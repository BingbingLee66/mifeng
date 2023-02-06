<template>
  <a-tabs v-model:activeKey="compName" class="bg-white pl-8">
    <a-tab-pane key="AccountInfo" tab="账户信息"></a-tab-pane>
    <a-tab-pane key="MemberLabel" tab="会员标签"></a-tab-pane>
    <a-tab-pane key="DemandLabel" tab="供需标签"></a-tab-pane>
    <a-tab-pane key="TradeLabel" tab="行业标签"></a-tab-pane>
  </a-tabs>
  <component :is="components.get(compName)"></component>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, markRaw } from 'vue'
export default defineComponent({
  setup() {
    const components = ref(new Map())
    components.value.set('AccountInfo', markRaw(defineAsyncComponent(() => import('./AccountInfo.vue'))))
    components.value.set('MemberLabel', markRaw(defineAsyncComponent(() => import('./MemberLabel.vue'))))
    components.value.set('DemandLabel', markRaw(defineAsyncComponent(() => import('./DemandLabel.vue'))))
    components.value.set('TradeLabel', markRaw(defineAsyncComponent(() => import('./TradeLabel.vue'))))
    const compName = ref('AccountInfo')
    return {
      components,
      compName
    }
  }
})
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
