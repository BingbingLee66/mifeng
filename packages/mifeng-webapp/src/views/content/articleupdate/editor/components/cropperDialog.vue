<template>
  <a-modal v-model:visible="visible" wrap-class-name="full-modal" width="624px" title="选择图片" @ok="handleOk">
    <div>
      <a-steps class="steps" :current="current" @change="stepChange">
        <a-step title="从正文选择封面" />
        <a-step title="编辑封面" />
      </a-steps>

      <div v-if="current === 0">
        <div class="tips">
          {{ coverList.length > 0 ? '请从正文插入的图片或视频封面中选择' : '正文中无图片或视频封面' }}
        </div>
        <div class="flex-x cover-container" v-if="coverList.length > 0">
          <div @click="setCurrentImg(item)" v-for="(item, index) in coverList" :key="index" style="position: relative">
            <img class="cover-img" :src="item" />
            <div class="mask" v-if="currentImg === item">
              <img class="select" :src="selectImg" />
            </div>
          </div>
          <a-button v-if="hasNextPage && !current && !props.content" @click="getMore">加载更多</a-button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex-x-center">
        <div v-if="!current">
          <a-button type="primary" @click="handleCancel" :disabled="!currentImg">下一步</a-button>
        </div>
        <div v-else>
          <a-button type="primary" @click="handleCancel" v-if="!props.ifReCropperImg">上一步</a-button>
          <a-button type="primary" @click="saveCropperImg">完成</a-button>
        </div>
      </div>
    </template>
    <div v-if="current === 1">
      <div class="cropper">
        <Cropper
          @previewTime="previewTime"
          ref="myCropper"
          @updateImg="updateImg"
          :optionCropper="optionCropper"
          :containersStyle="containersStyle"
        ></Cropper>
        <!-- <Cropper v-if="size === 2" :optionCropper="optionCropper2" :containersStyle="containersStyle"></Cropper> -->
      </div>
      <div class="size-tips">可按各个尺寸裁剪</div>
      <a-radio-group v-model:value="size" @change="sizeChange">
        <a-radio :value="1">图文封面（1:1）</a-radio>
        <a-radio :value="2">图文封面（2.35:1）</a-radio>
      </a-radio-group>
      <div class="size-tips" style="margin-bottom: 0px">封面预览</div>
      <div v-for="(val, key) in previewsList" :key="key">
        <div style="margin: 17px 0px 20px 0px">
          <div class="title">{{ val.title }}</div>
          <div class="title msg">{{ val.msg }}</div>
        </div>

        <div class="show-preview" :style="val.previewsStyle">
          <div :style="val.previewsStyle.div">
            <img :src="val.previews.url" :style="val.previews.img" v-if="val.previews.url" />
            <img :src="optionCropper.img" :style="val.previewsStyle" v-else />
          </div>
        </div>
      </div>

      <!-- <div class="show-preview" :style="val.previewsStyle" v-for="(val, key) in previewsList" :key="key">
        <img :src="previews.url" :style="previews.img" />
      </div> -->
      <!-- <div class="show-preview" :style="val.previewsStyle" v-for="(val, key) in previewsList" :key="key">
        <img :src="val.previews.url" :style="val.previews.img" />
      </div> -->
    </div>
  </a-modal>
</template>
<script setup>
import { ref, computed, watch, reactive } from 'vue'
import Cropper from '@business/components/src/cropper/Cropper'
import { uploadCoverImg, textImages, updateWeChatCover } from '@/api/content/article'
const selectImg = require('@/assets/imgs/img/select.png')
const current = ref(0)
const currentImg = ref()
const size = ref(1)
const myCropper = ref()
const query = reactive({
  pageNum: 1,
  pageSize: 8
})
const hasNextPage = ref(true)
const previewsList = reactive({
  1: {
    previewsStyle: {},
    previews: {},
    title: '图文封面（1:1）',
    msg: '你的用户将在转发的链接卡片上看到此封面。'
  },
  2: {
    previewsStyle: {
      width: '540.375px',
      height: '229.947px',
      zoom: 0.5
    },
    previews: {},
    title: '图文封面（2.35:1）',
    msg: '你的用户将在订阅号消息列表和内容推荐里看到此封面。'
  }
})
const props = defineProps(['dialogVisible', 'ifReCropperImg', 'currentArticleId', 'content', 'current'])
const $emit = defineEmits(['update:dialogVisible', 'updateCover'])
// // 是否重新裁剪
// const ifReCropper = ref(props.ifReCropperImg)
const visible = computed({
  set: value => {
    $emit('update:dialogVisible', value)
  },
  get: () => {
    return props.dialogVisible
  }
})
const pagination = computed(() => {
  return {
    pageNum: query.pageNum,
    pageSize: query.pageSize
  }
})

// 监听visible
watch(
  () => props.dialogVisible,
  newVal => {
    if (newVal) {
      if (!props.ifReCropperImg) {
        props.current ? contentReplace() : textImagesFunc()
      }
    } else {
      // 清空数据
      coverList.value = []
      query.pageNum = 1
      previewsList[1].previews = {}
      previewsList[2].previews = {}
    }
  }
)
watch(currentImg, newVal => {
  optionCropper.value.img = newVal
})

