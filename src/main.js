import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import ECharts from 'vue-echarts/components/ECharts.vue'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import i18n from './lang' // Internationalization
import '@/icons' // icon
import '@/permission' // permission control

import Print from '@/utils/print' // 打印
import VueClipboard from 'vue-clipboard2' // 复制内容
import DbClick from '@/utils/dbClick' // 防止重复点击
import { formatDateTime, formatDate } from '@/utils/date' // 格式化时间戳
import VueUeditorWrap from 'vue-ueditor-wrap'

Vue.use(Print)
Vue.use(DbClick)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

// set ElementUI lang to EN
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
Vue.component('vue-ueditor-wrap', VueUeditorWrap)
Vue.component('v-chart', ECharts)
Vue.config.productionTip = false

Vue.use(VueClipboard)

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

window.ysh = {
  baseApiUrl: process.env.VUE_APP_BASE_API
}
/**
 *时间戳过滤器
 */
Vue.filter('dateFormat', (dataStr) => {
  return dataStr === null ? '--' : formatDateTime(new Date(dataStr), 'yyyy-MM-dd hh:mm:ss')
})
/**
 *时间戳过滤器
 */
Vue.filter('dateFormat2', (dataStr) => {
  return dataStr === null ? '--' : formatDate(new Date(dataStr), 'yyyy-MM-dd')
})
