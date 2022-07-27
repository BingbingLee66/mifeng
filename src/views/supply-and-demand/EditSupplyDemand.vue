<template>
  <div v-loading="!detail" class="edit-wrap">
    <template v-if="detail">
      <PublishImg v-if="detail.yshContentEditVO.contentType === 1 || !detail.dynamicWxUserVO" :detail="detail" />
      <PublishVideo v-else :detail="detail" :id="id == '' ? 0 : id " />
    </template>
  </div>
</template>

<script>
import { getSupplyDemandDetail } from '@/api/home/supplyDemandManger'
import { details } from '@/api/content/crawler'

export default {
  components: {
    PublishImg: () => import('./PublishImg'),
    PublishVideo: () => import('./PublishVideo')
  },
  data() {
    return {
      detail: null,
      id:'',
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const id = this.$route.query.id
      if(this.$route.query.id) this.id = Number(id)
      // type = 0供需编辑 1爬虫供需编辑
      const type = this.$route.query.type ? 1 : 0
      if (type === 1) {
        const { data } = await details(id)
        this.detail = data
      } else {
        const { data } = await getSupplyDemandDetail(id)
        this.detail = data
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.edit-wrap {
  min-height: 500px;
}
</style>
