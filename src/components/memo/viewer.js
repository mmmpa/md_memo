import React from 'react'
import { dispatcher, router } from '../../libs/decorators/feeder'
import marked from 'marked';

@router
@dispatcher
export default class extends React.Component {
  get marked () {
    return { __html: marked(this.props.memo.md, { sanitize: true }) };
  }

  render () {
    return (
      <article>
        <h1>viewer</h1>
        <section className="viewer" dangerouslySetInnerHTML={this.marked} />
      </article>
    )
  }
}
