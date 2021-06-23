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
      //是否批量操作
      ifBatch: true,
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
    changeFetchData() {
      this.currentpage = 1;
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
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'));
      const self = this;
      let params =
      {
        'memberId': row.id,
        'type': 2,
        'memberAuditLogsId': row.memberAuditLogsId
      }
      this.currentRow = row;
      if (row.id !== undefined) {
        this.audit.id = row.id
      }
      this.ifBatch = false;
      getMemberAuditDetail(params).then(res => {
        console.log('res', res.data);
        self.$refs['detailDialog'].open(res.data).then(data => {

        })
        // let memberList = response.data.dtl
        // if (memberList !== null) {
        //   this.detailObj = memberList[0]
        // }
      })
      // this.detailVisible = true
    },
    //子组件有驳回
    monitorRefusal() {
      this.batchRejectVisible = true;
    },
    //子组件通过
    monitorPassFunc() {
      let arr = [this.currentRow.id]
      let params = {
        'memberId': arr,
        'auditStatus': 1
      }
      this.updateReauditFunc(params)
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
        this.rejectVisible = false;
        this.detailVisible = false;
        this.$refs['detailDialog'].close()
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
      this.audit.remark = '资料不属实';
      this.ifBatch = true;
      this.batchRejectVisible = true
    },
    rejectRemark(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      if (row.id !== undefined) {
        this.audit.id = row.id
      }
      this.audit.remark = '资料不属实'
      this.ifBatch = false;
      this.batchRejectVisible = true
    },
    //点击确定驳回
    batchReject() {
      // this.selectionDatas.push(this.currentRow.id)
      let params = {
        'auditStatus': 2,
        'remark': this.rejectionReason ? this.audit.remark + '，' + this.rejectionReason : this.audit.remark
      };
      let selectionDatas = [];
      console.log("selectionDatas")
      let arr = [];
      console.log("this.audit", this.audit);
      if (this.ifBatch) {
        selectionDatas = this.selectionDatas;
      } else {
        selectionDatas.push(this.audit.id)
      }

      params['memberId'] = selectionDatas;
      console.log("params", params)
      updateReaudit(params).then(response => {
        this.$message({
          message: '已驳回',
          type: 'success'
        })
        this.fetchData()
      })
      this.rejectVisible = false
      this.detailVisible = false;
      this.batchRejectVisible = false;
      this.$refs['detailDialog'].close()
    },
    //驳回
    rejectFunc() {

    },
    handlerChange(value) {
      this.query.tradeType = value[value.length - 1]
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      };
      console.log("this.selectionDatas", this.selectionDatas)
    }
  }
}
