import React from 'react'
import { dispatcher, router } from '../../libs/decorators/feeder'
import { bind } from 'decko'
import { Link } from 'react-router-dom'

import Fa from '../fa'

@router
@dispatcher
export default class extends React.Component {
  get files () {
    return this.props.files.map(({name, download, sha}) =>
      <li key={sha}>
        <Link to={ `/memo/${sha}` }>{ name }</Link>
      </li>
    )
  }
  render () {
    return (
      <article>
        viewer
      </article>
    )
  }
}
