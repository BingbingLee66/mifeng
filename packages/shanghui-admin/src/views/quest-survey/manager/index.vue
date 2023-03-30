<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" class="bg-white pl-8">
      <a-tab-pane :key="item.key" :tab="item.tab" v-for="item in componentList" />
    </a-tabs>
    <component :is="activeKey" />
  </div>
</template>
<script>
import { defineAsyncComponent, defineComponent, shallowRef } from 'vue'
export default defineComponent({
  components: {
    PlatformQuestionnaire: defineAsyncComponent(() => import('../components/PlatformQuestionnaire.vue')),
    ChamberQuestionnaire: defineAsyncComponent(() => import('../components/ChamberQuestionnaire.vue'))
  },
  props: {},
  emits: {},
  setup() {
    const activeKey = shallowRef('PlatformQuestionnaire')
    return {
      activeKey,
      componentList: [
        {
          key: 'PlatformQuestionnaire',
          tab: '平台问卷'
        },
        {
          key: 'ChamberQuestionnaire',
          tab: '商协会问卷'
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
//
</style>
