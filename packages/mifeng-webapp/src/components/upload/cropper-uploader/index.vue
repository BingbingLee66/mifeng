<!-- 
    vue-cropper官方地址：https://www.npmjs.com/package/vue-cropper
 -->

<template>
  <div class="drawing-container">
    <a-upload
      accept="image/*"
      v-model:file-list="fileList"
      :list-type="listType"
      class="upload-list-inline"
      :customRequest="function () {}"
      @change="handleChange"
      @preview="handlePreview"
      v-bind="$attrs"
    >
      <slot :options="{ fileList, limit }">
        <div v-if="fileList.length < limit">
          <plus-outlined />
          <div class="ant-upload-text">上传照片</div>
        </div>
      </slot>
    </a-upload>
    <a-modal
      v-if="editVisible"
      :visible="editVisible"
      :width="1200"
      style="top: 20px"
      title="图片编辑"
      :maskClosable="false"
      @cancel="handleEditCancel"
      @ok="handleOk"
    >
      <div style="width: 100%; height: 650px">
        <!-- :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight" -->
        <VueCropper
          ref="cropperRef"
          :img="options.img"
          :info="true"
          :infoTrue="options.infoTrue"
          :auto-crop="options.autoCrop"
          :fixed-box="options.fixedBox"
          :fixedNumber="options.fixedNumber"
          :fixed="options.fixed"
          :centerBox="options.centerBox"
          :full="options.full"
          :original="options.original"
          :canScale="options.canScale"
          :canMove="options.canMove"
          @realTime="realTime"
        ></VueCropper>
      </div>
      <!-- <h3 class="text-center mt20">滚动鼠标放大缩小图片</h3> -->
    </a-modal>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <div style="padding: 20px 0 0 0">
        <img alt="example" style="width: 100%; object-fit: contain" :src="previewImage" />
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import uploadRequest from '../util/upload-request'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { uploadCoverImg } from '@/api/content/article'
const props = defineProps({
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
  },
  autoCropWidth: {
    type: Number,
    default: 176
  },
  autoCropHeight: {
    type: Number,
    default: 176
  },
  isArticleCoverImg: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:url'])

const options = reactive({
  img: '', // 需要剪裁的图片
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: props.autoCropWidth, // 默认生成截图框的宽度
  autoCropHeight: props.autoCropHeight, // 默认生成截图框的长度
  fixedBox: false, // 是否固定截图框的大小 不允许改变
  info: true, // 裁剪框的大小信息
  outputSize: 0.5, // 裁剪生成图片的质量 [1至0.1]
  outputType: 'jpeg', // 裁剪生成图片的格式
  canScale: false, // 图片是否允许滚轮缩放
  fixed: true, // 是否开启截图框宽高固定比例
  fixedNumber: [props.autoCropWidth, props.autoCropHeight], // 截图框的宽高比例 需要配合centerBox一起使用才能生效
  full: false, // 是否输出原图比例的截图
  canMoveBox: false, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  canMove: false
})

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

// 获取VueCropper实例
const cropperRef = ref()
// 展示图片编辑器
const editVisible = ref(false)
// 上传的图片数据
const fileList = ref([])
const fileItem = ref(null)
// 裁剪之后的数据
const editImageData = ref({})
// 预览图片
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')
const uploadHeight = '105px'
const uploadWidth = (105 * props.autoCropWidth) / props.autoCropHeight + 'px'
/**
 * 图片回显
 */
watch(
  () => props.url,
  newVal => {
    if (newVal) {
      const ImgList = [{ url: newVal, status: 'done' }]
      fileList.value = ImgList
    }
  },
  { immediate: true, deep: true }
)

/**
 * 上传图片
 * @param {*} info
 */
const handleChange = info => {
  const { file: _file, fileList: _fileList } = info
  if (_fileList?.length) {
    if (!props.pattern.test(_file.name) || !_file.size) {
      fileList.value = []
      message.error('请上传正确的图片文件')
      return
    }

    getBase64(info.file.originFileObj, base64Url => {
      // 获取图片宽高信息
      const newImage = new Image()
      newImage.src = base64Url
      newImage.onload = () => {
        if (newImage.width < options.autoCropWidth || newImage.height < options.autoCropHeight) {
          fileList.value = []
          message.error('图片尺寸过小，请重新上传')
        } else {
          fileItem.value = info.file
          options.img = base64Url
          editVisible.value = true
        }
      }
    })
  }
}

/**
 * 实时预览事件
 * @param {*} data
 */
const realTime = data => {
  editImageData.value = data
}

/**
 * 关闭图片编辑器
 */
const handleEditCancel = () => {
  fileList.value = []
  editVisible.value = false
}

/**
 * 编辑后确认上传
 */
const confirmUpload = () => {
  cropperRef.value.getCropBlob(data => {
    data.lastModifiedDate = new Date()
    const file = new File([data], fileItem.value?.name, {
      type: data.type,
      lastModified: Date.now()
    })
    if (file && file.size > props.size * 1024 * 1024) {
      return message.error(`图片不能超过${props.size}M`)
    }
    if (props.isArticleCoverImg) {
      const formData = new FormData()
      formData.append('file', file)
      uploadCoverImg(formData).then(res => {
        emit('update:url', res.data.filePath)
        fileList.value = [
          {
            url: res.data.filePath,
            status: 'done'
          }
        ]
      })
    } else {
      uploadRequest({
        file,
        onSuccess: res => {
          emit('update:url', res.url)
          fileList.value = [
            {
              url: res.url,
              status: 'done'
            }
          ]
        }
      })
    }
  })
  editVisible.value = false
}
const handleOk = () => {
  if (editImageData.value.w < options.autoCropWidth || editImageData.value.h < options.autoCropHeight) {
    Modal.confirm({
      title: '提示',
      content: `分辨率太低，是否重新上传较清晰图片`,
      okText: '上传',
      cancelText: '取消',
      onOk: () => {
        confirmUpload()
      }
    })
  } else {
    confirmUpload()
  }
}

/**
 * 图片预览
 * @param {*} file
 */
const handlePreview = file => {
  if (!file.url && !file.preview) {
    file.preview = getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}

/**
 * 关闭图片预览
 */
const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}
</script>

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

  :deep(.ant-upload) {
    width: v-bind(uploadWidth);
    height: v-bind(uploadHeight);
  }
  :deep(.ant-upload-list-picture-card-container) {
    width: v-bind(uploadWidth);
    height: v-bind(uploadHeight);
  }
}
</style>
