<template>
  <div class="holiday-poster">
    <!--右侧模板-->
    <div class="poster-model">
      <div class="title">模块选择</div>
      <a-select
        ref="select"
        v-model:value="value1"
        style="width: 224px; height: 32px"
        :options="options1"
        @change="handleChange"
      ></a-select>
      <div class="imgs-wrap">
        <div class="imgs" v-for="item in postModelList" :key="item.id" @click="selectedModel(item)">
          <img class="model-img" :src="item.image" alt="" />
          <div :class="['mask', item.id === posterInfo.templateId ? 'masked' : '']">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <!--左侧海报-->
    <div class="poster">
      <div id="holidayPoster" class="img" ref="images" @mousewheel.prevent="rollImg">
        <div id="audioPlayDom" class="audio-play" @click="handleAudioPlay" v-if="isLanternModule">
          <img v-if="!audioPlay" :src="useImgUrl('ic_music_stop.png')" :style="{ 'animation-play-sate': animat }" />
          <img class="audio-play-start" v-else :src="useImgUrl('ic_music_start.png')" alt="" />
          <audio ref="audioRef" :src="posterInfo.defaultMusicUrl" autoplay loop></audio>
        </div>
        <div class="logo">
          <img class="logo-img" :src="logo" alt="" />
        </div>
        <div class="chamber-name">{{ userInfo.chambername }}</div>
        <div class="poster-container" ref="textContainer">
          <div
            v-drag
            class="text"
            @dblclick="changeInputStatus"
            :style="{ display: inputType && !isShowFontSize ? 'block' : 'none' }"
            v-html="posterInfo.value.replace(/\n/g, '<br>').replace(/\r\n/g, '<br>').replace(/\r/g, '<br>')"
          ></div>
          <textarea
            ref="textareaDom"
            :style="{ display: !inputType || isShowFontSize ? 'block' : 'none', resize: 'none' }"
            v-model="posterInfo.value"
            class="text-content"
            contenteditable="true"
            type="text"
          ></textarea>
        </div>
      </div>
      <div class="add-sub">
        <div class="wrap">
          <div class="sub" @click="scaleImg('-')">-</div>
          <div class="span">{{ parseInt(scaleImgNum * 200) }}%</div>
          <div class="add" @click="scaleImg('+')">+</div>
        </div>
      </div>
      <div v-if="isShowFontSize" ref="fontSizeSelectRef" class="change-font-size" @click="handleClickFontSizeChange">
        字体大小：
        <a-select
          ref="select"
          v-model:value="fontSizeValue"
          style="width: 100px; height: 32px"
          :options="fontSizeOptions"
        ></a-select>
      </div>
    </div>
  </div>
  <div class="poster-title">
    海报标题：<a-input
      class="input"
      v-model:value="posterInfo.title"
      show-count
      :maxlength="30"
      placeholder="添加海报"
    />
  </div>
  <!-- <div class="gift">
    <div class="gift__title">
      <span>平台大礼包：</span>
      <span class="gift__title--sub">我们为您准备了价值丰厚的平台电商大礼包，免费赠予会员</span>
    </div>
    <div>
      <img
        src="https://ysh-sh.oss-cn-shanghai.aliyuncs.com/test/bee/bg_poster_banner.png"
        style="width: 286px; height: 86px"
      />
    </div>
  </div> -->

  <div class="handler">
    <a-button style="margin: 0 10px" class="btn" @click="$router.push('/content/poster')">取消</a-button>
    <a-button type="primary" :loading="loading" class="mb-20 btn" @click="sharePoster">分享海报</a-button>
  </div>
</template>

<script setup>
import { useImgUrl } from '@/hooks/useImgUrl'
import { computed, defineProps, reactive, ref, createVNode, watchEffect, nextTick } from 'vue'
import { useStore } from 'vuex'
import { base64ToPNG } from '@/api/common'
import { createPoster, editPoster, getPosterDetail, posterModelList } from '@/api/content/poster'
import html2canvas from 'html2canvas'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { DataCollect } from '@/utils/data-collect'
import { RENDERER } from './Firework'
import useClickOutside from '@/use/useClickOutside'

