import NProgress from 'nprogress'

NProgress.configure({
  easing: 'ease',
  speed: 200,
  trickle: true,
  trickleSpeed: 500,
  showSpinner: true,
})

export default class ProgressIndicator {
  constructor () {
    this.count = 0
    this.uid = null
  }

  wrap (request) {
    return (...args) => {
      this.start()

      return request(...args)
        .then((...argsSecond) => {
          this.done()
          return Promise.resolve(...argsSecond)
        })
        .catch((...argsSecond) => {
          this.done()
          return Promise.reject(...argsSecond)
        })
    }
  }

  start () {
    this.count += 1
    NProgress.start()
  }

  done () {
    this.count -= 1
    NProgress.inc()

    setTimeout(() => {
      if (this.count === 0) {
        NProgress.done()
      }
    }, 1)
  }
}

export const progressIndicator = new ProgressIndicator()
