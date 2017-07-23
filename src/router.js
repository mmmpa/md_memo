import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { hashHistory } from 'react-router'

import PropsRoute from './components/props-route'

import RootContext from './contexts/root-context'

import CommonContext from './contexts/common-context'
import GithubConfiguration from './components/github-configuration'

import MemoContext from './contexts/memo-context'
import MemoEditorContext from './contexts/memo-editor-context'
import MemoIndex from './components/memo/index'
import MemoTitle from './components/memo/title'
import MemoEditor from './components/memo/editor'
import MemoViewer from './components/memo/viewer'
import MemoController from './components/memo/controller'

export default function () {
  return (
    <Router history={hashHistory}>
      <RootContext>
        <PropsRoute path="/memo" component={MemoContext}>
          <MemoIndex />

          <PropsRoute exact path="/memo/:file_name?" component={MemoEditorContext}>
            <MemoTitle />
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
