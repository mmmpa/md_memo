import React from 'react'

import { receiver, dispatcher, cloner } from '../libs/decorators/feeder'

@receiver
@dispatcher
@cloner
export default class extends React.Component {
  componentWillMount () {
    console.log(this.props.match)
  }


  render () {
    return (
      <div className="memo context">
        <h1>editor context</h1>
        { this.cloneChildren}
      </div>
    )
  }
}
