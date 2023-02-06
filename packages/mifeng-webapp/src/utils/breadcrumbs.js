import { reactive, watch } from 'vue'
import router from '@/router'
import { menuMap } from '@/router/menus'
import { BREADCRUMBS } from '@/constant'

export const breadcrumbs = reactive(JSON.parse(localStorage.getItem(BREADCRUMBS)) || [])

watch(breadcrumbs, breadcrumbs => {
  breadcrumbs.length && localStorage.setItem(BREADCRUMBS, JSON.stringify(breadcrumbs))
})

const whiteList = ['/', '/login', '/home']

router.beforeEach((to, from, next) => {
  if (whiteList.includes(to.path)) {
    breadcrumbs.length = 0
    return next()
  }
  // 菜单切换重置面包屑
  const parentMenu = menuMap.value[to.path]
  if (parentMenu) {
    breadcrumbs.length = 0
    breadcrumbs.push({ name: parentMenu.name })
  } else {
    const i = breadcrumbs.findIndex(v => v.path === to.path)
    // 存在该面包屑则清除该项后面的面包屑
    if (i > -1) {
      breadcrumbs.splice(i, breadcrumbs.length - i)
    }
  }
  const { name, meta, path, fullPath } = to
  breadcrumbs.push({ name: meta.title || name, path, fullPath })
  next()
})
