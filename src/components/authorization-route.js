import React from 'react'
import { cloner } from '../libs/decorators/feeder'

@cloner
export default class extends React.Component {
  render () {
    const {
      token,
      tokenRequired,
      noTokenRequired,
    } = this.props

    if ((tokenRequired && token === '') || (noTokenRequired && token !== '')) {
      return null
    }

    return (
      <div className="authorization">
        { this.cloneChildren }
      </div>
    )
  }
}
