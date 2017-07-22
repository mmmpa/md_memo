import React from 'react'
import { dispatcher, router } from '../../libs/decorators/feeder'
import marked from 'marked';

@router
@dispatcher
export default class extends React.Component {
  state = {
    scroll: 0,
  }

  get marked () {
    return { __html: marked(this.props.md, { sanitize: true }) };
  }

  componentDidMount () {
    this.$viewer = $(this.refs.viewer)
    this.$content = $(this.refs.content)
  }

  componentWillReceiveProps (nextProps) {
    this.scroll(nextProps.scroll)
  }

  scroll (f) {
    if (this.state.scroll === f) {
      return
    }
    this.setState({ scroll: f })

    const scrollHeight = Math.round(this.$content.height()) - Math.round(this.$viewer.height()) + 20
    this.$viewer.scrollTop(scrollHeight * f)
  }

  render () {
    return (
      <section id="memo-viewer" className="markdown-body" ref="viewer">
        <section id="memo-viewer-content" dangerouslySetInnerHTML={this.marked} ref="content" />
      </section>
    )
  }
}
