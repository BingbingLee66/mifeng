<template>
  <div class="qrcode-wrap">
    <div class="flex-x">
      <div class="qrcode-content">
        <h2>二维码：</h2>
        <div id="postdiv" class="poster" style="background-image: url(./img/chamber_homepage.png)">
          <img class="poster-logo" :src="chamberInfo.chamberLogo" alt="">
          <div class="poster-header">
            <div class="poster-chamber">{{ chamberInfo.chamberName }}</div>
            <img class="poster-label" src="../../../../../public/img/chamber_label.png" alt="">
          </div>
          <img class="poster-qrcode" :src="chamberInfo.qrCode" alt="">
        </div>
        <div class="mt-20 flex-x-between">
          <el-button type="primary" @click="refreshQrCode">刷新二维码</el-button>
          <el-button type="primary" :loading="isLoading" @click="clickGeneratePicture">下载海报</el-button>
          <el-button type="primary" @click="downloadQrCode">下载二维码</el-button>
        </div>
      </div>

      <div class="link-content">
        <h2>链接：</h2>
        <div class="link-wrap">
          <span style="line-height: 40px">链接1</span>
          <div style="margin: 0 10px">
            <el-input ref="link1Ref" v-model="chamberInfo.pathUrl" style="width: 400px" />
            <div style="margin-top: 10px">用于接入公众号或小程序路径</div>
          </div>
          <el-button @click="copy(1)">复制</el-button>
        </div>

        <div class="link-wrap mt-20">
          <span style="line-height: 40px">链接2</span>
          <div style="margin: 0 10px">
            <el-input ref="link2Ref" v-model="chamberInfo.promoteUrl" style="width: 400px" />
            <div style="margin-top: 10px">用于PC网站等推广</div>
          </div>
          <el-button @click="copy(2)">复制</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChamberQrcode } from '@/api/chamber/manager'
import { downloadFile } from '@/utils'
import html2canvas from 'html2canvas'

export default {
  name: 'ChamberHomepage',

  data() {
    return {
      chamberOptions: [],
      chamberInfo: {},
      isLoading: false
    }
  },

  computed: {
    ckey() {
      return this.$store.getters.ckey
    }
  },

  mounted() {
    this.getQRCode()
  },

  methods: {
    async getQRCode() {
      this.chamberInfo = {}

      const { data, state } = await getChamberQrcode({
        ckey: this.ckey,
        type: 1
      })

      if (!state) return

      this.chamberInfo = data
    },

    copy(type) {
      this.$refs[`link${type}Ref`].select()
      const successful = document.execCommand('copy')
      if (successful) {
        this.$message.success('链接复制成功')
      } else {
        this.$message.error('复制失败，请重试')
      }
    },

    downloadQrCode() {
      downloadFile({
        title: '入会专属二维码.png',
        url: this.chamberInfo.qrCode
      })
    },

    refreshQrCode() {
      this.$router.go(0)
    },

    async clickGeneratePicture() {
      this.isLoading = true
      try {
        await this.$nextTick()
        const canvas = document.createElement('canvas')
        const shareContent = document.getElementById('postdiv')
        const width = shareContent.offsetWidth // 获取dom 宽度
        const height = shareContent.offsetHeight // 获取dom 高度
        canvas.width = width * 2
        canvas.height = height * 2
        canvas.style.width = width * 2 + 'px'
        canvas.style.height = width * 2 + 'px'
        const scale = 1 // 定义任意放大倍数 支持小数
        const context = canvas.getContext('2d')
        context.scale(scale, scale)
        const rect = shareContent.getBoundingClientRect() // 获取元素相对于视口的
        context.translate(-rect.left, -rect.top)
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
        const _canvas = await html2canvas(shareContent, {
          // 转换为图片
          scrollY: -scrollTop,
          scrollX: 0,
          useCORS: true // 开启跨域
        })
        const imgUrl = _canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.download = '商会二维码'
        a.href = imgUrl
        a.click()
      } catch (error) {
        // console.log(error)
      }
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
.qrcode-wrap {
  padding: 20px;

  .poster {
    position: relative;

    .poster-header {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      margin: 0 auto;
      width: 80%;
      top: 100px;
      text-align: center;

      .poster-chamber {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: normal !important;
        -webkit-line-clamp: 2; /*  行数*/
        -webkit-box-orient: vertical;
        font-size: 36px;
        font-weight: 600;
        color: #f14a22;
        line-height: 50px;
        text-shadow: 0 2px 4px rgba(241, 74, 34, 0.46), 0 2px 4px rgba(255, 182, 182, 0.5);
      }
    }
    .poster-label{
      margin-top: 11px;
    }
    .poster-qrcode {
      position: absolute;
      width: 230px;
      height: 230px;
      top: 300px;
      left: 50%;
      transform: translate(-50%);
      border-radius: 9px;
    }

    .poster-logo {
      position: absolute;
      width: 104px;
      height: 104px;
      top: 363px;
      left: 50%;
      transform: translate(-50%);
      border-radius: 50%;
      background-color: #fff;
      z-index: 99;
    }
  }

  .qrcode-content {
    .poster {
      width: 375px;
      height: 812px;
      background-position: center;
      background-size: cover;
    }
  }

  .link-content {
    margin-left: 20px;

    .link-wrap {
      display: flex;
      align-items: start;
    }
  }
}
</style>
