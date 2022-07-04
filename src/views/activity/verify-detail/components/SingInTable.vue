<template>
  <el-card shadow="never">
    <el-tabs v-model="status">
      <el-tab-pane :label="`待审核(${statusCount[0]})`" name="0" />
      <el-tab-pane :label="`参与人员(${statusCount[1]})`" name="1" />
      <el-tab-pane :label="`已驳回(${statusCount[2]})`" name="2" />
    </el-tabs>
    <el-form inline>
      <el-form-item>
        <el-input v-model="query.namephone" placeholder="用户名、手机号" clearable />
      </el-form-item>
      <template v-if="status === '1'">
        <el-form-item label="签到状态">
          <el-select v-model="query.signStatus" placeholder="请选择">
            <el-option label="全部" :value="-1" />
            <el-option label="待签到" :value="0" />
            <el-option label="已签到" :value="1" />
            <el-option label="未签到" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="空置座位">
          <el-select v-model="query.seatStatus" placeholder="请选择">
            <el-option label="全部" :value="-1" />
            <el-option label="未坐" :value="0" />
            <el-option label="已坐" :value="1" />
            <el-option label="空座" :value="2" />
          </el-select>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" size="small" @click="onQueryChange({pageNum:1})">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="flex-x-between-center">
      <el-button v-if="status === '1'" type="text" @click="importVisible=true">导入</el-button>
      <i v-else />
      <el-button type="primary">导表</el-button>
    </div>

    <el-dialog :visible.sync="importVisible" title="导入" width="400px">
      <el-upload
        action="#"
        class="import-upload"
        drag
        :file-list="fileList"
        :before-upload="beforeUploadFile"
        :http-request="uploadFile"
        :on-remove="()=>(fileList=[])"
      >
        <div class="import-upload-content">
          <i class="el-icon-plus" />
          <div class="import-upload-text">上传批量导入表</div>
        </div>
      </el-upload>
      <div slot="footer" class="flex-x-between-center">
        <el-button type="text" @click="onDownLoadSingin"> 下载导入表 </el-button>
        <el-button type="primary" @click="onUploadSingin"> 确认导入 </el-button>
      </div>
    </el-dialog>

    <KdTable v-loading="tableLoading" class="mt5" :list="tableList" :data="tableData" @selection-change="onSelectionChange" />

    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <!-- 替补人员弹窗 -->
    <el-dialog :visible.sync="subDialog.show" :title="subDialog.title" width="500px">
      <el-row :gutter="10">
        <el-col :span="20"><el-input v-model="subDialog.phone" prefix-icon="el-icon-search" placeholder="手机号" clearable /> </el-col>
        <el-col :span="4"><el-button type="primary" @click="querySubDetail">识别</el-button></el-col>
      </el-row>
      <template v-if="subInfo">
        <div v-if="subInfo.uavatar"><img width="50" height="50" :src="subInfo.uavatar"></div>
        <div v-if="subInfo.userName">{{ subInfo.userName }}</div>
        <div v-if="subInfo.chamberName">{{ subInfo.chamberName }}</div>
      </template>
      <div v-else style="color:red;">不存在该用户信息</div>
      <div slot="footer" class="flex-x-center-center"><el-button type="primary">确定</el-button></div>
    </el-dialog>

    <!-- 设置座位弹窗 -->
    <el-dialog :visible.sync="seatDialog.show" title="设置座位号" width="500px">
      <el-row
        v-for="(v,i) of seatDialog.seats"
        :key="i"
        type="flex"
        align="middle"
      >

        <el-col :span="3">座位{{ i+1 }}</el-col>
        <template v-if="v.status === 1">
          <el-col :span="4">{{ v.num }}</el-col>
          <el-col :span="3" style="color:#999;">已就坐</el-col>
        </template>
        <template v-else-if="v.status === 2">
          <el-col :span="4">{{ v.num }}</el-col>
          <el-col :span="3" style="color:red;">空座</el-col>
          <el-col :span="10" style="color:#999;">已安排其他会员上坐，设置为</el-col>
          <el-col :span="4" style="color:#999;"><el-button type="text">已就坐</el-button></el-col>
        </template>
        <template v-else>
          <el-col :span="16"><el-input v-model="v.num" placeholder="限10字内" maxlength="10" clearable /></el-col>
          <el-col :span="4"><el-button type="text" style="color:red;margin-left:10px;" @click="seatDialog.seats.splice(i,1)">删除</el-button></el-col>
        </template>

      </el-row>
      <el-button v-if="!seatDialog.seats[0] || (![1,2].includes(seatDialog.seats[0].status) && seatDialog.seats.length<seatDialog.maxNum)" type="text" @click="seatDialog.seats.push({num:''})">+新增</el-button>
      <div class="flex-x-end-center"><el-button type="primary" @click="saveSeatsSettings">确定</el-button></div>
    </el-dialog>

    <!-- 备注弹窗 -->
    <el-dialog :visible.sync="remarkDialog.show" title="备注" width="500px">
      <el-input
        v-model.trim="remarkDialog.value"
        type="textarea"
        placeholder="限100字内"
        maxlength="100"
        :rows="5"
        resize="none"
      />
      <el-button slot="footer" type="primary" @click="saveRemark">确定</el-button>
    </el-dialog>

    <!-- 签到弹窗 -->
    <el-dialog :visible.sync="singinDialog.show" title="到场人数" center width="500px">
      <div class="flex-x-center-center" style="padding-bottom: 20px;color:#999;">报名 {{ singinDialog.maxNum }} 人</div>
      <div class="flex-x-center-center">
        <el-button :disabled="singinDialog.num<=1" type="text" style="font-size: 24px;padding: 0 20px;" @click="singinDialog.num--">-</el-button>
        共到场
        <span style="font-size:24px;padding: 0 5px;">{{ singinDialog.num }}</span>
        人
        <el-button :disabled="singinDialog.num>=singinDialog.maxNum" type="text" style="font-size: 24px;padding: 0 20px;" @click="singinDialog.num++">+</el-button>
      </div>
      <el-button slot="footer" type="primary" @click="onSignin({id:singinDialog.singinId,num:singinDialog.num,status:1})">确定</el-button>
    </el-dialog>

  </el-card>
