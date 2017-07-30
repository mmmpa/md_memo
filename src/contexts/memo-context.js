import React from 'react'
import { bind } from 'decko'

import { receiver, dispatcher, cloner } from '../libs/decorators/feeder'

@receiver
@dispatcher
@cloner
export default class extends React.Component {
  state = {
    currentPath: null,
    initialized: false,
    files: [],
    cm: null,
    scroll: 0,
  }

  componentWillMount () {
    this.componentInitialization(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.componentInitialization(nextProps)
  }

  async componentInitialization (props) {
    if (this.state.currentPath === props.location.pathname) {
      return
    }

    this.dispatch('document:layout:change', 'full-width')
    this.setState({ currentPath: props.location.pathname, initialized: true })

    this.startResize()

    await this.index()
  }

  startResize () {
    $(window).unbind('resize')
    $(window).resize(() => setTimeout(this.resize, 0))
    setTimeout(this.resize, 0)
  }

  listen (on) {
    on('memo:index', this.index)
    on('memo:index:update', this.updateIndex)
    on('cm:register', cm => this.setState({ cm }))
    on('cm:remove', () => this.setState({ cm: null }))
    on('cm:scroll', f => this.setState({ scroll: f }))
  }

  @bind
  resize () {
    const $body = $('#memo')
    const $title = $('#memo-title')
    const $index = $('#memo-index')
    const $editor = $('#memo-editor')
    const $viewer = $('#memo-viewer')
    const $controller = $('#memo-controller')

    const indexWidth = $index.width()
    const { top: bodyTop } = $body.position()
    const width = ($(window).width() - $index.width()) / 2

    const top = bodyTop + $title.height()

    const bottom = $controller.position().top
    const height = bottom - top

    $body.css({ height })
    $index.css({ top, height })
    $editor.css({ top, width, height, left: indexWidth })
    $viewer.css({ top, width, height, left: indexWidth + width })
    $controller.css({ paddingRight: width })
    const { cm } = this.state

    if (cm) {
      const $cmGutters = $('.CodeMirror-gutters')
      const defaultStyle = $cmGutters.attr('style')
      $cmGutters.css({ cssText: `${defaultStyle} min-height: ${height}px !important` })
      cm.setSize(width, height)
    }
  }

  @bind
  index (path = '') {
    return this.props.github.indexFiles({ path })
      .then((files) => {
        this.setState({
          files,
          filesMap: files.reduce((a, o) => {
            a[o.safePath] = o
            return a
          }, {}),
        })
      })
  }

  @bind
  updateIndex (oldPath, newFile) {
    const { filesMap } = this.state

    delete filesMap[oldPath]
    filesMap[newFile.safePath] = newFile
    this.setState({ filesMap })
  }

  render () {
    if (!this.state.initialized) {
      return null
    }

    return (
      <article id="memo">
        { this.cloneChildren}
      </article>
    )
  }
}
