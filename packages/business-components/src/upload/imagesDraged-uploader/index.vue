<template>
  <div class="c-imagesDragedUploader">
    <!-- draggable使用文档：  https://www.itxst.com/vue-draggable-next/tutorial.html -->
    <draggable
      class="imagesDraged"
      :list="fileList"
      item-key="element"
      force-fallback="true"
      ghost-class="ghostClass"
      chosen-class="imagesDraged-chosen"
      animation="300"
      :fallback-tolerance="8"
      @end="onDragEnd"
      v-bind="$attrs"
    >
      <template #item="{ element, index }">
        <div class="imagesDraged-box" :key="element.url">
          <a-spin :spinning="!element.url">
            <img class="imagesDraged-box-image" :src="element.thumbUrl || element.url" />
          </a-spin>
          <div class="imagesDraged-box-del" v-if="!hideDelete" @click="handleDelImage(index)">
            <close-outlined />
          </div>
          <div v-if="element.url && !hidePreview" class="imagesDraged-box-preview" @click="handlePreviewImage(element)">
            <eye-outlined />
            预览
          </div>
          <div v-if="!element.url" class="imagesDraged-box-progroess">
            <a-progress
              :percent="element.originFileObj && element.originFileObj.processVal"
              status="active"
              :show-info="false"
            />
          </div>
        </div>
      </template>
    </draggable>

    <a-upload
      accept="image/*"
      :file-list="fileList"
      list-type="picture-card"
      :before-upload="handleBeforeUpload"
      class="upload-list-inline"
      @change="handleChange"
      :customRequest="customRequest"
      v-bind="$attrs"
    >
      <slot :fileList="fileList" :limit="limit">
        <div v-if="fileList.length < limit">
          <plus-outlined />
          <div class="ant-upload-text">上传图片</div>
          <div v-if="!hideLimit" class="ant-upload-text">({{ fileList.length }}/{{ limit }})</div>
        </div>
      </slot>
    </a-upload>
  </div>
  <a-modal v-model:visible="previewData.visible" width="80%" :footer="null">
    <img :src="previewData.url" style="max-width: 90%; margin: 0 auto; display: block" />
  </a-modal>
</template>
<script>
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, progress as aProgress } from 'ant-design-vue'
import { defineComponent, reactive, ref } from 'vue'
import uploadRequest from '../util/upload-request'
import { useHandleUpload } from '../util/use-handle-upload'
import draggable from 'vuedraggable'
export default defineComponent({
  name: 'ImageUpload',

  components: {
    PlusOutlined,
    draggable,
    aProgress
  },
  props: {
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
    // 是否可删除
    hideDelete: {
      type: Boolean,
      default: false
    },
    // 是否预览
    hidePreview: {
      type: Boolean,
      default: false
    },

    // 显示数量
    hideLimit: {
      type: Boolean,
      default: false
    },

    // 自定义上传方法
    customRequest: {
      type: Function,
      default: uploadRequest
    },
    pattern: {
      type: RegExp,
      // eslint-disable-next-line prefer-regex-literals
      default: new RegExp(/\.(?:png|jpg|jpeg|gif|bmp)$/i)
    }
  },

  setup(props, ctx) {
    const { fileList, handleChange } = useHandleUpload(props)
    // 回显进度条
    const progressVal = ref(0)
    const onDragEnd = () => {
      ctx.emit('update:value', fileList.value)
      ctx.emit('uploaded', fileList.value)
    }
    const previewData = reactive({
      visible: false,
      url: null
    })

    /**
     * 文件上传前
     * @param file 上传的文件
     */
    const handleBeforeUpload = file => {
      // 判断数量

      if (fileList.value.length === props.limit) {
        message.error(`${file.name}上传失败。最多上传${props.size}张`)
        return false
      }
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

    const handleDelImage = index => {
      fileList.value.splice(index, 1)
      ctx.emit('update:value', fileList.value)
      ctx.emit('uploaded', fileList.value)
    }
    const handlePreviewImage = element => {
      previewData.url = element.url
      previewData.visible = true
    }

    return {
      progressVal,
      fileList,
      handleChange,
      handleBeforeUpload,
      handleDelImage,
      onDragEnd,
      previewData,
      handlePreviewImage
    }
  }
})
</script>

<style lang="scss" scoped>
.c-imagesDragedUploader {
  display: flex;
  flex-wrap: wrap;
}
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
:deep(.ant-upload-list-picture-card-container) {
  display: none;
}
.imagesDraged {
  display: flex;
  flex-wrap: wrap;

  .imagesDraged-box-del {
    visibility: hidden;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    font-size: 18px;
    opacity: 1;
    color: #e60c0c !important;
  }
  .imagesDraged-box-preview {
    visibility: hidden;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(148, 148, 148, 0.5);
    color: #ffffff !important;
    cursor: pointer;
    text-align: center;
  }
  .imagesDraged-box:hover {
    background-color: rgba(0, 0, 0, 0.8);
    div {
      opacity: 0.2;
    }
    .imagesDraged-box-del,
    .imagesDraged-box-preview {
      visibility: visible !important;
      opacity: 1;
    }

    .imagesDraged-box-del:hover {
      color: #e60c0c !important;
    }
  }
  .imagesDraged-chosen {
    background-color: rgba(0, 0, 0, 0.8);
    div {
      opacity: 0.2;
    }
    z-index: 999;
  }
  .ghostClass {
    background-color: initial !important;
    opacity: 0.8 !important;
  }

  .imagesDraged-box {
    width: 104px;
    height: 104px;
    position: relative;
    padding: 8px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: move;
    .imagesDraged-box-image {
      width: 86px !important;
      height: 86px !important;
      object-fit: contain;
      display: block;
    }
    .imagesDraged-box-progroess {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