</template>

<script>
import { formatDate, downloadFile } from '../util'

import {
  getActivitySinginList,
  uploadSinginData,
  modifySinginStatus,
  saveRemark,
  handleSignin,
  querySubInfo,
  setSubUser,
  handleSignOut,
  getSigninStatusCount
} from '@/api/activity/activity-verify-new'

export default {
  components: {
    KdTable: () => import('@/components/KdTable/index'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  props: {
    activityId: {
      type: Number,
      default: undefined
    },
    initStatus: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      status: '0',
      statusCount: {
        0: 0, 1: 0, 2: 0
      },
      tableData: [],
      tableLoading: false,

      importVisible: false,

      fileList: [],

      // 查询参数
      query: {
        pageSize: 10,
        pageNum: 1,
        namephone: '',
        seatStatus: -1,
        signStatus: -1
      },

      total: 0,

      subDialog: {
        show: false,
        title: '',
        phone: '',
        singinId: ''
      },

      subInfo: { },

      seatDialog: {
        show: false,
        seats: [],
        maxNum: 0,
        singinId: ''
      },

      remarkDialog: {
        show: false,
        singinId: '',
        value: ''
      },

      singinDialog: {
        show: false,
        singinId: '',
        maxNum: 0,
        num: 0
      }
    }
  },
  computed: {
    tableList() {
      const commonList = [
        { type: 'selection', width: 55 },
        {
          label: '用户信息',
          minWidth: 180,
          render: ({ row }) => (<div>
            <img style='width:50px;height:50px' src={row.uavatar} />
            <div>{row.userName}</div>
            <div>{row.phone}</div>
          </div>)
        },
        {
          label: '所属商会',
          minWidth: 180,
          prop: 'chamberName'
          // render: ({ row }) => row.chamberName
        },
      ]
      try {
        const tableNames = ['ApprovePerson', 'JoinPerson', 'RejectPerson']
        return this[`get${tableNames[this.status]}TableList`](commonList) || commonList
      } catch (error) {
        return commonList
      }
    },
  },
  watch: {
    status: {
      handler() {
        this.query = { pageSize: 10, pageNum: 1, namephone: '', seatStatus: -1, signStatus: -1 }
        this.getTableData()
      }
    },
    importVisible(newVal) {
      if (!newVal && this.fileList.length) this.fileList = []
    }
  },
  created() {
    this.getStatusCount()
    if (this.initStatus) this.status = this.initStatus
    this.getTableData()
  },
  methods: {
    async getStatusCount() {
      const { data } = await getSigninStatusCount()
      this.statusCount = data
    },

    onQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.getTableData()
    },

    async getTableData() {
      this.tableLoading = true
      try {
        const { query: { pageNum: page, ...query }, activityId, status } = this
        const { data: { totalRows, list }} = await getActivitySinginList(activityId, {
          page,
          status,
          ...query,
        })
        this.total = totalRows
        list.push({})
        this.tableData = list
      } catch (error) { /* console.log(error) */ }
      this.tableLoading = false
    },

    onSelectionChange(e) {
      this.selectionDatas = e.map(v => ({

      }))
    },

    beforeUploadFile(file) {
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
        this.$message.error('上传文件只能是 XLSX 或 XLS 格式!')
        return false
      }
    },

    uploadFile(e) {
      this.fileList = [e.file]
    },

    onDownLoadSingin() {
      downloadFile({
        title: '报名信息模板表.xlsx',
        url: 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/static/%E6%8A%A5%E5%90%8D%E4%BF%A1%E6%81%AF%E8%A1%A8-%E6%8E%92%E4%BD%8D%E7%AD%BE%E5%88%B0.xlsx'
      })
    },

    async onUploadSingin() {
      if (!this.fileList.length) return this.$message({ message: '请选择上传文件', type: 'warning' })
      const formData = new FormData()
      formData.append('activityId', this.activityId)
      formData.append('file', this.fileList[0])
      const { data } = await uploadSinginData(formData)
      console.log(data)
    },

    initSubDialog(row) {
      this.subDialog = {
        show: true,
        title: row.subUserPhone ? '修改替补人员' : '设置替补人员',
        phone: '',
        singinId: row.id
      }
      this.subInfo = {}
    },

    async querySubDetail() {
      const { data } = await querySubInfo(this.subDialog.phone)
      this.subInfo = data
    },

    async setSubUser() {
      const { phone, singinId } = this.subDialog
      const { state, msg } = setSubUser({ phone, id: singinId })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.getTableData()
        this.subDialog.show = true
      }
    },

    initSeatDialog(row) {
      this.seatDialog = {
        show: true,
        seats: JSON.parse(JSON.stringify(row.seats || [])),
        maxNum: row.subscribeTotal,
        singinId: row.id
      }
    },

    async saveSeatsSettings() {
      const { seats } = this.seatDialog
      if (!seats.length || seats.some(v => !v.num)) return this.$message({ message: '座位号不能为空', type: 'warning' })
      if ([1, 2].includes(seats[0].status)) {
        this.seatDialog.show = false
        return
      }
    },

    async modifySinginStatus(data) {
      const { state, msg } = await modifySinginStatus(data)
      if (state === 1) {
        this.getStatusCount()
        this.getTableData()
      }
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
    },

    async onDelSingin(row) {
      try {
        await this.$confirm('移除后可在已驳回列表找到该用户', '是否移除该参与人员？', {
          confirmButtonText: '确认移除',
          cancelButtonText: '取消',
        })
        this.modifySinginStatus({ id: row.id, status: 3 })
      } catch (error) { /* console.log(error) */ }
    },

    async saveRemark() {
      const { value, singinId } = this.remarkDialog
      const { state, msg } = await saveRemark(singinId, { remark: value })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        const item = this.tableData.find(v => v.id === singinId)
        item.remark = value
        this.remarkDialog.show = false
      }
    },

    async onSignin({ id, num, status }) {
      const { state, msg } = await handleSignin({ id, num, status })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.getTableData()
        this.singinDialog.show = false
      }
    },

    async onSignOut({ id, status }) {
      const { state, msg } = await handleSignOut({ id, status })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.getTableData()
      }
    },

    generateSinginTime() {
      return {
        label: '报名时间',
        minWidth: 150,
        render: ({ row }) => formatDate(row.createdTs)
      }
    },

    generateSinginInfo() {
      return {
        label: '报名信息',
        minWidth: 200,
        render: ({ row }) => (<div>
          {row.signs ? row.signs.map(v => <div>{v.key}：{v.value}</div>) : '-'}
        </div>)
      }
    },

    // 待审核
    getApprovePersonTableList(list = []) {
      return [
        ...list,
        this.generateSinginTime(),
        this.generateSinginInfo(),
        {
          label: '操作',
          fixed: 'right',
          minWidth: 80,
          render: ({ row }) => (<div>
            <el-button type='text' onClick={() => this.modifySinginStatus({ id: row.id, status: 1 })}>通过</el-button>
            <br />
            <el-button type='text' onClick={() => this.modifySinginStatus({ id: row.id, status: 2 })}><div style='color:red;'>驳回</div></el-button>
          </div>)
        }
      ]
    },
    // 参与人员
    getJoinPersonTableList(list = []) {
      return [
        ...list,
        this.generateSinginInfo(),
        {
          label: '替补',
          minWidth: 120,
          render: ({ row }) => (<div>
            <div>{row.subUserName}</div>
            <div>{row.subUserPhone}</div>
            <el-button type='text' onClick={() => this.initSubDialog(row)} >
              {row.subUserPhone ? '修改替补人员' : '设置替补人员'}
            </el-button>
          </div>)
        },
        {
          label: '到场人数',
          minWidth: 120,
          render: ({ row }) => (<div>
            <div>预计到场：{row.subscribeTotal}</div>
            <div>到场人数：
              <span style={row.realTotal > 0 && row.realTotal < row.subscribeTotal ? 'color:red;' : ''}>
                {row.realTotal ? row.realTotal : '-'}
              </span>
            </div>
          </div>)
        },
        {
          label: '座位号',
          minWidth: 120,
          render: ({ row }) => (<div>
            {row.seats ? row.seats.map(v => {
              if (v.status === 0) return <div>{v.num}</div>
              if (v.status === 1) return <div style='color:#409eff;'>{v.num}</div>
              if (v.status === 2) return <div style='color:red;'>{v.num} 空座</div>
            }) : '-'}
          </div>)
        },
        {
          label: '签到',
          render: ({ row }) => row.signStatus === 1 ? '是' : '-'
        },
        {
          label: '签退',
          render: ({ row }) => row.signOutStatus === 1 ? '是' : '-'
        },
        this.generateSinginTime(),
        {
          label: '来源',
          render: ({ row }) => {
            if (row.sourceType === 1) return '导入'
            if (row.sourceType === 2) return '小程序报名'
            if (row.sourceType === 3) return '临时签到'
            return '-'
          }
        },
        {
          label: '备注',
          render: ({ row }) => (<div>
            <div>{row.remark}</div>
            <el-button
              type='text'
              onClick={() => (this.remarkDialog = { show: true, singinId: row.id, value: row.remark || '' })}
            >备注</el-button>
          </div>)
        },
        {
          label: '操作',
          fixed: 'right',
          minWidth: 100,
          render: ({ row }) => (<div>
            <div><el-button type='text' onClick={() => this.initSeatDialog(row)}>设置座位号</el-button></div>
            <div>
              {
                row.signStatus === 1
                  ? <el-button type='text' onClick={() => this.onSignin({ id: row.id, num: 0, status: 2 })}>取消签到</el-button>
                  : <el-button
                    type='text'
                    onClick={() => (this.singinDialog = { show: true, maxNum: row.subscribeTotal, num: row.subscribeTotal, singinId: row.id })}>签到</el-button>
              }
            </div>
            <div>
              {
                row.signOutStatus === 1
                  ? <el-button type='text' onClick={() => this.onSignOut({ id: row.id, status: 2 })}>取消签退</el-button>
                  : <el-button type='text' onClick={() => this.onSignOut({ id: row.id, status: 1 })}>签退</el-button>
              }
            </div>
            <div><el-button type='text' onClick={() => this.onDelSingin(row)}><div style='color:red;'>移除</div></el-button></div>
          </div>)
        },
      ]
    },
    // 已驳回
    getRejectPersonTableList(list = []) {
      return [
        ...list,
        this.generateSinginTime(),
        {
          label: '驳回时间',
          minWidth: 150,
          render: ({ row }) => formatDate(row.rejectDate)
        },
        {
          label: '驳回理由',
          prop: 'rejectReason',
        },
        this.generateSinginInfo(),
        {
          label: '操作',
          fixed: 'right',
          minWidth: 130,
          render: ({ row }) => <el-button type='text' onClick={() => this.modifySinginStatus({ id: row.id, status: 1 })}>重新审核并通过</el-button>
        }
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.mt5 {
  margin-top: 5px;
}

.import-upload-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .el-icon-plus {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .import-upload-text {
    font-size: 20px;
    color: 999;
  }
}
</style>
