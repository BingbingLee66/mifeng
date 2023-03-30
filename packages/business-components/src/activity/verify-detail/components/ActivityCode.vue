<template>
  <div class="activity">
    <div class="activity-title">{{ activity.activityName }}</div>
    <div class="activity-body">
      <div class="activity-list">
        <div v-if="activity.activitySignUpStartTime" class="activity-item">
          <div class="activity-label">报名时间</div>
          <div class="activity-text">
            {{ $filters.dateFormat(activity.activitySignUpStartTime) }} ～
            {{ $filters.dateFormat(activity.activitySignUpEndTime) }}
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-label">活动时间</div>
          <div class="activity-text">
            {{ $filters.dateFormat(activity.activityStartTime) }} ～
            {{ $filters.dateFormat(activity.activityEndTime) }}
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-label">举办地点</div>
          <div class="activity-text">{{ activity.hostPlace }}</div>
        </div>
      </div>
      <div class="activity-content">
        <div class="activity-content-left">
          <img :src="activity.qrCode" class="activity-qrcode" />
          <div>扫码查看活动</div>
        </div>
        <div v-if="activity.ckey" class="activity-content-right">
          <img :src="activity.chamberLogo" class="chamber-logo" />
          <div class="chamber-name">{{ activity.chamberName }}</div>
          <div class="chamber-desc">
            已入驻
            <span style="color: #d01a33">{{ activity.chamberNum }}</span> 名会员
          </div>
        </div>
        <div v-else class="activity-content-right">
          <img :src="yshLogoUrl" class="chamber-logo" />
          <div class="chamber-name">云商会</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BASE_CDN_URL2 } from "@business/common/src/config/index";

import { inject } from "vue";
defineProps({
  activity: {
    type: Object,
    default() {
      return {};
    },
  },
});
const yshLogoUrl = `${BASE_CDN_URL2 + "prod/ysh/logo.png"}`;
</script>

<style lang="scss" scoped>
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
      &:last-child {
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
</style>
