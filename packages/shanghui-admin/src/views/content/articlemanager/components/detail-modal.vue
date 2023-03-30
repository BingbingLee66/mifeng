<template>
  <a-modal v-model:visible="modalVisible" title="详情" :footer="null" width="70%">
    <div class="m-preview-wrap">
      <div v-if="detailObj.auditStatus === 2 || detailObj.auditStatus === 3" class="m-article-remark">
        不通过理由：{{ detailObj.auditRemark }}
      </div>
      <div class="m-preview-area">
        <div class="m-article-title">{{ detailObj.title }}</div>
        <videoComponent v-if="detailObj.vid" ref="videoRef" :vid="detailObj.vid" :vHeight="'530px'" />
        <div class="m-article-content" v-html="detailObj.contentHtml" />
      </div>
    </div>
  </a-modal>
</template>
<script>
import { defineComponent, computed, defineAsyncComponent, ref } from 'vue'
export default defineComponent({
  components: {
    videoComponent: defineAsyncComponent(() => import('@business/components/src/aliyunVideoPlayer/index.vue'))
  },
  props: {
    detailObj: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const videoRef = ref()
    const modalVisible = computed({
      get() {
        return props.visible
      },
      set(value) {
        emit('update:visible', value)
        if (props.detailObj.vid) {
          videoRef.value.close()
        }
      }
    })
    const showVideo = () => {
      videoRef.value.show(props.detailObj.vid)
    }
    return { modalVisible, videoRef, showVideo }
  }
})
</script>
<style lang="scss" scoped>
.m-preview-wrap {
  width: 100%;
  height: 80vh;
}

.m-preview-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}

.m-article-remark {
  font-size: 19px;
  font-weight: 500;
  margin: 0px 20px;
}

.m-article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 20px 40px 20px 40px;
}

.m-article-content {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  //margin: 20px;
}

::-webkit-scrollbar {
  width: 0px;
}

.m-preview-area img {
  width: 100% !important;
  height: auto !important;
}
</style>
