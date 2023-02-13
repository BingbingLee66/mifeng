<template>
  <div class="p-main-padding">
    <div class="bg-white p-[25px] min-w-[800px]">
      <div class="w-[464px] mx-auto">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
      </div>

      <div class="steps-content mt-[30px]">
        <div v-if="steps[current].type === 'create'">
          <HolidayPoster :poster-id="posterId" @sharePoster="sharePoster"></HolidayPoster>
        </div>
        <div v-else>
          <PosterShare :poster-id="posterId" @prev="prev" @next="next" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Steps as ASteps } from 'ant-design-vue'
import PosterShare from './PosterShare.vue'
import HolidayPoster from './HolidayPoster'
import { DataCollect } from '@/utils/data-collect'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
const store = useStore()
const { Step: AStep } = ASteps
const useSteps = () => {
  const current = ref(0)
  const next = () => {
    current.value++
  }
  const prev = () => {
    current.value--
  }
  // 分享海报
  const sharePoster = id => {
    posterId.value = +id
    next()
  }
  return {
    current,
    steps: [
      {
        title: '新增节日海报',
        type: 'create'
      },
      {
        title: '分享海报',
        type: 'share'
      }
    ],
    next,
    prev,
    sharePoster
  }
}
const { current, steps, next, prev, sharePoster } = useSteps()

// 编辑海报get海报id
function updataPosterId() {
  const { id } = useRoute().params
  id && (posterId.value = +id)
}
const posterId = ref(0)
updataPosterId()

onMounted(() => {
  DataCollect.FestivalPoster.create({ store })
})
</script>

<style lang="scss">
.ant-steps .ant-steps-item:not(.ant-steps-item-active) > .ant-steps-item-container[role='button'] {
  cursor: text;
}
.ant-steps-item-title {
  color: #8c8c8c !important;
  &:hover {
    color: #8c8c8c !important;
  }
}
</style>
