import React from 'react'
import { bind } from 'decko'
import qs from 'query-string'

import { receiver, cloner } from '../libs/decorators/feeder'
import TinyStorage from '../libs/tiny-storage'
import Github from '../services/github'

@receiver
@cloner
export default class extends React.Component {
  state = {
    clientID: TinyStorage.getItem('clientID'),
    clientSecret: TinyStorage.getItem('clientSecret'),
    token: TinyStorage.getItem('token'),
  }

  async componentWillMount () {
    this.github = new Github()

    if (!this.state.clientID || !this.state.clientSecret) {
      this.props.history.push('/github_setting')
      return
    }

    const { code } = qs.parse(this.props.location.search)

    if (code) {
      try {
        const result = await this.createToken(code)
        console.log(result)
        return
      } catch (e) {
        console.log(e)
      }
    }

    // request_token の有効性を確認
    this.setState({ token: '' })
  }

  listen (on) {
    on('github:token:new', this.newToken)
    on('github:token:destroy', this.destroyToken)
    on('github:setting:save', this.saveSetting)
  }

  @bind
  newToken () {
    location.href = `http://github.com/login/oauth/authorize?scope=repo&client_id=${this.state.clientID}`
  }

  @bind
  async createToken (code) {
    const { clientID: client_id, clientSecret: client_secret } = this.state
    await this.github.createAccessToken({ client_id, client_secret, code })
  }

  @bind
  destroyToken () {
    console.log('destroy')
  }

  @bind
  saveSetting ({ clientID, clientSecret }) {
    console.log({ clientID, clientSecret })
    this.setState({ clientID, clientSecret })
    TinyStorage.setItem('clientID', clientID)
    TinyStorage.setItem('clientSecret', clientSecret)
  }

  render () {
    return (
      <div className="authorization context">
        { this.cloneChildren }
      </div>
    )
  }
}
