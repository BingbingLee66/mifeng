import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'
import { reportSlsData } from '@/api/statistics/tracker'

const AppCode = 'echamber'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 480000 // request timeout
})
console.log('process', process.env)
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    var token = getToken()
    var menuId = window.localStorage.getItem('menuId')
    var actionId = window.localStorage.getItem('actionId')
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
service.interceptors.response.use(
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
    reportRequestData(response)
    const res = response.data
    if (response.headers.token) {
      // 如果后台通过header返回token，说明token已经更新，则更新客户端本地token
      store.dispatch('user/updateToken', { token: response.headers.token })
    }
    // if the custom code is not 1, it is judged as an error.
    if (response.request.responseType !== 'blob' && res.state !== 1 && res.state !== -1 && res.state !== 0 && res.code !== 200 && res.state !== 200) {
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

function reportRequestData(response) {
  try {
    const baseURL = response.config.baseURL
    const url = response.config.url.replace(baseURL, '')
    const method = response.config.method.toUpperCase()
    const status = response.request.status
    const { ckey } = store.getters
    var params = ''
    var user_only = ''
    var ckeyStr = ''

    if (ckey) {
      ckeyStr = store.getters.ckey
    } else if (!url.includes('/user/login') && !ckey) {
      return
    }
    if (!response.config.hasOwnProperty('params') && response.config.hasOwnProperty('data')) {
      params = response.config.data
    } else {
      params = response.config.params
    }
    if (params === 'undefined') {
      params = ''
    }
    if (url.includes('/user/login')) {
      user_only = params.username
    } else {
      user_only = store.getters.profile.userName
    }
    reportSlsData({ url: url, ckey: ckeyStr, user_only: user_only, method: method, status: status, params: params, extend: '' })
  } catch (e) {
    console.log('sls日志收集失败', e)
  }
}

export default service
