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
        const menus = response.data.menu
        console.log(menus)
        menus.push({
          id: 9999,
          parentId: null,
          menuName: '问卷管理',
          menuUrl: '/quest-survey',
          component: 'layout',
          hidden: false,
          icon: 'education',
          hadGuide: false,
          guideId: null,
          children: [
            {
              id: 11111,
              parentId: 9999,
              menuName: '问卷管理',
              menuUrl: '/quest-survey/manager',
              component: 'views/quest-survey/manager',
              hidden: false,
              icon: 'operation',
              hadGuide: false,
              guideId: null,
              children: []
            }
          ]
        })
        const remoteroutes = traverseRoutes(menus)

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
