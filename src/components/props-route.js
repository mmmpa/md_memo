import React from 'react'
import { Route } from 'react-router-dom'

export default function (props) {
  const { component: Component, match, location, history, path: raw, children, ...rest } = props

  const path = raw.constructor.name === 'String' ? raw : void(0)

  return (
    <Route {...rest} path={path} render={() =>
      <Component {...rest}>{children}</Component>} />
  )
}
