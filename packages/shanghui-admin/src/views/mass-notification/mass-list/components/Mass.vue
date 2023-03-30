<template>
  <MassListDialog :chambersOptions="props.chambersOptions" />
</template>
<script setup>
import { defineAsyncComponent } from 'vue'
const MassListDialog = defineAsyncComponent(() =>
  import('@business/components/src/mass-notification/mass-list/index.vue')
)
const props = defineProps({
  chambersOptions: {
    type: Array,
    default: () => []
  }
})
</script>
