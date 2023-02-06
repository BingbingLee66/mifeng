<template>
  <div class="new-table-filter">
    <div v-if="title" class="table-title">{{ title }}</div>
    <div class="table-filter-list" :style="listStyles"><slot /></div>

    <TableFilterItem v-if="clearable">
      <AButton class="mr10" @click="emit('reset')">重置</AButton>
      <AButton type="primary" @click="emit('fetch', true)">查询</AButton>
      <div v-if="toggleVisible" class="fold" @click="folded = !folded">
        <span class="ml10 mr5">{{ folded ? '展开' : ' 收起' }}</span>
        <DownOutlined v-if="folded" />
        <UpOutlined v-else />
      </div>
    </TableFilterItem>

    <div v-if="hasAction" class="filter-opt">
      <slot name="action" />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, provide } from 'vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'TableFilter',
  components: {
    DownOutlined,
    UpOutlined
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    showAll: {
      type: Boolean,
      default: false
    },
    // 多少count显示展开面板
    count: {
      type: Number,
      default: 3
    },
    labelWidth: {
      type: String,
      default: ''
    }
  },
  emits: ['reset', 'fetch'],
  setup(props, { emit, slots }) {
    const folded = ref(true)
    provide('labelWidthKey', { width: props.labelWidth })

    const hasAction = computed(() => {
      const { action } = slots
      return action && action().length
    })

    const hasFilter = computed(() => {
      const { default: filter } = slots
      return filter && filter().length
    })

    const listStyles = computed(() => {
      return {
        height: hasFilter.value ? (folded.value && !props.showAll ? '52px' : 'auto') : 'auto'
      }
    })

    const toggleVisible = computed(() => {
      return hasFilter.value > props.count && !props.showAll
    })

    onMounted(() => {})

    return {
      emit,
      folded,
      hasAction,
      toggleVisible,
      listStyles
    }
  }
})
</script>

<style lang="scss" scoped>
.new-table-filter {
  display: flex;
  align-items: baseline;
  .table-filter-list {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    overflow: hidden;

    .table-filter-item {
      padding-right: 10px;
    }
    .filter-item-clear {
      font-size: 12px;
      line-height: 28px;
      cursor: pointer;
      padding-left: 10px;
      &:hover {
        color: map-get($map: $color, $key: base);
      }
    }
  }
  .filter-opt {
    display: flex;
    .x-radio-group {
      vertical-align: middle;
    }
  }
  .table-title {
    font-size: 14px;
  }
  .fold {
    cursor: pointer;
    color: map-get($map: $color, $key: base);
  }
}
</style>
