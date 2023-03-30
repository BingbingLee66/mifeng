<template>
  <div class="p-videoUploader">
    <a-upload
      :file-list="fileList"
      listType="picture-card"
      action="#"
      :accept="acceptTypes.join(',')"
      :before-upload="handleBeforeUpload"
      class="upload-list-inline"
      @preview="handlePreview"
      @change="handleChange"
      :customRequest="uploadRequest"
      v-bind="$attrs"
    >
      <slot :fileList="fileList" :limit="limit">
        <div v-if="fileList.length < limit">
          <plus-outlined />
          <div class="ant-upload-text">上传视频</div>
        </div>
      </slot>
      <template #itemRender="{ file, actions }">
        <div class="Video-box">
          <a-spin :spinning="!file.vid && !file.response">
            <img
              class="Video-box-image"
              :src="file.videoCoverURL || (file.response && file.response.videoCoverURL)"
              @click="actions.preview"
            />
          </a-spin>
          <div class="Video-box-del" @click="actions.remove" style="z-index: 100">
            <close-outlined />
          </div>
          <div v-if="file.vid || file.response" class="Video-box-eye" @click="actions.preview">
            <eye-outlined />
          </div>
          <div v-if="!file.vid && !file.response" class="Video-box-progroess">
            <a-progress
              :percent="file.originFileObj && file.originFileObj.processVal"
              status="active"
              :show-info="false"
            />
          </div>
        </div>
      </template>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" :width="1400" @cancel="handlePreviewCancel" v-if="previewVideo">
      <div style="padding: 20px 0 0 0">
        <AliyunVideoPlayer
          :cover="previewVideo.videoCoverURL || (previewVideo.response && previewVideo.response.videoCoverURL)"
          :vid="previewVideo.vid || previewVideo.response.vid"
          vheight="500px"
          ref="AliyunVideoPlayerRef"
        >
        </AliyunVideoPlayer>
      </div>
    </a-modal>
  </div>
</template>
<script>
/*  
value值为数组 每一项为antd--fileUpload对象
编辑时需初始化 [{vid,videoCoverURL}] 
取值时 value[0].vid || value[0].response.vid  */

/* 事件：
'getVideoCoverLocal' :获取视频第一帧封面图(本地base64格式，为了避免回显缓慢) 
'getVideoCoverRemote':获取视频第一帧封面图(已上传至服务器) 
'Succeed'：成功上传视频回执
'error'：上传视频回执   */

import { PlusOutlined } from '@ant-design/icons-vue'
import { message, progress as aProgress } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import { useHandleUpload } from '../util/use-handle-upload'
import AliyunVideoPlayer from '@business/components/src/aliyunVideoPlayer/index'
import { useUploadRequest } from './useOssUpload'
export default defineComponent({
  name: 'VideoUploader',
  components: {
    PlusOutlined,
    AliyunVideoPlayer,
    aProgress
  },

  emits: ['getVideoCoverLocal', 'getVideoCoverRemote', 'Succeed', 'error'],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    // 限制上传的总数
    limit: {
      type: Number,
      default: 1
    },
    // 上传限制的大小
    size: {
      type: Number,
      default: 500
    },
    // 自定义上传方法
    customRequest: {
      type: Function,
      default: null
    },
    // 文件类型
    acceptTypes: {
      type: Array,
      default() {
        return ['video/*']
      }
    },
    // 视频关联对象id 新增情况下id=0 修改情况下id=对象id,示例值(0)
    id: {
      default: '0',
      type: String
    },
    // （1：文章/动态 ，2：供需，3：操作指引）
    sourceType: {
      default: 1,
      type: Number
    }
  },

  setup(props) {
    const { fileList, handleChange } = useHandleUpload(props)
    const uploadRequest = useUploadRequest(props)

    const previewVisible = ref(false)
    const previewVideo = ref(false)
    const AliyunVideoPlayerRef = ref()
    /**
     * 文件上传前
     * @param file 上传的文件
     */
    const handleBeforeUpload = file => {
      if (file && file.size > props.size * 1024 * 1024) {
        if (props.size >= 1024) message.error(`视频不能超过${(props.size / 1024).toFixed(2)}G`)
        else message.error(`视频不能超过${props.size}M`)
        return false
      }
      return true
    }

    const handlePreview = async file => {
      previewVisible.value = true
      previewVideo.value = file
    }

    const handlePreviewCancel = () => {
      AliyunVideoPlayerRef.value.pause()
      previewVisible.value = null
    }
    return {
      previewVisible,
      previewVideo,
      fileList,
      handleChange,
      uploadRequest,
      handlePreview,
      handlePreviewCancel,
      handleBeforeUpload,
      AliyunVideoPlayerRef
    }
  }
})
</script>
<style lang="scss" scoped>
.Video-box {
  width: 104px;
  height: 104px;
  position: relative;
  border: 1px solid #d9d9d9;
  padding: 8px;
  margin-right: 10px;
  .Video-box-image {
    width: 86px !important;
    height: 86px !important;
    object-fit: contain;
    display: block;
    cursor: pointer;
  }
  .Video-box-del {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
  .Video-box-del:hover {
    color: #f4c820;
  }
  .Video-box-eye {
    position: absolute;
    left: 3%;
    top: 0;
    cursor: pointer;
  }
  .Video-box-progroess {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
