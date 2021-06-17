import {
  getAuditList, getDetail, updateAudit
} from '@/api/content/article'

export default {
  data() {
    return {
      visible: false,
      rejectVisible: false,
      batchRejectVisible: false,
      query: {
        publishType: -1,
        publishTimeType: 2
        // auditType: -1
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      detailObj: {
        title: '',
        contentHtml: ''
      },
      selectId: '',
      remark: '内容违规'
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({tabName, actionName})
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({tabName, actionName})
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'publishType': this.query.publishType,
        'publishTimeType': this.query.publishTimeType
      }
      getAuditList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail(row) {
      this.selectId = row.id
      let params = {
        id: this.selectId
      }
      getDetail(params).then(response => {
        this.detailObj = response.data.dtl
      }).catch(error => {
        reject(error)
      })
      this.visible = true
    },
    passThrough(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let ids = []
      ids.push(this.selectId)
      let params = {
        'articleIds': ids,
        'auditStatus': 1
      }
      updateAudit(params).then(response => {
        this.$message({
          message: '通过成功',
          type: 'success'
        })
        this.visible = false
        this.fetchData()
      })
    },
    openReject(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.rejectVisible = true
      this.remark = '内容违规'
    },
    reject() {
      let ids = []
      ids.push(this.selectId)
      let params = {
        'articleIds': ids,
        'auditStatus': 2,
        'remark': this.remark
      }
      updateAudit(params).then(response => {
        this.$message({
          message: '驳回成功',
          type: 'success'
        })
        this.rejectVisible = false
        this.visible = false
        this.fetchData()
      })
    },
    batchPassThrough(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'articleIds': this.selectionDatas,
        'auditStatus': 1
      }
      updateAudit(params).then(response => {
        this.$message({
          message: '通过成功',
          type: 'success'
        })
        this.visible = false
        this.fetchData()
      })
    },
    openBatchReject(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.batchRejectVisible = true
      this.remark = '内容违规'
    },
    batchReject() {
      let params = {
        'articleIds': this.selectionDatas,
        'auditStatus': 2,
        'remark': this.remark
      }
      updateAudit(params).then(response => {
        this.$message({
          message: '驳回成功',
          type: 'success'
        })
        this.batchRejectVisible = false
        this.visible = false
        this.fetchData()
      })
    },
    handlerChange(value) {
      this.query.tradeType = value[value.length - 1]
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    }
  }
}
