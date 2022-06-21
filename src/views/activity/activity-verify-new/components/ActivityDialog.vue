<template>
  <div :style="{zIndex:`${show?'':'-'}999`,opacity:show?1:0}" class="mask" @click="$emit('change',false)">
    <div class="activity-dialog" @click.stop>
      <div id="activity-qrcode" class="activity">
        <div class="activity-title">{{ activity.activityName }}</div>
        <div class="activity-body">
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-label">报名时间</div>
              <div class="activity-text">{{ formatDate(activity.activitySignUpStartTime) }} ～ {{ formatDate(activity.activitySignUpEndTime) }}</div>
            </div>
            <div class="activity-item">
              <div class="activity-label">活动时间</div>
              <div class="activity-text">{{ formatDate(activity.activityStartTime) }} ～ {{ formatDate(activity.activityEndTime) }}</div>
            </div>
            <div class="activity-item">
              <div class="activity-label">举办地点</div>
              <div class="activity-text"> {{ activity.hostPlace }}</div>
            </div>
          </div>
          <div class="activity-content">
            <div class="activity-content-left">
              <img :src="activity.qrCode" class="activity-qrcode">
              <div>扫码查看活动</div>
            </div>
            <div class="activity-content-right">
              <img :src="activity.chamberLogo" class="chamber-logo">
              <div class="chamber-name">{{ activity.chamberName }}</div>
              <div class="chamber-desc">已入驻 <span style="color: #d01a33;">{{ activity.chamberNum }}</span> 名会员</div>
            </div>
          </div>
        </div>

      </div>
      <div class="activity-footer" :loading="isLoading" @click="saveImage">保存图片</div>
      <i class="activity-close el-icon el-icon-close" @click="$emit('change',false)" />
    </div>
  </div>
</template>

<script>
import { generatePictureByDomId, formatDate, downloadFile } from '../util'

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
    activity: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    formatDate,
    async saveImage() {
      this.isLoading = true
      try {
        await this.$nextTick()
        const imgUrl = await generatePictureByDomId('activity-qrcode')
        console.log(imgUrl)
        downloadFile({ title: '活动二维码', url: imgUrl })
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

.activity-dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);

  .activity {
    width: 526px;
    height: 496px;
    background-color: #fff;
    border-radius: 6px;

    .activity-title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 61px;
      width: 100%;
      font-size: 18px;
      font-weight: 700;
      color: #333;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.06);
    }

    .activity-body {
      padding: 0 40px;
    }

    .activity-list {
      padding: 22px 0;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.06);

      .activity-item {
        display: flex;
        line-height: 20px;
        margin-bottom: 14px;

        &:last-child{
          margin-bottom: 0;
        }

        .activity-label {
          font-size: 14px;
          color: #999999;
          margin-right: 13px;
        }

        .activity-text {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }

    .activity-content {
      display: flex;
      padding-top: 20px;

      .activity-content-left {
        margin-right: 34px;
        font-size: 14px;
        color: #222;

        .activity-qrcode {
          width: 166px;
          height: 166px;
          margin-bottom: 2px;
        }

        div {
          margin-left: 6px;
        }
      }

      .activity-content-right {
        margin-top: 9px;
        line-height: 21px;
        .chamber-logo {
          width: 46px;
          height: 46px;
          margin-bottom: 6px;
        }
        .chamber-name {
          font-size: 15px;
          color: #222;
          margin-bottom: 4px;
        }
        .chamber-desc {
          font-size: 15px;
          color: #999;
        }
      }
    }
  }

  .activity-footer {
    position: absolute;
    right: 38px;
    bottom: 30px;
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

  .activity-close {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
