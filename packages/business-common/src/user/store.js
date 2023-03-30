import { login, logout, getUserInfo, register } from './api'
import { resetPermission } from '../permission/helpers'
import { getToken, setToken, removeToken } from '../utils/token'
import router from '../router/index'
import { clearMenus } from '../utils/menusHelpers'

const state = {
  token: getToken(),
  id: '',
  name: '',
  mobilenumber: '',
  profile: undefined,
  roles: [],
  ckey: '',
  chambername: '',
  systemlogo: '',
  createtime: '',
  expiretime: '',
  ontrial: false,
  trialtime: '',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    token ? setToken(token) : removeToken()
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_MOBILE_NUMBER: (state, mobilenumber) => {
    state.mobilenumber = mobilenumber
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
  },
  SET_CREATETIME: (state, createtime) => {
    state.createtime = createtime
  },
  SET_EXPIRETIME: (state, expiretime) => {
    state.expiretime = expiretime
  },
  SET_ONTRIAL: (state, ontrial) => {
    state.ontrial = ontrial
  },
  SET_TRIALTime: (state, trialtime) => {
    state.trialtime = trialtime
  },
}

const actions = {
  // user register
  register({ commit }, data) {
    return new Promise((resolve, reject) => {
      register(data)
        .then((res) => {
          if (res.state) {
            const { data } = res
            commit('SET_TOKEN', data)
            setToken(data)
            resolve()
          } else {
            reject(res)
          }
        })
        .catch((error) => {
          console.log('error1', error)
          reject(error)
        })
    })
  },

  // get user info
  async getInfo({ commit }) {
    const { data, state } = await getUserInfo()
    if (!data || state !== 1) {
      throw 'Verification failed, please Login again.' // eslint-disable-line
    }
    const { profile, createTime, expireTime, onTrial, trialTime } = data
    // console.log(profile)
    commit('SET_ID', profile.id)
    commit('SET_NAME', profile.remark)
    commit('SET_MOBILE_NUMBER', profile.userName)
    commit('SET_PROFILE', profile)
    commit('SET_ROLES', [profile.roleName])
    commit('SET_CKEY', profile.ckey)
    commit('SET_CHAMBERNAME', profile.chamberName)
    commit('SET_SYSTEMLOGO', profile.systemLogo)
    commit('SET_CREATETIME', createTime)
    commit('SET_EXPIRETIME', expireTime)
    commit('SET_ONTRIAL', onTrial)
    commit('SET_TRIALTime', trialTime)
    return data
  },

  // user logout
  async logout({ commit, state: { token } }, payload) {
    const { state, msg } = await logout(token)
    if (state !== 1) throw msg
    commit('SET_TOKEN', '')
    commit('SET_ID', '')
    commit('SET_NAME', '')
    commit('SET_MOBILE_NUMBER', '')
    commit('SET_PROFILE', {})
    commit('SET_ROLES', [])
    commit('SET_CKEY', '')
    commit('SET_CHAMBERNAME', '')
    commit('SET_SYSTEMLOGO', '')
    commit('SET_PERMISSIONS', [])
    commit('SET_CREATETIME', '')
    commit('SET_EXPIRETIME', '')
    commit('SET_ONTRIAL', false)
    commit('SET_TRIALTime', '')
    clearMenus()
    resetPermission()
    if (payload) return payload()
    router.replace({
      path: '/login',
      query: { redirect: router.currentRoute.path },
    })
  },

  // remove token
  async resetToken({ commit }) {
    commit('SET_TOKEN', '')
  },
  async updateToken({ commit }, { token }) {
    commit('SET_TOKEN', token)
  },
}

console.log(state)
export default {
  state,
  mutations,
  actions,
}
