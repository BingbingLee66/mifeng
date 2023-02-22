import Cookies from 'js-cookie'

const TokenKey = 'access-token'
const isDev = process.env.NODE_ENV === 'development'
const domain = !isDev ? '.kaidicloud.com' : ''
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { domain })
}

export function removeToken() {
  Cookies.remove(TokenKey)
  return Cookies.remove(TokenKey, { domain })
}
