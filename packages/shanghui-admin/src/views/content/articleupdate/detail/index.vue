<template>
  <Panle>
    <div v-if="detailObj.auditStatus === 2 || detailObj.auditStatus === 3" class="article-remark">
      不通过理由：{{ detailObj.auditRemark }}
    </div>
    <div class="preview-area">
      <div class="article-title">{{ detailObj.title }}</div>
      <div v-if="detailObj.vid" style="margin-bottom: 15px; width: 96%; margin: 0 auto">
        <VideoUpLoad v-if="videoValue[0].videoCoverURL" class="detail-video" v-model:value="videoValue" />
      </div>
      <div class="article-content" v-html="detailObj.contentHtml"></div>
    </div>
  </Panle>
</template>

<script setup>
import { getDetail } from '@business/common/src/content/api/article'
import VideoUpLoad from '@business/components/src/upload/video-uploader'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const articleId = ref()
const detailObj = reactive({})
onMounted(async () => {
  const { query } = router.currentRoute.value
  articleId.value = query.articleId
  await getArticeDetail()
})
const videoValue = ref([])
const getArticeDetail = async () => {
  const params = {
    id: articleId.value
  }
  const {
    data: { dtl }
  } = await getDetail(params)
  Object.assign(detailObj, dtl)
  if (dtl.vid) {
    videoValue.value = [{ vid: dtl.vid, videoCoverURL: dtl.videoCoverURL }]
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.preview-area {
  background-color: #ffff;
  width: 100%;
  min-height: 500px;
  margin: 30px 20px;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}
.detail-video {
  margin: auto;
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
:deep(.Video-box) {
  margin: auto;
  text-align: center;
  width: 300px;
  height: 300px;
}
:deep(.Video-box .Video-box-image) {
  width: 280px !important;
  height: 280px !important;
}
:deep(.ant-upload-list-picture-card-container) {
  margin: auto;
  text-align: center;
  width: 300px;
  height: 300px;
}
:deep(.ant-upload-list) {
  display: flex;
  justify-content: center;
}
:deep(.Video-box-del) {
  display: none;
}
</style>
