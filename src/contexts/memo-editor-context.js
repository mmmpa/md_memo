import React from 'react'

import { receiver, dispatcher, cloner } from '../libs/decorators/feeder'
import Memo from '../models/memo'

@receiver
@dispatcher
@cloner
export default class extends React.Component {
  state = {
    current: null,
    memo: new Memo(),
  }

  componentWillMount () {
    this.componentInitialization(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.componentInitialization(nextProps)
  }

  async componentInitialization (props) {
    const { file_name: nextFileName } = props.match.params

    if (!props.filesMap || nextFileName === this.state.current) {
      return
    }

    this.setState({ current: nextFileName })

    try {
      await this.deliverMemo(props.filesMap[nextFileName])
    } catch (e) {
      console.log(e)
    }
  }

  async deliverMemo ({ path } = {}) {
    const memo = path
      ? new Memo({ md: await this.props.github.download({ path }) })
      : new Memo()

    this.setState({ memo })
  }

  render () {
    return (
      <div className="memo context">
        <h1>editor context</h1>
        { this.cloneChildren}
      </div>
    )
  }
}
