import axios from 'axios'
import FileInformation from '../models/file-information'

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
      .catch((e) => {
        const { response: { status, statusText, data } } = e
        return Promise.reject({
          ...data,
          status,
          statusText,
          data,
          id: Date.now(),
        })
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
    }).then(o => o.map(raw => new FileInformation(raw)))
  }

  showFile ({ owner = this.owner, repository = this.repository, path }) {
    return this.request({
      uri: '/repos/{:owner}/{:repository}/contents/{:path}',
      method: 'get',
      params: { owner, repository, path },
    })
  }

  createFile ({ owner = this.owner, repository = this.repository, path, message = 'created from md_memo', content }) {
    return this
      .request({
        uri: '/repos/{:owner}/{:repository}/contents/{:path}',
        method: 'PUT',
        params: { owner, repository, path },
        body: { path, message, content },
      })
      .then(({ commit, content: resultContent }) => ({ commit, content: new FileInformation(resultContent) }))
  }

  updateFile ({ owner = this.owner, repository = this.repository, path, message = 'updated from md_memo', content, sha }) {
    return this
      .request({
        uri: '/repos/{:owner}/{:repository}/contents/{:path}',
        method: 'put',
        params: { owner, repository, path },
        body: { path, message, content, sha },
      })
      .then(({ commit, content: resultContent }) => ({ commit, content: new FileInformation(resultContent) }))
  }

  deleteFile ({ owner = this.owner, repository = this.repository, path, message = 'deleted from md_memo', sha }) {
    return this
      .request({
        uri: '/repos/{:owner}/{:repository}/contents/{:path}',
        method: 'delete',
        params: { owner, repository, path },
        body: { path, message, sha },
      })
      .then(({ commit, content }) => ({ commit, content: new FileInformation(content) }))
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
