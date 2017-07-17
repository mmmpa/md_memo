import React from 'react'
import { dispatcher, router } from '../../libs/decorators/feeder'

require('codemirror/addon/mode/overlay.js');
require('codemirror/addon/display/placeholder.js');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/markdown/markdown.js');
require('codemirror/mode/gfm/gfm.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/css/css.js');
require('codemirror/mode/htmlmixed/htmlmixed.js');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/meta.js');

import * as CodeMirror from 'codemirror'; // eslint-disable-line import/first

@router
@dispatcher
export default class extends React.Component {
  state = {
    md: '',
  }

  componentWillMount () {
    this.take(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.take(nextProps)
  }

  take (props) {
    this.setState({ md: props.memo.md });
    this.cm && this.cm.setValue(props.memo.md)
  }

  componentDidMount () {
    try {
      this.cm = CodeMirror.fromTextArea(this.editor, {
        lineNumbers: true,
        mode: 'gfm',
        lineWrapping: true,
      });

      this.cm.on('change', e => {
        this.changeComment(e.doc.getValue())
      });

      this.cm.setValue(this.state.md);
    } catch (e) {
      console.log(e)
    }
  }

  changeComment (value) {
    if (this.state.md === value) {
      return
    }
    this.setState({ md: value });
  }

  render () {
    return (
      <article>
        <h1>editor</h1>
        <textarea
          name="comment"
          ref={e => (this.editor = e)}
          value={this.state.md}
        />
      </article>
    )
  }
}
