<template>
  <BaseImg :img="imgObj" class="img-item" :operations="['preview']">
    <div class="img-overlay">
      <template v-if="status === 'wait'"> 等待上传 </template>
      <div v-else-if="status === 'begin'" class="pending">
        上传中
        <a-progress class="mt-10" :strokeWidth="16" :percent="percentage" status="active" />
      </div>
      <template v-else-if="status === 'reject'"> 审核不通过 </template>
      <div v-else-if="status === 'fail'" class="flex-y-center-center">
        上传失败
        <a-button class="mt-10" type="primary" size="small" @click="reUpload">重新上传</a-button>
      </div>
    </div>
    <close-circle-filled class="close-icon" @click.stop="status = 'delete'" />
  </BaseImg>
</template>

<script>
import { uploadAlbumImg, saveImgToAlbum } from '@/api/album'
import { checkFile } from '@/api/content/article'
import { defineComponent, ref, inject, watch } from 'vue'
import BaseImg from './BaseImg'
import { Progress } from 'ant-design-vue'
export default defineComponent({
  components: {
    AProgress: Progress,
    BaseImg
  },
  props: {
    file: {
      type: File,
      required: true
    },
    albumId: {
      type: [String, Number],
      default: undefined
    },
    index: {
      // 上传顺序
      type: Number,
      default: 0
    },
    defaultStatus: {
      type: String,
      default: 'wait'
    }
  },
  setup(props, { emit }) {
    const imgObj = ref({})
    const status = ref('wait') // 上传状态 begin-上传中 success-上传成功 reject-审核失败 fail-上传失败 delete-已经删除
    const percentage = ref(0) // 进度百分比
    const ckey = inject('ckey')
    const formData = ref(null)
    const init = () => {
      formData.value = new FormData()
      formData.value.append('file', props.file)
      generateImgObj() // 初始化图片对象
      status.value = props.defaultStatus
    }
    // 根据上传图片文件 生成图片列表所需的图片对象
    const generateImgObj = () => {
      // 初始化上传图片
      imgObj.value = { img: '', fileName: props.file.name }
      const reader = new FileReader()
      reader.readAsDataURL(props.file)
      reader.onload = e => (imgObj.value.img = e.target.result)
    }
    // async stay(time) {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve()
    //     }, time)
    //   })
    // },
    const handleUpload = async () => {
      if (status.value !== 'wait') return
      status.value = 'begin'
      percentage.value = 10
      // await this.stay(3000)
      await checkImg()
      // await this.stay(3000)
      const url = await uploadImgToOss()
      // await this.stay(3000)
      saveImgUrlToAlbum(url)
    }

    // 图片审核
    const checkImg = async () => {
      if (status.value === 'delete') throw new Error() // 已经删除阻断流程
      try {
        const { state } = await checkFile(formData.value)
        if (state !== 1) throw new Error() // 审核失败
        percentage.value = 40 // 进度上涨
      } catch (error) {
        status.value = 'reject' // 审核失败状态
        throw error // 审核失败返回reject阻断后面流程
      }
    }

    // 上传图片至oss
    const uploadImgToOss = async () => {
      if (status.value === 'delete') throw new Error() // 已经删除阻断流程
      try {
        const { data, state } = await uploadAlbumImg(formData.value)
        if (state !== 1) throw new Error()
        percentage.value = 70 // 进度上涨
        return data
      } catch (error) {
        status.value = 'fail' // 上传失败状态
        throw error // 上传失败返回reject阻断后面流程
      }
    }

    // 保存oss地址到相册
    const saveImgUrlToAlbum = async (url, count = 1) => {
      // 605状态需要重新调接口 重复调用3次
      if (status.value === 'delete') throw new Error() // 已经删除阻断流程
      try {
        const { state, data } = await saveImgToAlbum({
          ckey: ckey.value,
          fileName: props.file.name,
          id: props.albumId,
          img: url
        })
        if (state === 605 && count <= 3) saveImgUrlToAlbum(url, count + 1)
        if (state !== 1) throw new Error()
        percentage.value = 100 // 进度上涨
        status.value = 'success' // 上传成功状态
        imgObj.value = data
        // 第一张上传为封面
        if (+data.useType === 1) emit('coverChange', data)
      } catch (error) {
        status.value = 'fail' // 上传失败状态
        throw error // 上传失败返回reject阻断后面流程
      }
    }

    // 重新上传
    const reUpload = () => {
      status.value = 'wait'
      handleUpload()
    }
    init()
    watch(
      () => props.index,
      index => {
        if (index <= 4) handleUpload()
      },
      {
        immediate: true
      }
    )
    watch(status, status => {
      emit(status, { status, percentage: percentage.value, value: imgObj.value })
    })
    return {
      imgObj,
      status,
      percentage,
      ckey,
      saveImgUrlToAlbum,
      uploadImgToOss,
      reUpload
    }
  }
})
</script>

<style lang="scss" scoped>
.img-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9;
  color: #fff;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
}
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 19;
  font-size: 24px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pending {
  text-align: center;
  width: 180px;
}
</style>
