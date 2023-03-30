<template>
  <div>
    <div class="show-preview" :style="previewsStyle">
      <div :style="previews.div">
        <img :src="previews.url" :style="previews.img" />
      </div>
    </div>
  </div>
</template>
<script setup>
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { reactive, ref, watch } from "vue";
const props = defineProps({
  //裁剪区域外部样式宽高
  containersStyle: {
    type: Object,
    default: () => {
      return {
        width: 500,
        height: 500,
      };
    },
  },
  optionCropper: {
    default: () => {
      return {};
    },
  },
  fixedNumber:{
    type:Array
  }
});
const { width, height } = props.containersStyle;

</script>
