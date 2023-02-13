import { COOKIE_TOKEN } from '@/constant'
import Cookies from 'js-cookie'
const isProd = process.env.VUE_APP_BUILD_ENV === 'production'
const domain = isProd ? '.kaidicloud' : ''
export function getToken() {
  return Cookies.get(COOKIE_TOKEN) || ''
}

export function setToken(token) {
  Cookies.set(COOKIE_TOKEN, token, { domain })
}

export function removeToken() {
  Cookies.remove(COOKIE_TOKEN, { domain })
}
