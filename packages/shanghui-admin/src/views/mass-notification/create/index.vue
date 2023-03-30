<template>
  <Create>
    <template #Preview5G="{ FiveG }">
      <Preview5G v-model:visible="FiveG.visible" :template-id="FiveG.id" />
    </template>
  </Create>
</template>

<script setup>
import Create from '@business/components/src/mass-notification/create/index.vue'
import Preview5G from '../5g/components/Preivew5G.vue'
</script>

<style lang="scss" scoped></style>
