<template>
  <div class="plus-table">
    <a-card v-if="searchColumns.length" class="plus-table-title" :bodyStyle="{ padding: '24px 32px' }">
      <PlusFilter
        :search="props.search"
        :dataSource="props.dataSource"
        :columns="searchColumns"
        @finish="onFilterFinish"
        @finishFailed="onFilterFailed"
      >
        <template v-slot:filterItem="{ column }">
          <slot name="filterItem" :column="column"></slot>
        </template>

        <template v-slot:searchToolBar="{ form }">
          <slot name="searchToolBar" :form="form"></slot>
        </template>
      </PlusFilter>
    </a-card>
    <a-card
      :title="headerTitle"
      :headStyle="{ padding: '16px 32px', borderBottom: 'none' }"
      :bodyStyle="{ padding: '0 32px' }"
    >
      <template #extra> <slot name="toolBar"></slot></template>
      <a-table
        v-bind="$attrs"
        :columns="tableColumns"
        :data-source="props.dataSource"
        @change="(...params) => emit('change', ...params)"
        @expand="(...params) => emit('expand', ...params)"
        @expandedRowsChange="(...params) => emit('expandedRowsChange', ...params)"
        @resizeColumn="(...params) => emit('resizeColumn', ...params)"
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PlusFilter from './PlusFilter.vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  dataSource: {
    type: Array,
    required: true
  },
  headerTitle: {
    type: String,
    default: ''
  },
  request: {
    type: Function,
    default: () => {}
  },
  search: {
    type: Object
  }
})
const emit = defineEmits(['change', 'expand', 'expandedRowsChange', 'resizeColumn'])
const searchColumns = computed(() => {
  return props.columns.filter(item => item.filter)
})
const tableColumns = computed(() => {
  return props.columns.filter(item => !item.hideInTable)
})

const onFilterFinish = async res => {
  try {
    props.request(res)
  } catch (error) {
    console.log('request error')
  }
}

const onFilterFailed = () => {
  console.log('未通过校验')
}
</script>

<style lang="scss" scoped>
.plus-table {
  .plus-table-title {
    margin-bottom: 25px;
  }
  :deep(.ant-card-extra) {
    padding: 0;
  }
  :deep(.ant-card-head-title) {
    padding: 0;
  }
}
</style>
