import { COOKIE_TOKEN } from '@/constant'
import Cookies from 'js-cookie'

export function getToken() {
  return Cookies.get(COOKIE_TOKEN) || ''
}

export function setToken(token) {
  Cookies.set(COOKIE_TOKEN, token, { domain: '.kaidicloud' })
}

export function removeToken() {
  Cookies.remove(COOKIE_TOKEN, { domain: '.kaidicloud' })
}
