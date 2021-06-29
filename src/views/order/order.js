import { getList, updateOrder } from '@/api/order/order'
import { getAllSupplierList } from '@/api/supplier/supplier'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDateTime } from '@/utils/date' // 格式化时间戳
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      query: {
        orderSn: '',
        // suppplierId: '',
        supplierName: '',
        goodId: '',
        goodName: '',
        status: -1,
        consignee: '',
        consigneeMobile: '',
        date: ''
      },
      supplierOptions: [],
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      orderSns: []
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    // this.getSupplierOptions()
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
    getSupplierOptions () {
      getAllSupplierList().then(response => {
        this.chamberOptions = response.data.data
      })
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
        'orderSn': this.query.orderSn,
        // 'supplierId': this.query.supplierId,
        'supplierName': this.query.supplierName,
        'goodId': this.query.goodId,
        'goodName': this.query.goodName,
        'status': this.query.status,
        'consignee': this.query.consignee,
        'consigneeMobile': this.query.consigneeMobile,
        'pageSize': this.limit,
        'page': this.currentpage
      }
      if (this.query.date) {
        params['startTime'] = this.query.date[0]
        params['endTime'] = this.query.date[1]
      }
      getList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    reset () {
      this.query = {
        orderSn: '',
        ckey: '',
        goodId: '',
        goodName: '',
        status: -1,
        consignee: '',
        consigneeMobile: '',
        date: ''
      }
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
        } else if (data.status == 0) {
          statusStr = '取消订单'
        }
        let new_data = {
          '订单号': data.orderSn,
          '下单时间': formatDateTime(new Date(data.createTime), 'yyyy-MM-dd hh:mm:ss'),
          '商品名称': data.name,
          '商品规格': !data.codeName ? '无' : data.codeName,
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
      // exportJson2Excel('订单列表', this.selectionDatas)
      exportJson2Excel('订单管理', this.selectionDatas)
    },
    detail (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '订单详情', params: { 'orderSn': row.orderSn, 'isChamber': false } })
    },
    batchSendOut(e) {
      if (this.orderSns.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'orderSnList': this.orderSns,
        'status': 5
      }
      updateOrder(params).then(response => {
        this.$message({
          message: '发货成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    sendOut(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let orders = []
      orders.push(row.orderSn)
      let params = {
        'orderSnList': orders,
        'status': 5
      }
      updateOrder(params).then(response => {
        this.$message({
          message: '发货成功',
          type: 'success'
        })
        this.fetchData()
      })
    }
  }
}
