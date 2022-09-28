<template>
  <div>
    <el-tabs v-model="activeName" :type="type" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabList" :key="item.name" :label="item.label" :name="item.name" />
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    tabList: {
      type: Array,
      default() { return [] }
    },
    // 类型
    type: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      activeName: null
    }
  },
  created() {
    // this.activeName = this.tabList.length > 0 ? this.tabList[0].name : null
    // this.handleClick({ name: this.activeName })
  },
  methods: {
    handleClick(tab) {
      this.$emit('handleClick', tab.name)
    },
    setCurrentTab(val) {
      console.log('设置tab', val)
      this.activeName = val
    }
  }
}
</script>

<style ></style>
