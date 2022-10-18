import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

const AppCode = 'echamber'

const validStates = [-1, 0, 1, 200, 605] // 有效state

function handleHttpInterceptors(http) {
  // request interceptor
  http.interceptors.request.use(
    config => {
      // do something before request is sent
      const token = getToken()
      const menuId = window.localStorage.getItem('menuId')
      const actionId = window.localStorage.getItem('actionId')
      config.headers['appcode'] = AppCode
      if (token) {
        config.headers['access-token'] = token // 让每个请求携带自定义token 请根据实际情况自行修改
        config.headers['menu-id'] = menuId === null ? '' : menuId
        config.headers['action-id'] = actionId === null ? '' : actionId
      }
      window.localStorage.setItem('actionId', '')
      return config
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
  )

  // response interceptor
  http.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      // 上传阿里日志
      const res = response.data
      if (response.headers.token) {
        // 如果后台通过header返回token，说明token已经更新，则更新客户端本地token
        store.dispatch('user/updateToken', { token: response.headers.token })
      }
      // if the custom code is not 1, it is judged as an error.
      if (response.request.responseType !== 'blob' && !validStates.includes(res.state) && res.code !== 200) {
        Message({
          message: res.msg === undefined ? '系统错误，请重试' : res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(res)
      } else {
        return res
      }
    },
    error => {
      if (error.response.status === 401) {
        // 退出时清除所有tab
        store.dispatch('tagsView/delAllViews')
        store.dispatch('user/logout').then(() => {
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.path }
          })
        })
        return
      }
      let errorMsg = ''
      try {
        errorMsg = error.response.data.msg
      } catch (e) {
        errorMsg = error.response.data.message || e
      }
      Message({
        message: errorMsg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  )

  return http
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 480000 // request timeout
})

// console.log('process', process.env)

export default handleHttpInterceptors(service)

export const setRequest = function (settings, params) {
  const http = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    withCredentials: false, // send cookies when cross-domain requests
    timeout: 480000, // request timeout
    ...settings
  })

  handleHttpInterceptors(http, params)

  return http
}
