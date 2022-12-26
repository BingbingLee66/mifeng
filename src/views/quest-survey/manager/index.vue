<template>
  <div style="padding:20px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="平台问卷" name="PlatformQuestionnaire" />
      <el-tab-pane label="商协会问卷" name="ChamberQuestionnaire" />
    </el-tabs>
    <component :is="activeName" />
  </div>
</template>

<script>

export default {
  components: {
    PlatformQuestionnaire: () => import('./components/PlatformQuestionnaire'),
    ChamberQuestionnaire: () => import('./components/ChamberQuestionnaire')
  },
  props: {},
  data() {
    return {
      activeName: 'PlatformQuestionnaire'
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
//
</style>
