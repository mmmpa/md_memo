import React from 'react'
import {
  BrowserRouter as Router,
  Link,
} from 'react-router-dom'

import Index from './components/index'
import AuthorizationContext from './contexts/authorization-context'
import AuthorizationRoute from './components/authorization-route'
import Token from './components/token'
import GithubAuthorization from './components/github-authorization'
import GithubSetting from './components/github-setting'
import PropsRoute from './components/props-route'

export default function () {
  return (
    <Router>
      <div>
        <article className="container">
          <AuthorizationContext>
            <h1>md memo</h1>

            <AuthorizationRoute tokenRequired>
              <PropsRoute path="/" component={Index} />
            </AuthorizationRoute>

            <AuthorizationRoute noTokenRequired>
              <ul>
                <li><Link to="/">Get Github API request token</Link></li>
                <li><Link to="/github_setting">Set Github Oauth setting</Link></li>
              </ul>
              <PropsRoute exact path="/" component={GithubAuthorization} />
              <PropsRoute exact path="/github_setting" component={GithubSetting} />
              <PropsRoute exact path="/token" component={Token} />
            </AuthorizationRoute>
          </AuthorizationContext>
        </article>
      </div>
    </Router>
  )
}
