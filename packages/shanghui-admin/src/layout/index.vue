<template>
  <a-layout id="layout">
    <SiderBar
      width="256"
      style="background: #fff"
      :menus="menus"
      :activeMenuValue="$route.path"
      @change="onClickMenu"
      @clickLogo="goHome"
    />
    <a-layout class="content-layout">
      <TitleTips />
      <HeaderBar :userInfo="userInfo" :menuList="headerMenuList" />
      <div style="height: 100%; overflow: auto; padding-bottom: 20px">
        <TitleBar v-if="!hideTitleBar" />
        <div>
          <router-view />
        </div>
      </div>
    </a-layout>
  </a-layout>
</template>
<script>
import { computed, defineComponent } from 'vue'
import { Layout } from 'antd'
import { useStore } from 'vuex'
import { menus } from '@/router/menus'
import { useRoute, useRouter } from 'vue-router'
import { gotoMerchant } from '@/api/merchant/merchant'
import TitleTips from '@/components/layouts/TitleTips'
import SiderBar from '@/components/layouts/SiderBar'
import HeaderBar from '@/components/layouts/HeaderBar'
import TitleBar from '@/components/layouts/TitleBar'

export default defineComponent({
  components: {
    ALayout: Layout,
    TitleTips,
    SiderBar,
    HeaderBar,
    TitleBar
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    return {
      menus,
      userInfo: computed(() => store.state.user),
      // 头部菜单列表
      headerMenuList: [
        {
          name: '修改密码',
          handler: () => {
            router.push({ path: '/account/updatePwd' })
          }
        },
        {
          name: '退出登录',
          handler: () => {
            store.dispatch('user/logout')
          }
        }
      ],
      hideTitleBar: computed(() => {
        if (!route?.matched.length) return false
        // 取最后一个匹配项
        const currentRoute = route.matched[route.matched.length - 1]
        return currentRoute.components && currentRoute.components.default.hideTitleBar
      }),
      // 点击侧边栏子菜单
      onClickMenu(menu) {
        if (menu.path === '/livetelecast') return
        if (menu.path === '/livetelecast/manager') {
          gotoMerchant().then(res => {
            window.open(res.data, '_blank')
          })
        } else {
          if (!menu.isInner) {
            const { VUE_APP_BASE_URL, VUE_APP_BUILD_ENV } = process.env
            const isProd = VUE_APP_BUILD_ENV === 'production'
            window.location.href = `${
              isProd ? `https://scrm.kaidicloud.com/#${menu.path}` : `${VUE_APP_BASE_URL}/ecadmin/#${menu.path}`
            }`
          } else {
            router.push({ path: menu.path })
          }
        }
      },
      goHome() {
        router.push('/')
      }
    }
  }
})
</script>

<style lang="less" scoped>
#layout {
  height: 100%;
}

.content-layout {
  height: 100%;
  overflow: auto;
}
</style>
