<template>
  <PublishForm :detail="detail" @processParams="processParams">
    <AFormItem label="供需图片(选填)">
      <ImageDragedUploader
        v-model:value="imgList"
        :size="2"
        :limit="9"
        :pattern="new RegExp(/\.(?:png|jpg|jpeg|gif)$/i)"
      ></ImageDragedUploader>
    </AFormItem>
  </PublishForm>
</template>

<script>
import PublishForm from './components/PublishForm.vue'
import ImageDragedUploader from '@/components/upload/imagesDraged-uploader'
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'publishImg',
  components: {
    PublishForm,
    ImageDragedUploader
  },
  props: {
    detail: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const imgList = ref([])
    watch(
      () => props.detail,
      newV => {
        if (newV) {
          imgList.value = newV.yshContentEditVO.imgs.map(item => ({ url: item }))
        }
      },
      { immediate: true }
    )
    const processParams = async (params, callback) => {
      params.imgs = imgList.value.map(item => item.url)
      params.contentType = 1
      callback()
    }
    return { imgList, processParams }
  }
})
</script>
