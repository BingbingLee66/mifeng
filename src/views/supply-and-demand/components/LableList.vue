<template>
  <span class="lables">
    <span
      v-for="(item,index) in list"
      :key="item.id"
      class="lable-item"
    >
      {{ item[nameKey] }}
      <i class="el-icon-circle-close" @click.stop="$emit('delete',{list,item,index})" />
    </span>
    <el-button v-if="list.length<maxlength" type="success" :icon="icon" @click.stop="$emit('click')"><slot /></el-button>
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
    maxlength: {
      type: String || Number,
      default: Infinity
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
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #409eff;
    color: #409eff;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }
  }

  .el-icon-circle-close {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 16px;
    color: #fd5d5d;
  }
</style>
