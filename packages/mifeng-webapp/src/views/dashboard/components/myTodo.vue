<template>
  <div class="mytodo-wrapper">
    <div class="panel-header">
      <div class="panel-title-box">
        <div class="panel-title">我的待办</div>
        <div v-if="props.messageList.length !== 0" class="message-dot" />
      </div>
    </div>
    <div v-if="props.messageList.length !== 0" class="card-wrap">
      <div v-for="(item, index) in props.messageList" :key="index" class="card" @click="toResolve(item)">
        <div class="card-title">
          <img
            class="card-title-icon"
            :src="`https://ysh-cdn.kaidicloud.com/prod/bee/dashboard-mytodo-icon-${index + 1}.png`"
            alt=""
          />
          <div class="card-title-text">{{ item.title }}</div>
        </div>
        <div class="card-content">
          {{
            item.type === MSG_FROM_CHAMBER
              ? +item.count === 1
                ? `${item.source}发来${item.count} 条入会申请 `
                : `收到${item.count}条入会申请`
              : item.type === MSG_FROM_ACTIVITY
              ? `${item.targetName}收到${item.count} 条报名审核 `
              : `您收到${item.count}条站内信 `
          }}
        </div>
        <div class="card-time">{{ changeTime(item.lastUpdateTime) }}</div>
      </div>
    </div>
    <div v-else class="entry">
      <img class="card-entry" src="https://ysh-cdn.kaidicloud.com/prod/bee/dashboard-charm-entry.png" alt="" />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import relativeTime from 'dayjs/plugin/relativeTime'
import { readStationMail } from '@/api/mass-notification/index'
import ZC from 'dayjs/locale/zh-cn'
dayjs.locale(ZC)
dayjs.extend(relativeTime)
export default {
  name: 'MyTodo',
  props: {
    messageList: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const MSG_FROM_CHAMBER = 1
    const MSG_FROM_ACTIVITY = 2
    const MSG_FROM_MYMAIL = 3
    const router = useRouter()
    const changeTime = value => {
      const val = Number(value)
      const strDate = dayjs(val).fromNow(true)
      if ((strDate.indexOf('天') !== -1 && Number(strDate.replace('天', '')) > 7) || strDate.indexOf('月') !== -1) {
        return dayjs(val).format('M月D号')
      } else if (strDate.indexOf('年') !== -1) {
        return dayjs(val).format('YYYY年M月D号')
      } else {
        return dayjs(val).fromNow()
      }
    }
    const toResolve = async item => {
      const { type, count, source, businessId } = item

      switch (type) {
        case MSG_FROM_CHAMBER:
          router.push('/member/audit')
          break
        case MSG_FROM_ACTIVITY:
          router.push('/activity/activity-verify')
          break
        case MSG_FROM_MYMAIL:
          if (count > 1) {
            router.push('/sms/mail')
          } else {
            await readStationMail({ id: businessId })

            router.push({
              name: '站内信详情',
              query: {
                id: source
              }
            })
          }
          break
      }
    }
    return {
      props,
      changeTime,
      toResolve,
      MSG_FROM_CHAMBER,
      MSG_FROM_ACTIVITY,
      MSG_FROM_MYMAIL
    }
  }
}
</script>

<style lang="scss" scoped>
.mytodo-wrapper {
  background: #fff;
  margin-top: 20px;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
  padding: 0 24px;
  box-sizing: border-box;
  border-bottom: 1px #eee solid;
}

.panel-title {
  font-size: 16px;
  font-weight: bolder;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
}

.panel-title-box {
  padding: 0 20px;
  display: flex;
  align-items: center;
}
.message-dot {
  margin: 0 7px;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #eb2626;
}
.card-wrap {
  .card {
    margin: 24px;
    border-radius: 2px;
    .card-title {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #000000;
      line-height: 22px;
      font-weight: bolder;
      .card-title-icon {
        border-radius: 50%;
        padding: 5px;
        width: 24px;
        height: 24px;
        margin-right: 12px;
        background-color: #ff7682;
      }
    }
    .card-content {
      width: 290px;
      margin-top: 14px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.75);
      line-height: 22px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .card-time {
      margin: 8px 0 25px 0;
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.25);
      line-height: 20px;
    }
  }
  .card:nth-of-type(1) {
    border-bottom: 1px solid #ebebeb;
    .card-title-icon {
      background-color: #40a9ff;
    }
  }
  .card:nth-of-type(2) {
    border-bottom: 1px solid #ebebeb;
    .card-title-icon {
      background-color: #a894f6;
    }
  }
}
.card-entry {
  width: 100%;
  position: relative;
  top: 50px;
}
</style>
