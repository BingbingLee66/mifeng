import { getList, updateOrder } from '@/api/order/order'
import { getAllSupplierList } from '@/api/supplier/supplier'
import { formatDateTime } from '@/utils/date' // 格式化时间戳
import { exportJson2Excel } from '@/utils/exportExcel'
import { uploadLicense } from "@/api/member/manager";
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      mulDialog: false,
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
      orderSns: [],
      rowData: {},
      showSendOutDialog: false,
      shipping: {
        shippingSn: '',
        shippingCompany: ''
      },
      shippingRules: {
        shippingSn: [
          { required: true, message: '请输入物流单号', trigger: 'blur' },
        ],
        shippingCompany: [
          { required: true, message: '请输入物流公司', trigger: 'blur' }
        ]
      },
      fileList: []
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
    getSupplierOptions() {
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
        this.limit = 10
        this.currentpage = 1
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
    reset() {
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
    handleSelectionChange(value) {
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
    exportExcel(e) {
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
    detail(e, row) {
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
    // 发货前填写物流单号
    openSendOutDialog(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.rowData = row
      this.showSendOutDialog = true
    },

    sendOut(shipping) {
      this.$refs[shipping].validate((valid) => {
        if (valid) {
          let orders = []
          orders.push(this.rowData.orderSn)
          let params = {
            'orderSnList': orders,
            'status': 5,
            'shippingSn': this.shipping.shippingSn,
            'shippingCompany': this.shipping.shippingCompany,
          }
          updateOrder(params).then(response => {
            this.$message({
              message: '发货成功',
              type: 'success'
            })
            this.showSendOutDialog = false
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    openMulDialog() {
      this.mulDialog = true
    },
    downloadExcel() {
      let excelDatas = [{ '订单编号（必填）': '' }, { '物流公司（必填）': '' }, { '物流单号（必填）': '' }]
      exportJson2Excel('发货模板', excelDatas)
    },
    uploadLicense(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      console.log('formDataformData', content.file)
      // uploadLicense(formData).then(response => {
      //   this.formObj['license'] = response.data.filePath
      // })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      console.log('---===---', fileList)
      this.$message.warning(`请移除文件，重新上传！`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    uploadExcel() {
      console.log('-----', this.fileList)
      if (this.fileList.length < 1) {
        return this.$message.error('请先上传发货清单')
      } else {
        this.$message.success('上传')
      }
    },
    fileChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
      console.log()
    }
  }
}
