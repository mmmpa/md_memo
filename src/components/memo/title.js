import React from 'react'
import { bind } from 'decko'

import { dispatcher, router } from '../../libs/decorators/feeder'

@router
@dispatcher
export default class extends React.Component {
  @bind
  change (e) {
    this.dispatch('memo:title:update', e.target.value)
  }

  render () {
    return (
      <section id="memo-title">
        <div className="layout">
          <input type="text" className="form-control" placeholder="file name" value={this.props.title || ''} onChange={this.change} />
        </div>
      </section>
    )
  }
}
