import { getRoleActions } from '@/api/authority/permission'

const state = {
  permissions: []
}

const mutations = {
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // get permission
  getPermission({ dispatch, commit }, to) {
    if (to.meta.id !== undefined) {
      window.localStorage.setItem('menuId', to.meta.id)
    }
    return new Promise((resolve, reject) => {
      getRoleActions({ menuId: to.meta.id }).then(response => {
        const { data } = response
        commit('SET_PERMISSIONS', data.data)
        resolve()
      }).catch(error => {
        console.log('error', error)
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
