<template>
  <AUpload
    name="avatar"
    :accept="acceptTypes.join(',')"
    action="/"
    :beforeUpload="beforeUpload"
    :customRequest="customRequest"
    :showUploadList="false"
    v-bind="$attrs"
  >
    <div class="wrap" :class="{ 'wrap-loading': loading }">
      <slot :avatar="localAvatar">
        <div class="upload">
          <img v-if="localAvatar.hasVal" class="avatar" :src="localAvatar.url" />
          <div v-else class="avatar empty">
            <PlusOutlined />
            <span class="desc"> 上传照片 </span>
          </div>
        </div>
        <div class="desc">建议尺寸：88*88px；格式：png/jpeg/jpg</div>
      </slot>
      <div v-if="loading" class="loading" @click.stop>
        <LoadingOutlined />
      </div>
    </div>
  </AUpload>
</template>

<script>
import { computed, ref, watch } from 'vue'
import defaultAvatar from '@/assets/imgs/commons/default-avatar.png'
import { message, Upload } from 'antd'
import uploadRequest from '../util/upload-request'

export default {
  inheritAttrs: false,
  components: {
    AUpload: Upload
  },
  props: {
    // 文件路径
    value: {
      type: String,
      default: ''
    },
    // 自定义上传路径
    httpRequest: {
      type: Function,
      default(options) {
        return new Promise((resolve, reject) => {
          uploadRequest({ ...options, onSuccess: resolve, onError: reject })
        })
      }
    },
    maxSize: {
      type: Number,
      default: 2
    },
    // 文件类型
    acceptTypes: {
      type: Array,
      default() {
        return ['image/jpeg', 'image/png', 'image/jpg']
      }
    }
  },
  setup(props, context) {
    const beforeUpload = file => {
      if (file.size > 1024 * 1024 * props.maxSize) {
        message.error(`上传图片大小不能超过${props.maxSize}MB!`)
        return false
      }
    }
    const loading = ref(false)
    const localAvatar = ref({
      hasVal: false,
      url: null
    })
    const avatar = computed({
      get() {
        return props.value
      },
      set(value) {
        context.emit('update:value', value)
      }
    })
    // 初始化localAvatar，适用于 当value在外部更新时(初始值)
    watch(
      () => props.value,
      (newV, oldV) => {
        if ((!oldV && !localAvatar.value.hasVal) || localAvatar.value.url === oldV) {
          localAvatar.value.url = newV
          localAvatar.value.hasVal = true
        }
      },
      { immediate: true }
    )

    const customRequest = async options => {
      // 在改变avatar.value前赋值一次 检测props.value的值变化时，localAvatar已经改变
      localAvatar.value.url = URL.createObjectURL(options.file)
      localAvatar.value.hasVal = true
      if (loading.value) return
      loading.value = true
      try {
        const { url } = await props.httpRequest(options)
        avatar.value = url
      } catch (error) {
        localAvatar.value.url = null
      }
      loading.value = false
    }

    return {
      defaultAvatar,
      localAvatar,
      loading,
      avatar,
      beforeUpload,
      customRequest
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;

  &-loading {
    opacity: 0.4;
  }

  .loading {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.upload {
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

  .avatar {
    width: 100%;
    height: 100%;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .desc {
      font-size: 14px;
      color: inherit;
      margin-top: map-get($map: $space, $key: sm);
    }
  }

  .desc {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
