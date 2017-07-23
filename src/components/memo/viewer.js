import React from 'react'
import marked from 'marked'

import { dispatcher, router } from '../../libs/decorators/feeder'

@router
@dispatcher
export default class extends React.Component {
  state = {
    scroll: 0,
  }

  componentDidMount () {
    this.$viewer = $(this.viewer)
    this.$content = $(this.content)
  }

  componentWillReceiveProps (nextProps) {
    this.scroll(nextProps.scroll)
  }

  get marked () {
    return { __html: marked(this.props.md, { sanitize: true }) }
  }

  scroll (f) {
    if (this.state.scroll === f) {
      return
    }
    this.setState({ scroll: f })

    const scrollHeight = Math.round(this.$content.height() - this.$viewer.height()) + 20
    this.$viewer.scrollTop(scrollHeight * f)
  }

  render () {
    return (
      <section id="memo-viewer" className="markdown-body" ref={o => (this.viewer = o)}>
        <section id="memo-viewer-content" dangerouslySetInnerHTML={this.marked} ref={o => (this.content = o)} />
      </section>
    )
  }
}
