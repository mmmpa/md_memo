class TinyStorage {
  genKey (key) {
    return encodeURIComponent(key)
  }

  setItem (key, value) {
    document.cookie = `${this.genKey(key)}=${encodeURIComponent(value)}; path=/;`
  }

  getItem (key) {
    const base = document.cookie.split(`${this.genKey(key)}=`)

    if (base.length === 1) {
      return null
    }

    return decodeURIComponent(base.pop().split('; ').shift())
  }

  removeItem (key) {
    document.cookie = `${this.genKey(key)}=null; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  }
}

export default new TinyStorage()
