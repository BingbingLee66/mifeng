<template>
  <a-tabs v-model:activeKey="activeKey" class="bg-white pl-8" @change="changeTab">
    <a-tab-pane v-for="(item, index) in tabList" :key="index" :tab="item.name" />
  </a-tabs>
  <component :is="currentTab.tabCom" />
</template>

<script setup>
import { ref, markRaw, reactive } from 'vue'
import chamberSigned from './chamber-signed.vue'
import chamberUnsigned from './chamber-unsigned.vue'

const activeKey = ref(0)
const tabList = reactive([
  { name: '已签约', comp: markRaw(chamberSigned) },
  { name: '未签约', comp: markRaw(chamberUnsigned) }
])
const currentTab = reactive({
  tabCom: tabList[0].comp
})
const changeTab = () => {
  currentTab.tabCom = tabList[activeKey.value].comp
}
</script>

<style scoped></style>
