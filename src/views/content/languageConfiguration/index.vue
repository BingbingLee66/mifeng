<template>
  <div class="app-container">
    <el-tabs v-model="tabsIndex" @tab-click="handleTabsChange">
      <el-tab-pane label="打招呼" name="0" />
      <el-tab-pane label="快捷回复" name="1" />
      <el-tab-pane label="常用语" name="2" />
      <el-tab-pane label="场景列表" name="3" />
    </el-tabs>
    <el-button type="primary" @click="add">{{ btnTitle[tabsIndex] }}</el-button>

    <!-- 弹框 -->
    <addPop ref="addPops" :tabs-index="tabsIndex" :title="btnTitle[tabsIndex]" />
  </div>
</template>

<script>
import addPop from './component/add-pop'
export default {
  components: { addPop },
  data() {
    return {
      tabsIndex: '0', // 头部栏索引
      btnTitle: ['新增打招呼语言', '新增快捷回复', '新增常用语', '新增场景']
    }
  },

  async created() {

  },
  methods: {
    handleTabsChange() {

    },
    // 点击新增弹框
    add() {
      this.$refs.addPops.show()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
