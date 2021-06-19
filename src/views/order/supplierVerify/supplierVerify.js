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
      }
      this.listLoading = true
      let params = {
        'supplierName': this.query.supplierName,
        'status': this.query.status,
        'startTime': this.query.date[0],
        'endTime': this.query.date[1],
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getMatchForm(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
        for (let obj of this.list) {
          console.log(obj)
          console.log(obj.totalOrderCount)
        }
      })
    },
    handleSelectionChange (value) {
      let datas = value
      this.selectionDatas = []
      this.orderSns = []
      for (let data of datas) {
        let statusStr = '待发货'
        if (data.status == 2) {
          statusStr = '待发货'
        } else if (data.status == 5) {
          statusStr = '已发货'
        } else if (data.status == 6) {
          statusStr = '已完成'
        } else if (data.status == 4) {
          statusStr = '待成团'
        } else if (data.status == 1) {
          statusStr = '待支付'
        }
        let new_data = {
          '订单号': data.orderSn,
          '下单时间': formatDateTime(new Date(data.createTime), 'yyyy-MM-dd hh:mm:ss'),
          '商品名称': data.name,
          '商品规格': data.codeName,
          '单价(元)': data.price,
          '下单数': data.count,
          '实付金额(元)': data.realPrice,
          '收件人': data.consignee,
          '收件人手机号': data.mobile,
          '收货地址': data.consigneeAddress,
          '供货商家': data.supplierName,
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
      exportJson2Excel(this.selectionDatas)
    }
  }
}
