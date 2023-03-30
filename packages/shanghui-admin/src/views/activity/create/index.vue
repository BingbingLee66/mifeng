<template>
  <ActivityCreate>
    <template #baseInfoItem="{ formState }">
      <a-form-item label="活动介绍：" class="upload-style">
        <WangEditor v-model:content="formState.introduce" />
      </a-form-item>
    </template>
  </ActivityCreate>
</template>
<script setup>
import ActivityCreate from '@business/components/src/activity/create/ActivityCreate.vue'
import WangEditor from '@/components/wangeditor/WangEditor.vue'
</script>
<style lang="scss" scoped></style>
