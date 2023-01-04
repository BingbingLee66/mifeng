<template>
  <div>
    <hd v-bind="$attrs" />
    <template v-if="$attrs.item.selectItem">
      <div v-for="(item, index) in $attrs.item.selectItem" :key="index" class="select-val-item flex-x-between-center">
        <el-input v-model="item.label" :disabled="!!(item.otherItems===1 || item.isDisable)" placeholder="选项" maxlength="30" class="my-input" />
        <span v-if="!item.isDisable" class="del" @click="delSelectItem(index)">删除</span>
      </div>
    </template>

  </div>
</template>
<script>
export default {
  components: {
    hd: () => import('./Common_Hd.vue')
  },
  data() {
    return { radio: '' }
  },
  methods: {
    delSelectItem(item) {
      this.$emit('delSelectItem', { index: this.$attrs.index, item })
    }
  }
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
.my-input:before {
  content: '';
  display: block;
  width: 14px;
  height: 14px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  padding-left: 14px;
  //  margin-left: 14px;
}
.del {
  color: #d9001b;
  display: none;
  margin-left: 5px;
  flex-shrink: 0;
  font-size: 13px;
}
.select-val-item:hover /deep/ .el-input__inner{
  border: 1px solid #dcdfe6;
  padding: 2px;
}
.select-val-item:hover .del{
  display: inline-block;
}
.select-val-item:hover .my-input:before {content: '';border:none;width:0px;height: 0px;}
/deep/ .el-input__inner {
  border: none;
  // padding-left: 20px;
}
</style>