const store = useStore()
const userInfo = computed(() => store.state.user)
const emit = defineEmits(['sharePoster'])
const props = defineProps({
  // 海报id
  posterId: {
    type: Number,
    required: true
  }
})

// html2canvas
const generatePictureByDomId = async domId => {
  const canvas = document.createElement('canvas')
  const imgContent = document.getElementById(domId)
  const width = imgContent.offsetWidth // 获取dom 宽度
  const height = imgContent.offsetHeight // 获取dom 高度
  canvas.width = width * 2
  canvas.height = height * 2
  canvas.style.width = width * 2 + 'px'
  canvas.style.height = width * 2 + 'px'
  const scale = 2 // 定义任意放大倍数 支持小数
  const context = canvas.getContext('2d')
  context.scale(scale, scale)
  const rect = imgContent.getBoundingClientRect() // 获取元素相对于视口的
  context.translate(-rect.left, -rect.top)
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
  const _canvas = await html2canvas(imgContent, {
    // 转换为图片
    scrollY: -scrollTop,
    scrollX: 0,
    useCORS: true, // 开启跨域
    scale // 处理模糊问题
    // width: 750, // 画布的宽
    // height: 1334, // 画布的高
  })

  return _canvas.toDataURL('image/png', 1)
}
// 模板背景图
const bgImg = ref(`url(${useImgUrl('holiday/new-years-eve01.jpg')}) no-repeat center / cover`)
// 商协会logo
const logo = userInfo.value.systemlogo || useImgUrl('chambername-logo.png')
// 分享按钮loading
const loading = ref(false)

// 图片缩放
const images = ref(null)
const scaleImgNum = ref(0.5)
const wheelDelta = ref(null)

/** 是否元宵节模块  */
const isLanternModule = ref(false)

const rollImg = e => {
  const { transform } = images.value.style
  let zoom = transform.indexOf('scale') !== -1 ? +transform.split('(')[1].split(')')[0] : 0.5
  zoom += e.wheelDelta / 1334
  wheelDelta.value = Math.abs(e.wheelDelta)
  if (zoom > 0.1 && zoom < 2) {
    console.log(zoom)
    scaleImgNum.value = zoom
    images.value.style.transform = 'scale(' + zoom + ')'
  }
}
const scaleImg = type => {
  wheelDelta.value = wheelDelta.value === null ? 120 : wheelDelta.value
  console.log(scaleImgNum.value)
  if (type === '-' && scaleImgNum.value > 0.14024497751124437) {
    scaleImgNum.value -= wheelDelta.value / 1334
  } else if (type === '+' && scaleImgNum.value < 1.9393250224887555) {
    scaleImgNum.value += wheelDelta.value / 1334
  }
  if (scaleImgNum.value > 0.1 && scaleImgNum.value < 2) {
    images.value.style.transform = 'scale(' + scaleImgNum.value + ')'
  }
}

// 重置位置
function reset(model, first) {
  if (first) {
    const { defaultText, image, title, id, defaultMusicUrl, type } = model
    posterInfo.value = defaultText
    bgImg.value = `url(${image}) no-repeat center / cover`
    posterInfo.title = title
    posterInfo.templateId = id
    posterInfo.defaultMusicUrl = defaultMusicUrl
    if (type === 3) {
      isLanternModule.value = true
      audioPlay.value = true
      audioRef.value && audioRef.value.paused && audioRef.value.play()
      RENDERER.init()
    }
  } else {
    Modal.confirm({
      title: '切换模板，将会覆盖原海报修改的内容',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', {
        style: 'color:red;'
      }),
      onOk() {
        const { defaultText, image, title, id, defaultMusicUrl, type } = model
        posterInfo.value = defaultText
        bgImg.value = `url(${image}) no-repeat center / cover`
        posterInfo.title = title
        posterInfo.templateId = id
        posterInfo.defaultMusicUrl = defaultMusicUrl
        textContainer.value.style.top = '1080px'
        textContainer.value.style.left = '85px'
        isLanternModule.value = value1.value === 3 || type === 3
        if (isLanternModule.value) RENDERER.init()
        else RENDERER.stop()
      },
      onCancel() {
        console.log('Cancel')
      },
      class: 'test'
    })
  }
}

