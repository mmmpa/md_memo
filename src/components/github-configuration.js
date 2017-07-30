import React from 'react'
import { bind } from 'decko'
import { Link } from 'react-router-dom'
import { dispatcher } from '../libs/decorators/feeder'
import Fa from './fa'
import VerificationState from '../models/verification-state'

@dispatcher
export default class extends React.Component {
  state = {
    initialized: false,
    token: '',
    repository: '',
    isDisplayToken: false,
  }

  componentWillMount () {
    this.take(this.props)
  }

  componentDidMount () {
    this.componentWillUpdate({}, this.state)
  }

  componentWillReceiveProps (nextProps) {
    this.take(nextProps)
  }

  componentWillUpdate (_, nextState) {
    const { repository: prev } = this.state
    const { repository: next } = nextState

    if (prev !== next) {
      this.dispatch('github:repository:check', next)
    }
  }

  take (props) {
    if (this.state.initialized) {
      return
    }
    const { repository, token, repositoryVerification } = props
    this.setState({ repository, token, initialized: true })

    if (repositoryVerification === VerificationState.Ready) {
      this.dispatch('github:repository:check', repository)
    }
  }

  @bind
  save (e) {
    e.preventDefault()
    const { token, repository } = this.state
    this.dispatch('github:configuration:save', { token, repository })
  }

  @bind
  clear (e) {
    e.preventDefault()
  }

  @bind
  change (e) {
    e.preventDefault()
    this.setState({ [e.target.id]: e.target.value })
  }

  @bind
  togglePrivate (e) {
    this.dispatch('github:configuration:private', e.target.checked)
  }

  @bind
  refresh (e) {
    e.preventDefault()
    this.dispatch('github:token:new')
  }

  get creatableRepository () {
    const { isValidToken, repositories } = this.props
    const { repository } = this.state
    return repository && isValidToken && !repositories[repository]
  }

  get repositoryCheckState () {
    if (!this.state.repository) {
      return null
    }

    switch (this.props.repositoryVerification) {
      case VerificationState.Ready:
        return null
      case VerificationState.Checking:
        return <p className="repository-verification"><Fa icon="spinner" animation="pulse" /></p>
      case VerificationState.Valid:
        return <p className="repository-verification ok"><Fa icon="check" />Valid repository name.</p>
      case VerificationState.Invalid:
        return <p className="repository-verification ng"><Fa icon="exclamation-triangle" />Invalid repository name.</p>
      default:
        return null
    }
  }

  get isSaveRequired () {
    const { repository: propRepository, token: propToken } = this.props
    const { repository, token } = this.state

    return repository !== propRepository || token !== propToken
  }

  get isMemoAvailable () {
    return !this.isSaveRequired && this.props.repositoryVerification === VerificationState.Valid
  }

  get tokenBox () {
    const {
      isValidToken,
      isPrivateIncluded,
    } = this.props

    if (isValidToken) {
      return null
    }

    return (
      <div className="border-box">
        <h1>Github API access token setting</h1>
        <div className="form-group">
          <button className="btn btn-primary" onClick={this.refresh}>
            <Fa icon="github" />
            Get new access token
          </button>
          <label htmlFor="isPrivateIncluded" className="private-repository">
            <input
              type="checkbox"
              id="isPrivateIncluded"
              checked={isPrivateIncluded}
              onChange={this.togglePrivate}
            />
            Use private repository
          </label>
        </div>
      </div>
    )
  }

  get repositoryNameBox () {
    if (!this.props.isValidToken) {
      return null
    }

    return (
      <div className="border-box">
        <div className="form-group">
          <h1>Repository setting</h1>
          <label htmlFor="repository">Repository name</label>
          <input
            type="text"
            id="repository"
            className="form-control"
            value={this.state.repository}
            onChange={this.change}
          />
        </div>
        { this.repositoryCheckState }
        <div className="form-group">
          <button
            className="btn btn-success"
            disabled={!this.isSaveRequired}
            onClick={this.save}
          >
            <Fa icon="save" />
            Save
          </button>
        </div>
      </div>
    )
  }

  get startEditorButton () {
    if (!this.isMemoAvailable) {
      return null
    }

    return (
      <div className="form-group">
        <Link
          to="/memo"
          className="btn btn-primary"
        >
          <Fa icon="arrow-circle-o-right" />
          Start
        </Link>
      </div>
    )
  }

  get tokenValidMark () {
    return this.props.isValidToken
      ? <span className="text-success preparation-mark"><Fa icon="check-square" /></span>
      : <span className="preparation-mark"><Fa icon="square-o" /></span>
  }

  get repositoryPreparedMark () {
    return this.isMemoAvailable
      ? <span className="text-success preparation-mark"><Fa icon="check-square" /></span>
      : <span className="preparation-mark"><Fa icon="square-o" /></span>
  }

  render () {
    return (
      <article>
        <form>
          <div className="row">
            <div className="col-md-6 col-md-offset-3">
              <div className="description no-border-box">
                <h1>Markdown memo on Github application</h1>
                <p>このアプリケーションは特定の Gihub repository を保存先として Markdown によるメモを管理・作成・編集することを目的としています。</p>
                <p>アプリケーションを使用するにあたって、以下の設定が必要になります。</p>
                <ul>
                  <li>
                    {this.tokenValidMark}
                    Github にアクセスするための Github API access token
                  </li>
                  <li>
                    {this.repositoryPreparedMark}
                    メモの保存先の Repository name
                  </li>
                </ul>
              </div>
              {this.startEditorButton}
              {this.repositoryNameBox}
              {this.tokenBox}
            </div>
          </div>
        </form>
      </article>
    )
  }
}
