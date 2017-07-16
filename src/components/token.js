import React from 'react'
import { dispatcher } from '../libs/decorators/feeder'

@dispatcher
export default class extends React.Component {
  render () {
    return (
      <article>
        <h1>take token</h1>
        <button onClick={() => this.dispatch('token', 'token')}>test</button>
        <section>{ this.props.token }</section>
      </article>
    )
  }
}
