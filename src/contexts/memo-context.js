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
  }

  componentWillMount () {
    this.componentInitialization(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.componentInitialization(nextProps)
  }

  componentDidMount () {
    $(window).resize((e) => setTimeout(this.resize, 0))
    setTimeout(this.resize, 0)
  }

  async componentInitialization (props) {
    this.fetchMemo(props)

    if (this.state.currentPath === props.location.pathname) {
      return
    }

    this.dispatch('document:layout:change', 'full-width')
    this.setState({ currentPath: props.location.pathname, initialized: true })

    await this.index()
  }

  listen (on) {
    on('memo:index', this.index)
    on('memo:index:update', this.updateIndex)
    on('memo:show', this.show)
    on('cm:register', cm => this.setState({ cm }))
  }

  @bind
  resize () {
    console.log('resize')
    const $body = $('#memo')
    const $index = $('#memo-index')
    const $editor = $('#memo-editor')
    const $viewer = $('#memo-viewer')
    const $controller = $('#memo-controller')
    const $cm = $('.CodeMirror-gutters')
    const { cm } = this.state

    const indexWidth = $index.width()
    const { top, left } = $body.position();
    const width = ($(window).width() - $index.width()) / 2;

    const bottom = $controller.position().top;
    const height = bottom - top;

    $body.css({ height })
    $index.css({ height })
    $editor.css({ width, height, left: indexWidth })
    $viewer.css({ width, height, left: indexWidth + width })

    const defaultStyle = $cm.attr('style');
    $cm.css({'cssText': defaultStyle + `min-height: ${height}px !important;`});
    console.log(height, cm)

    cm.setSize(width, height);
  }

  @bind
  index (path = '') {
    return this.props.github.indexFiles({ path })
      .then(files => {
        this.setState({ files, filesMap: files.reduce((a, o) => (a[o.safePath] = o, a), {}) })
      })
  }

  @bind
  updateIndex (newFile) {
    const { filesMap } = this.state

    filesMap[newFile.safePath].update(newFile)
    this.setState({ filesMap })
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
      <article id="memo">
        { this.cloneChildren}
      </article>
    )
  }
}
