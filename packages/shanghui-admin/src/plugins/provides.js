import { computed } from 'vue'
import dayjs from 'dayjs'
import store from '@/store'

export default {
  install(app) {
    // 注入商会ckey
    app.provide(
      'ckey',
      computed(() => store.state.user.ckey)
    )
    app.provide('$filters', {
      dateFormat(str, format = 'YYYY-MM-DD HH:mm:ss') {
        if (!str) return '--'
        if (+str > 0) str = +str
        return dayjs(str).format(format)
      }
    })
  }
}
