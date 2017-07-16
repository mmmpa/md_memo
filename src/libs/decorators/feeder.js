import { withRouter } from 'react-router-dom'
import React from 'react'
import Hub from '../hub'

const hub = new Hub()

export function receiver (ReactComponent) {
  const ExtendedReceiver = class extends ReactComponent {
    addedOnStore = []

    get name () {
      return ReactComponent.name
    }

    componentWillUnmount () {
      super.componentWillUnmount && super.componentWillUnmount()

      this.addedOnStore.map(({ eventName, callback }) => {
        hub.off(eventName, callback)
        return eventName
      })
    }

    listen (on) {
      super.listen && super.listen(on)
    }

    componentWillMount () {
      super.componentWillMount && super.componentWillMount()

      this.listen((eventName, callback) => {
        this.addedOnStore.push({ eventName, callback })
        hub.on(eventName, callback)
      })
    }
  }

  return withRouter(ExtendedReceiver)
}

export function dispatcher (ReactComponent) {
  const ExtendedDispatcher = class extends ReactComponent {
    dispatch (event, ...args) {
      super.dispatch && super.dispatch()
      return hub.emit(event, ...args)
    }
  }

  return ExtendedDispatcher
}

export function cloner (ReactComponent) {
  const ExtendedCloner = class extends ReactComponent {
    get cloneChildren () {
      const { children: child } = this.props

      const children = Array.isArray(child) ? child : [child]

      const props = Object.assign({}, this.props, this.state)
      delete props.children


      return children.map((c, i) => c.type.constructor.name === 'String'
        ? c
        : React.cloneElement(c, Object.assign(props, { key: i })),
      )
    }
  }

  return ExtendedCloner
}

