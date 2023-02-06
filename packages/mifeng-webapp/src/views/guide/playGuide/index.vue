<template>
  <Panel>
    <div class="preview-wrap">
      <a-spin :spinning="fetchLoading">
        <div class="preview-area">
          <div class="article-title">{{ detailObj.title }}</div>
          <div style="margin-bottom: 15px; width: 96%; margin: 0 auto">
            <AliyunVideoPlayer ref="videoRef" v-if="detailObj.vid" :vid="detailObj.vid" height="430px" />
          </div>
          <div class="article-content" v-html="detailObj.content"></div>
        </div>
      </a-spin>
    </div>
  </Panel>
</template>
<script setup>
import { getguideDetail, getsaveLog } from '@/api/guide/guide'
import AliyunVideoPlayer from '@/components/aliyunVideoPlayer/index.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const fetchLoading = ref(false)
const route = useRoute()
const detailsId = route.query?.detailsId
const detailObj = ref({})
const fetchData = async () => {
  fetchLoading.value = true
  try {
    const { data } = await getguideDetail({ id: detailsId })
    detailObj.value = data
  } catch (error) {}
  fetchLoading.value = false
}
fetchData()
// 保存访问操作指引记录
getsaveLog({ ogid: detailsId })
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.preview-wrap {
  width: 95%;
  height: auto;
  min-height: 500px;
}
.preview-area {
  width: 100%;
  min-height: 500px;
  margin: 30px 20px;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}
.article-remark {
  font-size: 19px;
  font-weight: 500;
  margin: 20px;
}
.article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 40px 40px 20px 40px;
}
.article-content {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  margin: 0 40px 20px 40px;
}
.article-content > p > img {
  margin: 20px 10%;
  width: 80% !important;
  height: auto !important;
  max-height: 100% !important;
}
</style>
