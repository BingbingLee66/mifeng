<template>
  <div class="containers">
    <tab :tab-list="tabList" @handleClick="handleClick" />
    <formComponent :active-name="activeName" @query="sendListFunc" />
    <kdTable :table-data="tableData" :column-config="columnConfig" />
    <kdDialog />
    <KdPagination :page-size="query.pageSize" :current-page="query.page" :total="total" @change="change" />
    <!-- <kdDialog ref="
      kd-dialog-
      :custom-footer="true"
      dialog-title="通知发送规则"
      :center="true"
      @hide="hide"
    >
      <div slot="content">
        规则说明，文案先找业务定一下
      </div>
      <el-button slot="customFooter" type="primary" @click="hideSendRule">我知道啦</el-button>
      </kdDialog> -->
  </div>
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
import tab from './components/tab.vue'
import { sendList, templateList } from '@/api/mass-notification/index'
import kdTable from '@/views/mass-notification/components/common/kdTable'
import KdPagination from '@/components/common/KdPagination'
import { receiveType, channelTypeList } from '../util/label'
import dayjs from 'dayjs'
export default {
  name: 'Create',
  components: { kdDialog, tab, kdTable, KdPagination, formComponent: () => import('./components/formComponent') },

  data() {
    return {
      // notification :通知列表  mass:群发管理 template:模板管理
      activeName: '',
      tableData: [],
      // 表格配置
      columnConfig: [],
      query: {
        page: 1,
        pageSize: 10,
        noticeTypeId: 1,
      },
      total: 0,

    }
  },
  created() {
    const { ckey } = this.$store.getters
    this.ckey = ckey
    this.restTypeData()
    this.tableConfigUtil()
    this.sendListFunc()
  },
  methods: {
    /** 请求 */
    // 拉取群发通知列表 and群发管理列表(总后台)
    async sendListFunc(val) {
      console.log('val', val)
      let API = sendList
      let query = { ...this.query }
      if (this.activeName === 'template') {
        API = templateList
      } else {
        if (val) { query = Object.assign(query, val) }
      }

      const { data } = await API(query)
      this.tableData = data.list
      this.total = data.totalRows
    },
    // 模板管理
    // async templateListFunc(){
    //   templateList
    // }
    /** 行为操作 */
    // 点击接收人
    receiverClick() {
      console.log('点击接收人')
    },
    // 群发通知点击操作栏
    operationClick(type = 1, row) {
      console.log('row', row, type)
      // 详情
      if (type === 1) {
        // 打开详情弹框

      } else if (type === 2) {
        // 编辑

      } else if (type === 3) {
        // 删除

      }
    },
    // 管理模板 分配短信
    templateOperation(type = 1) {
      if (type === 1) {
        // 管理模板

      } else if (type === 1) {
        // 分配短信

      }
    },
    onSubmit() {},
    // 删除已选活动
    handleSelect() {},
    /** 父子组件交互 */
    change() {},
    // tab改变时
    handleClick(name) {
      this.activeName = name
      this.tableConfigUtil()
      this.sendListFunc()
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
    // 群发通知表格配置
      let columnConfig = [
        {
          prop: 'id',
          label: 'ID',
          width: 180
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
            return this.getTypeById('receive', row.receiveTypeId)
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
            return (
              scope.row.groupSendStatVOS && scope.row.groupSendStatVOS.map(item => { return <div><span>{this.getTypeById('channel', item.channelTypeId)}：</span><el-link type="primary">{item.readNum}/{item.unreadNum}</el-link> </div> })

            )
          }
        },
        {
          prop: 'readRate',
          label: '已读率',
          formatter: row => {
            return row.readRate * 100 + '%'
          }
        },
        {
          prop: 'sendTs',
          label: '发送时间',
          width: 160,
          render: (h, scope) => {
            const time = dayjs(parseInt(scope.row.sendTs)).format('YYYY-MM-DD HH:mm:ss')
            return (<div><div>{scope.row.sendType === 2 ? '定时发送' : ''}</div>  <div>{time}</div></div>)
          }
        },
        {
          prop: 'createInfo',
          label: '创建信息',
          width: 160,
          render: (h, scope) => {
            const time = dayjs(parseInt(scope.row.createInfo.operatorTime)).format('YYYY-MM-DD HH:mm:ss')
            return (<div> <div type="primary">{scope.row.createInfo.operatorName}</div>  <div>{time}</div></div>)
          }
        },
        {
          prop: 'updateInfo',
          label: '更新信息',
          width: 160,
          render: (h, scope) => {
            const time = dayjs(parseInt(scope.row.updateInfo.operatorTime)).format('YYYY-MM-DD HH:mm:ss')
            return (<div><div>{scope.row.updateInfo.operatorName}</div>  <div>{time}</div></div>)
          }
        },
        {
          prop: 'operation',
          label: '操作',
          render: (h, scope) => {
            return (<div class="operation"><el-link type="primary" onClick={ () => this.operationClick(2, scope.row)}> 编辑</el-link> <el-link type="primary" onClick={() => this.operationClick(1, scope.row)}>详情</el-link> <el-link type="primary" onClick={() => this.operationClick(3, scope.row)}>删除</el-link> </div>)
            // return (<div class="operation"><el-link type="primary" onClick={ () => this.updateItem(scope.row)}> 编辑</el-link> <el-link type="primary" onClick={() => this.detailItem(scope.row)}>详情</el-link> <el-link type="primary" onClick={() => this.deleteItem(scope.row)}>删除</el-link> </div>)
          }
        },
      ]
      // 群发管理
      if (this.activeName === 'mass') {
        this.columnConfig.unshift({
          prop: 'chamberName',
          label: '商协会名称',
          width: 180
        })
      }
      // 模板管理列表
      if (this.activeName === 'template') {
        columnConfig = [
          {
            prop: 'chamberName',
            label: '商协会名称',
          },
          {
            prop: 'smsTempNum',
            label: '短信模板',
          },
          {
            prop: 'subscriptionTempNum',
            label: '订阅消息模板',
          },
          {
            prop: 'appNoticeTempNum',
            label: 'APP通知模板',
          },
          {
            prop: 'smsDistributionSum',
            label: '短信总数',
          },
          {
            prop: 'smsRemainSum',
            label: '短信剩余量',
          },
          {
            prop: 'smsSuccSum',
            label: '短信发送成功',
          },
          {
            prop: 'smsFailSum',
            label: '短信发送失败',
          },
          {
            prop: 'smsDistributionNum',
            label: '分配记录',
          },
          {
            prop: 'operation',
            label: '操作',
            render: (h, scope) => {
              return (<div class="operation"><el-link type="primary" onClick={ () => this.templateOperation(1, scope.row)}> 管理模板</el-link> <el-link type="primary" onClick={() => this.templateOperation(2, scope.row)}>分配短信</el-link>  </div>)
            }
          },
        ]
      }
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
.operation {
  display: flex;
  flex-direction: column;
}
</style>
