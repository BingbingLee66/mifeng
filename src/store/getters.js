const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  ckey: state => state.user.ckey,
  chamberName: state => state.user.chambername,
  systemLogo: state => state.user.systemlogo,
  has: state => { // getters只有一个参数state
    // 要额外接收参数，通过返回函数来接收
    return function(actionInfo) {
      const { tabName, actionName } = actionInfo
      // console.log(state)
      // console.log(actionInfo)
      const matchPermission = state.permission.permissions
      let result = false
      if (matchPermission === null) {
        result = true
        return result
      }
      for (let i = 0; i < matchPermission.length; i++) {
        if (matchPermission[i] === null) {
          continue
        }
        if (tabName === matchPermission[i].tabName && actionName === matchPermission[i].actionName) {
          result = true
          break
        }
      }
      // console.log(result)
      return result
    }
  },
  getId: state => { // getters只有一个参数state
    // 要额外接收参数，通过返回函数来接收
    return function(actionInfo) {
      const { tabName, actionName } = actionInfo
      // console.log(state)
      // console.log(actionInfo)
      const matchPermission = state.permission.permissions
      let result = ''
      if (matchPermission === null) {
        return result
      }
      for (let i = 0; i < matchPermission.length; i++) {
        if (matchPermission[i] === null) {
          continue
        }
        if (tabName === matchPermission[i].tabName && actionName === matchPermission[i].actionName) {
          result = matchPermission[i].id
          break
        }
      }
      // console.log(result)
      return result
    }
  }
}
export default getters
