import { computed, ref } from 'vue'
import router from '../router/index'
// 菜单集合
export const menus = ref([])
// 菜单移除集合

export const removeMenus = ref([])
export const setRemoveMenus = value => {
  removeMenus.value = value
}

export const setMenus = (value, isMenu = true) => {
  if (isMenu) value = traverseMenus(value)
  menus.value = value
  setRemoveMenus(
    value.map(route =>
      !route.parentId && !route.children?.length ? router.addRoute('layout', route) : router.addRoute(route)
    )
  )
}

// 清空菜单
export const clearMenus = () => {
  removeMenus.value.forEach(v => v())
  setMenus([])
  setRemoveMenus([])
}

let pageMap = {}
export const setPageMap = value => {
  pageMap = value
}

export const innerRoutes = [
  '/content/aigc',
  '/content/ai-topic',
  '/home-update/recommend-manage',
  '/home-update/tab-manage',
  '/home-update/banner-manage',
  '/home-update/explode-goods',
  '/home-update/hot-activity',
  '/activity/create',
  '/activity/list',
  '/activity/activity-verify',
  '/album/list',
  '/album/create',
  '/content/king-areae',
  '/content/crawler',
  '/content/audit',
  '/content/info-column',
  '/content/carousel-update',
  '/quest-survey/manager',
  '/dashboard',
  '/chamber/investment-entry',
  '/chamber/join-audit',
  '/chamber/manager',
  '/chamber/directory-organizations',
  '/chamber/ClueManager',
  '/album/report',
  '/content/sign-in',
  '/finance/supplier-settle',
  '/mass-notification/template-library',
  '/order/order-setting',
  '/order/manager',
  '/finance/echamber-account',
  '/finance/chamber-capital',
  '/finance/chamber-withdrawal',
  '/finance/set-charge',
	'/mass-notification/template-set',
  '/mass-notification/5g/list',
  '/mass-notification/mass-list',
  '/mass-notification/create'
]

export const traverseMenus = (menus, parentPath = '') => {
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
      isInner: innerRoutes.includes(menu.menuUrl)
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
