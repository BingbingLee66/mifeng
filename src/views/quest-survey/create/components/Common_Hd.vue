<template>
  <div class=" hd">
    <!-- <span>{{ $attrs }}</span> -->
    <!-- 上传文件分为 图片和文件两种 -->

    <span v-if="$attrs.item.componentKey === COMPONENT_KEY.UPLOAD_FILE" class="components-type">
      <span>{{ FILE_TYPE_MAP.get($attrs.item.componentType) }}</span>
    </span>
    <span v-else class="components-type">{{ COMPONENT_KEY_MAP.get($attrs.item.componentKey) }}</span>

    <div class="flex-x-0-center">
      <span v-if="$attrs.item.required" class="require">*</span>
      <span class="title">{{ $attrs.index }}. </span>
      <el-input v-model="$attrs.item.title" maxlength="30" placeholder="标题">ee</el-input>
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
/deep/.el-input{
  display: inline-block;
}
/deep/ .el-input__inner{
  padding-left: 0;
  border: none;
}
.hd {
  margin-bottom: 15px;
}
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
  display: inline-block;

}
</style>
