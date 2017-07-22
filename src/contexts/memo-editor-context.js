import React from 'react'
import { bind } from 'decko'

import { receiver, dispatcher, cloner } from '../libs/decorators/feeder'
import Memo from '../models/memo'
import { base64 } from '../libs/encode'

@receiver
@dispatcher
@cloner
export default class extends React.Component {
  state = {
    current: null,
    memo: new Memo(),
    md: '',
  }

  componentWillMount () {
    this.componentInitialization(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.componentInitialization(nextProps)
  }

  async componentInitialization (props) {
    const { file_name: nextFileName } = props.match.params
    const nextFile = props.filesMap[nextFileName]

    if (!props.filesMap || nextFile === this.state.current) {
      return
    }

    this.setState({ current: nextFile })

    try {
      await this.deliverMemo(nextFile)
    } catch (e) {
      console.log(e)
    }
  }

  listen (on) {
    on('memo:save', this.save)
    on('memo:md:update', this.updateMd)
  }

  async deliverMemo ({ path } = {}) {
    const memo = path
      ? new Memo({ md: await this.props.github.download({ path }) })
      : new Memo()

    this.setState({ md: memo.md })
  }

  @bind
  updateMd (md) {
    this.setState({ md })
  }

  @bind
  async save () {
    const { path, sha } = this.state.current

    const { content } = await this.props.github.updateFile({ path, sha, content: base64(this.state.md) })
    this.dispatch('memo:index:update', content)
  }

  render () {
    return (
      <div>
        { this.cloneChildren}
      </div>
    )
  }
}
