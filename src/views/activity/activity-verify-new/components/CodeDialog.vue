<template>
  <div :style="{zIndex:`${show?'':'-'}999`,opacity:show?1:0}" class="mask" @click="$emit('change',false)">
    <div class="code-dialog" @click.stop>
      <div id="code-qrcode" class="code">
        <div class="code-title">{{ title }}</div>
        <div class="code-body">
          <img :src="url" class="code-img">
        </div>
      </div>
      <div class="code-footer" :loading="isLoading" @click="saveImage">保存图片</div>
      <i class="code-close el-icon el-icon-close" @click="$emit('change',false)" />
    </div>
  </div>
</template>

<script>
import { generatePictureByDomId, downloadFile } from '../util'

export default {
  components: {},
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async saveImage() {
      this.isLoading = true
      try {
        await this.$nextTick()
        const imgUrl = await generatePictureByDomId('code-qrcode')
        console.log(imgUrl)
        downloadFile({ title: this.title, url: imgUrl })
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba($color: #000000, $alpha: 0.5);
  z-index: 999;
}

.code-dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .code {
    width: 306px;
    height: 340px;
    padding-top: 34px;
    background-color: #fff;
    border-radius: 6px;

    .code-title {
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: #222;
      line-height: 25px;
      margin-bottom: 16px;
    }

    .code-body {
      width: 166px;
      height: 166px;
      margin: 0 auto;

      .code-img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .code-footer {
    position: absolute;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 98px;
    height: 34px;
    background: linear-gradient(360deg, #E53B4D 0%, #EA5755 100%);
    border-radius: 2px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }

  .code-close {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
