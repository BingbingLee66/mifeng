<template>
  <div class="bar flex-x-center-center">
    <img v-if="!isPlaying" class="play" src="@/assets/img/5g/play-start.png" @click="handleStart">
    <img v-else class="play" src="@/assets/img/5g/play-stop.png" @click="handlePause">
    <el-progress class="flex-1" :percentage="current*100/duration" :show-text="false" />
    <div class="time">
      {{ formatTime(current) }}/{{ formatTime(duration) }}
    </div>
    <audio v-if="src" v-show="false" ref="audio" :src="src" @loadedmetadata="onAudioLoad" @playing="isPlaying = true" @pause="isPlaying = false" @timeupdate="onTimeUpdate" @ended="onEnded" />
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      duration: 0,
      current: 0,
      isPlaying: false
    }
  },
  methods: {
    formatTime(sec) {
      let _sec = Math.floor(sec)
      if (!_sec) return '00:00'
      const hour = Math.floor(_sec / 3600)
      const min = Math.floor(_sec % 3600 / 60)
      _sec = _sec % 3600 % 60
      if (hour) return `${hour}:${this.fillZero(min)}:${this.fillZero(_sec)}`
      if (min) return `${this.fillZero(min)}:${this.fillZero(_sec)}`
      return `00:${this.fillZero(_sec)}`
    },
    fillZero(n) {
      return `${n}`.padStart(2, '0')
    },
    onAudioLoad(e) {
      this.duration = e.target.duration
    },
    onTimeUpdate(e) {
      const current = Math.floor(e.target.currentTime)
      if (this.current === current) return
      this.current = current
    },
    onEnded() {
      this.current = this.duration
      this.isPlaying = false
    },
    handleStart() {
      this.$refs.audio && this.$refs.audio.play()
    },
    handlePause() {
      this.$refs.audio && this.$refs.audio.pause()
    },
  },
}
</script>

<style lang="scss" scoped>
.bar {
  width: 100%;
  height: 24px;
  padding: 0 10px;
  background: rgba(0,0,0,0.85);

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
    color: #FFFFFF;
  }
}

</style>
