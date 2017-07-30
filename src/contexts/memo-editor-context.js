import React from 'react'
import { bind } from 'decko'

import { receiver, dispatcher, cloner } from '../libs/decorators/feeder'
import Memo from '../models/memo'
import base64 from '../libs/encode'

@receiver
@dispatcher
@cloner
export default class extends React.Component {
  state = {
    memo: new Memo(),
    md: '',
    title: '',
    error: null,
  }

  componentWillMount () {
    this.current = null
    this.isNewFile = false

    this.componentInitialization(this.props)
  }

  componentWillUpdate (nextProps) {
    this.componentInitialization(nextProps)
  }

  async componentInitialization (props) {
    const { file_name: nextFileName } = props.match.params
    const { file_name: oldFileName } = this.props.match.params
    const nextFile = props.filesMap[nextFileName]

    if (!nextFileName) {
      this.isNewFile = true

      if (oldFileName && (this.state.md !== '' || this.state.title !== '')) {
        this.setState({ md: '', title: '' })
      }
    } else {
      this.isNewFile = false
    }

    if (!props.filesMap || nextFileName === this.currentFileName) {
      return
    }

    if (nextFileName && !nextFile) {
      this.props.history.push('/memo')
      return
    }

    this.currentFileName = nextFileName
    this.current = nextFile

    try {
      await this.deliverMemo(nextFile)
    } catch (e) {
      console.log(e)
    }
  }

  listen (on) {
    on('memo:save', this.save)
    on('memo:destroy', this.destroy)
    on('memo:md:update', md => this.setState({ md }))
    on('memo:title:update', title => this.setState({ title }))
  }

  async deliverMemo ({ path } = {}) {
    const memo = path
      ? new Memo({ md: await this.props.github.download({ path }) })
      : new Memo()

    this.setState({ md: memo.md, title: path })
  }

  @bind
  async save (current = this.current || {}) {
    const { sha, path: oldPath } = current
    const { title: path, md } = this.state

    this.dispatch('global:lock')
    try {
      const { content } = await (this.isNewFile
        ? this.props.github.createFile({ path, content: base64(md) })
        : this.props.github.updateFile({ path, sha, content: base64(md) }))

      if (this.isNewFile) {
        await this.dispatch('memo:index')
        this.props.history.push(`/memo/${content.path}`)
      } else if (path === oldPath) {
        this.dispatch('memo:index:update', path, content)
      } else {
        await this.dispatch('memo:index:update', oldPath, content)
        await this.props.github.deleteFile({ path: oldPath, sha })

        setTimeout(() => this.props.history.push(`/memo/${content.path}`), 0)
      }
    } catch (e) {
      this.setState({ error: e })
    }

    this.dispatch('global:unlock')
  }

  @bind
  async destroy (current = this.current) {
    const { sha, path } = current

    this.dispatch('global:lock')
    try {
      await this.props.github.deleteFile({ path, sha })
      this.setState({ md: '', title: '' })
      this.props.history.push('/memo/')
    } catch (e) {
      this.setState({ error: e })
    }

    this.dispatch('global:unlock')
  }

  render () {
    return (
      <div>
        { this.cloneChildren}
      </div>
    )
  }
}
