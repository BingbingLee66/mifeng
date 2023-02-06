import axios from 'axios'
import { message } from 'antd'
import store from '@/store'
import { APP_CODE } from '@/constant'
import { permission } from './permission'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_BASE_URL + '/api',
  timeout: 60000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = error => {
  const { response, config } = error
  if (response) {
    if (response.status === 403) {
      // TODO 403 Forbidden
    }
    if (response.status === 401) {
      // 401无权限
      store.dispatch('user/logout')
    }
    if (config.method !== 'get' && /^5/.test(response.status)) {
      message.error('服务正在升级维护，请稍后再试')
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
request.interceptors.request.use(config => {
  if (process.env.NODE_ENV === 'development' && /^\/mock/.test(config.url)) {
    config.url = window.origin + config.url
  }
  // 添加token
  const { token } = store.state.user
  if (token) {
    Object.assign(config.headers, {
      'access-token': token,
      // 添加权限标记
      'menu-id': permission.menuId || '',
      'action-id': permission.actionId || ''
    })
    // 请求头添加完置空
    permission.actionId = ''
  }
  // 添加appcode
  Object.assign(config.headers, { appcode: APP_CODE })

  return config
}, errorHandler)

// 响应拦截器
request.interceptors.response.use(response => {
  const { data, config } = response
  if (data.state !== 1 && !config.hiddenError) {
    message.error(data.msg)
    return Promise.reject(data)
  } else if (config.method !== 'get' && !config.hiddenSuccess) {
    message.success(data.msg)
  }
  return response.data
}, errorHandler)

export default request
