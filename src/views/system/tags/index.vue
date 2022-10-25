<template>
  <div class="p-tags-index app-container">
    <el-row>
      <el-radio-group v-model="activieyTab">
        <el-radio-button label="supply">供需标签</el-radio-button>
        <el-radio-button label="member">会员标签</el-radio-button>
      </el-radio-group>
    </el-row>
    <!-- 供需标签 -->
    <div v-if="activieyTab === 'supply'">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="tab in tabList"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        />
      </el-tabs>
      <component :is="activeName" />
    </div>
    <!-- 会员标签 -->
    <div v-if="activieyTab === 'member'">
      <member-label />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    TagSetting: () => import('./components/TagSetting'),
    UserCustom: () => import('./components/UserCustom'),
    memberLabel: () => import('./member-label/member-label'),
  },
  data() {
    return {
      activieyTab: 'supply',
      activeName: 'TagSetting',
      tabList: [
        { name: 'TagSetting', label: '标签设置' },
        { name: 'UserCustom', label: '用户自定义' },
      ],
    }
  },
}
</script>

<style></style>
