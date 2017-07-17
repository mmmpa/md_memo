import React from 'react'
import { bind } from 'decko'
import qs from 'query-string'

import { receiver, cloner } from '../libs/decorators/feeder'
import TinyStorage from '../libs/tiny-storage'
import Github from '../services/github'
import configuration from '../configuration'

const { githubOauthEndpoint: oauth, clientID } = configuration

@receiver
@cloner
export default class extends React.Component {
  state = {
    token: TinyStorage.getItem('token') || '',
    isValidToken: false,
    repository: TinyStorage.getItem('repository') || '',
    isValidRepository: false,
    repositories: {},
    user: {},
    storeRepository: null,
    github: new Github({
      oauth,
      token: TinyStorage.getItem('token'),
    }),
    containerClassName: 'container'
  }

  get github () {
    return this.state.github
  }

  componentWillReceiveProps (nextProps) {
    this.initializeForRoute(nextProps)
  }

  async componentWillMount () {
    const { code } = qs.parse(this.props.location.search)

    try {
      !this.state.token && code && (await this.takeToken(code))
    } catch (e) {
      this.requireNewToken()
      return
    }

    try {
      this.state.token && this.setState(await this.refresh())
    } catch (e) {
      this.requireNewToken()
      return
    }

    const { storeRepository } = this.state;

    if (!storeRepository) {
      this.props.history.push('/configuration')
    }

    this.setState({ initialized: true })

    this.initializeForRoute(this.props)
  }

  requireNewToken () {
    this.disposeToken()
    this.props.history.push('/configuration')
  }

  initializeForRoute (props) {
    // do nothing
  }

  async takeToken (code) {
    const { clientID: client_id, clientSecret: client_secret } = this.state
    const { access_token: token } = await this.github.createAccessToken({ client_id, client_secret, code })

    TinyStorage.setItem('token', token)
    this.setState({ token, github: new Github({ oauth, token }) })
  }

  @bind
  async refresh ({ github = this.github, repository = this.state.repository } = {}) {
    const user = await github.showUser()

    let storeRepository
    try {
      storeRepository = repository
        ? await github.showRepository({ owner: user.login, repository })
        : null
    } catch (e) {
      storeRepository = null
    }

    return { github: new Github({ oauth, token: github.token, owner: user.login, repository: repository }), user, storeRepository, repository, isValidToken: true }
  }

  listen (on) {
    on('github:token:new', this.newToken)
    on('github:token:destroy', this.destroyToken)
    on('github:configuration:save', this.saveConfiguration)

    on('document:layout:change', this.changeLayout)
  }

  disposeToken () {
    this.setState({ token: null })
    TinyStorage.removeItem('token')
    this.github = new Github({ oauth, token: null })
  }

  @bind
  newToken () {
    location.href = `http://github.com/login/oauth/authorize?scope=repo&client_id=${clientID}`
  }

  @bind
  destroyToken () {
    console.log('destroy')
  }

  @bind
  changeLayout (containerClassName = 'container') {
    this.setState({ containerClassName })
  }

  @bind
  async saveConfiguration ({ token, repository }) {
    const github = new Github({ oauth, token })
    this.setState(await this.refresh({ github, repository }))
    TinyStorage.setItem('token', token)
    TinyStorage.setItem('repository', repository)
  }

  render () {
    if (!this.state.initialized) {
      return null
    }

    //console.log(this.props, this.state)

    return (
      <div className={this.state.containerClassName}>
        { this.cloneChildren }
      </div>
    )
  }
}
