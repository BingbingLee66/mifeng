import { defineAsyncComponent } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'

export default {
  install(app) {
    // antd icons 统一处理成异步组件
    const files = require.context('@ant-design/icons-vue', false, /\.js$/, 'lazy')
    files
      .keys()
      .filter(v => v.includes('@ant-design'))
      .forEach(key => {
        const arr = key.split('/')
        const type = arr[arr.length - 1].replace('.js', '')
        app.component(
          type,
          defineAsyncComponent(() => files(key))
        )
      })

    // 注册全局iconfont
    app.component(
      'IconFont',
      createFromIconfontCN({
        scriptUrl: '//ysh-cdn.kaidicloud.com/prod/bee/iconfont/font_3804451_9twp6fjyeqe.js'
      })
    )
  }
}
