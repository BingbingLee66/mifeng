import { reauditList, getMemberAuditDetail, updateReaudit } from '@/api/member/manager'
import DetailDialog from './component/detailDialog.vue'
export default {
  data() {
    return {
      rejectVisible: false,
      batchRejectVisible: false,
      detailVisible: false,
      audit: {
        id: '',
        remark: '资料不属实',
      },
      detailObj: {},
      query: {
        auditStatus: 0
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      //驳回理由
      rejectionReason: "",
      //当前正在操作的会员
      currentRow: null,
    }
  },
  components: {
    "DetailDialog": DetailDialog
  },
  computed: {
  },
  created() {
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
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
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'ckey': this.$store.getters.ckey,
        'auditStatus': this.query.auditStatus,
        'pageSize': this.limit,
        'page': this.currentpage
      }
      reauditList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail(e, row) {
      console.log('e', e);
      console.log('row', row)
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      // window.localStorage.setItem('memberaudit', this.$route.path)
      // this.$router.push({ name: '会员详情', params: { 'memberDetail': row, 'querytype': '2' } })
      // this.$refs['detailDialog'].open()

      let params =
      {
        'memberId': row.id,
        'type': row.type
      }
      this.currentRow = row;
      getMemberAuditDetail(params).then(response => {
        // let memberList = response.data.dtl
        // if (memberList !== null) {
        //   this.detailObj = memberList[0]
        // }
      })
      // this.detailVisible = true
    },
    monitorRefusal() {
      console.log("子组件有驳回");
      this.batchRejectVisible = true;
      //驳回成功后
    },
    batchApproved(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'memberId': this.selectionDatas,
        'auditStatus': 1
      }
      updateReaudit(params).then(response => {
        this.$message({
          message: '已通过',
          type: 'success'
        })
        this.fetchData()
        this.batchRejectVisible = false
      })
    },
    approved(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let arr = []
      arr.push(row.id)
      let params = {
        'memberId': arr,
        'auditStatus': 1
      }
      this.updateReauditFunc(params)
    },
    //会员审核信息详情
    getMemberAuditDetailFunc(params) {
      getMemberAuditDetail(params).then(response => {
        let memberList = response.data.dtl
        if (memberList !== null) {
          this.detailObj = memberList[0]
        }
      })
      this.detailVisible = true
    },

    //通过
    updateReauditFunc(params) {
      updateReaudit(params).then(response => {
        this.$message({
          message: '已通过',
          type: 'success'
        })
        this.fetchData()
        this.rejectVisible = false
        this.detailVisible = false
      })
    },
    batchRejectRemark(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.audit.remark = '资料不属实'
      this.batchRejectVisible = true
    },
    batchReject() {
      let params = {
        'memberId': this.selectionDatas,
        'auditStatus': 2,
        'remark': this.audit.remark
      }
      updateReaudit(params).then(response => {
        this.$message({
          message: '已驳回',
          type: 'success'
        })
        this.fetchData()
      })
      this.batchRejectVisible = false
    },
    rejectRemark(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      if (row.id !== undefined) {
        this.audit.id = row.id
      }
      this.audit.remark = '资料不属实'
      this.rejectVisible = true
    },
    reject() {
      let params = {
        'auditStatus': 2,
        'remark': this.audit.remark
      }
      let arr = []
      if (this.audit.id !== '') {
        arr.push(this.audit.id)
      } else {
        arr = this.selectionDatas
      }
      params['memberId'] = arr
      updateReaudit(params).then(response => {
        this.$message({
          message: '已驳回',
          type: 'success'
        })
        this.fetchData()
      })
      this.rejectVisible = false
      this.detailVisible = false
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
