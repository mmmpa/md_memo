import React from 'react'
import { bind } from 'decko'

import { dispatcher } from '../../libs/decorators/feeder'

@dispatcher
export default class extends React.Component {
  @bind
  save () {
    this.dispatch('memo:save')
  }

  render () {
    return (
      <article id="memo-controller" style={{ position: 'fixed', bottom: 0, width: '100%', background: '#fff', height: 49}}>
        <button className="btn btn-success" onClick={this.save}>save</button>
      </article>
    )
  }
}
