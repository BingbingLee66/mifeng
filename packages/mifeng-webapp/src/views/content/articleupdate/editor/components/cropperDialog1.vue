<template>
  aadddddddddddddddd
  <div style="width: 300px; height: 300px">
    <vueCropper
      ref="cropper"
      :img="option.img"
      :output-size="option.size"
      :output-type="option.outputType"
      :info="true"
      :full="option.full"
      :can-move="option.canMove"
      :can-move-box="option.canMoveBox"
      :fixed-box="option.fixedBox"
      :original="option.original"
      :auto-crop="option.autoCrop"
      @realTime="realTime"
      mode="cover"
    ></vueCropper>
  </div>
  <div>
    <div class="show-preview" :style="previewsStyle">
      <div :style="previews.div">
        <img :src="previews.url" :style="previews.img" />
      </div>
    </div>
  </div>
</template>
<script setup>
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { reactive, ref } from 'vue'
const option = reactive({
  // 裁剪生成图片的质量
  outputSize: 1,
  outputType: 'jpg',
  // 图片是否允许滚轮缩放
  canScale: false,
  // 上传图片是否可以移动
  canMove: false,
  img: 'https://avatars2.githubusercontent.com/u/15681693?s=460&v=4',
  // 是否输出原图比例的截图
  size: 1,
  full: true,
  // 截图框能否拖动
  canMoveBox: true,
  // 是否默认生成截图框
  autoCrop: true,
  // 只有自动截图开启 宽度高度才生效
  autoCropWidth: 160,
  autoCropHeight: 150,
  centerBox: false,
  high: true,
  max: 99999
})
// 预览对象
const previews = ref({})
// 预览样式
let previewsStyle = reactive({})
const realTime = data => {
  previews.value = data
  previewsStyle = {
    width: previews.value.w + 'px',
    height: previews.value.h + 'px',
    overflow: 'hidden',
    margin: '0',
    zoom: 0.5
  }
}
</script>
