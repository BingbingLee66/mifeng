<template>
  <div>
    <hd v-bind="$attrs" />
    <div v-for="(item, index) in $attrs.item.selectItem" :key="index" class="flex-x-0-center">
      <el-input v-model="item.value" placeholder="选项" maxlength="30" class="my-input">
      <!-- <div class="circle" />
      <div class="item-text">{{ item.label }}</div> -->

      </el-input></div>
  </div>
</template>
<script>
export default {
  components: {
    hd: () => import('./Common_Hd.vue')
  },
  props: {
    // item: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // },
    // index: { type: Number, require }
  },
  data() {
    return { radio: '' }
  }
}
</script>
<style lang="scss" scoped>
 .circle{
  border: 1px solid #DCDFE6;
  width: 14px;
  height: 14px;
  background-color: #FFF;
  border-radius: 50%;
 }
 .item-text{
  padding-left: 10px;
  color: #606266;
  font-size: 14px;
 }
 .my-input:before{
      content:'';
      display: block;
      width: 14px;
  height: 14px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
      background-color: #FFF;
      border: 1px solid #DCDFE6;
      border-radius: 50%;
     padding-left: 14px;
    //  margin-left: 14px;
    }
    /deep/ .el-input__inner{
      border: none;
      padding-left: 20px;
    }

</style>
