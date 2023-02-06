<template>
  <PublishForm :detail="detail" @processParams="processParams">
    <!-- 上传视频阿里云组件 -->
    <AFormItem label="供需视频：" required>
      <VideoUpLoader
        class="ml10"
        v-model:value="videoFile"
        :size="30"
        :acceptTypes="['video/mp4']"
        :sourceType="2"
        :id="id"
        @getVideoCoverLocal="getVideoCoverLocal"
        @getVideoCoverRemote="getVideoCoverRemote"
      >
      </VideoUpLoader>
    </AFormItem>
    <AFormItem label="上传视频封面图">
      <AvatarUploader
        v-model:value="videoCoverURL"
        class="avatarUploader ml10"
        :acceptTypes="['image/jpeg', 'image/png', 'image/jpg', 'image/bmp']"
        :maxSize="2"
        :disabled="!videoFile || videoFile == ''"
        ref="AvatarUploaderRef"
      >
        <template v-slot="{ avatar }">
          <div class="avatarUploader-cotent">
            <img
              v-if="avatar.hasVal && videoFile && videoFile.length"
              class="avatarUploader-cotent-avatar"
              :src="avatar.url"
            />
            <div v-else class="avatarUploader-cotent-avatar avatarUploader-cotent-empty">
              <PlusOutlined />
              <span class="avatarUploader-cotent-desc"> 上传图片 </span>
            </div>
          </div>
        </template>
      </AvatarUploader>
    </AFormItem>
  </PublishForm>
</template>

<script>
import VideoUpLoader from '@/components/upload/video-uploader/index'
import AvatarUploader from '@/components/upload/avatar-uploader/index'
import PublishForm from './components/PublishForm.vue'
import { ref, watch } from 'vue'
import { Message } from 'ant-design-vue'
export default {
  components: {
    PublishForm,
    VideoUpLoader,
    AvatarUploader
  },
  props: {
    detail: {
      type: Object,
      default: null
    },
    id: {
      type: String,
      default: '0'
    }
  },
  setup(props) {
    const videoFile = ref([])
    const videoCoverURL = ref()
    const videoCoverRemoteURL = ref()
    watch(
      () => props.detail,
      newObj => {
        if (newObj) {
          videoCoverURL.value = newObj.yshContentEditVO.vcover
          videoFile.value = [{ vid: newObj.yshContentEditVO.vid, videoCoverURL: newObj.yshContentEditVO.vcover }]
        }
      },
      { immediate: true }
    )
    const processParams = async (params, callback) => {
      if (!videoFile.value.length || !(videoFile.value[0].vid || videoFile.value[0].response.vid)) {
        return Message.warning('请上传视频')
      }
      params.vcover = videoCoverURL.value
      params.vid = videoFile.value[0].vid || videoFile.value[0].response.vid
      // 如果videoCoverURL是base64格式，说明为视频第一帧，则需要使用videoCoverRemoteURL
      if (videoCoverURL.value && videoCoverURL.value.indexOf('base64') !== -1) {
        if (!videoCoverRemoteURL.value) {
          return Message.error('视频头图上传失败，请重新选择视频头图')
        }
        params.vcover = videoCoverRemoteURL.value
      }
      params.contentType = 2
      params.coverType = 1
      callback()
    }
    const getVideoCoverRemote = url => {
      videoCoverRemoteURL.value = url
    }
    const getVideoCoverLocal = url => {
      videoCoverURL.value = url
    }
    return {
      videoFile,
      videoCoverURL,
      getVideoCoverLocal,
      getVideoCoverRemote,
      processParams
    }
  }
}
</script>

<style scoped lang="scss">
.avatarUploader img {
  width: 86px !important;
  height: 86px !important;
  object-fit: contain;
  display: block;
}

.avatarUploader-cotent {
  display: flex;
  justify-content: center;
  width: 104px;
  height: 104px;
  margin: 0 auto 8px;
  text-align: center;
  vertical-align: top;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.3s;
  box-sizing: border-box;
  padding: 8px;

  &:hover {
    border-color: map-get($map: $color, $key: base);
  }

  .avatarUploader-cotent-avatar {
    width: 100%;
    height: 100%;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
  }

  .avatarUploader-cotent-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatarUploader-cotent-desc {
      font-size: 14px;
      color: inherit;
      margin-top: map-get($map: $space, $key: sm);
    }
  }
}
:deep(.ant-upload-disabled) {
  color: #00000040;
  border-color: #d9d9d9;
  text-shadow: none;
  box-shadow: none;
  .avatarUploader-cotent {
    cursor: not-allowed !important;
  }
}
</style>
