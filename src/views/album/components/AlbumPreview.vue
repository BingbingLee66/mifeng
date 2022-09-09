<template>
  <div v-show="visible" class="overlay">
    <div class="preview">
      <div class="title">相册详情</div>
      <div class="content">
        <div class="btns">
          <div class="btn">
            <img class="btn-icon" src="https://ysh-cdn.kaidicloud.com/test/common/batch_opt.png">
            批量操作
          </div>
          <div class="btn">
            <img class="btn-icon" src="https://ysh-cdn.kaidicloud.com/test/common/manage.png">
            管理
          </div>
          <div class="btn">
            <img class="btn-icon" src="https://ysh-cdn.kaidicloud.com/test/common/upload.png">
            上传图片
          </div>
        </div>
        <div class="info">
          <div class="info-name"> {{ album.albumName }}</div>
          <div v-if="cutStr" class="album-intr" :class="{expanded:toggle}">
            {{
              toggle ? intro : cutStr
            }}
            <div class="expand" @click="toggle=!toggle">{{ toggle?'收起':'展开' }}</div>
          </div>
          <div v-else class="album-intr">{{ intro }}</div>
          <div class="flex-x">
            <div class="info-desc">
              浏览
              <span class="info-desc-value">{{ num }}W+</span>
            </div>
            <div class="info-desc">
              点赞
              <span class="info-desc-value">{{ num }}</span>
            </div>
          </div>
        </div>
        <div class="img-content">
          <div class="date">
            {{ dateStr }}
          </div>
          <div class="time">
            {{ timeStr }}
          </div>

          <div class="imgs">
            <img v-for="(item,i) of imgList" :key="i" class="img-item" :src="item">
          </div>
        </div>
      </div>
      <el-button class="footer" type="primary" @click="$emit('change', false)">回到相册创建</el-button>
    </div>
  </div>
</template>

<script>
import { formatDateTime } from '@/utils/date'

import default1 from '@/assets/img/album/default1.png'
import default2 from '@/assets/img/album/default2.png'
import default3 from '@/assets/img/album/default3.png'

const defaultImgs = [default1, default2, default3, default1, default2, default3]

export default {
  components: {},
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    album: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dateStr: '',
      timeStr: '',
      imgList: [],
      num: 1,
      toggle: false
    }
  },
  computed: {
    intro() {
      if (!this.album.introduce) return ''
      return this.album.introduce.replace(/[\s]+/g, ' ').trim()
    },
    cutStr() {
      const str = this.intro
      const fontSize = 16
      const line = 2
      const containerWidth = 320
      const chineseWidth = 1 * fontSize // 中文字符宽度
      const englishWidth = 0.55 * fontSize // 英文字符宽度
      const spaceWidth = 0.27 * fontSize // 空格宽度
      const totalLen = line * containerWidth - 3 * chineseWidth

      let str_length = 0
      let cutStr = ''

      for (let i = 0, len = str.length; i < len; i++) {
        const a = str[i]

        // 中文字符的长度经编码之后大于6
        if (encodeURI(a).length > 6) {
          str_length += chineseWidth
        } else if (encodeURI(a) === encodeURI(' ')) {
          str_length += spaceWidth
        } else {
          str_length += englishWidth
        }

        // 达到目标长度，即为字符串加上省略号并返回,-3是为了空3个中文出来展示 展开 文案
        if (str_length > totalLen && !cutStr) {
          cutStr = `${str.slice(0, i - 2)}...`
        }

        if (str_length > line * containerWidth) {
          return cutStr
        }
      }

      return ''
    }
  },
  watch: {
    visible: {
      handler(visible) {
        visible && this.init()
      },
      immediate: true
    }
  },
  methods: {
    init() {
      const date = new Date()
      const time = formatDateTime(date, 'hh')
      this.dateStr = formatDateTime(date, 'yyyy-MM-dd')
      this.timeStr = `${time}:00 ~ ${+time + 1}:00`
      this.imgList = defaultImgs.sort(() => Math.random() - 0.5).slice(0, 4)
      this.num = Math.floor((Math.random() * 10)) + 1
      this.toggle = false
    },

  },
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  z-index: 9;

  .preview {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    height: 798px;
    background: url('../../../assets/img/phone.png') no-repeat center / contain;
  }

  .title {
    position: absolute;
    width: 100px;
    height: 30px;
    top: 75px;
    left: 50%;
    transform: translate(-50%,0);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    background-color: #fff;
  }

  .content {
    position: absolute;
    left: 50%;
    top: 105px;
    transform: translate(-50%);
    width: 350px;
  }

  .btns {
    display: flex;
    justify-content: end;
    align-items: center;
    height: 41px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 11px solid #e8e8e8;
    box-sizing: content-box;

    .btn {
      font-size: 13px;
      color: #333;
      display: flex;
      align-items: center;
      margin-right: 15px;

      .btn-icon {
        width: 15px;
        height: 15px;
        margin-right: 2px;
      }
    }

  }

  .divide {
    height: 11px;
    background-color: #e8e8e8;
  }

  .info {
    padding: 15px;
    border-bottom: 1px solid #e8e8e8;

    .info-name {
      height: 23px;
      width: 100%;
      font-size: 17px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #222222;
      line-height: 23px;
      margin-bottom: 2px;
      word-break: break-all;
      @include ellipsis(1);
    }

    .album-intr {
      position: relative;
      font-size: 16px;
      color: #333;
      line-height: 28px;
      margin-bottom: 11px;
      word-break: break-all;

      &.expanded {
        padding-bottom: 28px;
      }

      .expand {
        position: absolute;
        right: 0;
        bottom: 0;
        color: #D01A33;
        line-height: 28px;
        cursor: pointer;
      }
    }

    .info-desc {
      font-size: 11px;
      color: #999;
      line-height: 16px;
      margin-right: 9px;
    }

    .info-desc-value {
      color: #222;
    }
  }

  .img-content {
    padding: 0 15px;
    .date {
      font-size: 17px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #222;
      line-height: 23px;
      margin: 15px 0 6px;
    }

    .time {
      font-size: 11px;
      color: #999;
      line-height: 16px;
      margin-bottom: 15px;
    }

    .imgs {
      display: flex;
      flex-wrap: wrap;
      margin-left: -10px;

      .img-item {
        margin: 0 0 10px 10px;
        width: 100px;
        height: 100px;
        border-radius: 7px;
      }
    }
  }

  .footer {
    position: absolute;
    left: 50%;
    bottom: 55px;
    transform: translate(-50%);
  }
}

</style>
