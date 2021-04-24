export function setSideMenus(Menus) {
  /* 存储的是Json 字符串*/
  localStorage.setItem('sideMenus', JSON.stringfy(Menus))
}

export function getSideMenus() {
  const strMenus = localStorage.getItem('sideMenus')
  return JSON.parse(strMenus)
}

export function traverseRoutes(menus) {
  let routes = menus.map((menu, index) => {
    let routeMenu = {
      component: menu.component,
      hidden: menu.hidden,
      id: menu.id,
      meta: { title: menu.menuName, icon: menu.icon, id: menu.id },
      name: menu.menuName,
      num: index + 1,
      parentId: menu.parentId,
      path: menu.menuUrl,
      children: menu.children
    }
    if (routeMenu.component) {
      let name = routeMenu.component
      routeMenu.component = (resolve) => require([`@/${name}`], resolve)
    }

    if (routeMenu.children && routeMenu.children.length) {
      routeMenu.children = traverseRoutes(routeMenu.children)
    }
    return routeMenu
  })
  return routes
}
