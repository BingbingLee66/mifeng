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

  getSideMenus({ commit }) {
    return new Promise((resolve, reject) => {
      listForRouter().then(response => {
        const menus = response.data.menu
        menus.forEach(v => {
          if (v.id === 33) {
            v.children.push({
              id: 9999,
              parentId: 33,
              menuName: '5G彩信模板管理',
              menuUrl: '/mass-notification/5g/list',
              component: 'views/mass-notification/5g/list',
              hidden: false,
              icon: 'operation',
              hadGuide: false,
              guideId: null,
              children: []
            })
          }
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
