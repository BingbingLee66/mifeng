<template>
  <div>
    <hd v-bind="$attrs" />
    <!-- {{ $attrs.item }} -->
    <template v-if="$attrs.item.selectItem">
      <div
        v-for="(item, index) in $attrs.item.selectItem"
        :key="index"
        class="select-val-item flex-x-between-center"
      >
        <span class="sel"></span>
        <a-input
          v-model:value="item.label"
          :disabled="!!(item.otherItems === 1 || item.isDisable)"
          placeholder="选项"
          maxlength="30"
          class="my-input"
        />
        <span v-if="!item.isDisable" class="del" @click="delSelectItem(index)"
          >删除</span
        >
      </div>
    </template>
  </div>
</template>
<script>
import hd from './Common_Hd.vue'
export default {
  components: {
    hd,
  },
  setup(props, { attrs, emit }) {
    const delSelectItem = (item) => {
      emit('delSelectItem', { index: attrs.index, item })
    }
    return { delSelectItem }
  },
}
</script>
<style lang="scss" scoped>
.circle {
  border: 1px solid #dcdfe6;
  width: 14px;
  height: 14px;
  background-color: #fff;
  border-radius: 50%;
}
.item-text {
  padding-left: 10px;
  color: #606266;
  font-size: 14px;
}
.select-val-item {
  position: relative;
}
.sel {
  width: 14px;
  height: 14px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  margin-right: 11px;
}
.del {
  color: #d9001b;
  display: none;
  margin-left: 5px;
  flex-shrink: 0;
  font-size: 13px;
}
.select-val-item:hover .ant-input {
  // border: 1px solid #dcdfe6;
  // padding-left: 22px;
  box-shadow: 0 0 0 2px rgb(244 200 32 / 20%);
}
.select-val-item:hover .sel {
  // display: none;
}
.select-val-item:hover .del {
  display: inline-block;
}

.ant-input {
  border: none;
  margin: 4px 0px;
  padding-left: 10px;
}
// /deep/ .el-input__inner {
//   border: none;
//   // padding-left: 20px;
// }
</style>
