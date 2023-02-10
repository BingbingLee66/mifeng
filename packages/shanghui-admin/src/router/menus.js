import { computed, ref } from 'vue'
import router from './index'
import { getMenuList } from '@/api/user'
import { getMenuList as getMockMenuList } from '@/api/mock'

// 异步打包pages下所有vue
const pages = require.context('@/views', true, /\.vue$/, 'lazy')
// 生成map用于动态路由注册
const pageMap = pages.keys().reduce(
  (map, key) => {
    map[key.replace('./', 'views/').replace('.vue', '')] = () => pages(key)
    return map
  },
  {
    layout: () => import(/* webpackChunkName: "layout" */ '@/layout'),
    'layout/index': () => import(/* webpackChunkName: "layout" */ '@/layout')
  }
)

// 遍历菜单
function traverseMenus(menus, parentPath = '') {
  const routes = menus.map((menu, index) => {
    const routeMenu = {
      component: menu.component,
      hidden: menu.hidden,
      id: menu.id,
      meta: { title: menu.menuName, icon: menu.icon, id: menu.id },
      name: menu.menuName,
      num: index + 1,
      parentId: menu.parentId,
      path: menu.menuUrl[0] === '/' ? menu.menuUrl : `${parentPath}/${menu.menuUrl}`,
      children: menu.children,
      guideId: menu.guideId,
      hadGuide: menu.hadGuide,
      // 是否是内部模块
      isInner: menu.isInner
    }
    if (routeMenu.component) {
      routeMenu.component = pageMap[routeMenu.component] || pageMap[`${routeMenu.component}/index`]
    }

    if (routeMenu.children && routeMenu.children.length) {
      routeMenu.children = traverseMenus(routeMenu.children, routeMenu.path)
    }
    return routeMenu
  })
  return routes
}

// 菜单集合
export const menus = ref([])
const staticRoutes = [
  {
    id: 2,
    parentId: null,
    menuName: '首页工作台',
    menuUrl: '/dashboard',
    component: 'views/dashboard/index',
    icon: 'bianzu1'
  }
]
export const setMenus = (value, isMenu = true) => {
  if (isMenu) value = traverseMenus(value)
  menus.value = value
  setRemoveMenus(
    value.map(route =>
      !route.parentId && !route.children?.length ? router.addRoute('layout', route) : router.addRoute(route)
    )
  )
}

// 查找菜单
export const menuMap = computed(() =>
  menus.value.reduce((map, parent) => {
    if (parent.children) {
      parent.children.forEach(c => (map[c.path] = parent))
    } else {
      map[parent.path] = parent
    }
    return map
  }, {})
)
// 初始化菜单
export const initMenus = async () => {
  const { data } = process.env.NODE_ENV === 'development' ? await getMockMenuList() : await getMenuList()
  // const { data } = await getMenuList()

  setMenus([...staticRoutes, ...data.menu])
}
// 菜单移除集合
export const removeMenus = ref([])
export const setRemoveMenus = value => {
  removeMenus.value = value
}

// 清空菜单
export const clearMenus = () => {
  removeMenus.value.forEach(v => v())
  setMenus([])
  setRemoveMenus([])
}
