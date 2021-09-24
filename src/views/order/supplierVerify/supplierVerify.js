import { getMatchForm } from '@/api/order/order'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDateTime } from '@/utils/date' // 格式化时间戳
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      query: {
        supplierName: '',
        status: -1,
        date: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: []
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    this.init()
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
    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
        this.limit = 10
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'supplierName': this.query.supplierName,
        'status': this.query.status,
        'startTime': this.query.date ? this.query.date[0] : '',
        'endTime': this.query.date ? this.query.date[1] : '',
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getMatchForm(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    handleSelectionChange (value) {
      let datas = value
      this.selectionDatas = []
      this.orderSns = []
      for (let data of datas) {
        let statusStr = '未发货'
        if (data.totalOrderCount == data.totalShipmentCount) {
          statusStr = '已发货'
        }
        let new_data = {
          '供货商家': data.supplierName,
          '商品名称': data.goodName,
          '商品规格': !data.codeName ? '无' : data.codeName,
          '供货价(元)': data.supplyPrice,
          '下单数(件)': data.totalOrderCount,
          '已发货(件)': data.totalShipmentCount,
          '未发货(件)': data.totalUnshippedCount,
          '实付金额(元)': data.totalPrice,
          '下单时间': formatDateTime(new Date(data.minTime), 'yyyy-MM-dd hh:mm:ss') + '~' + formatDateTime(new Date(data.maxTime), 'yyyy-MM-dd hh:mm:ss'),
          '状态': statusStr
        }
        this.selectionDatas.push(new_data)
        this.orderSns.push(data.orderSn)
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
      exportJson2Excel('商家对货表', this.selectionDatas)
    }
  }
}
