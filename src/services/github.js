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
  constructor ({ token }) {
    this.token = token
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
  }

  createAccessToken ({ client_id, client_secret, code }) {
    this.request({
      uri: 'https://github.com/login/oauth/access_token',
      method: 'post',
      body: { client_id, client_secret, code },
    })
  }
}
