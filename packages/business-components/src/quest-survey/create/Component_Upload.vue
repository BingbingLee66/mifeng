<template>
  <div>
    <hd v-bind="$attrs" />
    <div class="tips">
      <div
        v-for="(item, index) in UPLOAD_MAP.get($attrs.item.componentKey)"
        :key="index"
        class="tips-item"
      >
        {{ item }}
      </div>
    </div>
    <a-upload
      class="avatar-uploader"
      action="/"
      list-type="picture-card"
      disabled
    >
      <plus-outlined></plus-outlined>
    </a-upload>
  </div>
</template>
<script>
import { UPLOAD_MAP } from '@business/common/src/quest-survey/create/index'
import hd from './Common_Hd.vue'
export default {
  components: {
    hd,
  },
  data() {
    return {
      radio: '',
      input: '',
      UPLOAD_MAP,
    }
  },
}
</script>
<style lang="scss" scoped>
.tips {
  color: #b2b2b2;
  font-weight: 400;
  font-size: 13px;
}
.tips-item {
  margin-bottom: 5px;
}
</style>
