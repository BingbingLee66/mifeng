<template>
  <a-layout-header :style="{ background: '#fff', padding: 0, height: 'auto' }">
    <div class="header">
      <a class="help" v-if="hadGuide" @click="onSkip">操作指引</a>
      <a class="help" href="https://www.yuque.com/yunshanghuisolink/help" target="_blank"> 帮助文档 </a>
      <a-badge :count="count" :overflow-count="99" :offset="[10, 0]" class="notice-icon">
        <bell-two-tone @click="goMail" />
      </a-badge>

      <img class="chamber-icon" src="https://ysh-cdn.kaidicloud.com/prod/bee/chamber-icon.png" alt="" />
      <span class="chamber-name">{{ userInfo.chambername }}</span>
      <a-dropdown class="username">
        <div>
          <img v-if="userInfo.systemlogo" class="avatar" :src="userInfo.systemlogo" />
          <img v-else class="avatar" src="@/assets/imgs/commons/default-avatar.png" />
          {{ userInfo.name }}
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="(v, i) of menuList" :key="i" @click="hanlderMenuClick(v, i)">
              {{ v.name }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <div class="header-icon"></div>
    </div>
  </a-layout-header>
</template>

<script>
import { defineComponent, ref, onUnmounted, onMounted, watch } from 'vue'
import { Layout, Menu } from 'antd'
import { useRouter, useRoute } from 'vue-router'
import { stationMailDing } from '@/api/mass-notification/index'
import { getMenuList } from '@/api/user'

export default defineComponent({
  name: 'HeaderBar',
  components: {
    ALayoutHeader: Layout.Header,
    AMenu: Menu,
    AMenuItem: Menu.Item
  },
  props: {
    breadcrumbs: {
      type: Array,
      default() {
        return []
      }
    },
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    menuList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup() {
    const router = useRouter()
    const goMail = async () => {
      router.push('/sms/mail')
    }
    const count = ref(0)
    let timer = null
    const onDing = async () => {
      clearInterval(timer)
      const { data } = await stationMailDing()
      count.value = data || 0
      timer = setTimeout(onDing, 30000)
    }

    const route = useRoute()
    const menu = ref([])
    const menu1Id = ref(null)
    const menu2Id = ref(null)
    const hadGuide = ref(false)
    const guideId = ref(null)
    const getMenu = async () => {
      const {
        data: { menu: menuList }
      } = await getMenuList()
      menu.value = menuList
      menuList.forEach(v => {
        v.children.forEach(j => {
          if (j.menuUrl === route.path) {
            menu1Id.value = v.id
            menu2Id.value = j.id
            hadGuide.value = j.hadGuide
            guideId.value = j.guideId
          }
        })
      })
    }

    watch(
      () => route.path,
      async newPath => {
        if (newPath) {
          menu.value.forEach(v => {
            v.children.forEach(j => {
              if (j.menuUrl === newPath) {
                menu1Id.value = v.id
                menu2Id.value = j.id
                hadGuide.value = j.hadGuide
                guideId.value = j.guideId
              }
            })
          })
        }
      },
      { immediate: true }
    )

    // 点击操作指引
    const onSkip = () => {
      if (guideId.value == null) {
        router.push({
          path: '/guide/chamberGuide',
          query: {
            menu1Id: menu1Id.value,
            menu2Id: menu2Id.value
          }
        })
      } else {
        router.push({
          name: '操作指引详情',
          query: {
            detailsId: guideId.value
          }
        })
      }
    }

    onMounted(() => {
      onDing()
      getMenu()
    })
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      hanlderMenuClick(item, i) {
        item.handler && item.handler(item, i)
      },
      goMail,
      count,
      menu1Id,
      menu2Id,
      hadGuide,
      guideId,
      onSkip
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  z-index: 2;
  height: 48px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);

  .help {
    flex-shrink: 0;
    color: #40a9ff;
    margin-right: 52px;
  }

  .notice-icon {
    cursor: pointer;
    margin-right: 40px;
  }

  .chamber-icon {
    width: 24px;
    height: 24px;
  }

  .chamber-name {
    margin-right: 30px;
    max-width: 50%;
    @include ellipsis(1);
  }
  .avatar {
    width: 24px;
    height: 24px;
    background-color: #fff;
    border-radius: 50%;
    margin-right: 8px;
  }

  .header-icon,
  .username {
    margin-right: 27px;
  }
}
</style>
