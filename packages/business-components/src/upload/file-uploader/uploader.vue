<template>
  <a-upload
    v-bind="$attrs"
    class="uploader"
    :file-list="fileList"
    @change="handleChange"
    :customRequest="customRequest"
    :before-upload="beforeUpload"
  >
    <slot />
  </a-upload>
</template>

<script>
import { defineComponent } from 'vue'
import { message } from 'ant-design-vue'
import uploadRequest from '../util/upload-request'
import { useHandleUpload } from '../util/use-handle-upload'

export default defineComponent({
  name: 'FileUploader',
  props: {
    /**
     * 允许上传的类型,全小写,逗号分割
     */
    extensions: {
      type: String,
      default: ''
    },
    /**
     * 允许上传的最大文件大小，单位MB
     */
    maxSize: {
      type: Number,
      default: Infinity
    },
    /**
     * 最大允许上传的个数，默认无限制
     */
    limit: {
      type: Number,
      default: Infinity
    },
    /**
     * 文件列表
     */
    value: {
      type: Array,
      default: () => []
    },
    /**
     * 自定义上传函数
     */
    customRequest: {
      type: Function,
      default: uploadRequest
    }
  },
  setup(props) {
    const { fileList, handleChange } = useHandleUpload(props)
    /**
     * 文件上传之前的处理
     * @param file 当前上传文件
     */
    const beforeUpload = file => {
      if (fileList.value.length >= props.limit) {
        message.error(`最多只能上传${props.limit}个文件`)
        return false
      }
      if (!file.size) {
        message.error('请不要上传空文件')
        return false
      }
      const extension = file.name.split('.').slice(-1)[0].toLowerCase()
      const fileAccepted = props.extensions ? props.extensions.split(',').includes(extension) : true
      if (!fileAccepted) {
        message.error('文件类型不合法')
      }
      const isFileTooLarge = file.size / 1024 / 1024 > props.maxSize
      if (isFileTooLarge) {
        message.error(`超过文件大小${props.maxSize}M限制`)
      }
      return fileAccepted && !isFileTooLarge
    }
    return {
      fileList,
      beforeUpload,
      handleChange
    }
  }
})
</script>
<style lang="scss">
.uploader .ant-upload-list-item-info {
  a {
    color: #333;
  }
}
.uploader .ant-upload-list-item:hover .ant-upload-list-item-info {
  background-color: #fffaf2;
}
</style>
