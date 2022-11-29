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
        <el-button type="primary" size="small" @click="onQueryChange({ pageNum: 1 })">查询</el-button>
      </el-form-item>
    </el-form>
    <div v-if="status === '1'" class="flex-x-between-center">
      <div>
        <el-button type="text" @click="importVisible = true">导入</el-button>
        <el-button
          type="text"
          @click="
            $router.push({
              path: '/activity/ipSort',
              query: { activityId }
            })
          "
        >
          参与人与名片排序设置
        </el-button>
      </div>
      <!-- 导表 -->
      <el-button :loading="exportLoaing" type="primary" @click="onExportExcel">导表</el-button>
    </div>

    <el-dialog :visible.sync="importVisible" title="导入" width="400px">
      <el-upload
        action="#"
        class="import-upload"
        drag
        :file-list="fileList"
        :before-upload="beforeUploadFile"
        :http-request="uploadFile"
        :on-remove="() => (fileList = [])"
      >
        <div class="import-upload-content">
          <i class="el-icon-plus" />
          <div class="import-upload-text">上传批量导入表</div>
        </div>
      </el-upload>
      <div slot="footer" class="flex-x-between-center">
        <el-button type="text" @click="onDownLoadSignin"> 下载导入表 </el-button>
        <el-button type="primary" @click="onUploadSignin"> 确认导入 </el-button>
      </div>
    </el-dialog>

    <KdTable
      v-loading="tableLoading"
      class="mt5"
      :columns="tableList"
      :rows="tableData"
      @selection-change="onSelectionChange"
    />

    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <el-dialog :visible.sync="rejectDialog.show" title="驳回理由" width="500px">
      <el-input v-model="rejectDialog.value" placeholder="请输入驳回理由" />
      <el-button slot="footer" type="primary" @click="onRejectApply">确定</el-button>
    </el-dialog>

    <!-- 替补人员弹窗 -->
    <el-dialog :visible.sync="subDialog.show" :title="subDialog.title" width="500px">
      <el-row :gutter="10">
        <el-col
          :span="20"
        ><el-input v-model="subDialog.phone" prefix-icon="el-icon-search" placeholder="手机号" clearable />
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="querySubDetail">识别</el-button></el-col>
      </el-row>
      <template v-if="subInfo">
        <div v-if="subInfo.uavatar"><img width="50" height="50" :src="subInfo.uavatar"></div>
        <div v-if="subInfo.userName">{{ subInfo.userName }}</div>
        <div v-if="subInfo.chamberName">{{ subInfo.chamberName }}</div>
      </template>
      <div v-else style="color: red">不存在该用户信息</div>
      <div slot="footer" class="flex-x-center-center">
        <el-button type="primary" @click.stop="setSubUser">确定</el-button>
      </div>
    </el-dialog>

    <!-- 设置座位弹窗 -->
    <el-dialog :visible.sync="seatDialog.show" title="设置座位号" width="500px">
      <el-row v-for="(v, i) of seatDialog.seats" :key="i" type="flex" align="middle">
        <el-col :span="3">座位{{ i + 1 }}</el-col>
        <template v-if="v.status === 1">
          <el-col :span="4">{{ v.seatName }}</el-col>
          <el-col :span="3" style="color: #999">已就坐</el-col>
        </template>
        <template v-else-if="v.status === 2">
          <el-col :span="4">{{ v.seatName }}</el-col>
          <el-col :span="3" style="color: red">空座</el-col>
          <el-col :span="10" style="color: #999">已安排其他会员上坐，设置为</el-col>
          <el-col
            :span="4"
            style="color: #999"
          ><div class="el-button--text" type="text" @click="setSitted(v)">已坐</div></el-col>
        </template>
        <template v-else>
          <el-col :span="16"><el-input v-model="v.seatName" placeholder="限10字内" maxlength="10" clearable /></el-col>
          <el-col
            :span="4"
          ><el-button
            type="text"
            style="color: red; margin-left: 10px"
            @click="seatDialog.seats.splice(i, 1)"
          >删除</el-button></el-col>
        </template>
      </el-row>
      <el-button
        v-if="
          !seatDialog.seats[0] ||
            (![1, 2].includes(seatDialog.seats[0].status) && seatDialog.seats.length < seatDialog.maxNum)
        "
        type="text"
        @click="seatDialog.seats.push({ seatName: '' })"
      >+新增</el-button>
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
      <div class="flex-x-center-center" style="padding-bottom: 20px; color: #999">
        报名 {{ singinDialog.maxNum }} 人
      </div>
      <div class="flex-x-center-center">
        <el-button
          :disabled="singinDialog.num <= 1"
          type="text"
          style="font-size: 24px; padding: 0 20px"
          @click="singinDialog.num--"
        >-</el-button>
        共到场
        <span style="font-size: 24px; padding: 0 5px">{{ singinDialog.num }}</span>
        人
        <el-button
          :disabled="singinDialog.num >= singinDialog.maxNum"
          type="text"
          style="font-size: 24px; padding: 0 20px"
          @click="singinDialog.num++"
        >+</el-button>
      </div>
      <el-button
        slot="footer"
        type="primary"
        @click="onSignin({ id: singinDialog.signinId, num: singinDialog.num, status: 1 })"
      >确定</el-button>
    </el-dialog>

    <el-dialog :visible.sync="ipCardVisible" title="名片信息" center width="560px">
      <div class="ip-card-wrap">
        <div class="avator" :style="{ backgroundImage: `url(${cardInfo.avatar})` }" />
        <div class="content">
          <div class="name">{{ cardInfo.userName || '-' }}</div>
          <div class="post">{{ cardInfo.cardIdentityPost }}</div>
          <div class="company">{{ cardInfo.cardIdentityUnit }}</div>
          <div class="phone">{{ cardInfo.cardPhone }}</div>
          <div class="email">{{ cardInfo.cardEmail }}</div>
          <div class="address">{{ cardInfo.cardAddress }}</div>
        </div>
      </div>

      <el-button slot="footer" type="primary" @click="ipCardVisible = false">我知道了</el-button>
    </el-dialog>
    <!-- 附件详情弹框 -->
    <attachmentVisible ref="attachmentVisible" :attachment-visible.sync="showAttachment" :item="row" />
  </el-card>
