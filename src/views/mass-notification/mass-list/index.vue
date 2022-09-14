<template>
  <div class="containers">
    <tab :tab-list="tabList" @handleClick="handleClick" />
    <!-- 表单 -->
    <formComponent :active-name="activeName" @templateOperation="templateOperation" @query="sendListFunc" />
    <!-- 列表表格 -->
    <kdTable :table-data="tableData" :column-config="columnConfig" />
    <kdDialog />
    <!-- 分页 -->
    <KdPagination :page-size="query.pageSize" :current-page="query.page" :total="total" @change="change" />
    <receiveDialog
      ref="receiveRef"
      :table-data="dialog.tableData"
      :total="dialog.total"
      :column-config="dialog.columnConfig"
      :current-page="dialog.page"
      :page-size="dialog.pageSize"
      @change="receiveChange"
    />
    <!--  批量配置模板 -->
    <configUration :show-configuration.sync="showConfiguration" />
    <!-- 批量分配短信 -->
    <allocation :show-allocation.sync="showAllocation" />

  </div>
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
import tab from './components/tab.vue'
import { sendList, receiverInfoList, templateList } from '@/api/mass-notification/index'
import kdTable from '@/views/mass-notification/components/common/kdTable'
import KdPagination from '@/components/common/KdPagination'
import { receiveType, channelTypeList, memberPageListConfig } from '../util/label'
import configUration from './components/configUration'
import allocation from './components/allocation'

import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Create',
  components: { kdDialog, tab, kdTable, KdPagination, configUration, allocation, receiveDialog: () => import('../components/common/receiveDialog.vue'), formComponent: () => import('./components/formComponent') },

  data() {
    return {
      // notification :通知列表  mass:群发管理 template:模板管理
      activeName: '',
      tableData: [],
      // 表格配置
      columnConfig: [],
      // 列表的表单相关
      total: 0,
      query: {
        page: 1,
        pageSize: 10,
        noticeTypeId: 1,
      },
      // 弹框相关
      dialog: {
        query: {
          page: 1,
          pageSize: 10,

        },
        tableData: [],
        columnConfig: [],
        total: 0,

      },
      showDialog: false,
      showConfiguration: false, // 批量配置模板
      showAllocation: false // 批量分配短信
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
    // 拉取接收人
    async receiverListFunc(id) {
      const { data } = await receiverInfoList({ ...this.dialog.query, gsId: id })
      this.dialog.tableData = data.list.map(v => v.extend)
      this.dialog.total = data.totalRows
    },
    // 模板管理
    // async templateListFunc(){
    //   templateList
    // }
    /** 行为操作 */
    // 点击接收人
    receiverClick(row) {
      console.log('点击接收人')
      this.operationClick(6, row)
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

      } else if (type === 4) {
        // 导出发送记录

      } else if (type === 5) {
        // 未读重发

      } else if (type === 6) {
        // 接收人
        this.showDialog = true
        console.log('this.$refs[receiveRef]', this.$refs['receiveRef'])
        this.$refs['receiveRef'].$children[0].show()
        this.dialog.columnConfig = cloneDeep(memberPageListConfig)
        this.dialog.columnConfig.splice(0, 1)
        this.receiverListFunc(row.id)
      }
    },
    // 管理模板 分配短信
    templateOperation(type = 1) {
      if (type === 1) {
        // 管理模板
        this.showConfiguration = true
      } else if (type === 2) {
        // 分配短信
        this.showAllocation = true
      }
    },
    onSubmit() {},
    // 删除已选活动
    handleSelect() {},
    /** 父子组件交互 */
    change(val) {
      console.log('val', val)
    },
    // 弹框内分页的改变
    receiveChange(val) {
      console.log('val', val)
      // this.dialog.query.page = val?.pageNum && val.pageNum
      this.dialog.query.page = val?.pageNum
      this.dialog.query.pageSize = val.pageSize && val.pageSize
    },
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
            return (<el-link type="primary" onClick = {() => this.receiverClick(scope.row)}>{scope.row.receiverNum}</el-link>)
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
            return (<div class="operation"><el-link v-show={scope.row.editAuth === 1} type="primary" onClick={ () => this.operationClick(2, scope.row)}> 编辑</el-link> <el-link type="primary" v-show={scope.row.statAuth === 1} onClick={() => this.operationClick(1, scope.row)}>详情</el-link> <el-link v-show={scope.row.delAuth === 1} type="primary" onClick={() => this.operationClick(3, scope.row)}>删除</el-link> <el-link v-show={scope.row.statAuth === 1} type="primary" onClick={() => this.operationClick(4, scope.row)}>导出发送记录</el-link><el-link v-show={scope.row.resendAuth === 1} type="primary" onClick={() => this.operationClick(5, scope.row)}>未读重发</el-link></div>)
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