// 裁剪相关外部容器样式
const containersStyle = {
  width: 552,
  height: 307
}
const optionCropper = ref({
  fixedBox: false,
  // fixedNumber: [3, 4],
  // autoCrop: true,
  fixed: true,
  canMove: false,
  canScale: false,
  img: 'https://ysh-cdn.kaidicloud.com/prod/bee/commons/logo2.png'
})

// // 预览对象
const previews = ref({})
// 预览样式
// let previewsStyle = reactive({})
const previewTime = data => {
  previews.value = data
  // previewsStyle = {
  //   width: previews.value.w + 'px',
  //   height: previews.value.h + 'px',
  //   overflow: 'hidden',
  //   margin: '0',
  //   zoom: 0.5
  // }
  previewsList[size.value].previewsStyle = {
    width: data.w + 'px',
    height: data.h + 'px',
    overflow: 'hidden',
    margin: '0',
    zoom: 0.5
  }
  previewsList[size.value].previews = data
}

const stepChange = i => {
  // 判断是否有图片列表，没有不进行下一步
  if (i === 1 && !currentImg.value) return
  if (props.ifReCropperImg) return
  setStep(i)
}
const setStep = i => {
  current.value = i
}
const handleCancel = () => {
  current.value = +!current.value
  if (current.value === 1) {
    optionCropper.value.img = currentImg.value
  }
}
const setCurrentImg = i => {
  currentImg.value = i
}
const sizeChange = val => {
  const {
    target: { value }
  } = val
  size.value = value
  if (size.value === 1) {
    optionCropper.value.fixedNumber = [1, 1]
  } else if (size.value === 2) {
    optionCropper.value.fixedNumber = [2.35, 1]
  }
}
// 拉取正文的图片
const coverList = ref([])
const textImagesFunc = async () => {
  const params = {
    articleId: props.currentArticleId,
    ...pagination.value
  }
  const {
    data: { list, totalPages, page }
  } = await textImages(params)
  coverList.value = coverList.value.concat(list)
  currentImg.value = coverList.value[0] ?? ''
  if (totalPages > page) {
    hasNextPage.value = true
  } else {
    hasNextPage.value = false
  }
}
const getMore = () => {
  query.pageNum += 1
  textImagesFunc()
}

// 父子组件交互方法
const updateImg = val => {
  const files = blobToFile(val)
  uploadCover(files)
}
// 保存截图
const saveCropperImg = () => {
  // const blob =
  myCropper.value.getCropperImg()
  // console.log('blob', blob)
  // // 这里返回的是blob格式，后端需要file,所以转一下
  // const files = new File([blob], 'aaa', { type: 'png', lastModifiedL: Date.now() })
  // // console.log('myCropper', myCropper.value.getCropperImg())
  // uploadCover(files)
}
const uploadCover = async files => {
  const formData = new FormData()
  formData.append('file', files)
  const {
    data: { filePath }
  } = await uploadCoverImg(formData)
  if (!props.current) {
    updateWeChat(null, filePath)
  } else {
    $emit('updateCover', filePath)
    visible.value = false
  }
}
// 更新文章封面
const updateWeChat = async (currentArticleId = null, wechatCover) => {
  const params = {
    articleId: currentArticleId || props.currentArticleId,
    wechatCover
  }
  await updateWeChatCover(params)
  // 向父组件发出事件去修改封面
  $emit('updateCover', wechatCover)
  visible.value = false
}
// 重新裁剪
const reCropperImg = img => {
  console.log('img', img)
  current.value = 1
  optionCropper.value.img = img
}

// 工具函数 将bolb转成file
const blobToFile = blob => {
  const files = new File([blob], '截图.png', { type: 'image/png', lastModifiedL: Date.now() })
  return files
}
const contentReplace = () => {
  const arr = []
  props.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
    arr.push(capture)
  })
  coverList.value = arr
  currentImg.value = arr[0] ?? ''
}

defineExpose({
  updateWeChat,
  reCropperImg,
  setStep
})
</script>
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
  }
  .ant-modal-content {
    max-height: 1000px !important;
    overflow-y: scroll;
  }
}

// .ant-modal {
//   > :deep(.ant-modal-content) {
//     max-height: 1000px;
//   }
// }
// ::v-deep .ant-modal-content {
//   max-height: 1000px;
// }
.tips {
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 24px 0px 20px 0px;
}
.steps {
  padding: 0px 98px;
}
.cover-container {
  flex-wrap: wrap;

  .cover-img {
    width: 86px;
    height: 86px;
    border-radius: 5px;
    margin-right: 8px;
    margin: 0px 7px 8px 0px;
    z-index: 1;
  }
  .select {
    width: 22px;
    height: 22px;
    position: absolute;
    right: 0px;
    top: 0px;
  }
  .mask {
    position: absolute;
    background: rgba(0, 0, 0, 0.65);
    width: 86px;
    height: 86px;
    border-radius: 5px;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
.cover-select {
  position: absolute;
}
.cropper {
  margin: 24px 0px;
}
.size-tips {
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 24px 0px 16px 0px;
}
.title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  font-family: PingFangSC-Semibold, PingFang SC;
  color: rgba(0, 0, 0, 0.65);
}
.msg {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
}
</style>
