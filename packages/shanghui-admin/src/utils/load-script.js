const reservation = {}

/**
 * 异步加载脚本
 * @param url 脚本地址
 */
export default function loadScript(url) {
  if (!reservation[url]) {
    reservation[url] = {
      lock: false,
      resolves: []
    }
  }

  if (reservation[url].lock) {
    return new Promise(resolve => {
      reservation[url].resolves.push(resolve)
    })
  }

  reservation[url].lock = true

  return new Promise(resolve => {
    const script = document.createElement('script')
    script.type = 'text/javascript'

    if (script.readyState) {
      // IE
      script.onreadystatechange = () => {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null
          resolve()
          document.head.removeChild(script)
          while (reservation[url].resolves.length) {
            const callback = reservation[url].resolves.shift()
            callback && callback()
          }
        }
      }
    } else {
      // 其他浏览器
      script.onload = () => {
        resolve()
        document.head.removeChild(script)
        while (reservation[url].resolves.length) {
          const callback = reservation[url].resolves.shift()
          callback && callback()
        }
      }
    }
    script.src = url
    document.head.appendChild(script)
  })
}
