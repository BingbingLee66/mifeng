<template>
  <a-config-provider :locale="locale" :getPopupContainer="getPopupContainer">
    <router-view />
  </a-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import { ConfigProvider } from 'antd'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export default defineComponent({
  components: {
    AConfigProvider: ConfigProvider
  },
  setup() {
    const getPopupContainer = el => {
      if (el) {
        return el.parentNode
      } else {
        return document.body
      }
    }
    return {
      getPopupContainer,
      locale: zhCN
    }
  }
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
:root {
  --theme-color: #f4c820;
}
</style>
