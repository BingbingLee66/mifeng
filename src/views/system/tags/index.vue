<template>
  <div class="p-tags-index app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label" :name="tab.name" />
    </el-tabs>
    <component :is="activeName" />

  </div>
</template>

<script>

export default {
  components: {
    TagSetting: () => import('./components/TagSetting'),
    UserCustom: () => import('./components/UserCustom')
  },
  data() {
    return {
      activeName: 'TagSetting',
      tabList: [
        { name: 'TagSetting', label: '标签设置' },
        { name: 'UserCustom', label: '用户自定义' }
      ]
    }
  },
}
</script>

<style></style>
