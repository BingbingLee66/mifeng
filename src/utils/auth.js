import Cookies from 'js-cookie'

const TokenKey = 'access-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { domain: '.kaidicloud' })
}

export function removeToken() {
  return Cookies.remove(TokenKey, { domain: '.kaidicloud' })
}
