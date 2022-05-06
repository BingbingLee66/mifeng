import { listForRouter } from '@/api/system/menu'
import { traverseRoutes } from '@/utils/route'
import { constantRoutes } from '@/router'
import menu from '../../../mock/menu'
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
        menus.unshift({
          id: 9999,
          parentId: null,
          component: 'layout',
          hidden: false,
          icon: 'homeupdate',
          menuName: '供需管理',
          menuUrl: '/supply_and_demand',
          children: [
            {
              id: 99991,
              component: 'views/supply-and-demand/PublishImg',
              hidden: false,
              icon: 'operation',
              menuName: '发布图文供需',
              menuUrl: '/publish/img',
              parentId: 9999,
              children: []
            },
            {
              id: 99992,
              component: 'views/supply-and-demand/PublishVideo',
              hidden: false,
              icon: 'operation',
              menuName: '发布视频供需',
              menuUrl: '/publish/video',
              parentId: 9999,
              children: []
            },
            {
              id: 99993,
              component: 'views/supply-and-demand/DemandManagement',
              hidden: false,
              icon: 'operation',
              menuName: '供需管理',
              menuUrl: '/management',
              parentId: 9999,
              children: []
            }
          ]
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
