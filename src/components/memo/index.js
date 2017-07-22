import React from 'react'
import { dispatcher } from '../../libs/decorators/feeder'
import { bind } from 'decko'
import { Link } from 'react-router-dom'

import Fa from '../fa'

@dispatcher
export default class extends React.Component {
  get files () {
    return this.props.files.map(({name, download, safePath}) =>
      <li key={safePath}>
        <Link to={ `/memo/f-${safePath}` }>{ name }</Link>
      </li>
    )
  }
  render () {
    return (
      <section id="memo-index">
        <ul>
          { this.files }
        </ul>
      </section>
    )
  }
}
