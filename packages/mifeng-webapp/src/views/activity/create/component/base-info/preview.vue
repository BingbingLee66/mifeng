<template>
  <div v-if="detailVisible" class="preview-container flex-x-center-center" @click.stop="hide">
    <div class="right">
      <!-- 头部图片 -->
      <div class="right-out">活动详情</div>
      <img :src="closeIcon" class="my-close" @click="hide" alt="" />
      <img class="right-bg" :src="phoneImg" alt="" />
      <div class="container-wrapper">
        <div class="right-content">
          <div class="right-top">
            <img v-if="formState.headImage.length" :src="formState.headImage[0].url" class="pic" alt="" />
          </div>
          <div class="content">
            <!-- 标题 -->
            <div class="active-title">
              <div class="title-left">{{ formState.activityName }}</div>
              <div class="title-right">
                <div><i class="el-icon-share" /></div>
                <div style="color: #c62134; font-size: 12px">分享</div>
              </div>
            </div>
            <!-- 时间 -->
            <div class="active-Date">
              <div class="Date-info">
                <div class="info-apply">
                  <div class="apply-dian">·</div>
                  报名时间:
                </div>
                <div v-show="applyDate.length">
                  <span>{{ applyDate[0] }}</span>
                  <span>~</span>
                  <span>{{ applyDate[1] }}</span>
                </div>
              </div>
              <div class="Date-info">
                <div class="info-apply">
                  <div class="apply-dian" style="color: #bc822c">·</div>
                  活动时间:
                </div>
                <div v-show="date.length">
                  <span>{{ date[0] }}</span>
                  <span>~</span>
                  <span>{{ date[1] }}</span>
                </div>
              </div>
              <div class="Date-info">
                <div class="info-apply">
                  <div class="apply-dian" style="color: #dc5015">·</div>
                  活动地点:
                </div>
                <div class="info-site">
                  {{ formState.province + formState.city + formState.area + formState.addressInfo }}
                </div>
              </div>
            </div>
            <div class="active-middle">
              <!-- 账户详情 -->
              <div class="active-data">
                <div class="active-left">
                  <img class="active-avatar" :src="systemLogo ? systemLogo : imgUrl" alt="" />
                </div>
                <div class="active-right">
                  <div class="right-cham">{{ chamberName ? chamberName : '凯迪云商会总后台管理系统' }}</div>
                  <div class="right-member">已入驻200名会员</div>
                </div>
              </div>
              <img src="https://ysh-cdn.kaidicloud.com/prod/png/active.png" class="pic" alt="" />
              <div class="coverLabel">
                <div class="activeLabel-box">
                  <div class="activeLabel">活动详情</div>
                  <div class="line" />
                </div>
                <div v-if="formState.authAlbum === 1" class="defaultLabel">会员图片</div>
                <div class="defaultLabel">座位号</div>
              </div>
            </div>
            <div class="active-introduce">活动介绍</div>

            <div id="my-phone-article-content" class="phone-article-content" v-html="formState.introduce" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import store from '@/store'
