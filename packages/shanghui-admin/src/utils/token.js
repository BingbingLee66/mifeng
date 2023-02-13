import { ACCESS_TOKEN, COOKIE_TOKEN } from '@/constant'
import Cookies from 'js-cookie'

export function getToken() {
  return localStorage.getItem(ACCESS_TOKEN) || Cookies.get(COOKIE_TOKEN) || ''
}

export function setToken(token) {
  localStorage.setItem(ACCESS_TOKEN, token)
  Cookies.set(COOKIE_TOKEN, token, { domain: '.kaidicloud' })
}

export function removeToken() {
  localStorage.removeItem(ACCESS_TOKEN)
  Cookies.remove(COOKIE_TOKEN, { domain: '.kaidicloud' })
}