// 模板下拉选择
const selectedHandler = () => {
  const options1 = [
    {
      value: '',
      label: '所有类型'
    },
    {
      value: 1,
      label: '除夕'
    },
    {
      value: 2,
      label: '新春'
    },
    {
      value: 3,
      label: '元宵'
    },
    {
      value: 4,
      label: '开工'
    },
    {
      value: 5,
      label: '妇女节'
    }
  ]
  const value1 = ref('')
  // 模板列表
  const postModelList = ref([])
  let flag = true
  let first = true
  // 下拉选择切换
  const handleChange = async value => {
    const { data: res } = await posterModelList({ type: value, page: 1, pageSize: 1000 })
    postModelList.value = res.list
    if (props.posterId && flag) {
      // 编辑海报
      flag = false
      const { data: res } = await getPosterDetail({ id: props.posterId })
      postModelList.value.forEach(item => {
        if (item.id === res.templateId) {
          selectedModel(item, first)
          first = false
        }
      })
      posterInfo.title = res.title
      posterInfo.value = res.posterText
      offsetTop.value = res.festivalExtensionVO[0].extensionJsonObj.top
      offsetLeft.value = res.festivalExtensionVO[0].extensionJsonObj.left
      fontSizeValue.value = res.festivalExtensionVO[0].extensionJsonObj.fontSize
    } else {
      // 初始化
      selectedModel(postModelList.value[0], first)
      first = false
    }
  }
  handleChange('')
  return {
    options1,
    value1,
    handleChange,
    postModelList
  }
}
const { options1, value1, handleChange, postModelList } = selectedHandler()

// 选择模板
const selectedModel = (model, first) => {
  reset(model, first)
}

// 双击改变输入框类型
const dbClickChange = () => {
  // input框类型切换
  const inputType = ref(true)
  const isShowFontSize = ref(false)
  // 文本域dom
  const textareaDom = ref(null)
  // 双击改变
  function changeInputStatus() {
    isShowFontSize.value = true
    inputType.value = false
    isClickOutside2.value = false
    setTimeout(() => {
      textareaDom.value.focus()
    }, 200)
  }
  function handleClickFontSizeChange() {
    isClickOutside2.value = false
  }
  return {
    inputType,
    isShowFontSize,
    textareaDom,
    changeInputStatus,
    handleClickFontSizeChange
  }
}
const { inputType, isShowFontSize, textareaDom, changeInputStatus, handleClickFontSizeChange } = dbClickChange()

