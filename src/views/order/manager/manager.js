import { getAllList, getChannelList } from '@/api/order/order'
import { getChamberOptions } from '@/api/finance/finance'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDateTime } from '@/utils/date' // 格式化时间戳
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      query: {
        orderSn: '',
        ckey: '',
        wechatOrderNum: '',
        supplierName: '',
        goodName: '',
        status: -1,
        consignee: '',
        consigneeMobile: '',
        date: '',
        settled: -1,
        settlementStatus: -1,
        channelId: -1, // 推广渠道
        isFirst: -1, // 用户属性
      },
      chamberOptions: [],
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      channelOptions: [],
      templateId: ''// 优惠券模板id
    }
  },
  computed: {
    // ...mapGetters(['has'])
    chamberName() {
      return function(ckey) {
        let chamberName = ''
        for (let chamber of this.chamberOptions) {
          if (ckey === chamber.value) {
            chamberName = chamber.label
            break
          }
        }
        return chamberName
      }
    }
  },
  created() {
    this.templateId = this.$route.query.templateId
    this.getChamberOptions()
    this.getChannelOptions()
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
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    getChamberOptions() {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
    },
    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    // 查询推广渠道
    getChannelOptions() {
      getChannelList().then(res => {
        this.channelOptions = res.data
        this.channelOptions.unshift({ id: -1, channelName: '全部' })
      })
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
        'ckey': this.query.ckey,
        'wechatOrderNum': this.query.wechatOrderNum,
        'goodName': this.query.goodName,
        'supplierName': this.query.supplierName,
        'status': this.query.status,
        'consignee': this.query.consignee,
        'consigneeMobile': this.query.consigneeMobile,
        'pageSize': this.limit,
        'page': this.currentpage,
        'channelId': this.query.channelId,
        'isFirst': this.query.isFirst
      }
      if (params.isFirst == -1) delete params.isFirst
      if (params.status == 5 || params.status == 6) {
        params.settled = this.query.settled
        if (params.settled == -1) delete params.settled
        params.settlementStatus = this.query.settlementStatus
        if (params.settlementStatus == -1) delete params.settlementStatus
      }
      if (params.channelId == -1) delete params.channelId
      if (this.query.date) {
        params['startTime'] = this.query.date[0]
        params['endTime'] = this.query.date[1]
      }
      if (this.templateId) {
        params['templateId'] = this.templateId
      }
      getAllList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    // 订单状态改变
    statusSelectChange(val) {
      if (val === 5 || val === 6) {
        this.query.settled = -1
        this.query.settlementStatus = -1
      }
    },
    reset() {
      this.query = {
        orderSn: '',
        ckey: '',
        wechatOrderNum: '',
        supplierName: '',
        goodName: '',
        status: -1,
        consignee: '',
        consigneeMobile: '',
        date: '',
        channelId: null,
      }
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
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
        let isFirstStr = ''
        if (data.isFirst == 1) {
          isFirstStr = "首单用户"
        } else if (data.isFirst == 2) {
          isFirstStr = "复购用户"
        } else {
          isFirstStr = "--"
        }
        let new_data = {
          '订单号': data.orderSn,
          '下单时间': formatDateTime(new Date(data.createTime), 'yyyy-MM-dd hh:mm:ss'),
          '微信订单号': data.wechatOrderNum ? data.wechatOrderNum : '--',
          '状态': statusStr,
          '推广渠道': data.channelName || '--',
          '用户属性': isFirstStr,
          '供货商家': data.supplierName,
          '订单所属商会': this.chamberName(data.ckey),
          '商品名称': data.name,
          '商品规格': !data.codeName ? '无' : data.codeName,
          '单价(元)': data.price,
          '下单数': data.count,
          '立减优惠(元)': data.totalDiscount,
          '优惠券优惠(元)': data.couponPrice,
          '实付金额(元)': data.realPrice,
          '收件人': data.consignee,
          '收件人手机号': data.mobile,
          '收货地址': data.consigneeAddress
        }
        this.selectionDatas.push(new_data)
      }
    },
    exportExcel(e) {
      if (!this.query.date) {
        this.$message.error({
          message: '请选择下单起止时间'
        })
        return
      }
      let params = {
        'orderSn': this.query.orderSn,
        'ckey': this.query.ckey,
        'wechatOrderNum': this.query.wechatOrderNum,
        'goodName': this.query.goodName,
        'supplierName': this.query.supplierName,
        'status': this.query.status,
        'channelId': this.query.channelId,
        'isFirst': this.query.isFirst,
        'consignee': this.query.consignee,
        'consigneeMobile': this.query.consigneeMobile,
        'startTime': this.query.date[0],
        'endTime': this.query.date[1],
      }
      if (params.isFirst == -1) delete params.isFirst
      if (params.channelId == -1) delete params.channelId
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      getAllList(params).then(res => {
        if (res.data.data.list.length === 0) {
          this.$message.warning('无记录')
          return
        }
        this.handleSelectionChange(res.data.data.list)
        exportJson2Excel('订单列表', this.selectionDatas)
      })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '订单详情', params: { 'orderSn': row.orderSn } })
    }
  }
}
