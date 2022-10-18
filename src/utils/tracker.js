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
      const commonParams = await Promise.resolve(this.createCommonParams())
      super.send({ ...commonParams, ...data })
    } catch { }
  }
  async sendImmediate(data = {}) {
    try {
      const commonParams = await Promise.resolve(this.createCommonParams())
      super.sendImmediate({ ...commonParams, ...data })
    } catch { }
  }
  async sendBatchLogs(arr = []) {
    try {
      const commonParams = await Promise.resolve(this.createCommonParams())
      super.sendBatchLogs(arr.map(v => ({ ...commonParams, ...v })))
    } catch { }
  }
  async sendBatchLogsImmediate(arr = []) {
    try {
      const commonParams = await Promise.resolve(this.createCommonParams())
      super.sendBatchLogsImmediate(arr.map(v => ({ ...commonParams, ...v })))
    } catch { }
  }
}

const tracker = new Tracker({
  host: process.env.VUE_APP_SLS_HOST,
  project: process.env.VUE_APP_SLS_PROJECT,
  logstore: process.env.VUE_APP_SLS_LOGSTORE,
  time: 5,
  count: 10,
  topic: '',
  source: 'YSH-ADMIN',
  createCommonParams() {
    const { id: user_only = '' } = store.state.user.profile || {}
    const { currentRoute, prevRoute } = router
    return {
      cookie: document.cookie,
      device_id: '',
      user_only,
      time: Date.now(),
      date: dayjs().format('YYYY/MM/DD'),
      platform: 'web',
      web_name: 'mfSCRM',
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
