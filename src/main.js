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
import { decrypt } from '@/utils/cryptoUtils'
import Print from '@/utils/print' // 打印
import VueClipboard from 'vue-clipboard2' // 复制内容
import DbClick from '@/utils/dbClick' // 防止重复点击
import { formatDateTime, formatDate } from '@/utils/date' // 格式化时间戳
import VueUeditorWrap from 'vue-ueditor-wrap'

require('../src/plugins/aliplayercomponents-1.0.5.min')
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
import kdDialog from './components/common/kdDialog'

Vue.component('kdDialog', kdDialog)
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
  return dataStr === null ? '--' : formatDateTime(new Date(parseInt(dataStr)), 'yyyy-MM-dd hh:mm:ss')
})
/**
 *时间戳过滤器
 */
Vue.filter('dateFormat2', (dataStr) => {
  return dataStr === null ? '--' : formatDate(new Date(dataStr), 'yyyy-MM-dd')
})

Vue.mixin({
  methods: {
    // 创建视频
    $createPlayer(id, accessKeyId, accessKeySecret, securityToken, region, vid, height = '300px',autoplay) {
      accessKeyId = decrypt(accessKeyId)
      accessKeySecret = decrypt(accessKeySecret)
      securityToken = decrypt(securityToken)
      region = decrypt(region)
      return new Aliplayer({
        id,
        // autoplay: false,  //是否自动播放
        autoplay,  //是否自动播放
        width: '100%',
        height,
        // 支持播放地址播放,此播放优先级最高
        // source,
        // 播放方式四：使用STS方式播放
        vid,
        region,
        // vid: '10c0875db475494b891a8fc7f9b259d2',
        accessKeyId,
        accessKeySecret,
        securityToken,
        isLive: false,
        defaultDefinition: 'LD',
        // cover: picUrl,
        controlBarVisibility: 'always',
        components: [{
          name: 'RateComponent',
          type: AliPlayerComponent.RateComponent,
        }],
        // https://help.aliyun.com/document_detail/62948.html#-
        skinLayout: [{
          name: 'bigPlayButton',
          align: 'blabs',
          x: 'calc(50% - 32px)',
          y: '50%'
        },
        {
          name: 'H5Loading',
          align: 'cc',
        },
        {
          name: 'errorDisplay',
          align: 'tlabs',
          x: 0,
          y: 0
        },
        {
          name: 'infoDisplay'
        },
        {
          name: 'tooltip',
          align: 'blabs',
          x: 0,
          y: 56
        }, // 悬浮在按钮上的提示
        {
          name: 'thumbnail'
        },
        {
          name: 'controlBar',
          align: 'blabs',
          x: 0,
          y: 0, // 控制视频的控件
          children: [{
            name: 'progress',
            align: 'blabs',
            x: 0,
            y: 44
          }, // 进度
          {
            name: 'playButton',
            align: 'tl',
            x: 15,
            y: 12
          }, // 播放按钮
          {
            name: 'timeDisplay',
            align: 'tl',
            x: 10,
            y: 7
          }, // 时间线
          {
            name: 'fullScreenButton',
            align: 'tr',
            x: 10,
            y: 12
          }, // 全屏按钮按钮
          // {name:"subtitle", align:"tr",x:5, y:12},                // 字幕
          // {name:"setting", align:"tr",x:15, y:12},                // 设置
          {
            name: 'volume',
            align: 'tr',
            x: 5,
            y: 10
          }],
        },

        ],
        // components: [{
        //   name: 'ProgressComponent',
        //   type: ProgressComponent
        // }, ]
      },)
    },
    // 下载抓错
    $downloadFile(data, name) {
      if (data.type === 'application/json') {
        // 说明是普通对象数据，读取信息
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
          const jsonData = JSON.parse(fileReader.result)
          // 后台信息
          if (jsonData && jsonData.code !== 200) return this.$message.error(jsonData.msg || '请稍后重试')
        }
        fileReader.readAsText(data)
      } else {
        let blob = new Blob([data], {
          type: 'application/vnd.ms-excel'
        })
        let downLoadEle = document.createElement('a')
        let href = URL.createObjectURL(blob)
        downLoadEle.href = href
        downLoadEle.download = name // 自定义文件名
        document.body.appendChild(downLoadEle)
        downLoadEle.click()
        document.body.removeChild(downLoadEle)
        window.URL.revokeObjectURL(href)
      }
    },
    // 深拷贝
    $deepClone(obj) {
      var newObj = obj instanceof Array ? [] : {}
      if (typeof obj !== 'object') {
        return obj
      } else {
        for (var i in obj) {
          newObj[i] = typeof obj[i] === 'object' ? this.$deepClone(obj[i]) : obj[i]
        }
      }
      return newObj
    },
    // 精准除法
    $accDivision(arg1, arg2) {
      let t1 = 0,
        t2 = 0,
        r1, r2
      try {
        t1 = arg1.toString().split('.')[1].length
      } catch (e) {}
      try {
        t2 = arg2.toString().split('.')[1].length
      } catch (e) {}
      r1 = Number(arg1.toString().replace('.', ''))
      r2 = Number(arg2.toString().replace('.', ''))
      return (r1 / r2) * Math.pow(10, t2 - t1)
    },
    $minHeight() {
      return (document.documentElement.clientHeight - 70) + 'px'
    },
  }
})
