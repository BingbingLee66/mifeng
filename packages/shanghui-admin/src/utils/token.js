import { ACCESS_TOKEN } from '@/constant'
import Cookies from 'js-cookie'

export function getToken() {
  return localStorage.getItem(ACCESS_TOKEN) || Cookies.get(ACCESS_TOKEN) || ''
}

export function setToken(token) {
  return localStorage.setItem(ACCESS_TOKEN, token) && Cookies.set(ACCESS_TOKEN, token)
}

export function removeToken() {
  return localStorage.removeItem(ACCESS_TOKEN)
}
