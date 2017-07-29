const spawn = require('child_process').spawn;

upload()
  .then(r => console.log('Done!', r))
  .catch(e => console.log('\u001b[31mFailed\u001b[0m.', e));

async function upload ({
                         fileDir = './public',
                         commitId = () => exec({}, 'git', 'rev-parse', 'HEAD'),
                         region = process.env.MD_MEMO_STORE_REGION || 'us-west-2',
                         bucket = process.env.MD_MEMO_STORE_BUCKET,
                         deployment = process.env.MD_MEMO_STORE_DEPLOYMENT,
                         reset = process.env.MD_MEMO_STORE_RESET,
                         ip = process.env.MD_MEMO_STORE_RESTRICT_RESET,
                         build = process.env.MD_MEMO_STORE_BUILD,
                       } = {}) {

  const bucketName = (bucket || `${prefix}${(await commitId()).replace(/[^a-z0-9]/g, '')}`).slice(0, 63);
  const url = `${bucketName}.s3-website-${region}.amazonaws.com`;

  if (await hasBucket(bucketName) && reset) {
    await deleteBucket(bucketName);
  }

  if (!(await hasBucket(bucketName))) {
    await createBucket(bucketName, region);
    await putPolicy(bucketName, ip);
    await makeBucketWebsite(bucketName, url);
    await putDummyIndex(bucketName);
  }

  if (!deployment) {
    return `(But no deployment) \u001b[36mhttp://${url}\u001b[0m`;
  }

  build && await exec({}, 'yarn', 'run', 'build');

  await clearBucket(bucketName);
  await deploy(bucketName, fileDir);

  return `\u001b[36mhttp://${url}\u001b[0m`;
}

function clearBucket (bucketName) {
  return exec({}, `aws`, 's3', 'rm', `s3://${bucketName}`, '--recursive');
}

function createBucket (bucketName, regionName) {
  return exec({}, `aws`, 's3api', 'create-bucket', '--bucket', bucketName, '--create-bucket-configuration', `LocationConstraint=${regionName}`);
}

function deleteBucket (bucketName) {
  return exec({}, `aws`, 's3', 'rb', `s3://${bucketName}`, '--force');
}

function deploy (bucketName, fileDir) {
  return exec({}, `aws`, 's3', 'cp', fileDir, `s3://${bucketName}`, '--recursive');
}

async function hasBucket (bucketName) {
  const buckets = JSON.parse(await exec({ stdOutQuiet: true }, 'aws', 's3api', 'list-buckets'));

  return buckets.Buckets.find(({ Name }) => Name === bucketName);
}

function makeBucketWebsite (bucketName) {
  return exec({}, `aws`, 's3api', 'put-bucket-website', '--bucket', bucketName, '--website-configuration', generateWebsite());
}

function putDummyIndex (bucketName) {
  return exec({}, `aws`, 's3', 'cp', './deployment/dummy-index.html', `s3://${bucketName}/index.html`);
}

function putPolicy (bucketName, ip) {
  return exec({}, `aws`, 's3api', 'put-bucket-policy', '--bucket', bucketName, '--policy', generatePolicy(bucketName, ip));
}

// bucket configuration

function generateWebsite () {
  return JSON.stringify({
    "ErrorDocument": {
      "Key": "index.html" // very simple 404 fallback for a single page application
    },
    "IndexDocument": {
      "Suffix": "index.html"
    },
  })
}

function generatePolicy (bucketName, ip) {
  const condition = ip
    ? { "Condition": { "IpAddress": { "aws:SourceIp": ip } } }
    : {};

  return JSON.stringify({
    "Id": `Policy${bucketName}`,
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": `Stmt${bucketName}`,
        "Action": [
          "s3:GetObject"
        ],
        "Effect": "Allow",
        "Resource": `arn:aws:s3:::${bucketName}/*`,
        ...condition,
        "Principal": "*"
      },
    ],
  });
}

// support method

function exec (option, cmd, ...rest) {
  console.log('\u001b[36mcommand:\u001b[0m', cmd, ...rest);

  return new Promise((resolve, reject) => {
    const work = spawn(cmd, rest);
    let out = '';

    work.stdout.on('data', function (data) {
      const o = data.toString();
      option.stdOutQuiet || console.log(`\u001b[96m${o.replace(/\n$/g, '')}\u001b[0m`);
      out += o;
    });

    work.stderr.on('data', function (data) {
      option.stdErrQuiet || console.log(data.toString());
    });

    work.on('exit', function (code) {
      setTimeout(() => {
        +code === 0
          ? resolve(out.replace(/\n$/g, ''))
          : reject();
      }, 0);
    });
  });
}
