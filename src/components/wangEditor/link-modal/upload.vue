<template>
  <el-upload
    style="width: 150px; height: 150px"
    class="uploader-card"
    action="/"
    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP"
    list-type="picture-card"
    :show-file-list="false"
    :before-upload="beforeUpload"
    :http-request="upload"
  >
    <el-image
      v-if="src"
      style="width: 150px; height: 150px"
      :src="src"
    />
    <i v-if="src" class="el-icon-close close-icon" @click.stop="src = ''" />
    <i
      v-else
      style="width: 150px;
             height: 150px;
             font-size: 28px;
             color: #8c939d;
             line-height: 138px;
             text-align: center;
            "
      class="el-icon-plus"
    />
  </el-upload>
</template>

<script>
import { uploadFileRichImg } from '@/api/content/article'

export default {
  name: 'RichUpload',
  props: {
    limit: {
      type: Number,
      default: 10
    },
  },
  data() {
    return {
      src: ''
    }
  },
  methods: {
    /** 上传图片校验 */
    beforeUpload(file) {
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png'
      ) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * this.limit) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },

    /** 上传图片 */
    upload(content) {
      const formData = new FormData()
      formData.append('upload', content.file)
      uploadFileRichImg(formData).then(res => {
        this.src = res.data.filePath
        this.$emit('upload', this.src)
      })
    },
  }
}
</script>

<style scoped lang="scss">
.uploader-card /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader-card /deep/.el-upload:hover {
  border-color: #409eff;
}
.close-icon {
  z-index: 100;
  position: absolute;
  top: 0;
  right: 0;
  color: #000;
}
</style>
