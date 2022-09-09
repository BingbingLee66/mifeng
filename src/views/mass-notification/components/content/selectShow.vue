<template>
  <div class="select" @click="selectEmit">
    <span v-if="onlyShow">已选{{ num }}人</span>
    <span v-else class="select-text"> 请选择</span>
    <el-button v-if="onlyShow" class="btn" type="primary" size="mini" plain>{{ btnText }}</el-button>
    <i v-else class="el-icon-arrow-down" />
  </div>
</template>

<script>
export default {
  name: 'SelectShow',
  props: {
    num: {
      type: Number,
      default: 0
    },
    // 是否只展示 ,为false显示输入框样式
    onlyShow: {
      type: Boolean,
      default: true
    },
    // 按钮文本
    btnText: {
      type: String,
      default: '查看'
    }
  },
  methods: {
    selectEmit() {
      let emit = ''

      // 查看事件
      if (this.btnText === '查看') { emit = 'showDialog' }
      // 去选择事件
      if (this.btnText === '去选择') { emit = 'selectEmit' }
      // 点击事件
      if (!this.onlyShow) { emit = 'clickItem' }
      console
      this.$emit(emit)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.select {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 40px;
  width: 500px;
  padding: 0px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.select-text{
    color: #c0c4cc;
}
</style>
