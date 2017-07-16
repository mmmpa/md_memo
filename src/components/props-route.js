import React from 'react'
import { Route } from 'react-router-dom'

export default function (props) {
  const { component: Component, ...rest } = props

  return (
    <Route {...rest} render={() => <Component {...rest} />} />
  )
}
