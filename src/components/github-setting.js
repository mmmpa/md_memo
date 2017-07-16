import React from 'react'
import { bind } from 'decko'

import { dispatcher } from '../libs/decorators/feeder'

@dispatcher
export default class extends React.Component {
  componentWillMount () {
    console.log(this.props)
    const { clientID, clientSecret } = this.props
    this.setState({ clientID, clientSecret })
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
  }

  @bind
  save (e) {
    e.preventDefault()
    const { clientID, clientSecret } = this.state
    this.dispatch('github:setting:save', { clientID, clientSecret })
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

  render () {
    return (
      <article>
        <form>
          <div className="form-group">
            <label htmlFor="clientId">Client ID</label>
            <input id="clientID" type="text" value={this.state.clientID} className="form-control" onChange={this.change} />
          </div>
          <div className="form-group">
            <label htmlFor="clientSecret">Client Secret</label>
            <input id="clientSecret" type="text" value={this.state.clientSecret} className="form-control" onChange={this.change} />
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
