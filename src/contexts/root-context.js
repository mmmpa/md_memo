import React from 'react'
import { bind } from 'decko'
import qs from 'query-string'

import { receiver, cloner } from '../libs/decorators/feeder'
import TinyStorage from '../libs/tiny-storage'
import Github from '../services/github'
import configuration from '../configuration'
import VerificationState from '../models/verification-state'

const {
  githubOauthEndpoint: oauth,
  clientID,
} = configuration

@receiver
@cloner
export default class extends React.Component {
  state = {
    token: TinyStorage.getItem('token') || '',
    isValidToken: false,
    repository: TinyStorage.getItem('repository') || '',
    repositoryVerification: VerificationState.Ready,
    isValidRepository: false,
    repositories: {},
    user: {},
    github: new Github({
      oauth,
      token: TinyStorage.getItem('token'),
    }),
    containerClassName: 'container',
    isLocked: 0,
    working: [],
  }

  async componentWillMount () {
    try {
      const { code } = qs.parse(this.props.location.search)
      code && (await this.takeToken(code))
    } catch (e) {
      this.requireNewToken()
      this.setState({ initialized: true })
      return
    }

    try {
      this.state.token && this.setState(await this.refresh())
    } catch (e) {
      this.requireNewToken()
      this.setState({ initialized: true })
      return
    }

    const { repository } = this.state

    if (!repository) {
      this.props.history.push('/common/configuration')
      this.setState({ initialized: true })
      return
    }

    try {
      await this.checkRepository(repository, 0)
    } catch (e) {
      this.props.history.push('/common/configuration')
      this.setState({ initialized: true })
      return
    }

    this.props.history.push('/memo')
    this.setState({ initialized: true })
  }

  get github () {
    return this.state.github
  }

  requireNewToken () {
    this.disposeToken()
    this.props.history.push('/common/configuration')
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
    on('github:repository:check', this.checkRepository)

    on('document:layout:change', this.changeLayout)

    on('global:lock', () => this.setState({ isLocked: this.state.isLocked + 1 }))
    on('global:unlock', () => this.setState({ isLocked: this.state.isLocked - 1 }))
  }

  disposeToken () {
    const github = new Github({ oauth, token: '' })
    this.setState({ github, token: '' })
    TinyStorage.removeItem('token')
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

  @bind
  checkRepository (repository, wait = 1000) {
    if (!this.state.token) {
      return Promise.reject()
    }

    if (this.uid) {
      clearTimeout(this.uid)
      this.uid = null
    }

    this.setState({ repositoryVerification: VerificationState.Checking })

    return new Promise((resolve, reject) => {
      this.uid = setTimeout(async () => {
        this.setState({ repositoryVerification: VerificationState.Checking })
        try {
          await this.state.github.showRepository({ repository })
          this.setState({ repositoryVerification: VerificationState.Valid })
          resolve()
        } catch (e) {
          this.setState({ repositoryVerification: VerificationState.Invalid })
          reject()
        }
      }, wait)
    })
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
