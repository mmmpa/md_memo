import React from 'react'

import { receiver, dispatcher, cloner } from '../libs/decorators/feeder'

@receiver
@dispatcher
@cloner
export default class extends React.Component {
  state = {
    currentPath: null,
    initialized: false,
  }

  componentWillMount () {
    this.componentInitialization(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.componentInitialization(nextProps)
  }

  componentInitialization (props) {
    if(!props.location.pathname.startsWith(props.contextPath)){
      this.setState({ currentPath: null })
      return
    }

    if(this.state.currentPath === props.contextPath){
      return
    }

    this.dispatch('document:layout:change', 'container')
    this.setState({ currentPath: props.contextPath, initialized: true })
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
