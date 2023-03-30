import { permission, actionMap, watchActionEffect } from '@business/common/src/permission/helpers'

// action指令管理器
class ActionManager {
  constructor(el) {
    this.el = el
    el.__actionManager = this
  }

  // 管理器注册
  register(binding) {
    // 注册捕获点击事件 每次点击赋值
    this.addAction = () => (permission.actionId = actionMap.value ? actionMap.value[binding.value] : '')

    this.el.addEventListener('click', this.addAction, true)

    // 监听是否存在actionId 不存在则不显示dom
    this.stopWatcher = watchActionEffect(binding.value, actionId => {
      if (actionId) {
        this.el.style.display = this.el.__originalDisplay || ''
      } else {
        this.el.style.display = 'none'
      }
    })
  }

  // 管理器销毁
  destroy() {
    // 销毁点击事件
    this.el.removeEventListener('click', this.addAction, true)
    // 停止监听
    this.stopWatcher()
    this.stopWatcher = null
    // 解放变量
    this.el.__actionManager = null
    this.el = null
  }
}

// 权限动作指令 用于请求时请求头添加actionid
export const actionDirective = {
  install(app) {
    app.directive('action', this)
  },
  created(el, binding) {
    el.__originalDisplay = el.style.display
    new ActionManager(el).register(binding)
  },
  beforeUpdate(el) {
    el.__actionManager?.destroy()
  },
  updated(el, binding) {
    new ActionManager(el).register(binding)
  },
  beforeUnmount(el) {
    el.__actionManager.destroy()
  }
}
