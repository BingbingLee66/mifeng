<template>
  <div :style="`width:${width}px;height:${height}px;margin:0 auto`">
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
      :fixed-number="option.fixedNumber"
      :fixed="option.fixed"
      :auto-crop-width="option.autoCropWidth"
      :auto-crop-height="option.autoCropHeight"
      @realTime="realTime"
      :mode="option.mode"></vueCropper>
  </div>
  <div>
    <!-- <div class="show-preview" :style="previewsStyle">
      <div :style="previews.div">
        <img :src="previews.url" :style="previews.img" />
      </div>
    </div> -->
  </div>
</template>
<script setup>
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { reactive, ref, watch ,onMounted } from "vue";
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
//监听父组件img发生改变
const emit = defineEmits(['updateImg','previewTime'])
const { width, height } = props.containersStyle;
let option = reactive({
  // 裁剪生成图片的质量
  outputSize: 1,
  outputType: "jpg",
  // 图片是否允许滚轮缩放
  canScale: false,
  // 上传图片是否可以移动
  canMove: false,
  img: "https://avatars2.githubusercontent.com/u/15681693?s=460&v=4",
  // 是否输出原图比例的截图
  size: 1,
  full: true,
  // 截图框能否拖动
  canMoveBox: true,
  // 是否默认生成截图框
  autoCrop: true,
  // 只有自动截图开启 宽度高度才生效
  // autoCropWidth: 160,
  // autoCropHeight: 150,
  // 截图框是否被限制在图片里面
  centerBox: false,
  //图片渲染方式
  mode: "contain",
  //截图框的宽高比例
  fixedNumber: [1, 1],
  //固定截图框大小
  fixedBox: false,
  fixed: false,
  //父组件传过来的参数
  ...props.optionCropper,
});

//监听比例变化
watch(
  () => props.optionCropper.fixedNumber,
  (newVal) => {
    styleChange(newVal)
  }
)
watch(()=>props.optionCropper.img,(newVal)=>{
  option.img=newVal
})

// 预览对象
const previews = ref({});
// 预览样式
let previewsStyle = reactive({});
const realTime = (data) => {
  emit('previewTime',data)
  previews.value = data;
  // console.log(data)
  previewsStyle = {
    width: previews.value.w + "px",
    height: previews.value.h + "px",
    overflow: "hidden",
    margin: "0",
    // zoom: 0.5,
  };
};

//动态修改裁剪比例
const styleChange = (ratio = [1, 1]) => {
  const [w,h]=ratio
  option.fixedNumber = [w,h];
  option.autoCropWidth = props.containersStyle.width;
  option.autoCropHeight = Math.round((props.containersStyle.width * h) / w);
  console.log('autoCropWidth',option.autoCropWidth)
  console.log('autoCropHeight',option.autoCropHeight)

};
styleChange();
const cropper = ref()
//获取裁剪组件的实例
onMounted(() => {
  console.log('cropper',cropper.value);
});

//获取截图图片 blob格式
const getCropperImg= ()=>{
 cropper.value.getCropBlob(data=>{
  emit('updateImg', data)
 })

// const data= await cropper.value.getCropBlob()
// console.log('data',data)
}

// this.$refs.cropper.getCropBlob(data => {
//   // do something
//   console.log(data)  
// })
defineExpose({getCropperImg})
</script>
