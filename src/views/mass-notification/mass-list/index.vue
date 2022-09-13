<template>
  <div class="containers">
    <tab :tab-list="tabList" @handleClick="handleClick" />
    <formComponent :active-name="activeName" />

    <kdDialog ref="kdDialog" :custom-footer="true" dialog-title="通知发送规则" :center="true" @hide="hide">
      <div slot="content">
        规则说明，文案先找业务定一下
      </div>
      <el-button slot="customFooter" type="primary" @click="hideSendRule">我知道啦</el-button>
    </kdDialog>
  </div>
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
import tab from './components/tab.vue'
import { sendList } from '@/api/mass-notification/index'
import { receiveType, channelTypeList } from '../util/label'
export default {
  name: 'Create',
  components: { kdDialog, tab, formComponent: () => import('./components/formComponent') },

  data() {
    return {
      // notification :通知列表  mass:群发管理 template:模板管理
      activeName: '',
      tabList: [],
      // 表格配置
      columnConfig: []
    }
  },
  created() {
    const { ckey } = this.$store.getters
    this.ckey = ckey
    this.restTypeData()
  },
  methods: {
    /** 请求 */
    // 拉取群发通知列表
    async sendListFunc() {
      await sendList()
    },
    /** 行为操作 */
    // 点击接收人
    receiverClick() {
      console.log('点击接收人')
    },
    onSubmit() {},
    // 删除已选活动
    handleSelect() {},
    /** 父子组件交互 */
    // tab改变时
    handleClick(name) {
      this.activeName = name
      console.log('handleClick', name)
    },
    /** 工具 */

    restTypeData() {
      if (this.ckey) {
        this.tabList = [{ name: 'notification', label: '通知列表' }]
      } else {
        this.tabList = [{ name: 'mass', label: '群发管理' }, { name: 'template', label: '模板管理' }]
      }
    },
    tableConfigUtil() {
      const columnConfig = [
        {
          prop: 'id',
          label: '姓名',
        },
        {
          prop: 'noticeTypeId',
          label: '所属类型',
          formatter: row => {
            let msg = '自定义通知'
            if (row.noticeTypeId === 1) { msg = '缴费通知' } else if (row.noticeTypeId === 2) { msg = '活动通知' } else if (row.noticeTypeId === 3) { msg = '招商活动' } else if (row.noticeTypeId === 4) { msg = '邀请入会' }
            return msg
          }
        },
        {
          prop: 'noticeTypeId',
          label: '同步渠道',
          formatter: row => {
            if (!row.groupSendStatVOS || row.groupSendStatVOS.length < 1) return ''
            const msg = []
            row.groupSendStatVOS.forEach(i => {
              msg.push(this.getTypeById('channel', i.channelTypeId))
              // === 1 ? '短信' : i.channelTypeId === 2 ? '订阅消息' : i.channelTypeId === 3 ? 'app通知' : '应用内通知'
            })
            return msg.join('、')
          }
        },
        {
          prop: 'receiveTypeId',
          label: '接收人类型',
          formatter: row => {
            return this.getTypeById('receive', row.id)
          }
        },
        {
          prop: 'receiverNum',
          label: '接收人',
          render: (h, scope) => {
            return (<div onClick = {this.receiverClick}>{scope.row.receiverNum}</div>)
          }
        },
        {
          prop: 'receiverNum',
          label: '已读/未读人数',
          render: (h, scope) => {
            return (<div onClick = {this.receiverClick}>{scope.row.receiverNum}</div>)
          }
        },
      ]
      this.columnConfig = columnConfig
    },
    // 根据id查找对应的文本
    getTypeById(type, id) {
      // 接收人类型
      if (type === 'receive') {
        const index = receiveType.findIndex(v => v.type === id)
        if (index === -1) { return '' }
        return receiveType[index].n
      }
      // 渠道类型
      if (type === 'channel') {
        const index = channelTypeList.findIndex(v => v.id === id)
        if (index === -1) { return '' }
        return channelTypeList[index].n
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.containers {
  padding: 20px;
}
</style>
