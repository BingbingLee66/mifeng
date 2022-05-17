<template>
  <div v-loading="!detail" class="edit-wrap">
    <template v-if="detail">
      <PublishImg v-if="detail.yshContentEditVO.contentType === 1" :detail="detail" />
      <PublishVideo v-else :detail="detail" />
    </template>
  </div>
</template>

<script>
import { getSupplyDemandDetail } from '@/api/home/supplyDemandManger'

export default {
  components: {
    PublishImg: () => import('./PublishImg'),
    PublishVideo: () => import('./PublishVideo')
  },
  data() {
    return {
      detail: null
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const { data } = await getSupplyDemandDetail(this.$route.query.id)
      this.detail = data
    }
  },
}
</script>

<style lang="scss" scoped>
.edit-wrap {
  min-height: 500px;
}
</style>
