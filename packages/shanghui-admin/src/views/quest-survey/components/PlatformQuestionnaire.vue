<template>
  <PlatformQuestion :inherited-columns="columns" />
</template>
<script setup>
import PlatformQuestion from '@business/components/src/quest-survey/PlatformQuestion.vue'
import { columns } from '@business/common/src/quest-survey/constant'
</script>
