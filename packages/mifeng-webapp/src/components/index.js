import { defineAsyncComponent } from 'vue'

const components = {
  TableFilter: () => import('./TableFilter/index.vue'),
  TableFilterItem: () => import('./TableFilter/item.vue'),
  Panel: () => import('./panel/index.vue'),
  FileUploader: () => import('./upload/file-uploader/uploader'),
  ImageUploader: () => import('./upload/image-uploader/index'),
  PlusTable: () => import('@business/components/src/plusTable/PlusTable.vue')
}
const install = vue => {
  Object.keys(components).forEach(key => {
    vue.component(key, defineAsyncComponent(components[key]))
  })
}
export default { install, components }
