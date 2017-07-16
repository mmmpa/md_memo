import React from 'react'
import { dispatcher } from '../libs/decorators/feeder'

@dispatcher
export default class extends React.Component {
  render () {
    return (
      <article>
        <button onClick={() => this.dispatch('github:token:new')}>Authorization</button>
      </article>
    )
  }
}
