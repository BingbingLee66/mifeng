<template>
  <a-tabs v-model:activeKey="clientType" class="bg-white pl-8">
    <a-tab-pane :key="TAB_TYPE.MASS" tab="群发管理" />
    <a-tab-pane :key="TAB_TYPE.TEMPLATE" tab="模板设置" />
  </a-tabs>
  <component :is="clientType" :chambersOptions="chambersOptions" />
</template>
<script>
import { ref, defineAsyncComponent } from 'vue'
import { distributionChambers } from '@business/common/src/mass-notification/api/index'
export default {
  components: {
    Mass: defineAsyncComponent(() => import('./components/Mass.vue')),
    Template: defineAsyncComponent(() => import('./components/Template.vue'))
  },
  setup() {
    const clientType = ref('Mass')
    const TAB_TYPE = {
      MASS: 'Mass',
      TEMPLATE: 'Template'
    }
    const chambersOptions = ref([])
    const queryChambersOptions = async () => {
      const { data } = await distributionChambers()
      chambersOptions.value = data
    }

    queryChambersOptions()
    return {
      clientType,
      TAB_TYPE,
      chambersOptions
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
