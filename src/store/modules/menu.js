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
          if (v.id === 11) {
            v.children.push({
              children: [],
              component: 'views/chamber/directoryOrganizations/index', // 组件路径
              guideId: null,
              hadGuide: false,
              hidden: false,
              icon: 'operation',
              menuName: '社会组织名录',
              menuUrl: '/chamber/directory-organizations', // 页面路由 自己定义
              parentId: 11,
            })
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
