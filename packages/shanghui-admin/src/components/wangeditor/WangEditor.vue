<template>
  <WangEditor
    v-bind="$attrs"
    :imgUploadOption="imgUploadOption"
    :needLink="true"
    :imgUploadUrl="imgUploadUrl"
  ></WangEditor>
</template>
<script setup>
import WangEditor from '@business/components/src/wangeditor/WangEditor.vue'
defineProps({
  contentNumber: {
    type: Number,
    default: 0
  },
  placeholder: {
    type: String,
    default: ''
  }
})
const imgUploadUrl = process.env.VUE_APP_BASE_URL + '/api/ecservice/upload/richhtml-custom-img-upload'
const imgUploadOption = {
  uploadFileName: 'upload',
  imgUploadUrl,
  // 图片上传并返回了结果，想要自己把图片插入到编辑器中
  // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
  customInsertFunc: (insertImg, result) => {
    insertImg(result.data.filePath)
  }
}
</script>
<style lang="scss" scoped></style>