// 分享海报
const sharePosterHandler = (top, left) => {
  const textContainer = ref(null)
  const offsetTop = ref(top)
  const offsetLeft = ref(left)
  // 上传参数
  const posterInfo = reactive({
    value: '', // 祝福语 || 海报文案
    templateId: '', // 模板id
    title: '', // 海报标题
    chambername: userInfo.value.chambername
  })
  // 分享海报
  async function sharePoster() {
    loading.value = true
    const { top, left } = getComputedStyle(textContainer.value)
    // posterInfo.x = left
    // posterInfo.y = top
    const oldCanvas = document.getElementById('canvas')
    oldCanvas && oldCanvas.remove()
    const audioPlayDom = document.getElementById('audioPlayDom')
    audioPlayDom && audioPlayDom.remove()
    inputType.value = true
    isShowFontSize.value = false
    isClickOutside1.value = false
    isClickOutside2.value = false
    await nextTick()
    scaleImgNum.value = 0.5
    images.value.style.transform = 'scale(0.5)'
    const dataUri = await generatePictureByDomId('holidayPoster')
    const res = await base64ToPNG({ dataUri, folder: 'festival' })
    const posterParams = {
      id: props.posterId || '',
      posterImage: res.data, // 海报图url
      posterText: posterInfo.value, // 海报文案
      templateId: posterInfo.templateId, // 模板id
      title: posterInfo.title, // 海报标题
      festivalPosterExtension: [
        {
          targetType: 1, // 目标类型 0-节日模板 1-海报
          modelType: 0, // 模块类型 0-文案
          extensionType: 0, // 扩展类型 0-坐标
          extensionJsonObj: { top, left, fontSize: fontSizeValue.value } // 扩展参数
        }
      ]
    }
    let result = null
    if (props.posterId) {
      result = await editPoster(posterParams)
    } else {
      result = await createPoster(posterParams)
      DataCollect.FestivalPoster.publish({ store, poster: { id: result.data, title: posterParams.title } })
    }
    loading.value = false
    emit('sharePoster', result.data)
  }
  return {
    textContainer,
    offsetTop,
    offsetLeft,
    sharePoster,
    posterInfo
  }
}
const { textContainer, offsetTop, offsetLeft, sharePoster, posterInfo } = sharePosterHandler('1080px', '85px')

// 改变字体大小
const fontSizeHandler = () => {
  const fontSizeSelectRef = ref(null)
  const fontSizeValue = ref('24px')
  const fontSizeOptions = [
    {
      value: '18px',
      label: '18'
    },
    {
      value: '24px',
      label: '24'
    },
    {
      value: '30px',
      label: '30'
    },
    {
      value: '36px',
      label: '36'
    },
    {
      value: '48px',
      label: '48'
    }
  ]
  return {
    fontSizeSelectRef,
    fontSizeValue,
    fontSizeOptions
  }
}
const { fontSizeSelectRef, fontSizeValue, fontSizeOptions } = fontSizeHandler()
const isClickOutside1 = useClickOutside(textareaDom)
const isClickOutside2 = useClickOutside(fontSizeSelectRef)
watchEffect(() => {
  if (isClickOutside1.value && isClickOutside2.value) {
    isShowFontSize.value = false
    inputType.value = true
  }
})

// 音频播放
const audioHandler = () => {
  const audioRef = ref(null)
  const audioPlay = ref(true)
  const handleAudioPlay = () => {
    audioPlay.value = !audioPlay.value
    if (audioPlay.value) {
      audioRef.value.play()
    } else {
      audioRef.value.pause()
    }
  }
  return {
    audioRef,
    audioPlay,
    handleAudioPlay
  }
}
const { audioRef, audioPlay, handleAudioPlay } = audioHandler()
</script>

