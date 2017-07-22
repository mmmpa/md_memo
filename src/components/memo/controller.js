import React from 'react'
import { bind } from 'decko'

import { dispatcher } from '../../libs/decorators/feeder'
import Fa from '../fa'
import ErrorMessage from './error-message'

@dispatcher
export default class extends React.Component {
  @bind
  save () {
    this.dispatch('memo:save')
  }

  @bind
  destroy () {
    this.dispatch('memo:destroy')
  }

  render () {
    const { isLocked } = this.props

    return (
      <article id="memo-controller">
        <ErrorMessage error={this.props.error} />
        <button className="save" onClick={this.save} disabled={isLocked}>
          <Fa icon="upload" />
          save
        </button>
        <button className="delete" onClick={this.destroy} disabled={isLocked}>
          <Fa icon="trash-o" /></button>
      </article>
    )
  }
}
