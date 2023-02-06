import { computed } from 'vue'
import dayjs from 'dayjs'
import store from '@/store'

// 注册全局方法或属性
export default {
  install(app) {
    // 全局过滤器
    app.config.globalProperties.$filters = {
      dateFormat(str, format = 'YYYY-MM-DD HH:mm:ss') {
        if (!str) return '--'
        if (+str > 0) str = +str
        return dayjs(str).format(format)
      }
    }

    // 模板注入全局ckey
    app.config.globalProperties.ckey = computed(() => store.state.user.ckey)
  }
}
