<template>
  <div class="container">
    <el-tabs v-model="clientType" type="border-card">
      <el-tab-pane label="小程序" name="wechat">
        <tab-content v-if="clientType === 'wechat'" client-type="0" />
      </el-tab-pane>
      <el-tab-pane label="APP" name="app">
        <h3 class="text-center">此功能暂未开放</h3>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabContent from './TabContent/index'
export default {
  components: {
    TabContent
  },
  data() {
    return {
      clientType: 'wechat'
    }
  }
}
</script>
