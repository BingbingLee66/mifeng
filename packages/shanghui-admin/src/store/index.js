import { createStore } from 'vuex'
import user from './module/user'
import tagsView from './module/tagsView'

export default createStore({
  modules: {
    user,
    tagsView
  }
})
