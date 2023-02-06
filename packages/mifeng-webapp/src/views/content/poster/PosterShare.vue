<template>
  <div class="c-poster-share flex justify-center">
    <div>
      <div class="text-base font-[500] text-[#222]">微信分享</div>
      <div class="flex">
        <img class="qrcode w-[186px] h-[186px] mt-[16px]" :src="posterInfo.hyalineQrcodeImage" alt="" />
        <div class="flex flex-col ml-[20px] mt-[70px]">
          <div class="text-sm text-black font-[500]">您可扫码打开节日海报页面</div>
          <div class="mt-[12px] leading-[22px] text-sm">1. 立即分享到微信聊天、朋友圈</div>
          <div class="leading-[22px] text-sm">2. 提前保存海报图片到手机相册，节日当天再扫码分享</div>
        </div>
      </div>
      <div class="w-[216px]">
        <video
          controls
          class="mt-[26px] w-full h-full bg-black"
          src="https://ysh-cdn.kaidicloud.com/prod/bee/video/guide.mp4"
        ></video>
      </div>
    </div>
    <a-divider type="vertical" style="background-color: e9e9e9; height: 611px; margin-left: 24px" />
    <div class="ml-[35px]">
      <div class="text-base font-[500] text-[#222]">短信群发</div>
      <a-checkbox class="text-base mt-4" v-model:checked="checked">开启短信群发</a-checkbox>
      <img
        src="https://ysh-cdn.kaidicloud.com/prod/bee/iphone.png"
        class="w-[277px] h-[535px] mt-4 block"
        :review="false"
      />
    </div>
  </div>
  <div class="flex items-center justify-center mt-[24px]">
    <a-button @click="emit('prev')">返回上一步</a-button>
    <a-button type="primary" class="ml-[7px]" @click="isMass ? goToMass() : save()">{{
      isMass ? '立即发送' : '保存'
    }}</a-button>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { Divider as ADivider } from 'ant-design-vue'
import { usePosterDetail } from './usePoster'
import { NOTIFICATION_TYPE } from '@/constant/mass-notification'
const emit = defineEmits(['prev', 'next'])
const checked = ref(false)
const isMass = computed(() => checked.value)
const router = useRouter()
const props = defineProps({
  // 海报id
  posterId: {
    type: Number,
    required: true
  }
})

const { poster: posterInfo } = usePosterDetail(props.posterId)
const goToMass = () => {
  router.push({
    path: '/mass-notification/create',
    query: {
      posterId: props.posterId,
      type: NOTIFICATION_TYPE.POSTER
    }
  })
}
const save = () => {
  router.push({
    path: '/content/poster'
  })
}
</script>
