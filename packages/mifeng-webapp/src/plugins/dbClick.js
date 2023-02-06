// 预防按钮连点
export default {
  install(app) {
    app.directive('dbClick', {
      inserted(el) {
        el.addEventListener('click', () => {
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
