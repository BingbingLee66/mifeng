// 预防按钮连点
export default {
  install (Vue) {
    Vue.directive('dbClick', {
      inserted(el, binding) {
        el.addEventListener('click', e => {
          if (!el.disabled) {
            el.disabled = true
            el.style.cursor = 'not-allowed'
            setTimeout(() => {
              el.style.cursor = 'pointer'
              el.disabled = false
            }, 3000)
          }
        })
      }
    })
  }
}
