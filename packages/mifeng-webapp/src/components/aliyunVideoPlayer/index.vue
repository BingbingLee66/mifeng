<template>
  <div class="p-aliyunVideoPlayer">
    <div class="video-wrap">
      <!-- <span>视频组件</span> -->
      <div :id="videoPlayerId" />
    </div>
  </div>
</template>
<script>
import { defineComponent, watch } from 'vue'
import { renderVideo } from './usePlay'
export default defineComponent({
  name: 'AliyunVideoPlayer',
  components: {},
  props: {
    // 视频id     //检测id有值会自动解析
    vid: {
      type: String,
      required: true
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      default: false
    },
    // 自定义视频封面  仅当autoplay为false才生效
    cover: {
      type: String,
      default: null
    },
    // 视频展示高度  格式：**px
    vHeight: {
      type: String,
      default: '500px'
    }
  },
  setup(props) {
    let videoPlayer
    const videoPlayerId = `videoContent${Date.now()}`
    const show = async () => {
      videoPlayer = await renderVideo(props.vid, props.autoplay, props.vHeight, props.cover, videoPlayerId)
    }
    // 销毁实例
    const close = () => {
      videoPlayer?.dispose()
      videoPlayer = null
    }
    // 暂停播放
    const pause = () => {
      videoPlayer?.pause()
    }
    // 更多请浏览官方文档https://help.aliyun.com/document_detail/125572.htm?spm=a2c4g.11186623.0.0.6e6c125dSKXB5N#section-11l-e4g-lbr
    watch(
      () => props.vid,
      () => {
        show()
      },
      { immediate: true }
    )
    return { show, videoPlayerId, close, videoPlayer, pause }
  }
})
</script>
<style scoped>
@import url('https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/aliplayer-min.css');
.video-wrap :deep(.prism-big-play-btn) {
  left: 50% !important;
  transform: translate(-50%, 50%) !important;
}
</style>
