import SlsTracker from '@aliyun-sls/web-track-browser'
import router from '../router'
import store from '../store'
import dayjs from 'dayjs'

class Tracker extends SlsTracker {
  constructor({ createCommonParams, ...options } = {}) {
    super(options)
    if (createCommonParams) this.createCommonParams = createCommonParams
  }
  async send(data = {}) {
    try {
      super.send(await this.beforeSend(data))
    } catch { }
  }
  async sendImmediate(data = {}) {
    try {
      super.sendImmediate(await this.beforeSend(data))
    } catch { }
  }
  async sendBatchLogs(data = []) {
    try {
      super.sendBatchLogs(await this.beforeSend(data))
    } catch { }
  }
  async sendBatchLogsImmediate(data = []) {
    try {
      super.sendBatchLogsImmediate(await this.beforeSend(data))
    } catch { }
  }
  async beforeSend(data) {
    const commonParams = await Promise.resolve(this.createCommonParams())
    const { web_name, app_name, platform } = commonParams
    const source = `${web_name || app_name}-${platform}`
    if (this.opt.source !== source) this.opt.source = source
    const log = Array.isArray(data) ? data.map(v => ({ ...commonParams, ...v })) : { ...commonParams, ...data }
    // 未登录则延迟登录后上报
    if (!log.user_only) {
      this.delayLogs.push(log)
      throw 'Delay log' // eslint-disable-line
    } else if (this.delayLogs.length) { // 立即上报延时日志
      const delayLogs = this.delayLogs.map(log => ({ ...log, ...commonParams }))
      this.delayLogs.length = 0
      super.sendBatchLogsImmediate(delayLogs)
    }
    return log
  }

  delayLogs = [] // 延迟上报集
}

const tracker = new Tracker({
  host: process.env.VUE_APP_SLS_HOST,
  project: process.env.VUE_APP_SLS_PROJECT,
  logstore: process.env.VUE_APP_SLS_LOGSTORE,
  time: 5,
  count: 10,
  topic: '',
  source: 'mfSCRM-web',
  createCommonParams() {
    const { id: user_only = '', ckey = '' } = store.state.user.profile || {}
    const { currentRoute, prevRoute } = router
    return {
      cookie: document.cookie,
      device_id: '',
      user_only,
      time: Date.now(),
      date: dayjs().format('YYYY/MM/DD'),
      platform: 'web',
      web_name: ckey ? 'mfSCRM' : 'zhtSCRM',
      current_url: currentRoute.path, // 当前页面
      from_url: prevRoute.path === '/' ? '' : prevRoute.path, // 当前页面之前的页面
    }
  }
})

/*
*  @param {target} 目标对象
*  @param {key} 目标对象对应字段
*  @param {fn} 插入的方法
*/
function proxy(target, key, fn) {
  const { [key]: _method = () => { } } = target
  target[key] = function (...args) {
    try {
      fn.call(this, ...args)
    } catch { }
    return _method.apply(this, args)
  }
}
// 路由追踪上报
(function traceRouter() {
  router.afterEach((to, from) => {
    router.prevRoute = from
    // 上报跳转来源
    tracker.send({ event: 'EnterPage' })
  })
  function reportToUrl({ path = '' } = {}) {
    // 上报跳转去向
    tracker.send({ to_url: path, event: 'Click' })
  }
  proxy(router, 'push', reportToUrl)
  proxy(router, 'replace', reportToUrl)
})()

export default tracker
