import { login, logout, getInfo } from '@/api/user'
// import { logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const state = {
  token: getToken(),
  name: '',
  profile: undefined,
  roles: [],
  ckey: '',
  chambername: '',
  systemlogo: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_PROFILE: (state, profile) => {
    state.profile = profile
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CKEY: (state, ckey) => {
    state.ckey = ckey
  },
  SET_CHAMBERNAME: (state, chambername) => {
    state.chambername = chambername
  },
  SET_SYSTEMLOGO: (state, systemlogo) => {
    state.systemlogo = systemlogo
  }
}

const actions = {
  // user login
  login({ dispatch, commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        Message({
          message: '登录成功',
          type: 'success',
          duration: 1 * 1000
        })
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)

        resolve()
      }).catch(error => {
        console.log('error1', error)
        reject(error)
      })
    })
  },
  // login({ dispatch, commit }, response) {
  //       const { data } = response
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       Message({
  //         message: '登录成功',
  //         type: 'success',
  //         duration: 1 * 1000
  //       })
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)

  //       resolve()
  //     }).catch(error => {
  //       console.log('error1', error)
  //       reject(error)
  //     })
  //   })
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { profile } = data
        let getroles = []
        getroles.push(profile.roleName)
        commit('SET_NAME', profile.remark)
        commit('SET_PROFILE', profile)
        commit('SET_ROLES', getroles)
        commit('SET_CKEY', profile.ckey)
        commit('SET_CHAMBERNAME', profile.chamberName)
        commit('SET_SYSTEMLOGO', profile.systemLogo)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_PROFILE', {})
        commit('SET_ROLES', [])
        commit('SET_CKEY', '')
        commit('SET_CHAMBERNAME', '')
        commit('SET_SYSTEMLOGO', '')
        commit('SET_PERMISSIONS', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
  updateToken({ commit }, { token }) {
    commit('SET_TOKEN', token)
    setToken(token)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