<style scoped lang="scss">
.holiday-poster {
  display: flex;
  .poster-model {
    width: 266px;
    height: 765px;
    /*overflow-x: hidden;*/
    padding: 0 24px;
    .title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      line-height: 22px;
      margin-bottom: 16px;
    }
    .imgs-wrap {
      height: 662px;
      width: 218px;
      overflow-y: auto;
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: transparent;
      }
      justify-content: space-between;
      .imgs {
        cursor: pointer;
        flex-shrink: 0;
        width: 100px;
        height: 178px;
        border-radius: 4px;
        /*background: pink;*/
        margin-bottom: 20px;
        /*z-index: 2;*/
        position: relative;
        .model-img {
          width: 100px;
          height: 178px;
        }
        &:hover {
          z-index: 99;
          background: rgba(0, 0, 0, 0.45);
        }
        .mask {
          position: absolute;
          width: 100px;
          height: 178px;
          top: 0;
          left: 0;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          text-align: center;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: transparent;
          line-height: 34px;
          &:hover {
            color: #fff;
            background: rgba(0, 0, 0, 0.45);
          }
        }
        .masked {
          background: rgba(0, 0, 0, 0.45);
          color: #fff;
        }
      }
    }
  }
  .poster {
    width: 100%;
    height: 765px;
    background: #f0f2f5;
    border-radius: 2px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    /*align-items: center;*/
    position: relative;
    .img {
      width: 750px;
      height: 1334px;
      position: relative;
      margin-top: -310px;
      /*overflow: hidden;*/
      transform: scale(0.5);
      background: v-bind(bgImg);

      .audio-play {
        position: absolute;
        top: 40px;
        right: 40px;
        cursor: pointer;
        &-start {
          animation: rotateArround 4s linear infinite alternate;
          -webkit-animation: rotateArround 4s linear infinite alternate;
          -moz-animation: rotateArround 4s linear infinite alternate;
          -ms-animation: rotateArround 4s linear infinite alternate;
          -o-animation: rotateArround 4s linear infinite alternate;
        }
      }
      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 750px;
        height: 170px;
        margin-top: 23px;
        .logo-img {
          width: 136px;
          height: 136px;
          border: 6px solid #fff;
          border-radius: 50%;
        }
      }
      .chamber-name {
        display: flex;
        justify-content: center;
        width: 750px;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;
        line-height: 40px;
      }
      .poster-container {
        position: absolute;
        top: v-bind(offsetTop);
        left: v-bind(offsetLeft);
        .text {
          z-index: 99;
          width: 580px;
          height: 230px;
          font-size: v-bind(fontSizeValue);
          color: #fff;
          border: 4px solid transparent;
          padding: 14px 10px;
          overflow: hidden;
          word-break: break-all;
          &:hover {
            border: 4px solid #65a6fa;
            cursor: move;
            &:before {
              content: '按住拖动位置或双击编辑内容';
              position: absolute;
              text-align: center;
              background: #6b291d;
              padding: 10px 30px;
              top: -70px;
              left: 100px;
              color: #fff;
              font-size: 26px;
            }
          }
        }
        .text-content {
          width: 580px;
          height: 230px;
          font-size: v-bind(fontSizeValue);
          color: #fff;
          padding: 18px 14px;
          overflow: hidden;
          background: transparent;
        }
      }
    }
    .add-sub {
      position: absolute;
      bottom: 0px;
      width: 870px;
      height: 60px;
      display: flex;
      justify-content: center;
      background: #f0f2f5;
      .wrap {
        position: absolute;
        bottom: 23px;
        width: 148px;
        height: 36px;
        background: #d8d8d8;
        border-radius: 17px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        .span {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: rgba(0, 0, 0, 0.9);
          line-height: 24px;
        }
        .sub,
        .add {
          cursor: pointer;
          font-size: 26px;
          width: 24px;
          height: 24px;
          text-align: center;
          line-height: 16px;
          border: 1px dashed #000;
          -moz-user-select: none; /*火狐*/
          -webkit-user-select: none; /*webkit浏览器*/
          user-select: none;
        }
      }
    }

    .change-font-size {
      position: absolute;
      bottom: 0;
      top: 20px;
      right: 20px;
      height: 32px;
    }
  }
}
.poster-title {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  width: 532px;
  height: 32px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 32px;
  .input {
    width: 460px;
    height: 32px;
  }
}
.handler {
  width: 1136px;
  display: flex;
  justify-content: center;
  margin-top: 24px;
  .btn {
    width: 102px;
    height: 32px;
  }
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
}
// .container {
//   position: absolute;
//   width: 500px;
//   height: 500px;
//   top: 50%;
//   left: 50%;
//   margin-top: -250px;
//   margin-left: -250px;
// }

.gift {
  &__title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    margin-top: 26px;
    margin-bottom: 16px;
    &--sub {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
  }
}

@keyframes rotateArround {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}

@-webkit-keyframes rotateArround {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
