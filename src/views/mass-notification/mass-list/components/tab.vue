<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
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
  },
  data() {
    return {
      activeName: null
    }
  },
  created() {
    this.activeName = this.tabList.length > 0 ? this.tabList[0].name : null
    this.handleClick({ name: this.activeName })
  },
  methods: {
    handleClick(tab) {
      this.$emit('handleClick', tab.name)
    }
  }
}
</script>

<style ></style>
