<template>
  <div class="app-container">
    <div class="content">
      <div class="box" v-html="info.content" />
      <div style="margin-left:40px">
        <el-image
          v-if="info.imgs && info.imgs.length"
          style="width: 150px; height: 150px;"
          :src="info.imgs[0]"
          :preview-src-list="info.imgs"
          @click.stop="handleClickitem"
        />
      </div>
    </div>

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
.content{
  display: flex;

  .box{
    max-width: 70%;
    /deep/ img{
      width: 100% !important;
    }
  }
}

</style>
