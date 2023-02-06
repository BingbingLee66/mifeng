<template>
  <Panel>
    <div class="app-container">
      <div class="app-wrap">
        <div class="title">
          扫码快速加入 <span style="color: #409eff">{{ chamberName }} > {{ departmentName }}</span>
        </div>
        <div class="post">
          <div id="postdiv" ref="postRefs" class="post-wrap">
            <p class="tit-1">{{ chamberName }}</p>
            <p class="tit-2">{{ departmentName }}</p>
            <div class="erweima">
              <img :src="qrcode" />
            </div>
          </div>
          <a-button type="primary" @click="getInviteLogoFun('refresh')">刷新二维码</a-button>
          <a-button type="primary" @click="domtoimageFun" :loading="isLoading">保存图片</a-button>
        </div>
      </div>
    </div>
  </Panel>
</template>
<script>
import { useImgUrl } from '@/hooks/useImgUrl'
import { getInviteLogo, updateInviteLogo } from '@/api/org-structure/org'
import { inject, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { downloadFile, generatePictureByDomId } from '@/utils/index'
export default {
  setup() {
    const inviteInfo = invite()
    // 背景图
    const bgImg1 = `url(${useImgUrl('admin-entry-poster-bg-1.png')}) no-repeat`
    const bgImg2 = `url(${useImgUrl('admin-entry-poster-bg-2.png')}) no-repeat`
    return { ...inviteInfo, bgImg1, bgImg2 }
  }
}
function invite() {
  const ckey = inject('ckey')
  const route = useRoute()
  const router = useRouter()
  const info = reactive({
    chamberName: '',
    departmentName: '',
    qrcode: ''
  })
  const getInviteLogoFun = async type => {
    const params = {
      ckey: ckey.value,
      departmentId: route.query.departmentId
    }
    let API = getInviteLogo
    if (type === 'refresh') {
      API = updateInviteLogo
    }
    const {
      data: {
        data: { chamberName, departmentName, systemJoinQrcode }
      }
    } = await API(params)
    info.chamberName = chamberName
    info.departmentName = departmentName
    info.qrcode = systemJoinQrcode
    if (type === 'refresh') {
      router.go(0)
    }
  }
  getInviteLogoFun('init')
  const isLoading = ref(false)
  const domtoimageFun = async () => {
    isLoading.value = true
    const imgUrl = await generatePictureByDomId('postdiv')
    downloadFile({ url: imgUrl, title: '入会二维码' })
    isLoading.value = false
  }
  return { ...toRefs(info), getInviteLogoFun, domtoimageFun, isLoading }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  padding: 10px 0 0 30px;
  box-sizing: border-box;

  .app-wrap {
    .title {
      font-size: 16px;
      color: #000;
      line-height: 40px;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .ant-btn {
      color: #fff;
      margin: 20px 20px 0 0;
    }
    .post {
      .post-wrap {
        width: 375px;
        min-height: 667px;
        background: v-bind(bgImg1);
        background-size: 100% 100%;
        padding: 40px 16px 16px 16px;
        text-align: center;

        .tit-1 {
          margin: 0;
          padding: 0;
          color: #ffffff;
          font-weight: bold;
          font-size: 42px;
          font-style: italic;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .tit-2 {
          margin: 0;
          padding: 0;
          color: #ffffff;
          font-weight: bold;
          font-size: 35px;
          margin-top: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .erweima {
          width: 342px;
          height: 313px;
          margin: 0 auto;
          margin-top: 20px;
          padding-top: 80px;
          background: v-bind(bgImg2);
          background-size: 100% 100%;
          text-align: center;

          img {
            width: 183px;
            height: 183px;
            object-fit: cover;
          }
        }
      }
    }
  }
}
</style>
