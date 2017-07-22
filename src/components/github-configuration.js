import React from 'react'
import { dispatcher } from '../libs/decorators/feeder'
import { bind } from 'decko'
import { Link } from 'react-router-dom'

import Fa from './fa'

@dispatcher
export default class extends React.Component {
  state = {
    token: '',
    repository: '',
    isValidRepository: false,
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

  componentWillUpdate (state, nextState) {
    const { repository: prev } = state
    const { repository: next } = nextState

    if (prev !== next) {
      this.checkRepository(next)
    }
  }

  take (props) {
    const { repository, token } = props
    this.setState({ repository, token })
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
  refresh (e) {
    e.preventDefault()
    this.dispatch('github:token:new')
  }

  get creatableRepository () {
    const { isValidToken, repositories } = this.props
    const { repository } = this.state
    return repository && isValidToken && !repositories[repository]
  }

  checkRepository (repository) {
    if (this.uid) {
      clearTimeout(this.uid)
      this.uid = null
    }

    this.uid = setTimeout(async () => {
      try {
        await this.props.github.showRepository({ repository })
        this.setState({ isValidRepository: true })
      } catch (e) {
        console.log(e)
        this.setState({ isValidRepository: false })
      }
    }, 1000)
  }

  get repositoryAvailability () {
    if (!this.state.repository) {
      return null
    }

    return this.state.isValidRepository
      ? <p className="text-success">Valid repository name.</p>
      : <p className="text-danger">Invalid repository name.</p>
  }

  render () {
    const { isValidToken } = this.props

    return (
      <article>
        <ul>
          <li><Link to="/memo">memo</Link></li>
          <li><Link to="/common/configuration">configuration</Link></li>
        </ul>
        <form>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="clientSecret">Access token</label>
                <input id="token" type="text" value={this.state.token} className="form-control" onChange={this.change} />
              </div>
              <div className="form-group">
                <button className="btn btn-default" onClick={this.refresh}>Get new access token</button>
              </div>
            </div>
            <div className="form-group col-md-6">
              <div className="form-group">
                <label htmlFor="repository">Repository</label>
                <input id="repository" type="text" value={this.state.repository} className="form-control" onChange={this.change} disabled={!isValidToken} />
              </div>
              { this.repositoryAvailability }
            </div>
          </div>
          <div className="form-group">
            <button className="btn btn-success" onClick={this.save}>Save</button>
            <button className="btn btn-danger" onClick={this.clear}>Clear</button>
          </div>
        </form>
      </article>
    )
  }
}
