<template>
  <a-modal :visible="dialogVisible" title="批量分配短信" @ok="handleSave" width="600px" @cancel="handleClose">
    <a-row>1、请选择模板应用商协会 (选择后，以下商协会可使用此模板)</a-row>
    <a-row>
      <a-col :span="8">
        <a-input v-model:value="name" allowClear placeholder="请输入内容" />
      </a-col>
      <a-col>
        <a-button type="primary" @click="searchChamber" class="ml-4">查询</a-button>
      </a-col>
      <a-col class="flex-x-between-center ml-4">
        已选 <span class="container-choice">{{ formState.ckeys.length }}</span
        >个商协会
      </a-col>
    </a-row>
    <a-checkbox v-model:checked="SelectAll" :indeterminate="indeterminate" @change="onCheckAllChange">
      全选
    </a-checkbox>
    <div class="business">
      <a-checkbox-group v-model:value="formState.ckeys">
        <div class="group-box">
          <a-checkbox v-for="item in originOpt" :key="item.ckey" :value="item.ckey" class="checkbox-item">
            {{ item.name }}
          </a-checkbox>
        </div>
      </a-checkbox-group>
    </div>
    <a-row> 2、请配置分配短信条数（改配置仅对所选商协会应用） </a-row>
    <a-form ref="formRef" :model="formState">
      <a-form-item label="分配短信条数" name="num">
        <a-input-number v-model:value="formState.num" :min="1" :max="5000" placeholder="请分配短信" addon-after="条" />
      </a-form-item>
      <a-form-item label="分配短信条数" name="num">
        <a-input-number v-model:value="maxNum" :min="0" disabled addon-after="条" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { reactive, ref, computed, toRefs, watch } from 'vue'
import { distributionChambers, batchDistributionNum } from '@business/common/src/mass-notification/api/index'
import { message, Modal } from 'ant-design-vue'
export default {
  props: {
    showConfiguration: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:showConfiguration'],
  setup(props, { emit }) {
    const dialogVisible = computed({
      get() {
        return props.showConfiguration
      },
      set(value) {
        emit('update:showConfiguration', value)
      }
    })
    const formState = reactive({
      channelTypeId: 1,
      ckeys: [],
      num: ''
    })
    const maxNum = computed(() => formState.ckeys.length * formState.num || 0)
    const state = reactive({
      indeterminate: true,
      SelectAll: false,
      originOpt: []
    })
    const name = ref('')
    const searchChamber = async () => {
      const parmas = {
        name: name.value
      }
      const { data } = await distributionChambers(parmas)
      state.originOpt = data
    }
    searchChamber()
    const handleSave = async () => {
      if (!formState.ckeys.length) return message.error('请选择商协会')
      if (!formState.num) return message.error('请输入分配短信条数')
      Modal.confirm({
        title: '提示',
        content: `是否确认分配 [ ${maxNum.value} ] 条短信给所选商协会`,
        async onOk() {
          await batchDistributionNum(formState)
          handleClose()
          emit('onClick')
        }
      })
    }
    const onCheckAllChange = () => {
      if (state.SelectAll) {
        formState.ckeys = state.originOpt.map(v => {
          return v.ckey
        })
      } else {
        formState.ckeys = []
      }
    }
    watch(
      () => formState.ckeys,
      val => {
        state.indeterminate = !!val.length && val.length < state.originOpt.length
        state.SelectAll = val.length === state.originOpt.length
      }
    )
    const handleClose = () => {
      Object.assign(formState, {
        channelTypeId: 1,
        ckeys: [],
        num: ''
      })
      name.value = ''
      state.SelectAll = false
      dialogVisible.value = false
    }
    return {
      dialogVisible,
      formState,
      ...toRefs(state),
      name,
      searchChamber,
      onCheckAllChange,
      handleSave,
      handleClose,
      maxNum
    }
  }
}
</script>
<style lang="scss" scoped>
.container-choice {
  color: #4daaff;
}
.business {
  height: 350px;
  max-height: 350px;
  overflow-y: auto;
  width: 100%;
  padding: 10px 0;
  margin-bottom: 10px;
}
</style>
