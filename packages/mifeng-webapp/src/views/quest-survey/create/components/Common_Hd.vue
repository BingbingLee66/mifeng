<template>
  <div class="hd">
    <!-- <span>{{ $attrs.disable }}</span> -->
    <!-- 上传文件分为 图片和文件两种 -->
    <div class="flex-x-0-center hd-title">
      <img :src="required" v-if="$attrs.item.required" class="require" />
      <span v-if="$attrs.item.componentKey === COMPONENT_KEY.UPLOAD_FILE" class="components-type">
        <span>【{{ FILE_TYPE_MAP.get($attrs.item.componentType) }}】</span>
      </span>
      <span v-else class="components-type">【{{ COMPONENT_KEY_MAP.get($attrs.item.componentKey) }}】</span>
      <span class="title">{{ $attrs.index + 1 }}. </span>
      <a-input v-model:value="$attrs.item.title" :disabled="$attrs.item.isDisable" :maxlength="30"></a-input>
    </div>
  </div>
</template>
<script>
import { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP } from '../constant/index'
export default {
  data() {
    return { COMPONENT_KEY, COMPONENT_KEY_MAP, FILE_TYPE_MAP, required: require('@/assets/imgs/img/required.png') }
  }
}
</script>
<style lang="scss" scoped>
// /deep/.el-input{
//   display: inline-block;
// }
.ant-input {
  padding-left: 4px;
  border: none;
  font-weight: 500;
  color: #222222;
}
.hd-title:hover .ant-input {
  box-shadow: 0 0 0 2px rgb(244 200 32 / 20%);
}
.hd {
  margin-bottom: 15px;
}
.require {
  width: 10px;
  height: 10px;
}
.title {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #222222;
}
.components-type {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #00000040;
  flex-shrink: 0;
}
</style>
