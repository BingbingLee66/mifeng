import { listForRouter } from '@/api/system/menu'
import { traverseRoutes } from '@/utils/route'
import { constantRoutes } from '@/router'
// import menu from '../../../mock/menu'
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {

  getSideMenus({ commit, state }) {
    return new Promise((resolve, reject) => {
      listForRouter().then(response => {
        let menus = response.data.menu
        menus.forEach(v => {
          if (v.id === 25) {
            v.children.push(...[
              {
                children: [],
                component: 'views/album/create',
                guideId: null,
                hadGuide: false,
                hidden: false,
                icon: 'operation',
                menuName: '创建直播相册',
                menuUrl: '/album/create',
                parentId: 25
              },
              {
                children: [],
                component: 'views/album/list',
                guideId: null,
                hadGuide: false,
                hidden: false,
                icon: 'operation',
                menuName: '图片直播',
                menuUrl: '/album/list',
                parentId: 25
              },
            ])
          }
        })
        let remoteroutes = traverseRoutes(menus)
        commit('SET_ROUTES', remoteroutes)
        resolve(remoteroutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
