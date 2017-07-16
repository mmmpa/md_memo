import React from 'react'
import { bind } from 'decko'
import qs from 'query-string'

import { receiver, dispatcher, cloner } from '../libs/decorators/feeder'
import TinyStorage from '../libs/tiny-storage'
import Github from '../services/github'
import configuration from '../configuration'

const { githubOauthEndpoint: oauth, clientID } = configuration

@receiver
@dispatcher
@cloner
export default class extends React.Component {
  state = {
    files: []
  }

  async componentWillMount () {
    if(!this.props.location.pathname.startsWith(this.props.contextPath)){
      return
    }

    console.log(this.props.storeRepository)
    this.dispatch('document:layout:change', 'full-width')

    this.setState({ initialized: true })
  }

  async indexFiles () {
  }

  render () {
    if (!this.state.initialized) {
      return null
    }

    return (
      <div className="memo context">
        { this.cloneChildren }
      </div>
    )
  }
}
