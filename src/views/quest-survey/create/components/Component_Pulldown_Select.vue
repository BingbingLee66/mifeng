<template>
  <div>
    <hd v-bind="$attrs" />
    <!-- <el-select v-model="value" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select> -->
    <div v-if="$attrs.item.componentKey === COMPONENT_KEY.PROVINCE_CITY_AREA">
      <img :src="area" class="area">
    </div>
    <template v-else>
      <div class="my-select flex-x-between-center">
        <span class="select-text">请选择</span>
        <span class="el-icon-arrow-down" />
      </div>
      <div class="select-val">
        <div v-for="(item,index) in $attrs.item.selectItem" :key="index" class="select-val-item flex-x-between-center">
          <el-input v-model="item.value" :disabled="!!(item.otherItems===1 || item.isDisable)" placeholder="选项" maxlength="30" />
          <span class="del" @click="delSelectItem(index)">删除</span>
        </div>
        <span style="color: #328ffe" @click="addSelectItem">添加选项</span>
      </div>
    </template>

    <!-- <div v-for="(item, index) in $attrs.item.selectItem" :key="index">
      <el-radio v-model="radio" label="1">{{ item.label }}</el-radio>
    </div> -->
  </div>
</template>
<script>
import { COMPONENT_KEY } from '../constant/index'
export default {
  components: {
    hd: () => import('./Common_Hd.vue')
  },
  data() {
    return {
      radio: '',
      COMPONENT_KEY,
      area: require('@/assets/img/area.png'),
    }
  },
  methods: {
    addSelectItem() {
      this.$emit('addSelectItem')
    },
    delSelectItem(item) {
      this.$emit('delSelectItem', { index: this.$attrs.index, item })
    }
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
.area{
  width: 300px;
}
.select-val {
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  padding: 10px 10px 10px;
  font-size: 13px;
}

.del {
  color: #d9001b;
  display: none;
  margin-left: 5px;
  flex-shrink: 0;
}
.select-val-item:hover .del{
  display: inline-block;
}
.select-val-item:hover /deep/ .el-input__inner{
  border: 1px solid #dcdfe6;
  padding: 2px;
}
/deep/ .el-input.is-disabled{
  background-color:#fff
}
/deep/ .el-input__inner {
  border: none;
  display: inline-block;
  padding: 2px;
  background-color:#fff
  // padding-left: 20px;
}
// .pull-down-select{

// }
</style>
