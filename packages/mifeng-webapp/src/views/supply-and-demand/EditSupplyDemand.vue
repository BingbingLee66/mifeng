<template>
  <a-spin :spinning="!detail">
    <template v-if="detail">
      <PublishImg v-if="detail.yshContentEditVO.contentType === 1 || !detail.dynamicWxUserVO" :detail="detail" />
      <PublishVideo v-else :detail="detail" :id="id == '' ? '0' : id" />
    </template>
  </a-spin>
</template>
<script>
import { getSupplyDemandDetail } from '@/api/home/supplyDemandManager/index'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import PublishImg from './PublishImg'
import PublishVideo from './PublishVideo'
export default defineComponent({
  name: 'EditSupplyDemand',
  components: {
    PublishImg,
    PublishVideo
  },
  setup() {
    const route = useRoute()
    const id = route.query?.id
    const detail = ref()
    const getDetail = async () => {
      const { data } = await getSupplyDemandDetail(id)
      detail.value = data
    }
    getDetail()
    return {
      id,
      detail
    }
  }
})
</script>

<style lang="scss" scoped>
.edit-wrap {
  min-height: 500px;
}
</style>
