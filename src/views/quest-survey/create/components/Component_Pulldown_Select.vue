<template>
  <div>
    <hd v-bind="$attrs" />
    <!-- <el-select v-model="value" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select> -->
    <div class="my-select flex-x-between-center">
      <span class="select-text">请选择</span>
      <span class="el-icon-arrow-down" />
    </div>
    <div class="select-val">
      <div v-for="item in $attrs.item.selectItem" :key="item.id" class="select-val-item">
        <el-input v-model="item.value" placeholder="选项" maxlength="30" /><span class="del">删除</span></div>
      <span style="color: #328ffe;" @click="addSelectItem">添加选项</span>
    </div>
    <!-- <div v-for="(item, index) in $attrs.item.selectItem" :key="index">
      <el-radio v-model="radio" label="1">{{ item.label }}</el-radio>
    </div> -->
  </div>
</template>
<script>
export default {
  components: {
    hd: () => import('./Common_Hd.vue')
  },
  data() {
    return {
      radio: ''
    }
  },
  methods: {
    addSelectItem() { this.$emit('addSelectItem', this.$attrs.item.id) }
  }
}
</script>
<style lang="scss" scoped>
.my-select {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding: 0 15px;
  .select-text {
    color: #ccc4d6;
    font-size: 13px;
  }

}
.select-val{
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  padding: 0px 10px 10px;
  font-size: 13px;
}
.del {
    color: #d9001b;

  }

/deep/ .el-input__inner ,.el-input{
  border: none;
  min-width: 38px;
  max-width: 100px;
  padding: 0;
  // padding-left: 20px;
}
// .pull-down-select{

// }
</style>
