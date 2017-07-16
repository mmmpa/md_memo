import React from 'react'

import { receiver, dispatcher, cloner } from '../libs/decorators/feeder'
import configuration from '../configuration'

@receiver
@dispatcher
@cloner
export default class extends React.Component {
  async componentWillMount () {
    if(!this.props.location.pathname.startsWith(this.props.contextPath)){
      return
    }

    this.dispatch('document:layout:change')

    this.setState({ initialized: true })
  }
  render () {
    if (!this.state.initialized) {
      return null
    }

    return (
      <div className="common context">
        { this.cloneChildren }
      </div>
    )
  }
}
