import React from 'react'
import { Route } from 'react-router-dom'

export default function (props) {
  const { component: Component, path, children, ...rest } = props

  delete rest.match
  delete rest.location
  delete rest.history

  return (
    <Route
      {...rest}
      path={path}
      render={() => <Component {...rest} >{children}</Component>}
    />
  )
}
