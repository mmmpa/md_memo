import React from 'react'
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom'
import { hashHistory } from 'react-router'

import PropsRoute from './components/props-route'

import RootContext from './contexts/root-context'

import CommonContext from './contexts/common-context'
import GithubConfiguration from './components/github-configuration'

import MemoContext from './contexts/memo-context'
import MemoEditorContext from './contexts/memo-editor-context'
import MemoIndex from './components/memo/index'
import MemoTopPage from './components/memo/top-page'
import MemoEditor from './components/memo/editor'
import MemoViewer from './components/memo/viewer'
import MemoController from './components/memo/controller'

// フラグではなく state で分岐するようにする

export default function () {
  return (
    <Router history={hashHistory}>
      <RootContext>
        <h1>md memo</h1>
        <ul>
          <li><Link to="/memo">memo</Link></li>
          <li><Link to="/common/configuration">configuration</Link></li>
        </ul>

        <PropsRoute path="/memo" component={MemoContext}>
          <MemoIndex />

          <PropsRoute exact path="/memo" component={MemoTopPage} />

          <PropsRoute exact path="/memo/new" component={MemoEditorContext}>
            <MemoEditor />
            <MemoViewer />
            <MemoController />
          </PropsRoute>

          <PropsRoute exact path="/memo/f-:file_name" component={MemoEditorContext}>
            <MemoEditor />
            <MemoViewer />
            <MemoController />
          </PropsRoute>
        </PropsRoute>

        <CommonContext contextPath="/common">
          <PropsRoute exact path="/common/configuration" component={GithubConfiguration} />
        </CommonContext>
      </RootContext>
    </Router>
  )
}
