import React from 'react'

import { dispatcher } from '../../libs/decorators/feeder'
import Fa from '../fa'

@dispatcher
export default class extends React.Component {
  shouldComponentUpdate (nextProps) {
    return this.id !== (nextProps.error ? nextProps.error.id : null)
  }

  get message () {
    const { error: { status } } = this.props

    switch (status) {
      case 404:
        return 'ファイル名は必須です'
      case 409:
        return '元のファイルが更新されています。リロードが必要です'
      case 422:
        return 'ファイル名が既に使用されています'
      default:
        return 'Unknown error.'
    }
  }

  render () {
    const { error } = this.props

    this.id = error ? error.id : null

    if (!error) {
      return null
    }

    return (
      <p className="error-message">
        <Fa icon="ban" />
        {this.message}
      </p>
    )
  }
}
