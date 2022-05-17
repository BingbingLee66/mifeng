<template>
  <PublishForm :detail="detail">
    <el-form-item v-loading="videoLoading" label="供需视频" required>
      <el-upload
        v-if="!vid"
        action="#"
        list-type="picture-card"
        :before-upload="beforeUploadVideo"
        :http-request="uploadVideoFunc"
        :show-file-list="false"
      >
        <div class="upload-description">
          <i class="el-icon-plus" />
          <span>上传视频</span>
          <span>（0 / 1）</span>
        </div>
      </el-upload>

      <div v-else class="goods-pre">
        <videoComponent v-if="vid" ref="videoRef" :vid="vid" height="148px" />
        <i class="el-icon-error" style="font-size:20px;color:red;" @click="vid=''" />
      </div>
    </el-form-item>
    <el-form-item v-loading="imgLoading" label="视频封面">
      <el-upload
        action="#"
        class="image-upload"
        list-type="picture-card"
        :http-request="upload"
        :show-file-list="false"
        :before-upload="beforeUpload"
      >
        <div
          v-if="vcover"
          class="image-item"
          :style="{backgroundImage: `url(${vcover})`}"
        >
          <i class="el-icon-circle-close" @click.stop="vcover=''" />
          <div class="image-preview" @click.stop="$refs.kdDialog.show()">预览</div>
        </div>
        <div v-else class="upload-description">
          <i class="el-icon-plus" />
          <span>上传图片</span>
          <span>（0 / 1）</span>
        </div>
      </el-upload>
    </el-form-item>
    <kdDialog ref="kdDialog" :show-footer="false" dialog-title="" dialog-width="60%">
      <div slot="content">
        <img :src="vcover" style="max-width:90%">
      </div>
    </kdDialog>
  </PublishForm>
</template>

<script>
import { checkFile, uploadFile, uploadVideo, queryVideo } from '@/api/content/article'
import videoComponent from '@/components/video/index'

export default {
  components: {
    PublishForm: () => import(/* webpackChunkName: "PublishForm" */'./components/PublishForm'),
    videoComponent
  },
  props: {
    detail: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      vid: '',
      vcover: '',
      videoLoading: false,
      imgLoading: false
    }
  },
  watch: {
    detail: {
      handler(newObj) {
        if (newObj) {
          this.vcover = newObj.yshContentEditVO.vcover
          this.vid = newObj.yshContentEditVO.vid
        }
      },
      immediate: true
    },
    vid(newVid) {
      clearInterval(this.timer)
      if (newVid) this.timer = setInterval(this.queryVideoFunc, 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {

    // 上传前校验
    beforeUpload(file, index) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    // 上传逻辑
    async upload(content) {
      this.imgLoading = true

      let formData = new FormData()
      formData.append('file', content.file)

      try {
        const { state, msg } = await checkFile(formData)
        if (state !== 1) {
          this.$message.error(msg)
          this.imgLoading = false
          return
        }
        const { data } = await uploadFile(formData, 'demand')
        this.vcover = data
      } catch (error) { /*  */ }
      this.imgLoading = false
    },

    beforeUploadVideo(file) {
      if (file.type.indexOf('video/') !== -1) { // 视频
        if (file.type !== 'video/mp4') {
          this.$message.error('上传视频只能是 MP4 格式!')
          return false
        }
        if (file.size > 1024 * 1024 * 30) {
          this.$message.error('上传视频大小不能超过 30MB!')
          return false
        }
      } else {
        this.$message.error('不支持的文件格式!')
        return false
      }
    },
    // 上传视频
    async uploadVideoFunc(content) {
      this.videoLoading = true
      let formData = new FormData()
      formData.append('file', content.file)
      try {
        const res = await uploadVideo(formData, 0)
        if (res.code === 200) {
          this.vid = res.data.videoId
          return
        }
      } catch (error) { /*  */ }
      this.videoLoading = false
      this.$message({ message: '视频上传失败', type: 'error' })
    },
    // 查视频动态
    queryVideoFunc() {
      queryVideo(this.vid).then(res => {
        if (res.state === 1) {
          clearInterval(this.timer)
          this.$nextTick(() => {
            this.$refs.videoRef.show(this.vid)
            this.videoLoading = false
          })
        }
      })
    },
    processParams(params) {
      return new Promise((resolve, reject) => {
        if (!this.vid) {
          this.$message({ message: '请上传视频', type: 'warning' })
          return reject('请上传视频')
        }
        params.contentType = 2
        params.coverType = 1
        params.vcover = this.vcover || undefined
        params.vid = this.vid
        resolve(params)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.upload-description {
  line-height: 16px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.image-item {
  width: 100%;
  height: 100%;
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 220px;
  cursor: pointer;

  .el-icon-circle-close {
    display: none;
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 20px;
    color: #fd5d5d;
    z-index: 10;
  }

  .image-preview {
    display: none;
    position: absolute;
    height: 30px;
    line-height: 30px;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    background-color: rgba($color: #000000, $alpha: 0.5);
    color: #fff;
    z-index: 10;
  }

  &:hover {
    .el-icon-circle-close,.image-preview {
      display: block;
    }
  }
}

.goods-pre {
  // border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  width: 148px;
  height: 148px;
  // overflow: hidden;
  /*float: left;*/
  // margin-right: 10px;
}
.goods-avatar {
  width: 148px;
  height: 148px;
}
.goods-pre:hover .goods-pre-btn {
  display: block;
}

.goods-pre:hover .el-icon-error {
  display: block;
}

.goods-pre .el-icon-error {
  right: 3px;
  top: 3px;
  cursor: pointer;
  position: absolute;
  z-index: 12;
  display: none;
}

.goods-pre-btn {
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  color: #fff;
  cursor: pointer;
  position: absolute;
  text-align: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  display: none;
}
</style>
