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
    containerClassName: 'container',
    isLocked: 0,
    working: [],
  }

  async componentWillMount () {
    const { code } = qs.parse(this.props.location.search)

    try {
      code && (await this.takeToken(code))
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

    const { storeRepository } = this.state

    if (!storeRepository) {
      this.props.history.push('/common/configuration')
    }

    this.setState({ initialized: true })

    this.initializeForRoute(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.initializeForRoute(nextProps)
  }

  get github () {
    return this.state.github
  }

  requireNewToken () {
    this.disposeToken()
    this.props.history.push('/common/configuration')
  }

  initializeForRoute () {
    // do nothing
  }

  async takeToken (code) {
    const { access_token: token } = await this.github.createAccessToken({ code })

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

    return { github: new Github({ oauth, token: github.token, owner: user.login, repository }), user, storeRepository, repository, isValidToken: true }
  }

  listen (on) {
    on('github:token:new', this.newToken)
    on('github:token:destroy', this.destroyToken)
    on('github:configuration:save', this.saveConfiguration)

    on('document:layout:change', this.changeLayout)

    on('global:lock', () => this.setState({ isLocked: this.state.isLocked + 1 }))
    on('global:unlock', () => this.setState({ isLocked: this.state.isLocked - 1 }))
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

    return (
      <div className={this.state.containerClassName}>
        { this.cloneChildren }
      </div>
    )
  }
}