import dayjs from 'dayjs'
import { useImgUrl } from '@/hooks/useImgUrl'
export default defineComponent({
  name: 'Preview',

  setup() {
    const imgUrl = `${useImgUrl('commons/avatar.png')}`
    const closeIcon = `${useImgUrl('commons/close.png')}`
    const phoneImg = `${useImgUrl('commons/phone.png')}`
    const detailVisible = ref(false)
    const formState = ref({})
    const applyDate = ref([]) // 报名时间：
    const date = ref([]) // 活动时间：

    const chamberName = computed(() => store.state.user.chambername)
    const systemLogo = computed(() => store.state.user.systemlogo)

    const show = () => {
      detailVisible.value = true
    }

    const hide = () => {
      detailVisible.value = false
    }

    const dateFormat = (str, format = 'YYYY-MM-DD hh:mm:ss') => {
      if (!str) return '--'
      if (+str > 0) str = +str
      return dayjs(str).format(format)
    }

    const open = async val => {
      applyDate.value = []
      date.value = []
      formState.value = val
      if (val.applyDate.length > 0) {
        applyDate.value.push(dateFormat(val.applyDate[0]))
        applyDate.value.push(dateFormat(val.applyDate[1]))
      }

      if (val.date.length > 0) {
        date.value.push(dateFormat(val.date[0]))
        date.value.push(dateFormat(val.date[1]))
      }
      show()
    }

    return {
      detailVisible,
      formState,
      applyDate,
      date,
      imgUrl,
      chamberName,
      systemLogo,
      closeIcon,
      phoneImg,

      show,
      hide,
      open
    }
  }
})
</script>
<style lang="scss" scoped>
.preview-container {
  background-color: rgba(0, 0, 0, 0.447058823529412);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1001;

  .right-bg,
  .right-content,
  .right {
    width: 400px;
    height: 740px;
    position: absolute;
  }
  .right {
    position: relative;

    .my-close {
      width: 40px;
      height: 40px;
      position: absolute;
      right: -26px;
      z-index: 102;
    }
  }
  .right-top {
    width: 84%;
    height: 180px;
    text-align: center;
    margin-left: 37px;
  }
  .pic {
    width: 100%;
    height: 100%;
  }
  .coverLabel {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    font-weight: 550;
    color: #323232;
    background-color: #fff;
    top: -136px;
  }
  .activeLabel {
    font-size: 19px;
    padding: 5px 0;
    color: #c62134;
    font-weight: 550;
    transform: scale(0.7);
  }
  .defaultLabel {
    transform: scale(0.7);
  }
  .line {
    margin: 1px auto;
    border: #c62134 1px solid;
    background-color: #c62134;
    border-radius: 4px;
    width: 50%;
  }
  .right-out {
    position: absolute;
    top: 8%;
    right: 38%;
    width: 90px;
    height: 42px;
    background: #fff;
    z-index: 110;
    line-height: 42px;
    text-align: center;
  }
  .right-bg {
    z-index: 101;
  }
  .right-content {
    margin-top: 110px;
    height: 600px;
    overflow-y: scroll;
    overflow-x: visible;
    z-index: 102;
    .content {
      padding: 0 30px 0 40px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      line-height: 60px;
    }
    .date {
      margin-top: 14px;
    }
    .content-html {
      margin-top: 10px;
      overflow: hidden;
    }
  }
  .container-wrapper {
    overflow: hidden;
  }
  .right-content::-webkit-scrollbar {
    display: none;
  }
  .phone-article-content {
    width: 100%;
    position: relative;
    font-size: 14px;
    font-weight: 500;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    border: none !important;
  }

  #my-phone-article-content {
    width: 100%;
    position: relative;
    font-size: 14px;
    font-weight: 500;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    border: none !important;
  }
  #my-phone-article-content img {
    max-width: 100%;
    height: auto !important;
    max-height: 100% !important;
  }
  // .phone-article-content>p>img {
  //   width: 100% !important;
  //   height: auto !important;
  //   max-height: 100% !important;
  // }
  .phone-article-content img {
    max-width: 100%;
    height: auto !important;
    max-height: 100% !important;
  }

  .active-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    margin-top: 10px;
    // border-bottom: 2px solid #f5f5f5;
    .title-left {
      width: 85%;
      font-size: 17px;
    }
    .title-right {
      width: 15%;
      text-align: center;
      .el-icon-share {
        color: #a4a4a4;
      }
    }
  }
  .active-Date {
    margin-top: 10px;
    border-bottom: 2px solid #f5f5f5;
    padding-bottom: 10px;
    font-size: 12px;
    .Date-info {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      color: #888;
      margin-bottom: 5px;

      .info-apply {
        color: #323232;
        margin-right: 10px;
        position: relative;
        margin-left: 10px;
        .apply-dian {
          position: absolute;
          color: #27bc76;
          font-size: 30px;
          top: -72%;
          left: -21%;
        }
      }
      .info-site {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 70%;
      }
    }
  }
  .active-middle {
    width: 100%;
    height: 135px;
    position: relative;
    .active-data {
      position: absolute;
      top: 58%;
      left: 8px;
      width: 225px;
      height: 50px;
      background: #fff;
      display: flex;
      align-items: center;
      .active-left {
        width: 40px;
        height: 40px;

        .active-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .active-right {
        font-size: 12px;
        margin-left: 5px;
        .right-cham {
          font-weight: 700;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 175px;
        }
        .right-member {
          color: #c5c2c6;
          transform: scale(0.8);
          margin-left: -20px;
        }
      }
    }
  }
  .active-introduce {
    color: #c62134;
    font-size: 12px;
    font-weight: 700;
    margin-left: 10px;
  }
}
</style>
