<template>
  <div class="qrcode-wrap ">
    <div v-if="!ckey" class="flex-x-start-center">
      <span style="line-height: 40px">请选择商协会</span>
      <el-select
        v-model="chamber"
        v-lazy-load="lazyOption"
        placeholder="请选择"
        filterable
        remote
        clearable
        :remote-method="remoteMethod"
        style="width: 300px; margin: 0 10px;"
        @clear="remoteMethod"
        @blur="onBlur"
      >
        <el-option v-for="item in chamberOptions" :key="item.ckey" :label="item.name" :value="item.ckey" />
      </el-select>
      <el-button @click="getQRCode">生成二维码</el-button>
    </div>

    <div v-if="JSON.stringify(chamberInfo) !== '{}'" class="flex-x">
      <div class="qrcode-content">
        <h2>二维码：</h2>

        <div class="poster-wrap">
          <div id="postdiv" class="poster" style="background-image: url(./img/chamber_homepage.png)">
            <img class="poster-logo" :src="chamberInfo.chamberLogo" alt="">
            <div class="poster-header">
              <div class="poster-chamber">{{ chamberInfo.chamberName }}</div>
              <img class="poster-label" src="../../../../public/img/chamber_label.png" alt="">
            </div>
            <img class="poster-qrcode" :src="chamberInfo.qrCode" alt="">
          </div>
          <div id="qrcode-div" class="p-qrcode-wrap">
            <img class="qrcode-download" :src="chamberInfo.qrCode" alt="">
            <img class="logo-download" :src="chamberInfo.chamberLogo" alt="">
          </div>
        </div>

        <div class="mt-20 flex-x-between">
          <el-button type="primary" @click="refreshQrCode">刷新二维码</el-button>
          <el-button type="primary" :loading="isLoading" @click="clickGeneratePicture('postdiv')">下载海报</el-button>
          <el-button type="primary" @click="downloadQrCode">下载二维码</el-button>
        </div>
      </div>

      <div class="link-content">
        <h2>链接：</h2>
        <div class="link-wrap">
          <span style="line-height: 40px">链接1</span>
          <div style="margin: 0 10px">
            <el-input ref="link1Ref" v-model="chamberInfo.pathUrl" style="width: 400px;" />
            <div style="margin-top: 10px">用于接入公众号或小程序路径</div>
          </div>
          <el-button @click="copy(1)">复制</el-button>
        </div>

        <div class="link-wrap mt-20">
          <span style="line-height: 40px">链接2</span>
          <div style="margin: 0 10px">
            <el-input ref="link2Ref" v-model="chamberInfo.promoteUrl" style="width: 400px;" />
            <div style="margin-top: 10px">用于PC网站等推广</div>
          </div>
          <el-button @click="copy(2)">复制</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getList, getChamberQrcode } from '@/api/chamber/manager'
import lazyLoad from '@/directive/lazy-load'
import html2canvas from 'html2canvas'

export default {
  name: 'ChamberHomepage',

  directives: { lazyLoad },

  data() {
    return {
      chamber: '',

      chamberOptions: [],
      lazyOption: {
        loadData: this.getChamberList,
        distance: 20,
        scrollBody: '.el-scrollbar__wrap', // 为el-select 滚动容器的DOM元素的class选择器
        callback: fn => {
          // 这里是在组件销毁前, 移除监听事件.
          this.$once('hook:beforeDestroy', () => fn())
        },
      },
      query: '',
      totalPages: 0,
      page: 1,

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
    if (!this.ckey) {
      this.getChamberList()
    } else {
      this.chamber = this.ckey
      this.getQRCode()
    }
  },

  methods: {
    onBlur() {
      if (!this.chamber) {
        this.query = ''
        this.remoteMethod()
      }
    },

    remoteMethod(query) {
      this.page = 1
      this.query = query
      this.getChamberList()
    },

    async getChamberList() {
      if (this.page > 1 && this.page > this.totalPages) return

      const { data, state } = await getList({
        page: this.page,
        pageSize: 20,
        status: 1,
        name: this.query
      })

      if (!state) return

      this.totalPages = data.data.totalPages
      if (this.page === 1) {
        this.chamberOptions = data.data.list
      } else {
        this.chamberOptions = this.chamberOptions.concat(data.data.list)
      }
      this.page++
    },

    async getQRCode() {
      if (!this.chamber) this.$message.error('请选择商协会')
      this.chamberInfo = {}

      const { data, state } = await getChamberQrcode({
        ckey: this.chamber,
        type: 2
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
      this.clickGeneratePicture('qrcode-div')
    },

    refreshQrCode() {
      this.$router.go(0)
    },

    async clickGeneratePicture(domName) {
      this.isLoading = true
      try {
        await this.$nextTick()
        const canvas = document.createElement('canvas')
        const shareContent = document.getElementById(domName)
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
        const _canvas = await html2canvas(shareContent, { // 转换为图片
          scrollY: -scrollTop,
          scrollX: 0,
          useCORS: true // 开启跨域
        })
        const imgUrl = _canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.download = '商会主页二维码'
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

  .poster-wrap {
    position: relative;
  }

  .p-qrcode-wrap {
    top: 300px;
    left: 50%;
    transform: translate(-50%);
    position: absolute;
    width: 230px;

    .qrcode-download {
      width: 230px;
      height: 230px;
    }

    .logo-download {
      position: absolute;
      left: 50%;
      top: 62px;
      transform: translateX(-50%);
      width: 104px;
      height: 104px;
      border-radius: 50%;
      background-color: #fff;
    }
  }

  .poster {
    position: relative;

    .poster-header {
      position: absolute;
      width: 100%;
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
        color: #F14A22;
        line-height: 50px;
        text-shadow: 0 2px 4px rgba(241,74,34,0.46), 0 2px 4px rgba(255,182,182,0.5);
        padding: 0 25px;
      }
      .poster-label{
        margin-top: 11px;
        width: 121px;
      }
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
