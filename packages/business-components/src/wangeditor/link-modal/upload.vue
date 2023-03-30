<template>
  <ImageUpload
    :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
    v-model:value="fileList"
    :limit="1"
    :size="10"
    :custom-request="uploadImage"
  ></ImageUpload>
</template>

<script setup>
import ImageUpload from '@business/components/src/upload/image-uploader/index'
import { checkFile, uploadFileRichImg } from '@business/common/src/content/api/article'
import { Message } from 'ant-design-vue'
import { ref } from 'vue'
const emit = defineEmits(['upload'])
const fileList = ref([])
const handleProgress = (c, e) => {
  if (c.onProgress) {
    if (e.total > 0) {
      e.percent = (e.loaded / e.total) * 100
    }
    c.onProgress(e)
  }
}

// 上传图片
const uploadImage = async content => {
  const formData = new window.FormData()
  formData.append('file', content.file)
  try {
    const { state } = await checkFile(formData)
    if (state !== 1) {
      throw Error()
    }
  } catch (error) {
    Message.error(`${content.file.name}照片审核失败`)
    content.onError(new Error('照片审核失败'))
    return
  }
  formData.append('upload', content.file)
  const { data } = await uploadFileRichImg(formData, e => handleProgress(content, e))
  fileList.value = [{ url: data.filePath }]
  emit('upload', data.filePath)
}
</script>

<style scoped lang="scss"></style>
