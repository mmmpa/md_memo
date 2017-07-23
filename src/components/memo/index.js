import React from 'react'
import { Link } from 'react-router-dom'

import { dispatcher } from '../../libs/decorators/feeder'
import Fa from '../fa'

@dispatcher
export default class extends React.Component {
  get files () {
    return this.props.files.map(({ name, safePath }) =>
      (<li key={safePath}>
        <Link to={`/memo/${safePath}`}>{name}</Link>
      </li>),
    )
  }

  render () {
    return (
      <section id="memo-index">
        <ul>
          <li>
            <Link to="/common/configuration"><Fa icon="cog" />configuration</Link>
          </li>
          <li>
            <Link to="/memo"><Fa icon="plus-circle" />new memo</Link>
          </li>
          { this.files }
        </ul>
      </section>
    )
  }
}
