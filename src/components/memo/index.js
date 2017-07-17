import React from 'react'
import { dispatcher } from '../../libs/decorators/feeder'
import { bind } from 'decko'
import { Link } from 'react-router-dom'

import Fa from '../fa'

@dispatcher
export default class extends React.Component {
  get files () {
    return this.props.files.map(({name, download, sha}) =>
      <li key={sha}>
        <Link to={ `/memo/f-${sha}` }>{ name }</Link>
      </li>
    )
  }
  render () {
    return (
      <article>
        <ul>
          { this.files }
        </ul>
      </article>
    )
  }
}
