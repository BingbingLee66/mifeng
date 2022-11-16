import lazyLoad from './lazyLoad'

const install = function (Vue) {
  Vue.directive('lazy-load', lazyLoad)
}

lazyLoad.install = install

export default lazyLoad
