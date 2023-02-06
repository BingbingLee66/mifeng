<template>
  <div class="table-filter-item">
    <span v-if="label" class="table-head-label" :title="label" :style="{ width }"> {{ label }}: </span>
    <slot />
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'TableFilterItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    return {
      width: `${props.labelWidth || inject('labelWidthKey').width}px`
    }
  }
})
</script>

<style lang="scss" scoped>
.table-filter-item {
  display: flex;
  align-items: center;
  margin: 10px 20px;

  .table-head-label {
    font-size: 12px;
    line-height: 28px;
    margin-right: 10px;
    text-align: right;
    @include truncate(60px);
  }

  &:last-child {
    margin-right: 0;
  }
}
</style>
