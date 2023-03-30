<template>
  <AModal @cancel="close" @ok="close" title="数据定义" v-model:visible="visible">
    <span>
      <div v-for="item in statistics" :key="item.id" class="statistics-item">
        <div class="title">{{ item.title }}</div>
        <div>{{ item.content }}</div>
      </div>
    </span>
  </AModal>
</template>

<script setup>
import { statisticsList } from '../constant'
import { defineProps, defineEmits, computed } from 'vue'
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})
const $emit = defineEmits(['update:dialogVisible'])
const close = () => {
  $emit('update:dialogVisible', false)
}
const visible = computed({
  set: value => {
    $emit('update:dialogVisible', value)
  },
  get: () => {
    return props.dialogVisible
  }
})
const statistics = statisticsList
</script>

<style lang="scss" scoped>
.statistics-item {
  margin-bottom: 24px;
  .title {
    margin-bottom: 4px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
