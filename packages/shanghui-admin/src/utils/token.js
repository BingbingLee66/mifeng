import { COOKIE_TOKEN } from '@/constant'
import Cookies from 'js-cookie'
const isDev = process.env.NODE_ENV === 'development'
const domain = !isDev ? '.kaidicloud.com' : ''
export function getToken() {
  return Cookies.get(COOKIE_TOKEN) || ''
}

export function setToken(token) {
  Cookies.set(COOKIE_TOKEN, token, { domain })
}

export function removeToken() {
  Cookies.remove(COOKIE_TOKEN, { domain })
}
