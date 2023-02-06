<template>
  <!-- 答题人信息 -->
  <div class="text-base bg-white px-8 pb-5">
    <a-row class="mb-2 w-full">
      <a-col :span="6">
        <span class="text-black">序号：</span>
        <span>{{ answersDetail.questionnaireRecordId }}</span>
      </a-col>
      <a-col :span="6">
        <span class="text-black">提交时间：</span>
        <span>{{ $filters.dateFormat(answersDetail.submitTs) }}</span>
      </a-col>
    </a-row>
    <a-row class="mb-2">
      <a-col :span="6">
        <span class="text-black">会内职位：</span>
        <span>{{ answersDetail.post }}</span>
      </a-col>
      <a-col :span="6">
        <span class="text-black">姓名：</span>
        <span>{{ answersDetail.name }}</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6">
        <span class="text-black">联系方式：</span>
        <span>{{ answersDetail.contactPhone }}</span>
      </a-col>
    </a-row>
  </div>
  <Panel>
    <!-- 标题 -->
    <div class="answer-title">{{ answersDetail.title }}</div>
    <!-- 说明  -->
    <div v-if="answersDetail.remark" class="mb-5 py-5 px-3 bg-gray-50">
      <div class="text-black text-lg font-bold mb-3">说明</div>
      <div>{{ answersDetail.remark }}</div>
    </div>
    <div v-for="(item, index) in answersDetail.answers" :key="item.problemId" class="mb-4">
      <!-- 题目 -->
      <div class="flex-x-0-center">
        <div class="answer-name" :class="{ require: item.required }">{{ index + 1 }}. {{ item.title }}</div>
        <div class="answer-type">
          <span v-if="item.key === COMPONENT_KEY.UPLOAD_FILE">【{{ FILE_TYPE_MAP.get(item.key) }}】</span>
          <span v-else class="components-type">【{{ COMPONENT_KEY_MAP.get(item.key) }}】</span>
        </div>
      </div>
      <!-- 答案 -->
      <div class="answer-content">
        <div
          v-if="
            [COMPONENT_KEY.PROVINCE_CITY_AREA, COMPONENT_KEY.SINGLE_TEXT, COMPONENT_KEY.MULTIPLE_TEXT].includes(
              item.key
            )
          "
        >
          <template v-if="item.val && item.val[0]">
            <div v-if="item.key === COMPONENT_KEY.PROVINCE_CITY_AREA">
              {{ item.val[0].provinceName }}-{{ item.val[0].cityName }}-{{ item.val[0].areaName }}
            </div>
            <div v-else>{{ item.val[0].value }}</div></template
          >
        </div>
        <div v-else>
          <div v-for="(item2, index2) in item.val" :key="index2">
            <div v-if="item.key === COMPONENT_KEY.UPLOAD_VIDEO" class="flex-x-start-center my-2">
              <div class="play-wrap" @click="handlePreview(item2)">
                <img :src="item2.cover" class="answer-img" />
                <play-circle-outlined class="play-icon" />
              </div>
              <a-button type="link" @click="downloadVideo(item2.sourceAddr)" style="color: var(--theme-color)">
                下载
              </a-button>
            </div>
            <div v-else-if="[COMPONENT_KEY.UPLOAD_IMAGE, COMPONENT_KEY.UPLOAD_FILE].includes(item.key)" class="my-2">
              <a-image :src="item2.value" :width="108" :height="108" class="answer-img" />
              <a-button type="link" @click="downloadIamge(item2.value, index2)" style="color: var(--theme-color)">
                下载
              </a-button>
            </div>
            <div v-else class="mt-2">{{ item2.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </Panel>
  <!-- 上一份答卷/下一份答卷 -->
  <div class="text-center mt-5">
    <a-button v-if="answersDetail.prevId" class="mr-5" @click="() => (_userId = answersDetail.prevId)">
      上一份答卷
    </a-button>
    <a-button v-if="answersDetail.nextId" type="primary" @click="() => (_userId = answersDetail.nextId)">
      下一份答卷
    </a-button>
  </div>

  <a-modal v-if="previewVisible" :visible="previewVisible" :footer="null" :width="1400" @cancel="handlePreviewCancel">
    <div style="padding: 20px 0 0 0">
      <AliyunVideoPlayer
        :cover="previewVideo.cover"
        :vid="previewVideo.vid"
        vheight="500px"
        :autoplay="true"
        ref="AliyunVideoPlayerRef"
      >
      </AliyunVideoPlayer>
    </div>
  </a-modal>
</template>

<script setup>
import { answersUserDetailByMiF } from '@/api/quest-survey'
import { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP } from '../../create/constant/index'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import AliyunVideoPlayer from '@/components/aliyunVideoPlayer/index'

const route = useRoute()
const { questionnaireId, userId } = route.query
const answersDetail = ref({})
const _userId = ref(userId)
watchEffect(
  async () => {
    const { data } = await answersUserDetailByMiF({ businessType: 1, questionnaireId, userId: _userId.value })
    answersDetail.value = data
  },
  { flush: 'post' }
)

/**
 * 下载图片
 * @param {*} imgsrc 图片路径
 */
const downloadIamge = imgsrc => {
  const image = new Image()
  image.src = imgsrc + '?v=' + Math.random()
  image.crossOrigin = '*'
  image.onload = function () {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    const event = new MouseEvent('click')
    a.download = Date.now()
    a.href = url
    a.dispatchEvent(event)
  }
}

/**
 * 下载视频
 * @param {*} url 视频路径
 */
const downloadVideo = url => {
  // 将http换成https
  url = url.replace(/^http/, 'https')
  // window.open(url)
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const a = document.createElement('a')
      const objectUrl = window.URL.createObjectURL(blob)
      a.download = Date.now()
      a.href = objectUrl
      a.click()
      window.revokeObjectURL(objectUrl)
    })
}

const previewVisible = ref(false)
const previewVideo = ref('')
const AliyunVideoPlayerRef = ref()
const handlePreview = async file => {
  previewVisible.value = true
  previewVideo.value = file
}
const handlePreviewCancel = () => {
  AliyunVideoPlayerRef.value.pause()
  previewVisible.value = null
}
</script>

<style lang="scss" scoped>
.answer {
  &-title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #222222;
    margin-bottom: 20px;
    &::before {
      content: '';
      display: block;
      width: 4px;
      background: #f4c820;
      height: 16px;
      margin-right: 10px;
    }
  }
  &-name {
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #222222;
  }
  &-type {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.25);
  }
  &-content {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    padding: 16px 0;
    line-height: 1;
    border-bottom: 1px solid #e9e9e9;
    margin-left: 14px;
  }
}

.require::before {
  content: '*';
  color: #e00000;
  margin-right: 6px;
}

.answer-img-wrap,
.answer-img {
  width: 108px;
  height: 108px;
  object-fit: cover;
}
:deep(.ant-image-img) {
  width: 108px;
  height: 108px;
  object-fit: cover;
}

.play-wrap {
  position: relative;
  cursor: pointer;
  .play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
    color: #f4c820;
    font-size: 24px;
  }
  &:hover .play-icon {
    display: block;
  }
}
</style>
