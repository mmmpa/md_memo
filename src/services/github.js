import axios from 'axios'

const baseURL = 'https://api.github.com/'
const placeHolder = /(\{:([^}]+)\})/

export function insertParams ({ uri: raw, params }) {
  let uri = raw

  if (!params) {
    return uri
  }

  let matched = null
  while ((matched = uri.match(placeHolder))) {
    uri = uri.replace(placeHolder, encodeURIComponent(params[matched[2]] || ''))
  }

  return uri
}

export default class Github {
  constructor ({ token, oauth } = {}) {
    this.token = token
    this.oauth = oauth
  }

  request ({ uri, method, params, body, query }) {
    const headers = this.token
      ? { Authorization: `token ${this.token}` }
      : {}

    return axios({
      method,
      headers,
      baseURL,
      url: insertParams({ uri, params }),
      params: query,
      data: body,
    })
      .then(({ data }) => data.error
        ? Promise.reject(data)
        : data)
  }

  createAccessToken ({ code }) {
    return this.request({
      uri: this.oauth,
      method: 'post',
      body: { code },
    })
  }

  indexRepositories () {
    return this.request({
      uri: '/user/repos',
      method: 'get',
    })
  }

  showRepository ({ owner, repository }) {
    console.log('showRepository', { repository })
    return this.request({
      uri: '/repos/{:owner}/{:repo}',
      method: 'get',
      params: { owner, repo: repository },
    })
  }

  createRepository ({ name }) {
    return this.request({
      uri: '/user/repos',
      method: 'post',
      body: {
        name,
        private: true,
      },
    })
  }

  showUser () {
    return this.request({
      uri: '/user',
      method: 'get',
    })
  }
}
