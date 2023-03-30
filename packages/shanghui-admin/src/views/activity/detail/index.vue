<template>
  <ActivityDetail :activityId="activityId"></ActivityDetail>
</template>
<script setup>
import ActivityDetail from '@business/components/src/activity/ActivityDetail.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const activityId = route.query.activityId || ''
</script>
<style lang="scss" scoped></style>
