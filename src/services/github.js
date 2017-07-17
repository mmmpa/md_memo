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
  constructor ({ token, oauth, owner, repository } = {}) {
    this.token = token
    this.oauth = oauth
    this.owner = owner
    this.repository = repository
  }

  request ({ uri, method, params, body, query, headers: additionalHeaders = {} }) {
    const headers = this.token
      ? { Authorization: `token ${this.token}`, ...additionalHeaders }
      : { ...additionalHeaders }

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

  indexFiles ({ owner = this.owner, repository = this.repository, path = '' }) {
    return this.request({
      uri: '/repos/{:owner}/{:repository}/contents/{:path}',
      method: 'get',
      params: { owner, repository, path },
    })
  }

  showFile ({ owner = this.owner, repository = this.repository, path }) {
    console.log({ owner, repository, path })
    return this.request({
      uri: '/repos/{:owner}/{:repository}/contents/{:path}',
      method: 'get',
      params: { owner, repository, path },
    })
  }

  download ({ owner = this.owner, repository = this.repository, path }) {
    console.log({ owner, repository, path })
    return this.request({
      headers: {
        Accept: 'application/vnd.github.v3.raw',
      },
      uri: '/repos/{:owner}/{:repository}/contents/{:path}',
      method: 'get',
      params: { owner, repository, path },
    })
  }

  showRepository ({ owner = this.owner, repository = this.repository }) {
    return this.request({
      uri: '/repos/{:owner}/{:repository}',
      method: 'get',
      params: { owner, repository },
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
