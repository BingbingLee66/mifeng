<!-- DetailModal -->
<template>
  <a-modal v-model:visible="visible" @cancel="cancel" title="详情" width="520px">
    <div class="mb20">操作人：{{ detail.auditor }}</div>
    <div class="mb20">操作时间：{{ $filters.dateFormat(+detail.auditedTsLong) }}</div>
    <div class="mb20" v-if="detail.auditStatus == 2">驳回原因：{{ detail.rejectRemark }}</div>
    <template #footer>
      <a-button type="primary" @click="cancel">知道了</a-button>
    </template>
  </a-modal>
</template>

<script>
import { examineDetail } from '@/api/member/manager'
import { defineComponent, reactive, watchEffect, toRefs } from 'vue'
import { closeModal } from '@/hooks/useModal'

export default defineComponent({
  props: {
    recordData: [Object, Array]
  },
  setup(props) {
    const { visible, cancel } = closeModal('DetailModal')
    const modalState = reactive({
      detail: {}
    })
    watchEffect(async () => {
      if (props.recordData.id) {
        const { data } = await examineDetail({ id: props.recordData.id })
        modalState.detail = data
      }
    })
    return { visible, cancel, ...toRefs(modalState) }
  }
})
</script>
