import { inject, provide, ref, watchEffect } from 'vue'
/**
 * 控制打开弹窗
 * @param modelName 相对应的弹窗组件名
 * @returns openAction 打开弹窗方法
 */
export function openModal(modelName) {
  const name = ref(false)
  provide(modelName, name)
  function openAction() {
    name.value = true
  }
  return { openAction }
}

/**
 * 控制关闭弹窗
 * @param modelName 相对应的弹窗组件名
 * @returns
 */
export function closeModal(modelName) {
  const visible = ref(false)
  const show = inject(modelName, ref(false))
  watchEffect(() => {
    visible.value = show.value
  })
  function cancel() {
    visible.value = false
    show.value = false
  }
  return { visible, cancel }
}
