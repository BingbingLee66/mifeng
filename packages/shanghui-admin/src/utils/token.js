import { ACCESS_TOKEN } from '@/constant'

export function getToken() {
  return localStorage.getItem(ACCESS_TOKEN)
}

export function setToken(token) {
  return localStorage.setItem(ACCESS_TOKEN, token)
}

export function removeToken() {
  return localStorage.removeItem(ACCESS_TOKEN)
}
