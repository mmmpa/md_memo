import React from 'react'
import { Route } from 'react-router-dom'

export default function (props) {
  const { component: Component, match, location, history, path, children, ...rest } = props

  return (
    <Route {...rest} path={path} render={p => {
      return <Component {...rest} >{children}</Component>
    }} />
  )
}
