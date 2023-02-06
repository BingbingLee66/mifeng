<template>
  <a-layout-sider
    class="sider-bar"
    v-model:collapsed="collapsed"
    theme="light"
    breakpoint="lg"
    :collapsedWidth="64"
    @breakpoint="collapsed = $event"
  >
    <div class="sider-bar-wrap">
      <div class="logo" @click.stop="$emit('clickLogo')">
        <img v-if="collapsed" class="collapsed-logo" :src="logo1" />
        <div v-else class="uncollapse-logo">
          <img :src="logo2" />
        </div>
      </div>
      <div class="menu-content">
        <a-menu :selectedKeys="[activeMenuValue]" mode="inline" v-model:open-keys="openKeys">
          <template v-for="item of menus">
            <template v-if="!item.hidden">
              <a-sub-menu v-if="item.children && item.children.length" :key="item[menuKey]">
                <template #icon>
                  <icon-font :type="item.meta.icon" />
                </template>
                <template v-slot:title>
                  <span>{{ item.name }}</span>
                </template>
                <template v-for="child of item.children">
                  <a-menu-item v-if="!child.hidden" :key="child[menuKey]" @click="onClickMenu(child, item)">
                    {{ child.name }}
                  </a-menu-item>
                </template>
              </a-sub-menu>
              <template v-else>
                <a-menu-item :key="item[menuKey]" @click="onClickMenu(item, null)">
                  <template #icon>
                    <icon-font :type="item.meta.icon" />
                  </template>
                  <span>{{ item.name }}</span>
                </a-menu-item>
              </template></template
            >
          </template>
        </a-menu>
      </div>
      <div class="footer" :class="{ collapsed }">
        <component :is="collapsed ? 'menu-unfold-outlined' : 'menu-fold-outlined'" @click="collapsed = !collapsed" />
      </div>
    </div>
  </a-layout-sider>
</template>

<script>
import { defineComponent, watch, ref } from 'vue'
import { Layout, Menu } from 'antd'
import { useImgUrl } from '@/hooks/useImgUrl'

// 菜单展开keys集合
function useOpenKeys(props) {
  const openKeys = ref([])
  // 自动展开激活子菜单
  const setActiveOpenKey = () => {
    let openKey
    props.menus.some(cur => {
      if (cur[props.menuKey] === props.activeMenuValue) {
        openKey = cur[props.menuKey]
        return true
      }
      if (cur.children && cur.children.some(v => v[props.menuKey] === props.activeMenuValue)) {
        openKey = cur[props.menuKey]
        return true
      }
      return false
    })
    if (!openKey || openKeys.value.includes(openKey)) return
    openKeys.value.push(openKey)
  }

  return { openKeys, setActiveOpenKey }
}

export default defineComponent({
  name: 'SiderBar',
  components: {
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ASubMenu: Menu.SubMenu,
    ALayoutSider: Layout.Sider
  },
  props: {
    // 菜单列表
    menus: {
      type: Array,
      default() {
        return []
      }
    },
    // 菜单对象的对应键 用于标记菜单唯一
    menuKey: {
      type: String,
      default: 'path'
    },
    // 激活的菜单键值
    activeMenuValue: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const logo1 = `${useImgUrl('commons/logo.png')}`
    const logo2 = `${useImgUrl('commons/logo2.png')}`
    const bgImg = `url(${useImgUrl('siderbar/bg.png')}) no-repeat`
    const collapsed = ref(false)
    const { openKeys, setActiveOpenKey } = useOpenKeys(props)
    watch(
      () => props.activeMenuValue,
      () => setActiveOpenKey(),
      { immediate: true }
    )

    watch(collapsed, collapsed => (collapsed ? (openKeys.value = []) : setActiveOpenKey()))

    return {
      collapsed,
      openKeys,
      logo1,
      logo2,
      bgImg
    }
  },
  methods: {
    onClickMenu(child, parent) {
      this.$emit('change', { ...child, parent })
    }
  }
})
</script>

<style lang="less" scoped>
.sider-bar {
  height: 100%;
  position: relative;
  box-shadow: 0px 3px 13px 0px #e4e4e4;
  .sider-bar-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  .logo {
    box-sizing: border-box;
    width: 100%;
    background-color: #fff;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #f0f0f0;
    cursor: pointer;

    .collapsed-logo {
      width: 21px;
      height: 21px;
      margin: 10px 0;
    }

    .uncollapse-logo {
      width: 100%;
      height: 172px;
      background: v-bind(bgImg);
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        display: block;
        width: 66px;
        height: 99px;
      }
    }
  }

  .menu-content {
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }
  }

  .footer {
    width: 100%;
    height: 40px;
    background-color: #fff;
    z-index: 1;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    display: flex;
    align-items: center;
    padding: 0 24px;

    &.collapsed {
      padding: 0 calc(50% - 16px / 2);
      font-size: 16px;
    }
  }
}
</style>
