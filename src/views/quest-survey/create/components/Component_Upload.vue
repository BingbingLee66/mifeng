<template>
  <div>
    <hd v-bind="$attrs" />
    <div class="tips">
      <div v-for="(item,index) in UPLOAD_MAP.get($attrs.item.componentKey)" :key="index" class="tips-item">{{ item }}</div>
    </div>
    <el-upload
      class="avatar-uploader"
      action="/"
      list-type="picture-card"
      disabled
    >
      <i class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>
<script>
import { UPLOAD_MAP } from '../constant/index'
export default {
  components: {
    hd: () => import('./Common_Hd.vue')
  },
  data() {
    return {
      radio: '', input: '', UPLOAD_MAP
    }
  },

}
</script>
<style lang="scss" scoped>
.tips{
  color: #B2B2B2;
  font-weight: 400;
    font-size: 13px;
}
.tips-item{
  margin-bottom: 5px;
}
</style>
