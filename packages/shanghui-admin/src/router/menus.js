import { getMenuList } from '@business/common/src/user/api'
import { getMenuList as getMockMenuList } from '@/api/mock'
import {
  removeMenus,
  setRemoveMenus,
  setMenus,
  clearMenus,
  traverseMenus,
  menus,
  menuMap,
  setPageMap
} from '@business/common/src/utils/menusHelpers'

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

setPageMap(pageMap)

const staticRoutes = [
  {
    id: 2,
    parentId: null,
    menuName: '首页',
    menuUrl: '/dashboard',
    component: 'views/dashboard/index',
    icon: 'bianzu1'
  }
]

// 初始化菜单
export const initMenus = async () => {
  try {
    const { data } = process.env.NODE_ENV === 'development' ? await getMockMenuList() : await getMenuList()
    setMenus([...staticRoutes, ...data.menu])
  } catch (error) {
    setMenus([...staticRoutes])
  }
}

export { removeMenus, setRemoveMenus, setMenus, clearMenus, traverseMenus, menus, menuMap }
