import downLoad from './downLoad'

const install = function(Vue) {
  Vue.directive('downLoadUrl', downLoad)
}

downLoad.install = install

export default downLoad
