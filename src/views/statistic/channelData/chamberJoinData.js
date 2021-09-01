import { exportJson2Excel } from '@/utils/exportExcel'
import { getList, getChannelSummary, getChannelStatistical } from '@/api/mall/channel'
import { getGoodsDetail } from '@/api/goods/goodsSku'

export default {
  data() {
    return {
      channelList: [], // 关联渠道列表
      showMeaning: false,
      showGoodsDetail: false,
      pfStatistics: {
        channelNums: 0,
        goodsNums: 0,
        payOrderNums: 0,
        payUserNums: 0,
        successAmount: 0,
        userNums: 0,
        visitNums: 0
      },
      query: {
        days: 7,
        date: '',
        id: -1,
        goodsId: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      goodsDetail: {},
      deliveryConfig: {}
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    this.getChannelList()
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
    init() {
      this.getStatistics()
      this.initDatePicker()
    },
    initDatePicker() {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query.days)
      // 月、日 不够10补0
      const defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query.date = [defalutStartTime, defalutEndTime]
      this.fetchData()
    },
    rangeDatePicker(val) {
      console.log(val)
    },
    // 获取渠道推广数据汇总结果数据
    getStatistics() {
      let params = {}
      getChannelSummary(params).then(res => {
        this.pfStatistics.channelNums = res.data.channelNums
        this.pfStatistics.goodsNums = res.data.goodsNums
        this.pfStatistics.payOrderNums = res.data.payOrderNums
        this.pfStatistics.payUserNums = res.data.payUserNums
        this.pfStatistics.successAmount = res.data.successAmount
        this.pfStatistics.userNums = res.data.userNums
        this.pfStatistics.visitNums = res.data.visitNums
      })
    },
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
        if (this.query.goodsId) {
          this.getGoodsDetails()
          this.showGoodsDetail = true
        } else {
          this.showGoodsDetail = false
        }
      }
      this.listLoading = true
      let params = {
        'startTime': this.query.date[0],
        'endTime': this.query.date[1],
        'channelId': this.query.id,
        'goodsId': this.query.goodsId,
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getChannelStatistical(params).then(response => {
        this.list = response.data.list
        this.total = response.data.totalRows
        this.listLoading = false
      })
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        let new_data = {
          '日期': data.dayTimeStr,
          '推广渠道': data.channelNums > 0 ? data.channelNums : '--',
          '推广商品数': data.goodsNums > 0 ? data.goodsNums : '--',
          '访问人数/uv': data.userNums > 0 ? data.userNums : '--',
          '访问次数/pv': data.visitNums > 0 ? data.visitNums : '--',
          '提交订单人数': data.orderUserNums > 0 ? data.orderUserNums : '--',
          '支付人数': data.payUserNums > 0 ? data.payUserNums : '--',
          '提交订单数': data.orderNums > 0 ? data.orderNums : '--',
          '支付订单数': data.orderUserNums > 0 ? data.orderUserNums : '--',
          '成交金额': data.successAmount > 0 ? data.successAmount : '--'
        }
        this.selectionDatas.push(new_data)
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
      exportJson2Excel('渠道推广数据', this.selectionDatas)
    },
    // 获取关联渠道列表
    getChannelList() {
      getList().then(res => {
        res.data.list.unshift({
          id: -1,
          channelName: '全部渠道'
        })
        this.channelList = res.data.list
      })
    },
    getGoodsDetails() {
      let params = {
        'id': this.query.goodsId
      }
      getGoodsDetail(params).then(response => {
        if (response.state === 1) {
          this.goodsDetail = response.data.goodsDetail
          this.deliveryConfig = JSON.parse(response.data.goodsDetail.deliveryConfig)
        } else {
          console.log(9999)
          this.goodsDetail = {}
          this.deliveryConfig = {}
        }
      }).catch(err => {
        console.log(err)
        this.goodsDetail = {}
        this.deliveryConfig = {}
      })
    },
    prevent(e) {
      var keynum = window.event ? e.keyCode : e.which
      if (keynum === 189 || keynum === 190 || keynum === 109 || keynum === 110) {
        this.$message.error('必须是大于0的整数')
        e.target.value = ''
      }
    }
  }
}
