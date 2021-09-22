import {
  getActivityApply,
  getActivitySource,
  getActivityApplyDetail,
  getActivityRejectApply,
  signActivityApply,
  aduitActivityApply,
  downloadActivityApply
} from '@/api/activity/activity-verify'

export default {
  data() {
    return {
      actId: '',
      applyDetail: {},
      applyDetailList: [],
      ckey: '',
      type: '1',
      previewImgVisible: false,
      previewUrl: '',
      query: {
        auditStatus: '',
        signStatus: '',
        name: '',
        phone: '',
        userType: '',
        chamberId: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      rejectReason: '',
      chamberOptions: [], // 活动来源数据
      showRejectDialog: false,
      showDetailDialog: false,
      showTipDialog: false,
      showMulBtn: false,
      selectionDatas: [],
      signed: false,
      unsign: false,
      rowData: null,
      auditFalg: null,
      mulAuditFalg: null,
      chamberName: null,
    }
  },
  created() {
    this.ckey = this.$store.getters.ckey
    this.actId = this.$route.query.activityId
    this.chamberName = this.$route.query.chamberName
    if (this.$route.query.type === 'auditStatus' && this.$route.query.status === -1) {
      this.query.auditStatus = -1
    }
    if (this.$route.query.type === 'auditStatus' && this.$route.query.status === 1) {
      this.query.auditStatus = 1
    }
    if (this.$route.query.type === 'auditStatus' && this.$route.query.status === 0) {
      this.query.auditStatus = 0
    }
    this.getApplyDetail()
    this.fetchData()
    this.getSourceOptions()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // 获取活动详情
    getApplyDetail() {
      getActivityApplyDetail({ activityId: this.actId }).then(res => {
        if (res.state === 1) {
          this.applyDetail = res.data
        }
      })
    },
    // 获取活动来源
    getSourceOptions() {
      getActivitySource().then(response => {
        this.chamberOptions = response.data
      })
    },
    // 查询活动报名审核列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      if (this.query.auditStatus === 0) {
        this.showMulBtn = true
      } else {
        this.showMulBtn = false
      }
      this.listLoading = true
      let params = {
        'activityId': this.actId,
        'auditStatus': this.query.auditStatus,
        'signStatus': this.query.signStatus,
        'name': this.query.name,
        'phone': this.query.phone,
        'userType': this.query.userType,
        'chamberId': this.query.chamberId,
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      getActivityApply(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    handleClick(tab) {
      this.type = tab.name
      this.fetchData()
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    // 批量通过/驳回
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        if (this.mulAuditFalg === 2) {
          this.selectionDatas.push({
            auditStatus: 2,
            activityId: data.activityId,
            id: data.id,
            auditReason: this.rejectReason
          })
        } else {
          this.selectionDatas.push({
            auditStatus: 1,
            activityId: data.activityId,
            id: data.id,
          })
        }
      }
    },
    handleMulAudit(falg) {
      if (this.selectionDatas.length === 0) {
        return this.$message.warning('请先选择数据')
      }
      if (falg === 1) {
        this.$confirm('确定通过吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'none'
        }).then(() => {
          aduitActivityApply(this.selectionDatas).then(res => {
            this.fetchData(1)
            this.$message.success(res.msg)
          })
        }).catch(() => {
        })
      } else {
        this.mulAuditFalg = falg
        this.showRejectDialog = true
      }
    },
    // 通过/驳回
    handleAudit(row, auditFalg) {
      this.rowData = row
      this.auditFalg = auditFalg
      if (auditFalg === 1) {
        this.$confirm('确定通过吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'none'
        }).then(() => {
          let paramsArr = []
          let paramsObj = {
            auditStatus: 1,
            activityId: this.rowData.activityId,
            id: this.rowData.id
          }
          paramsArr.push(paramsObj)
          aduitActivityApply(paramsArr).then(res => {
            this.fetchData(1)
            this.$message.success(res.msg)
          })
        }).catch(() => {
        })
      } else {
        this.showRejectDialog = true
      }
    },
    reject() {
      if (this.rejectReason.trim() === '') {
        return this.$message.error('驳回理由不能为空')
      }
      let paramsArr = []
      if (this.mulAuditFalg === 2) {
        paramsArr = this.selectionDatas
      } else {
        let paramsObj = {
          auditStatus: 2,
          activityId: this.rowData.activityId,
          id: this.rowData.id,
          auditReason: this.rejectReason
        }
        paramsArr.push(paramsObj)
      }
      aduitActivityApply(paramsArr).then(res => {
        this.list = []
        this.fetchData(1)
        this.$message.success('操作成功')
        this.showRejectDialog = false
      })
    },
    // 查看详情
    showDetail(row) {
      let params = {
        activityId: row.activityId,
        wxUserId: row.wxUserId
      }
      getActivityRejectApply(params).then(res => {
        this.applyDetailList = res.data
        this.showDetailDialog = true
      })
    },
    // 签到
    handleSign(e, row, falg) {
      if (falg === 1) {
        this.signed = true
        this.unsign = false
      } else {
        this.unsign = true
        this.signed = false
      }
      let params = {
        activityId: row.activityId,
        id: row.id, // 报名申请id
        signStatus: falg // 1已签到,2未签到
      }
      signActivityApply(params).then(res => {
        if (res.state === 1) {
          this.$message.success(res.msg)
        }
      })
    },
    // 下载签到表
    downloadSignTable() {
      let a = document.createElement('a')
      a.download = ''
      a.href = process.env.VUE_APP_BASE_API + '/api/ec/activity-apply/download?activityId=' + this.actId
      a.click()
    }
  }
}
