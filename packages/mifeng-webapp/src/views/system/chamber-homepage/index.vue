<template>
  <div class="qrcode-wrap">
    <div class="flex-x">
      <div class="qrcode-content">
        <h2>二维码：</h2>

        <div class="poster-wrap">
          <div id="post-div" class="poster">
            <img class="poster-logo" :src="chamberInfo.chamberLogo" alt="" />
            <div class="poster-header">
              <div class="poster-chamber">{{ chamberInfo.chamberName }}</div>
              <img class="poster-label" src="https://ysh-cdn.kaidicloud.com/prod/bee/chamber_label.png" alt="" />
            </div>
            <img class="poster-qrcode" :src="chamberInfo.qrCode" alt="" />
          </div>
          <div id="qrcode-div" class="p-qrcode-wrap">
            <img class="qrcode-download" :src="chamberInfo.qrCode" alt="" />
            <img class="logo-download" :src="chamberInfo.chamberLogo" alt="" />
          </div>
        </div>

        <div class="mt-20 flex-x-between">
          <a-button type="primary" @click="refreshQrCode">刷新二维码</a-button>
          <a-button type="primary" :loading="posterLoading" @click="downLoad(POSTER)"> 下载海报 </a-button>
          <a-button type="primary" :loading="qrcodeLoading" @click="downLoad(QRCODE)">下载二维码</a-button>
        </div>
      </div>

      <div class="link-content">
        <h2>链接：</h2>
        <div class="link-wrap">
          <span style="line-height: 40px">链接1</span>
          <div style="margin: 0 10px">
            <a-input ref="link1Ref" v-model:value="chamberInfo.pathUrl" style="width: 400px" />
            <div style="margin-top: 10px">用于接入公众号或小程序路径</div>
          </div>
          <a-button @click="copy(POSTER)">复制</a-button>
        </div>

        <div class="link-wrap mt-20">
          <span style="line-height: 40px">链接2</span>
          <div style="margin: 0 10px">
            <a-input ref="link2Ref" v-model:value="chamberInfo.promoteUrl" style="width: 400px" />
            <div style="margin-top: 10px">用于PC网站等推广</div>
          </div>
          <a-button @click="copy(QRCODE)">复制</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getChamberQrcode } from '@/api/chamber/manager'
import { getCurrentInstance, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { downloadFile, generatePictureByDomId } from '@/utils/index'
const POSTER = 1
const QRCODE = 2

const chamberInfo = ref({})
const posterLoading = ref(false)
const qrcodeLoading = ref(false)
const ckey = inject('ckey')
const link1Ref = ref(null)
const link2Ref = ref(null)
const router = useRouter()
const { proxy } = getCurrentInstance()

const getQRCode = async () => {
  const { data } = await getChamberQrcode({
    ckey: ckey.value,
    type: 2
  })
  chamberInfo.value = data
}
const copy = type => {
  switch (type) {
    case POSTER:
      link1Ref.value.select()
      break
    case QRCODE:
      link2Ref.value.select()
      break
  }
  const successful = document.execCommand('copy')
  if (successful) {
    proxy.$message.success('链接复制成功')
  } else {
    proxy.$message.error('复制失败，请重试')
  }
}
const refreshQrCode = () => {
  router.go(0)
}
const downLoad = type => {
  switch (type) {
    case POSTER:
      clickGeneratePicture('post-div', POSTER)
      break
    case QRCODE:
      clickGeneratePicture('qrcode-div', QRCODE)
      break
  }
}
const clickGeneratePicture = async (domName, type) => {
  switch (type) {
    case POSTER:
      posterLoading.value = true
      break
    case QRCODE:
      qrcodeLoading.value = true
      break
  }
  try {
    const imgUrl = await generatePictureByDomId(domName)
    downloadFile({ url: imgUrl, title: '商会专属二维码' })
  } catch (error) {
    console.error(error)
  }
  switch (type) {
    case POSTER:
      posterLoading.value = false
      break
    case QRCODE:
      qrcodeLoading.value = false
      break
  }
}
onMounted(() => {
  getQRCode()
})
</script>

<style scoped lang="scss">
.qrcode-wrap {
  background-color: #fff;
  margin: 20px;
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
      top: 63px;
      transform: translateX(-50%);
      width: 104px;
      height: 104px;
      border-radius: 50%;
      background-color: #fff;
    }
  }

  .poster {
    position: relative;
    background-image: url('https://ysh-cdn.kaidicloud.com/prod/bee/chamber_homepage.png');
    background-repeat: no-repeat;
    background-size: cover;
    .poster-header {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      margin: 0 auto;
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
        color: #f14a22;
        line-height: 50px;
        text-shadow: 0 2px 4px rgba(241, 74, 34, 0.46), 0 2px 4px rgba(255, 182, 182, 0.5);
        padding: 0 25px;
      }
    }
    .poster-label {
      margin-top: 11px;
      width: 121px;
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
    background-color: #fff;
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
      align-items: flex-start;
    }
  }
}
</style>
