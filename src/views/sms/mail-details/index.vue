<template>
  <div class="app-container">
    <div>
      <el-image
        v-if="info.imgs && info.imgs.length"
        style="width: 100px; height: 100px; margin-bottom: 20px;"
        :src="info.imgs[0]"
        :preview-src-list="info.imgs"
        @click.stop="handleClickitem"
      />
    </div>
    <div class="box" v-html="info.content" />
  </div>
</template>
<script>
import { stationMailDetail } from '@/api/mass-notification/index'
export default {
  components: {},
  data() {
    return {
      id: '',
      info: {},

    }
  },
  created() {
    this.id = this.$route.params.id || ''
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const params = { id: this.id }
      const res = await stationMailDetail(params)
      this.info = res.data
      this.info.imgs = res.data.imgs || []
    },
    // 关闭二维码蒙层
    handleClickitem() {
      this.$nextTick(() => {
        const domlmageMask = document.querySelector('.el-image-viewer__mask')
        if (!domlmageMask) return
        domlmageMask.addEventListener('click', () => {
          document.querySelector('.el-image-viewer__close').click()
        })
      })
    }
  },

}
</script>

<style lang="scss" scoped>
.box{
  width: 100%;
}
</style>
