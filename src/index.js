import React from 'react'
import ReactDOM from 'react-dom'

import Router from './router'

export default class App {
  static start (dom) {
    ReactDOM.render(<Router />, dom)
  }
}

App.start(document.querySelector('#app'))

window.progressIndicator.done()
