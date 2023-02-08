<!-- eslint-disable no-unused-vars -->
<template>
  <a-form ref="formRef" name="advanced_search" class="plus-filter" :model="formState" v-if="columns.length">
    <a-row :gutter="24" style="row-gap: 24px">
      <template v-for="(item, index) in columns" :key="item.dataIndex">
        <a-col v-show="expand || index <= hiddenNum" :span="item.span || 6">
          <slot name="filterItem" :column="item">
            <!-- input -->
            <a-form-item v-if="item.valueType === 'text'" :name="item.dataIndex" :label="item.title">
              <a-input
                autocomplete="off"
                v-model:value="formState[item.dataIndex]"
                :placeholder="`请输入${item.title}`"
                v-bind="item.formItemProps"
              ></a-input>
            </a-form-item>
            <!-- select -->
            <a-form-item v-else-if="item.valueType === 'select'" :name="item.dataIndex" :label="item.title">
              <a-select
                v-model:value="formState[item.dataIndex]"
                :placeholder="`请选择${item.title}`"
                v-bind="item.formItemProps"
              >
              </a-select>
            </a-form-item>
            <!-- cascader -->
            <a-form-item v-else-if="item.valueType === 'cascader'" :name="item.dataIndex" :label="item.title">
              <a-cascader v-model:value="formState[item.dataIndex]" v-bind="item.formItemProps" />
            </a-form-item>
            <!-- range-picker -->
            <a-form-item v-else-if="item.valueType === 'dateTimeRange'" :name="item.dataIndex" :label="item.title">
              <a-range-picker
                v-model:value="formState[item.dataIndex]"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                v-bind="item.formItemProps"
              />
            </a-form-item>
            <!-- date-picker -->
            <a-form-item v-else-if="item.valueType === 'datePicker'" :name="item.dataIndex" :label="item.title">
              <a-date-picker
                v-model:value="formState[item.dataIndex]"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                v-bind="item.formItemProps"
              />
            </a-form-item>
          </slot>
        </a-col>
      </template>
      <a-col :span="isMulti ? 24 : 6" style="text-align: right; margin-left: auto">
        <slot name="searchToolBar" :form="formRef">
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button style="margin: 0 8px" @click="() => formRef.resetFields()">重置</a-button>
        </slot>
        <a style="font-size: 12px; color: #2d8dfd" @click="expand = !expand" v-if="isMulti">
          <template v-if="expand">
            <UpOutlined />
            收起
          </template>
          <template v-else>
            <DownOutlined />
            展开
          </template>
        </a>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
    required: true
  },
  search: {
    type: Object,
    default() {
      return {
        hiddenNum: 3,
        defaultCollapsed: true
      }
    }
  }
})
const columns = computed(() => {
  return props.columns.filter(item => {
    formState[item.dataIndex] = item.initialValue
    return item
  })
})
const hiddenNum = computed(() => {
  return props.search.hiddenNum - 1
})

const isMulti = computed(() => {
  return columns.value.length > props.search.hiddenNum
})

const expand = ref(!props.search.defaultCollapsed)
const formRef = ref()
const formState = reactive({})
</script>
<style scoped lang="scss">
.plus-filter {
  background-color: #fff;
  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
