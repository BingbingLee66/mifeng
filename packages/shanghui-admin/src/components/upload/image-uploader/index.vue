<template>
  <div>
    <a-upload
      accept="image/*"
      :file-list="fileList"
      :listType="listType"
      :before-upload="handleBeforeUpload"
      class="upload-list-inline"
      @preview="handlePreview"
      @change="handleChange"
      :customRequest="customRequest"
      v-bind="$attrs"
    >
      <slot :options="{ fileList, limit }">
        <div v-if="fileList.length < limit">
          <plus-outlined />
          <div class="ant-upload-text">上传照片</div>
        </div>
      </slot>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" :width="600" @cancel="handlePreviewCancel">
      <div style="padding: 20px 0 0 0">
        <img alt="example" style="width: 100%; object-fit: contain" :src="previewImage" />
      </div>
    </a-modal>
  </div>
</template>
<script>
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import uploadRequest from '../util/upload-request'
import { useHandleUpload } from '../util/use-handle-upload'

export default defineComponent({
  name: 'ImageUpload',

  components: {
    PlusOutlined
  },
  props: {
    // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
    listType: {
      type: String,
      default: 'picture-card'
    },
    // 图片列表
    value: {
      type: Array,
      default: () => []
    },
    // 限制上传的总数
    limit: {
      type: Number,
      default: 6
    },
    // 上传限制的大小
    size: {
      type: Number,
      default: 2
    },
    // 自定义上传方法
    customRequest: {
      type: Function,
      default: uploadRequest
    },
    // 图片url回调
    url: {
      type: String,
      default: ''
    },
    pattern: {
      type: RegExp,
      // eslint-disable-next-line prefer-regex-literals
      default: new RegExp(/\.(?:png|jpg|jpeg|gif|bmp)$/i)
    }
  },

  setup(props) {
    const { fileList, handleChange } = useHandleUpload(props)
    const previewVisible = ref(false)
    const previewImage = ref('')

    const getBase64 = file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }

    /**
     * 文件上传前
     * @param file 上传的文件
     */
    const handleBeforeUpload = file => {
      // 导入文件类型不合法
      if (!props.pattern.test(file.name) || !file.size) {
        message.error('请上传正确的图片文件')
        return false
      }

      if (file && file.size > props.size * 1024 * 1024) {
        message.error(`图片不能超过${props.size}M`)
        return false
      }
      return true
    }

    const handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      previewImage.value = file.url || file.preview
      previewVisible.value = true
    }

    const handlePreviewCancel = () => {
      previewVisible.value = false
    }

    return {
      previewVisible,
      previewImage,
      fileList,
      handleChange,
      handlePreview,
      handlePreviewCancel,
      handleBeforeUpload
    }
  }
})
</script>
<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
<style lang="scss" scoped>
.upload-list-inline {
  >>> .ant-upload-list-item {
    float: left;
    width: 100%;
    height: 100%;
    margin-right: 8px;
  }
  >>> .ant-upload-animate-enter {
    animation-name: uploadAnimateInlineIn;
  }
  >>> .ant-upload-animate-leave {
    animation-name: uploadAnimateInlineOut;
  }
}
</style>
