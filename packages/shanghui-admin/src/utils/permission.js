import { reactive, computed, watchEffect } from 'vue'
import { getMenuActions } from '@/api/authority'

function usePermission() {
  // 菜单权限管理器
  const permission = reactive({
    map: {}, // 菜单权限地图
    menuId: '', // 当前的菜单id
    actionId: '' // 当前的权限动作的actionId
  })

  // 当前菜单的权限列表
  const permissionList = computed(() => permission.map[permission.menuId])

  // 当前菜单的权限动作map
  const actionMap = computed(() => {
    if (permissionList.value === null) return null
    return (permissionList.value || []).reduce((map, item) => {
      const { tabName, actionName, id } = item
      map[[tabName, actionName].filter(v => v).join('-')] = id
      return map
    }, {})
  })

  // 获取菜单权限列表
  async function getPermission(menuId) {
    if (!menuId) return
    permission.menuId = menuId
    if (permissionList.value && permissionList.value.length) return
    const { data } = await getMenuActions({ menuId })
    permission.map[menuId] = data.data
  }

  /**
   * 用于监听对应action
   * @param [string] actionName action名称
   * @param [function]  action变化运行的回调 参数为actionid actionid为空 说明没有权限
   * @returns [function] stopWatcher 停止监听的方法
   */
  function watchActionEffect(actionName, fn) {
    return watchEffect(() => {
      const actionId = actionMap.value ? actionMap.value[actionName] : ''
      fn(actionId)
    })
  }

  /**
   * 用于监听是否有对应actionId来触发请求
   * @param actionName action名称
   * @param requestFn 有对应actionId才运行的请求回调 参数为actionId
   * @returns [function] stopWatcher 停止监听的方法
   */
  function watchActionRequestEffect(actionName, requestFn) {
    const stopWatcher = watchActionEffect(actionName, actionId => {
      if (actionId) {
        // stopWatcher()
        permission.actionId = actionId
        requestFn(actionId)
      }
    })
    return stopWatcher
  }

  return {
    permission,
    actionMap,
    getPermission,
    watchActionEffect,
    watchActionRequestEffect,
    resetPermission() {
      permission.map = {}
      permission.menuId = ''
      permission.actionId = ''
    }
  }
}

export const { permission, actionMap, getPermission, resetPermission, watchActionEffect, watchActionRequestEffect } =
  usePermission()
