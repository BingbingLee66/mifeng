import { defineAsyncComponent } from 'vue'

const components = {
  Panel: () => import('./panel/index.vue'),
  PlusTable: () => import('./plusTable/PlusTable.vue')
}
const install = vue => {
  Object.keys(components).forEach(key => {
    vue.component(key, defineAsyncComponent(components[key]))
  })
}
export default { install, components }
