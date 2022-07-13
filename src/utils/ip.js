// 使用nodeJS中os模块
const os = require('os')

export function getNetworkIp() {
  let needHost = ''
  try {
    let network = os.networkInterfaces()
    for (let dev in network) {
      let iface = network[dev]
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          needHost = alias.address
        }
      }
    }
  } catch (e) {
    needHost = 'localhost'
  }
  return needHost
}

// const myHost = getNetworkIp()
// const myName = os.hostname()

// process.env.VUE_APP_HOST = myHost
// process.env.VUE_APP_NAME = myName
