import React from 'react'
import { dispatcher, router } from '../../libs/decorators/feeder'
import marked from 'marked';

@router
@dispatcher
export default class extends React.Component {
  get marked () {
    return { __html: marked(this.props.md, { sanitize: true }) };
  }

  render () {
    return (
      <section id="memo-viewer" className="markdown-body">
        <section dangerouslySetInnerHTML={this.marked} />
      </section>
    )
  }
}
