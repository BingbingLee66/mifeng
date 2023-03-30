<template>
  <div class="bar flex-x-center-center">
    <img v-if="!isPlaying" class="play" :src="start" @click="handleStart" />
    <img v-else class="play" :src="stop" @click="handlePause" />
    <a-progress class="flex-1" :percent="(current * 100) / duration" :showInfo="false" :strokeColor="'#ffca00'" />
    <div class="time">{{ formatTime(current) }}/{{ formatTime(duration) }}</div>
    <audio
      v-if="src"
      v-show="false"
      ref="audio"
      :src="props.src"
      @loadedmetadata="onAudioLoad"
      @playing="isPlaying = true"
      @pause="isPlaying = false"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useImgUrlAdmin } from '@business/common/src/utils/useImgUrl'

const start = useImgUrlAdmin('test/5g/play-start.png')
const stop = useImgUrlAdmin('test/5g/play-stop.png')
const props = defineProps({
  src: {
    type: String,
    default: ''
  }
})
const duration = ref(0)
const current = ref(0)
const isPlaying = ref(false)
const formatTime = sec => {
  let _sec = Math.floor(sec)
  if (!_sec) return '00:00'
  const hour = Math.floor(_sec / 3600)
  const min = Math.floor((_sec % 3600) / 60)
  _sec = (_sec % 3600) % 60
  if (hour) return `${hour}:${fillZero(min)}:${fillZero(_sec)}`
  if (min) return `${fillZero(min)}:${fillZero(_sec)}`
  return `00:${fillZero(_sec)}`
}
const fillZero = n => {
  return `${n}`.padStart(2, '0')
}
const audio = ref(null)
const onAudioLoad = e => {
  duration.value = e.target.duration
}
const onTimeUpdate = e => {
  const Current = Math.floor(e.target.currentTime)
  if (current.value === Current) return
  current.value = Current
}
const onEnded = () => {
  current.value = duration.value
  isPlaying.value = false
}
const handleStart = () => {
  audio.value && audio.value.play()
}
const handlePause = () => {
  audio.value && audio.value.pause()
}
</script>

<style lang="scss" scoped>
.bar {
  width: 100%;
  height: 24px;
  padding: 0 10px;
  background: rgba(0, 0, 0, 0.85);

  .play {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    margin-right: 10px;
    cursor: pointer;
  }
  .time {
    margin-left: 8px;
    flex-shrink: 0;
    font-size: 12px;
    color: #ffffff;
  }
}

:deep(.ant-btn.ant-btn-link) {
  padding: 0;
}
.ant-btn-link {
  color: #f4c820 !important;
}
</style>
