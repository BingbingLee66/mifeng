let storage = {
  setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  getJson(key) {
    return JSON.parse(localStorage.getItem(key))
  },
  set(key, value) {
    localStorage.setItem(key, value)
  },
  get(key) {
    return localStorage.getItem(key)
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}
export default storage
