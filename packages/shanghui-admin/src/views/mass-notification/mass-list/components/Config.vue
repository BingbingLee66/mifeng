<template>
  <a-modal :visible="dialogVisible" title="批量配置模板" @ok="handleSave" width="600px" @cancel="handleClose">
    <a-row>1、请选择模板</a-row>
    <a-row>
      <a-col :span="8">
        <a-select v-model:value="formState.channelTypeId" @change="onLibrary" style="width: 150px">
          <a-select-option :value="1">短信</a-select-option>
          <a-select-option :value="2">订阅消息</a-select-option>
          <a-select-option :value="3">APP推送</a-select-option>
        </a-select>
      </a-col>
      <a-col>
        <a-select
          ref="select"
          v-model:value="formState.id"
          :options="stencil"
          allowClear
          :field-names="{ label: 'name', value: 'id' }"
          style="width: 150px"
        ></a-select>
      </a-col>
    </a-row>
    <a-row>2、请选择模板应用商协会 (选择后，以下商协会可使用此模板)</a-row>
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
  </a-modal>
</template>
<script>
import { reactive, ref, computed, toRefs, watch } from 'vue'
import {
  selectTemplateListAdmin,
  distributionChambers,
  batchTemplateDistribution
} from '@business/common/src/mass-notification/api/index'
import { message } from 'ant-design-vue'
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
      id: null,
      ckeys: []
    })
    const stencil = ref([])
    // 搜索渠道
    const onLibrary = async () => {
      formState.id = ''
      stencil.value = []
      const { data } = await selectTemplateListAdmin({
        channelTypeId: formState.channelTypeId
      })
      stencil.value = data
    }
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
    const initFunc = () => {
      searchChamber()
      onLibrary()
    }
    initFunc()
    const handleSave = async () => {
      if (!formState.id) return message.error('请选择模板')
      if (!formState.ckeys.length) return message.error('请选择商协会')
      await batchTemplateDistribution(formState)
      handleClose()
      emit('onClick')
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
        id: null
      })
      name.value = ''
      state.SelectAll = false
      dialogVisible.value = false
    }
    return {
      dialogVisible,
      formState,
      onLibrary,
      stencil,
      ...toRefs(state),
      name,
      searchChamber,
      onCheckAllChange,
      handleSave,
      handleClose
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
}
</style>
