import downLoad from './downLoad'

const install = function(Vue) {
  Vue.directive('downLoad', downLoad)
}

downLoad.install = install

export default downLoad
