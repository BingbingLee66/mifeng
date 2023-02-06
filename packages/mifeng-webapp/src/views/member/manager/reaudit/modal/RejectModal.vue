<!-- RejectDialog -->
<template>
  <a-modal v-model:visible="visible" @cancel="cancel" title="驳回理由" width="520px">
    <a-radio-group v-model:value="remark">
      <a-radio v-for="item in radioOptions" :key="item.label" :style="radioStyle" :value="item.label">
        {{ item.label }}
      </a-radio>
    </a-radio-group>
    <a-row style="100%">
      <a-textarea
        v-if="remark === '其他'"
        v-model:value="otherRemark"
        :auto-size="{ minRows: 3, maxRows: 5 }"
        :maxlength="30"
        :showCount="true"
        style="width: 100%; margin-left: 20px"
      />
    </a-row>
    <template #footer>
      <a-button type="default" @click="cancel">取消</a-button>
      <a-button type="primary" @click="confirm">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { reactive, ref } from 'vue'
import { closeModal } from '@/hooks/useModal'
import { message } from 'ant-design-vue'

export default {
  props: {
    recordData: [Object, Array]
  },

  setup(props, { emit }) {
    const { visible, cancel } = closeModal('RejectModal')

    const remark = ref('资料乱填')

    const otherRemark = ref('')

    const radioStyle = reactive({
      display: 'flex',
      height: '30px',
      lineHeight: '30px'
    })

    const radioOptions = [
      { label: '资料乱填' },
      { label: '不是本商会会员' },
      { label: '提交资料不齐全' },
      { label: '其他' }
    ]

    const confirm = () => {
      if (remark.value === '其他' && !otherRemark.value) return message.warning('请输入驳回理由~')
      const _remark = remark.value === '其他' ? otherRemark.value : remark.value
      emit('confirm', props.recordData, _remark)
      cancel()
    }

    return { visible, cancel, confirm, remark, otherRemark, radioStyle, radioOptions }
  }
}
</script>
