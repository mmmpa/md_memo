export default class FileInformation {
  constructor (params = {}) {
    Object.assign(this, params)

    this.safePath = this.path
  }

  update(params) {
    Object.assign(this, params)
  }
}