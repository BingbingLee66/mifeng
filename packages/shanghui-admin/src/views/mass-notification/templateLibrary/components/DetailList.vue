<template>
  <div v-for="item in list" :key="item.id" class="flex">
    <div class="w-20 mb-3 font-bold flex-shrink-0">{{ item.label }}</div>
    <div v-html="item.value"></div>
  </div>
</template>
<script setup>
defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
</script>
