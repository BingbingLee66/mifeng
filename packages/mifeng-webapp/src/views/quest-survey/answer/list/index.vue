<template>
  <Panel>
    <div class="answer-title">{{ answersTitle }}</div>
    <a-tabs v-model:activeKey="compName">
      <a-tab-pane key="OverView" tab="统计&分析"></a-tab-pane>
      <a-tab-pane key="LookOver" tab="查看下载答卷"></a-tab-pane>
    </a-tabs>
    <component :is="components.get(compName)" @getTitle="getTitle"></component>
  </Panel>
</template>

<script setup>
import { defineAsyncComponent, ref, markRaw } from 'vue'
const components = ref(new Map())
components.value.set('OverView', markRaw(defineAsyncComponent(() => import('./OverView.vue'))))
components.value.set('LookOver', markRaw(defineAsyncComponent(() => import('./LookOver.vue'))))
const compName = ref('OverView')
const answersTitle = ref('')
const getTitle = e => (answersTitle.value = e)
</script>

<style lang="scss" scoped>
.answer-title {
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #222222;
  &::before {
    content: '';
    display: block;
    width: 4px;
    background: #f4c820;
    height: 16px;
    margin-right: 10px;
  }
}
</style>