</template>

<script>
import { downloadFile } from '@/utils'
import { formatDate } from '../util'

import {
  getActivitySigninList,
  uploadSigninData,
  modifySigninStatus,
  saveRemark,
  handleSignin,
  querySubInfo,
  setSubUser,
  handleSignOut,
  getSigninStatusCount,
  resetSigninSeat,
  modifySeatStatus,
  getActivityExcel,
  getCardDetail
} from '@/api/activity/activity-verify-new'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    attachmentVisible: () => import('./AttachmentDetail')
  },
  props: {
    activity: {
      type: Object,
      required: true
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
        0: 0,
        1: 0,
        2: 0
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

      rejectDialog: {
        show: false,
        value: '',
        signinId: ''
      },

      subDialog: {
        show: false,
        title: '',
        phone: '',
        signinId: ''
      },

      subInfo: {},
      cardInfo: {},

      seatDialog: {
        show: false,
        seats: [],
        maxNum: 0,
        signinId: ''
      },

      remarkDialog: {
        show: false,
        signinId: '',
        value: ''
      },

      singinDialog: {
        show: false,
        signinId: '',
        maxNum: 0,
        num: 0
      },

      ipCardVisible: false,

      exportLoaing: false,
      // 当前操作的row
      row: null,
      // 附件详情弹框
      showAttachment: false
    }
  },
  computed: {
    activityId() {
      return this.activity.id
    },
    start() {
      return +this.activity.activityStartTime
    },
    end() {
      return +this.activity.activityEndTime
    },
    tableList() {
      const commonList = [
        {
          label: '用户信息',
          minWidth: 180,
          render: ({ row }) => (
            <div>
              {row.uavatar ? <img style="width:50px;height:50px" src={row.uavatar} /> : ''}
              <div>{row.userName}</div>
              <div>{row.phone}</div>
            </div>
          )
        },
        {
          label: '所属商会',
          minWidth: 180,
          prop: 'chamberName'
          // render: ({ row }) => row.chamberName
        },
        {
          label: '附件',
          minWidth: 240,
          // prop: 'attachment',
          render: ({ row }) => {
            const arr = []
            row.attachment &&
              row.attachment.forEach(element => {
                element.signValue &&
                  element.signValue.forEach(e => {
                    arr.push({ filename: e.filename, url: e.url, type: e.type })
                  })
              })
            return arr.map(m => {
              return (
                <div onClick={() => this.downloadFileAttach(m)} class="attachment">
                  {m.filename}
                </div>
              )
            })
          }
        },
        {}
      ]

      try {
        const tableNames = ['ApprovePerson', 'JoinPerson', 'RejectPerson']
        return this[`get${tableNames[this.status]}TableList`](commonList) || commonList
      } catch (error) {
        return commonList
      }
    }
  },
  watch: {
    status: {
      handler(newVal) {
        this.query = { pageSize: 10, pageNum: 1, namephone: '', seatStatus: -1, signStatus: -1 }
        if (newVal === '1') this.selectionDatas = []
        this.getTableData()
      }
    },
    importVisible(newVal) {
      if (!newVal && this.fileList.length) this.fileList = []
    }
  },
  created() {
    this.getStatusCount()
    if (this.initStatus !== this.status) {
      this.status = this.initStatus
    } else {
      this.getTableData()
    }
  },
  methods: {
    async downloadFileAttach(item) {
      if (item.type === 'file') {
        window.open(item.url)
      } else {
        this.downloadByBlob(item.url, item.filename)
      }

      // if (item.type === 'file') {
      // const a = document.createElement('a')
      // a.href = item.url
      // a.download = item.filename // 下载后文件名
      // a.style.display = 'none'
      // document.body.appendChild(a)
      // a.click() // 点击下载
      // document.body.removeChild(a) // 下载完成移除元素

      // window.open(item.url)
      // } else {
      //   const imgUrl = await generatePictureByDomId(this.sid)
      //   console.log(imgUrl)
      //   downloadFile({ title: this.title, url: imgUrl })
      // }

      // downloadFile({
      //   title: item.fileName,
      //   url: window.URL.createObjectURL(item.url)
      // })
    },
    downloadByBlob(url, name) {
      const image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, image.width, image.height)
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob)
          this.download(url, name)
          // 用完释放URL对象
          URL.revokeObjectURL(url)
        })
      }
    },
    download(href, name) {
      const eleLink = document.createElement('a')
      eleLink.download = name
      eleLink.href = href
      eleLink.click()
      eleLink.remove()
    },

    async getStatusCount() {
      const { data } = await getSigninStatusCount(this.activityId)
      this.statusCount = data
    },

    onQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.getTableData()
    },

    async getTableData() {
      this.tableLoading = true
      try {
        const {
          query: { pageNum: page, ...query },
          activityId,
          status
        } = this
        const {
          data: { totalRows, list }
        } = await getActivitySigninList(activityId, {
          page,
          status,
          ...query
        })
        this.total = totalRows
        this.tableData = list
      } catch (error) {
        /* console.log(error) */
      }
      this.tableLoading = false
    },

    async getCardDetail(cardId) {
      try {
        this.ipCardVisible = true
        const { data, state } = await getCardDetail(cardId)
        if (!state) return
        this.cardInfo = data
      } catch (e) {
        console.log(e)
      }
    },

    async onRejectApply() {
      const { value, signinId } = this.rejectDialog
      if (!value) return this.$message({ message: '请输入驳回理由', type: 'warning' })
      const { state } = await this.modifySigninStatus({ id: signinId, status: 2, reason: value })
      if (state === 1) this.rejectDialog.show = false
    },

    onSelectionChange(e) {
      this.selectionDatas = e
    },

    beforeUploadFile(file) {
      if (
        !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(
          file.type
        )
      ) {
        this.$message.error('上传文件只能是 XLSX 或 XLS 格式!')
        return false
      }
    },

    uploadFile(e) {
      this.fileList = [e.file]
    },

    onDownLoadSignin() {
      downloadFile({
        title: '报名信息模板表.xlsx',
        url: `${process.env.VUE_APP_BASE_API}/api/ec/singin/download/dynamicTemplate/${this.activityId}`
      })
    },

    async onUploadSignin() {
      if (!this.fileList.length) return this.$message({ message: '请选择上传文件', type: 'warning' })
      const formData = new FormData()
      formData.append('activityId', this.activityId)
      formData.append('file', this.fileList[0])
      const { state, msg } = await uploadSigninData(formData)
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.importVisible = false
        this.getTableData()
      }
    },

    initSubDialog(row) {
      this.subDialog = {
        show: true,
        title: row.subUserPhone ? '修改替补人员' : '设置替补人员',
        phone: row.subUserPhone,
        signinId: row.id
      }
      this.subInfo = {}
    },

    async querySubDetail() {
      const { data } = await querySubInfo(this.subDialog.phone)
      this.subInfo = data
    },

    async setSubUser() {
      const { phone, signinId } = this.subDialog
      if (!phone) return this.$message({ message: '请输入替补人员手机号', type: 'warning' })
      if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(phone)) {
        return this.$message({ message: '手机号格式错误', type: 'warning' })
      }
      const { state, msg } = await setSubUser({ phone, id: signinId })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.getTableData()
        this.subDialog.show = false
      }
    },

    initSeatDialog(row) {
      this.seatDialog = {
        show: true,
        seats: JSON.parse(JSON.stringify(row.seats || [])),
        maxNum: row.subscribeTotal,
        signinId: row.id
      }
    },

    async saveSeatsSettings() {
      const { seats, signinId } = this.seatDialog
      if (!seats.length || seats.some(v => !v.seatName)) {
        return this.$message({ message: '座位号不能为空', type: 'warning' })
      }
      if ([1, 2].includes(seats[0].status)) {
        this.seatDialog.show = false
        return
      }
      const { state, msg } = await resetSigninSeat(signinId, seats)
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.getTableData()
        this.seatDialog.show = false
      }
    },

    async setSitted(item) {
      const { signinId } = this.seatDialog
      const { state, msg } = await modifySeatStatus(signinId, [item.seatId])
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        item.status = 1
        const row = this.tableData.find(v => v.id === signinId)
        row.seats.find(v => v.seatId === item.seatId).status = 1
      }
    },

    async modifySigninStatus({ id, status, ...data }) {
      const { state, msg } = await modifySigninStatus({ id, status, activityId: this.activityId }, data)
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.getStatusCount()
        this.getTableData()
      }
      return { state }
    },

    async onDelSingin(row) {
      try {
        await this.$confirm('移除后可在已驳回列表找到该用户', '是否移除该参与人员？', {
          confirmButtonText: '确认移除',
          cancelButtonText: '取消'
        })
        this.modifySigninStatus({ id: row.id, status: 3 })
      } catch (error) {
        /* console.log(error) */
      }
    },

    async saveRemark() {
      const { value, signinId } = this.remarkDialog
      const { state, msg } = await saveRemark(signinId, { remark: value })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        const item = this.tableData.find(v => v.id === signinId)
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

    generateSigninTime() {
      return {
        label: '报名时间',
        minWidth: 150,
        render: ({ row }) => formatDate(row.createdTs)
      }
    },

    generateSigninInfo() {
      return {
        label: '报名信息',
        minWidth: 200,
        render: ({ row }) => {
          const signs = row.signs || []
          const dom = signs.map(v => (
            <div>
              {v.key}：{v.value}
            </div>
          ))
          const cardItemIndex = signs.findIndex(v => v.key === 'card')

          if (cardItemIndex > -1) {
            dom.splice(cardItemIndex, 1)
            dom.push(
              <el-button type="text" onClick={() => this.getCardDetail(signs[cardItemIndex].value)}>
                IP名片详情
              </el-button>
            )
          }

          return <div>{signs && signs.length ? dom : '-'}</div>
        }
      }
    },

    // 待审核
    getApprovePersonTableList(list = []) {
      return [
        ...list,
        this.generateSigninTime(),
        this.generateSigninInfo(),
        {
          label: '操作',
          fixed: 'right',
          minWidth: 80,
          render: ({ row }) => (
            <div>
              <el-button type="text" onClick={() => this.modifySigninStatus({ id: row.id, status: 1 })}>
                通过
              </el-button>
              <br />
              <el-button type="text" onClick={() => (this.rejectDialog = { show: true, value: '', signinId: row.id })}>
                <div style="color:red;">驳回</div>
              </el-button>
            </div>
          )
        }
      ]
    },
    //
    showAttachDetail(row) {
      this.row = row
      this.showAttachment = true
      this.$refs['attachmentVisible'].formData(row)
    },
    // 参与人员
    getJoinPersonTableList(list = []) {
      return [
        ...list,
        this.generateSigninInfo(),
        {
          label: '替补',
          minWidth: 120,
          render: ({ row }) => (
            <div>
              <div>{row.subUserName}</div>
              <div>{row.subUserPhone}</div>
              <el-button type="text" onClick={() => this.initSubDialog(row)}>
                {row.subUserPhone ? '修改替补人员' : '设置替补人员'}
              </el-button>
            </div>
          )
        },
        {
          label: '到场人数',
          minWidth: 120,
          render: ({ row }) => (
            <div>
              <div>预计到场：{row.subscribeTotal}</div>
              <div>
                到场人数：
              <span style={row.realTotal > 0 && row.realTotal < row.subscribeTotal ? 'color:red;' : ''}>
                {row.realTotal ? row.realTotal : '-'}
              </span>
              </div>
            </div>
          )
        },
        {
          label: '座位号',
          minWidth: 120,
          render: ({ row }) => (
            <div>
              {row.seats
                ? row.seats.map(v => {
                  if (v.status === 0) return <div>{v.seatName}</div>
                  if (v.status === 1) return <div style="color:#409eff;">{v.seatName}</div>
                  if (v.status === 2) return <div style="color:red;">{v.seatName} 空座</div>
                  return <div></div>
                })
                : '-'}
            </div>
          )
        },
        {
          label: '签到',
          render: ({ row }) => (row.signStatus === 1 ? '是' : '-')
        },
        {
          label: '签到时间',
          render: ({ row }) => (row.signTs ? formatDate(row.signTs) : '-')
        },
        {
          label: '签退',
          render: ({ row }) => (row.signOutStatus === 1 ? '是' : '-')
        },
        {
          label: '签退时间',
          render: ({ row }) => (row.signoutTs ? formatDate(row.signoutTs) : '-')
        },
        this.generateSigninTime(),
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
          render: ({ row }) => (
            <div>
              <div>{row.remark}</div>
              <el-button
                type="text"
                onClick={() => (this.remarkDialog = { show: true, signinId: row.id, value: row.remark || '' })}
              >
                备注
              </el-button>
            </div>
          )
        },
        {
          label: '操作',
          fixed: 'right',
          minWidth: 100,
          render: ({ row }) => {
            return (
              <div>
                <div>
                  <el-button type="text" onClick={() => this.initSeatDialog(row)}>
                    设置座位号
                  </el-button>
                </div>
                <div> {this.generateSigninButton(row)} </div>
                <div> {this.generateSignOutButton(row)} </div>
                <div>
                  <el-button type="text" onClick={() => this.onDelSingin(row)}>
                    <div style="color:red;">移除</div>
                  </el-button>
                  <el-button type="text" onClick={() => this.showAttachDetail(row)}>
                    附件详情
                  </el-button>
                </div>
              </div>
            )
          }
        }
      ]
    },
    generateSigninButton(row) {
      const { start, end } = this
      const now = Date.now()
      // 活动开始前1小时，才可以【签到】，直到已结束，其他时段不显示。
      if (now - start >= -1000 * 60 * 60 && now - end <= 0) {
        if (row.signStatus === 1) {
          return (
            <el-button type="text" onClick={() => this.onSignin({ id: row.id, num: 0, status: 2 })}>
              取消签到
            </el-button>
          )
        } else {
          return (
            <el-button
              type="text"
              onClick={() =>
                (this.singinDialog = {
                  show: true,
                  maxNum: row.subscribeTotal,
                  num: row.subscribeTotal,
                  signinId: row.id
                })
              }
            >
              签到
            </el-button>
          )
        }
      }
    },
    generateSignOutButton(row) {
      const { start, end } = this
      const now = Date.now()
      // 活动开始后和结束后一小时，才可以【签退】，其他时间不显示；
      if (now - start >= 0 && now - end <= 1000 * 60 * 60) {
        return row.signOutStatus === 1 ? (
          <el-button type="text" onClick={() => this.onSignOut({ id: row.id, status: 2 })}>
            取消签退
          </el-button>
        ) : (
          <el-button type="text" onClick={() => this.onSignOut({ id: row.id, status: 1 })}>
            签退
          </el-button>
        )
      }
    },
    // 已驳回
    getRejectPersonTableList(list = []) {
      return [
        ...list,
        this.generateSigninTime(),
        {
          label: '驳回时间',
          minWidth: 150,
          render: ({ row }) => formatDate(row.rejectDate)
        },
        {
          label: '驳回理由',
          prop: 'rejectReason'
        },
        this.generateSigninInfo(),
        {
          label: '操作',
          fixed: 'right',
          minWidth: 130,
          render: ({ row }) => (
            <el-button type="text" onClick={() => this.modifySigninStatus({ id: row.id, status: 4 })}>
              重新审核并通过
            </el-button>
          )
        }
      ]
    },
    async onExportExcel() {
      this.exportLoaing = true
      try {
        const {
          query: { namephone, seatStatus, signStatus },
          status,
          activityId,
          activity
        } = this
        const blob = await getActivityExcel(activityId, {
          namephone,
          seatStatus,
          signStatus,
          status,
          page: 1,
          pageSize: 1
        })
        downloadFile({
          title: `【参与人员】${activity.activityName}.xlsx`,
          url: window.URL.createObjectURL(blob)
        })
      } catch (error) {
        // console.log(error)
      }
      this.exportLoaing = false
    }
  }
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
    color: #999;
  }
}

.ip-card-wrap {
  display: flex;
  border: 1px solid #858585;
  border-radius: 10px;
  overflow: hidden;

  .avator {
    position: relative;
    width: 180px;
    height: 180px;
    background-color: #ccc;
    flex-shrink: 0;

    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      right: -50px;
      height: 100%;
      border: 50px solid transparent;
      border-bottom: 180px solid white;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 20px 0 10px;
  }

  .name {
    font-size: 20px;
    font-weight: bold;
  }

  .post,
  .company,
  .phone,
  .emial {
    line-height: 26px;
  }

  .phone {
    margin-top: 10px;
  }

  .address {
    margin-top: 6px;
  }
}
.attachment {
  color: #1890ff;
}
.el-button--text {
  cursor: pointer;
}
</style>
