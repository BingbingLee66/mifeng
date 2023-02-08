import {
  getSupplierSettlementList,
  changeSettlementStatus,
  getOrderCount
} from '@/api/finance/finance'
import {
  formatDate
} from '@/utils/date' // 格式化时间戳
// import { mapGetters } from 'vuex'
export default {
  components: {
    financeRules: () => import('@/components/common/FinanceRules.vue')
  },
  data() {
    return {
      query: {
        goodName: '', // 商品名称
        supplierName: '', // 供货商姓名
        supplierPhone: null, // 供货商手机号
        status: -1, // 状态
        page: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
      },
      total: 0,
      list: [],
      listLoading: false,
      calculationRulesDia: false, // 计算规则弹窗
      paymentDia: false, // 申请付款弹窗
      selectTime: [],
      settlementId: 0,
      btnLoading: false,
      judgeCount: 1,
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    },
  },
  created() {
    // this.initDateTimePicker()
    this.init()
  },
  filters: {
    filterStatus(val) {
      switch (val) {
        case 0:
          return '待商务确认'
        case 1:
          return '待财务付款'
        case 2:
          return '财务已付款'
        default:
          return `状态出错${val}`
      }
    }
  },
  watch: {
    selectTime(newData) {
      if (!newData) {
        this.query.startTime = ''
        this.query.endTime = ''
      } else {
        console.log(newData);
        this.query.startTime = newData[0]
        this.query.endTime = newData[1]
      }
    }
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({
        tabName,
        actionName
      })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({
        tabName,
        actionName
      })
    },
    handleSizeChange(val) {
      this.query.pageSize = val
      this.query.page = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.query.page = val
      this.fetchData()
    },
    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    initDateTimePicker() {
      // 初始化1个月
      const end = new Date().getTime() - 3600 * 1000 * 24 * 1
      const start = new Date().getTime() - 3600 * 1000 * 24 * 31
      this.query.startTime = this.selectTime[0] = formatDate(new Date(start), 'yyyy-MM-dd')
      this.query.endTime = this.selectTime[1] = formatDate(new Date(end), 'yyyy-MM-dd')
    },
    checkNum() {
      this.query.supplierPhone = this.query.supplierPhone.replace(/\D/g, '')
    },
    // 查询列表
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
        this.query.pageSize = 10
        this.query.page = 1
      }
      this.listLoading = true
      let params = {
        ...this.query
      }
      if (params.status == -1) delete params.status
      if (this.ckey) params.ckey = this.ckey
      getSupplierSettlementList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    // 判断显示弹窗
    judgeDiaShow(id) {
      this.settlementId = id
      this.btnLoading = true
      getOrderCount(id).then(res => {
        this.btnLoading = false
        this.judgeCount = res.data
        this.paymentDia = true
      }).catch((e)=>{
        this.btnLoading = false
      })
    },
    // 点击标记为已付款
    signPay(id,status){
      this.$confirm(
        '标记已付款',
        {
          title:'标记已付款',
          message: this.$createElement('div', null, [this.$createElement('p', null, '是否确定已付款给该供货商？'),this.$createElement('p', null, '该操作执行后无法撤销，请谨慎处理。')]),
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.changeStatus(id,status)
      })
    },
    // 标记为已付款/申请财务付款
    async changeStatus(id, status) {
      let res = await changeSettlementStatus({
        id,
        status
      })
      try {
        if (res.state !== 1) return this.$message.error(res.msg)
        this.$message.success('处理成功')
        this.paymentDia = false
        this.fetchData()
      } catch (e) {
        console.log(e)
      }
    },
    // 结算单详情
    detail(row) {
      // window.localStorage.setItem('actionId',e.currentTarget.getAttribute('actionId'))
      this.$router.push({
        name: '结算单详情',
        query: {
          skuId: row.skuId,
          settlementId: row.id
        }
      })
    },
    // 关闭计算规则弹窗
    closeDia() {
      this.calculationRulesDia = false
    },
    // 点击申请财务付款
    handlePayMent(e, row) {
      console.log('申请财务付款row', row);
      this.paymentDia = true
    },
    // 导出表格
    exportExcel() {
      if (!this.selectTime || this.selectTime.length === 0) return this.$message.error('请选择结算时间')
      let params = {
        ...this.query
      }
      let paramString = `?startTime=${params.startTime}&endTime=${params.endTime}`
      if (params.status != -1) {
        paramString += `&status=${params.status}`
      }
      if(params.goodName){
        paramString += `&goodName=${params.goodName}`
      }
      if(params.supplierName){
        paramString += `&supplierName=${params.supplierName}`
      }
      if(params.supplierPhone){
        paramString += `&supplierPhone=${params.supplierPhone}`
      }
      if (this.ckey) paramString += `&ckey=${this.ckey}`
      let a = document.createElement('a')
      a.download = ''
      a.href = process.env.VUE_APP_BASE_API_2 + '/ec/mall/settlement-download' + paramString
      a.click()
    },
  }
}