<template>
  <span class="lables">
    <span
      v-for="(item,index) in list"
      :key="item.id"
      class="lable-item"
      :style="itemStyle"
    >
      {{ item[nameKey] }}
      <slot name="icon" :list="list" :item="item" :index="index">
        <i class="lable-icon el-icon-circle-close" @click.stop="$emit('delete',{list,item,index})" />
      </slot>
    </span>
    <el-button v-if="list.length<limit" type="success" :icon="icon" @click.stop="$emit('click')"><slot /></el-button>
  </span>
</template>

<script>

export default {
  components: {},
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    icon: {
      type: String,
      default: ''
    },
    limit: {
      type: String || Number,
      default: Infinity
    },
    itemStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() { return {} }
}
</script>

<style  scoped lang="scss">
  .lable-item {
    display: inline-block;
    position: relative;
    padding: 12px 20px;
    margin-right: 8px;
    margin-bottom: 8px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #409eff;
    color: #409eff;
    cursor: pointer;
    line-height: 1.15;

    &:last-child {
      margin-right: 0;
    }
  }

  .lable-icon {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 16px;
  }

  .el-icon-circle-close {
    color: #fd5d5d;
  }
</style>
