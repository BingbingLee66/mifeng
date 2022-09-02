<template>
  <BaseImg :img="imgObj" class="img-item" :operations="['preview']">
    <div class="img-overlay">
      <template v-if="status === 'wait'">
        等待上传
      </template>
      <div v-else-if="status === 'begin'" class="pending">
        上传中
        <el-progress class="mt-10" text-inside :stroke-width="16" :percentage="percentage" />
      </div>
      <template v-else-if="status === 'reject'">
        审核不通过
      </template>
      <div v-else-if="status === 'fail'" class="flex-y-center-center">
        上传失败
        <el-button class="mt-10" type="primary" size="small" @click="handleUpload">重新上传</el-button>
      </div>
    </div>
    <i class="close-icon el-icon-error" @click.stop="status = 'delete'" />
  </BaseImg>
</template>

<script>

import { uploadAlbumImg, saveImgToAlbum } from '@/api/album'
import { checkFile } from '@/api/content/article'

export default {
  components: {
    BaseImg: () => import('./BaseImg')
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
      type: Number,
      default: 0
    },
    defaultStatus: {
      type: String,
      default: 'wait'
    }
  },
  data() {
    return {
      imgObj: {},
      status: 'wait', // 上传状态 begin-上传中 success-上传成功 reject-审核失败 fail-上传失败 delete-已经删除
      percentage: 0, // 进度百分比
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    }
  },
  watch: {
    index() {
      this.handleUpload()
    },
    status(status) {
      // 事件 - begin | success | reject | fail | delete
      this.$emit(status, { status: this.status, percentage: this.percentage, value: this.imgObj })
    }
  },
  created() {
    this.init()
    this.handleUpload()
  },
  methods: {
    init() {
      this.formData = new FormData()
      this.formData.append('file', this.file)
      this.generateImgObj() // 初始化图片对象
      this.status = this.defaultStatus
    },
    // 根据上传图片文件 生成图片列表所需的图片对象
    generateImgObj() {
      // 初始化上传图片
      this.imgObj = { img: '', fileName: this.file.name, }
      const reader = new FileReader()
      reader.readAsDataURL(this.file)
      reader.onload = e => (this.imgObj.img = e.target.result)
    },
    // async stay(time) {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve()
    //     }, time)
    //   })
    // },
    async handleUpload() {
      if (this.status === 'reject' || this.index >= 4) return
      this.status = 'begin'
      this.percentage = 10
      // await this.stay(3000)
      await this.checkImg()
      // await this.stay(3000)
      const url = await this.uploadImgToOss()
      // await this.stay(3000)
      this.saveImgUrlToAlbum(url)
    },

    // 图片审核
    checkImg() {
      if (this.status === 'delete') return Promise.reject() // 已经删除阻断流程
      return checkFile(this.formData)
        .then(({ state }) => {
          if (state !== 1) return Promise.reject() // 审核失败
          this.percentage = 40 // 进度上涨
        })
        .catch(() => {
          this.status = 'reject' // 审核失败状态
          return Promise.reject() // 审核失败返回reject阻断后面流程
        })
    },
    // 上传图片至oss
    uploadImgToOss() {
      if (this.status === 'delete') return Promise.reject() // 已经删除阻断流程
      return uploadAlbumImg(this.formData)
        .then(({ data, state }) => {
          if (state !== 1) return Promise.reject() // 上传失败
          this.percentage = 70 // 进度上涨
          return data
        })
        .catch(() => {
          this.status = 'fail' // 上传失败状态
          return Promise.reject() // 上传失败返回reject阻断后面流程
        })
    },
    // 保存oss地址到相册
    async saveImgUrlToAlbum(url, count = 1) { // 605状态需要重新调接口 重复调用3次
      if (this.status === 'delete') return Promise.reject() // 已经删除阻断流程
      return saveImgToAlbum({ ckey: this.ckey, fileName: this.file.name, id: this.albumId, img: url })
        .then(({ state, data }) => {
          if (state === 605 && count <= 3) this.saveImgUrlToAlbum(url, count + 1)
          if (state !== 1) return Promise.reject()
          this.percentage = 100 // 进度上涨
          this.status = 'success' // 上传成功状态
          this.imgObj = data
          // 第一张上传为封面
          if (+data.useType === 1) this.$emit('coverChange', data)
        })
        .catch(() => {
          this.status = 'fail' // 上传失败状态
          return Promise.reject() // 上传失败返回reject阻断后面流程
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.img-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 200px;
  background-color: rgba(0,0,0,.4);
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
}

.pending{
  text-align: center;
  width: 180px;
}
</style>
