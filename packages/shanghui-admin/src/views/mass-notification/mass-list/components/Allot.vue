<template>
  <a-modal :visible="dialogVisible" title="分配短信" @cancel="handleClose" @ok="handleSave">
    <div>请配置分配短信条数</div>
    <a-form ref="formRef" :model="formState">
      <a-form-item label="分配短信条数" name="num">
        <a-input-number v-model:value="formState.num" :min="1" :max="5000" placeholder="请分配短信" addon-after="条" />
      </a-form-item>
    </a-form>
    <div class="hit">商协会短信总数：{{ smsDistributionSum }} 商协会短信剩余数：{{ smsRemainSum }}</div>
  </a-modal>
</template>
<script>
import { reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { batchDistributionNum } from '@business/common/src/mass-notification/api/index'
export default {
  setup(props, { emit }) {
    const dialogVisible = ref(false)
    const smsRemainSum = ref(0)
    const smsDistributionSum = ref(0)
    const show = row => {
      formState.ckeys.push(row.ckey)
      smsRemainSum.value = row.smsRemainSum || 0
      smsDistributionSum.value = row.smsDistributionSum || 0
      dialogVisible.value = true
    }
    const formState = reactive({
      ckeys: [], // 商会ckey集合
      num: '',
      channelTypeId: 1
    })
    const handleClose = () => {
      dialogVisible.value = false
      formState.ckey = []
      formState.num = ''
      smsRemainSum.value = 0
      smsDistributionSum.value = 0
    }
    const handleSave = async () => {
      if (formState.num === '') return message.error('请输入分配短信条数')
      Modal.confirm({
        title: '提示',
        content: `是否确认分配 [ ${formState.num} ] 条短信给所选商协会`,
        async onOk() {
          await batchDistributionNum(formState)
          dialogVisible.value = false
          emit('onClick')
        }
      })
    }
    return { dialogVisible, show, formState, smsRemainSum, smsDistributionSum, handleClose, handleSave }
  }
}
</script>
<style lang="scss" scoped>
.hit {
  color: #c0c0c0;
}
</style>
