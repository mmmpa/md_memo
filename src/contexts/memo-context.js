import React from 'react'

import { receiver, dispatcher, cloner } from '../libs/decorators/feeder'
import configuration from '../configuration'
import MemoContext from '../contexts/memo-context'
import MemoIndex from '../components/memo/index'
import MemoTopPage from '../components/memo/top-page'
import MemoEditor from '../components/memo/editor'
import MemoViewer from '../components/memo/viewer'
import MemoController from '../components/memo/controller'

@receiver
@dispatcher
@cloner
export default class extends React.Component {
  state = {
    currentPath: null,
    initialized: false,
    files: [],
  }

  componentWillMount () {
    this.componentInitialization(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.componentInitialization(nextProps)
  }

  async componentInitialization (props) {
    this.fetchMemo(props)

    if (this.state.currentPath === props.location.pathname) {
      return
    }

    this.dispatch('document:layout:change', 'full-width')
    this.setState({ currentPath: props.location.pathname, initialized: true })

    this.setState({ files: await this.index() })
  }

  listen (on) {
    on('memo:index', this.index)
    on('memo:show', this.show)
  }

  index (path = '') {
    return this.props.github.indexFiles({ path })
  }

  fetchMemo (props) {
  }

  show () {

  }

  render () {
    if (!this.state.initialized) {
      return null
    }

    return (
      <div className="memo context">
        <h1>test</h1>
        { this.cloneChildren}
      </div>
    )
  }
}
