import { getSupplierSettlementList, updateSupplierSettlement } from '@/api/finance/finance'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDate } from '@/utils/date' // 格式化时间戳
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      query: {
        supplier: '',
        settlementStatus: 2,
        date: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      ids: [],
      selectionDatas: []
      // formObj: {
      //   id: '',
      //   rptDateMin: '',
      //   rptDateMax: '',
      //   ckey: '',
      //   supplierName: '',
      //   goodsName: '',
      //   codeName: '',
      //   count: '',
      //   supplyPrice: '',
      //   totalSupplyPrice: '',
      //   settlementStatus: '',
      // }
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    this.init()
    this.initDateTimePicker()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
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
    init () {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    initDateTimePicker () {
      // 初始化1个月
      const end = new Date()
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 31)
      this.$set(this.query, 'date', [start, end])
    },
    batchConfirm (e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('商家货款确定已结算清楚？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'ids': this.ids
        }
        updateSupplierSettlement(params).then(response => {
          this.$message({
            message: '结算成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消结算'
        })
      })
    },
    confirm (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('商家货款确定已结算清楚？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let ids = []
        row.id.split(',').forEach(o => {
          ids.push(o)
        })
        let params = {
          'ids': ids
        }
        updateSupplierSettlement(params).then(response => {
          this.$message({
            message: '确定结算成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消确定结算'
        })
      })
    },
    fetchData (e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'supplier': this.query.supplier,
        'settlementStatus': this.query.settlementStatus,
      }
      if (this.query.date) {
        params['startTime'] = this.query.date[0]
        params['endTime'] = this.query.date[1]
      }
      getSupplierSettlementList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    handleSelectionChange (value) {
      let datas = value
      this.selectionDatas = []
      this.ids = []
      for (let data of datas) {
        let new_data = {
          '完成时间': formatDate(new Date(data.rptDateMin), 'yyyy-MM-dd') + '至' + formatDate(new Date(data.rptDateMax), 'yyyy-MM-dd'),
          '供货商': data.supplierName,
          '商品名称': data.goodsName,
          '规格': !data.codeName ? '无' : data.codeName,
          '供货价(元)': data.supplyPrice,
          '销量(件)': data.count,
          '待结算金额(元)': data.unsettledSupplyPrice,
          '总金额(元)': data.totalSupplyPrice,
          '状态': data.settlementStatus === 1 ? '已结算' : '未结算',
        }
        this.selectionDatas.push(new_data)
        data.id.split(',').forEach(o => {
          this.ids.push(o)
        })
      }
    },
    exportExcel (e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('供货商货款结算', this.selectionDatas)
    }
  }
}
