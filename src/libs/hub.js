export default class Hub {
  constructor () {
    this.store = {}
  }

  on (name, callback) {
    if (!this.store[name]) {
      this.store[name] = []
    }
    this.store[name].push(callback)
  }

  off (name, callback) {
    this.store[name] = this.store[name].filter(cb => cb !== callback)
  }

  emit (name, ...args) {
    const cbs = this.store[name]

    return cbs && cbs.length
      ? Promise.all(cbs.map(cb => cb(...args))).catch((e) => {
        console.log({ e })
        return Promise.reject(e)
      })
      : Promise.reject('No callback set.')
  }
}
