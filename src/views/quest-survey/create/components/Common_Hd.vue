<template>
  <div class="flex-x-0-center">
    <!-- <span>{{ $attrs }}</span> -->
    <span class="require">*</span>
    <span class="title">{{ $attrs.index }}. {{ $attrs.item.title }}</span>
    <!-- 上传文件分为 图片和文件两种 -->
    <div class="components-type">
      <span v-if="$attrs.item.componentKey === COMPONENT_KEY.UPLOAD_FILE">
        <span>{{ FILE_TYPE_MAP.get($attrs.item.componentType) }}</span>
      </span>
      <span v-else>{{ COMPONENT_KEY_MAP.get($attrs.item.componentKey) }}</span>
    </div>
  </div>
</template>
<script>
import { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP } from '../constant/index'
export default {
  data() {
    return { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP }
  }
}
</script>
<style lang="scss" scoped>
.require {
  color: #d9001b;
}
.title {
  font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC', sans-serif;
  font-weight: 650;
  font-style: normal;
  font-size: 16px;
}
.components-type {
  border: 1px solid #5b5454;
  border-radius: 20px;
  padding: 3px 6px;
  color: #000000;
  font-size: 13px;
  margin-left: 5px;
}
</style>
