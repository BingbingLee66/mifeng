<template>
  <Panel class="myTodo-wrap">
    <div class="panel-header">
      <div class="panel-title-box">
        <div class="panel-title">我的待办</div>
        <div v-if="messageList.length !== 0" class="message-dot" />
      </div>
    </div>
    <div v-if="messageList.length !== 0" class="card-wrap">
      <div v-for="(item, index) in messageList" :key="index" class="card" @click="toResolve(item.type, item.count)">
        <div class="card-title">
          <div class="el-icon-edit" />
          <div>{{ item.title }}</div>
        </div>
        <div class="card-content">
          {{
            item.type === 1
              ? `${item.targetName}发来${item.count} 条入会申请 `
              : item.type === 2
                ? `${item.targetName}收到${item.count} 条报名审核 `
                : `您收到${item.count}条站内信 `
          }}
        </div>
        <div class="card-time">{{ changeTime(item.lastUpdateTime) }}</div>
      </div>
    </div>
    <div v-else>
      <img class="card-entry" src="../../../../public/img/dashboard-charm-entry.png">
    </div>
  </Panel>
</template>

<script>
import Panel from '../../../components/panel'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ZC from 'dayjs/locale/zh-cn'
dayjs.locale(ZC)
dayjs.extend(relativeTime)
export default {
  name: 'MyTodo',
  components: {
    Panel
  },
  props: {
    messageList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // messageList: [
      //   {
      //     title: '入会审核',
      //     targetName: '色能目型理可鉴赏课十九点回',
      //     type: 1,
      //     count: 2,
      //     lastUpdateTime: '1668055089000'
      //   },
      //   {
      //     title: '活动报名审核',
      //     targetName: '全展组定步',
      //     type: 2,
      //     count: 3,
      //     lastUpdateTime: '1667277489000'
      //   },
      //   {
      //     title: '站内信',
      //     targetName: '全展阿斯弗步',
      //     type: 3,
      //     count: 6,
      //     lastUpdateTime: '1636259889000'
      //   }
      //  ]
    }
  },
  methods: {
    changeTime(value) {
      const val = Number(value)
      const strDate = dayjs(val).fromNow(true)
      if ((strDate.indexOf('天') !== -1 && Number(strDate.replace('天', '')) > 7) || strDate.indexOf('月') !== -1) {
        return dayjs(val).format('M月D号')
      } else if (strDate.indexOf('年') !== -1) {
        return dayjs(val).format('YYYY年M月D号')
      } else {
        return dayjs(val).fromNow()
      }
    },
    toResolve(type, count) {
      switch (type) {
        case 1:
          this.$router.push('/member/audit')
          break
        case 2:
          this.$router.push('/activity/activity-verify')
          break
        case 3:
          if (count > 1) {
            this.$router.push('/sms/mail')
          } else {
            this.$router.push('/sms/mail-detail')
          }

          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
  display: flex;
  .card {
    padding: 25px 35px;
    width: 25%;
    border: 1px solid #ebebeb;
    border-radius: 2px;
    .card-title {
      margin: 10px 0;
      display: flex;
      font-size: 15px;
      font-weight: 600;
    }
    .card-content {
      width: 245px;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .card-time {
      float: right;
      font-size: 12px;
    }
  }
}
.card-entry {
  height: 170px;
}
</style>
