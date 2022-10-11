import { getUserDetail } from '@/api/member/manager'
import Labels from '@/api/labels/labels'
import ysTable from '@/components/ys-table'
/* 会员标签 */
const memberLabelData = [
  {
    label: '标签组',
    prop: 'tagGroupName'
  },
  {
    label: '标签',
    prop: 'tagName',
    type: 'slot',
    slotName: 'tagName'
  },
  {
    label: '标记时间',
    prop: 'markTime',
    type: 'time'
  }
]
const memberLabelData2 = [
  {
    label: '标签组',
    prop: 'tagGroupName'
  },
  {
    label: '标签',
    prop: 'tagName',
    type: 'slot',
    slotName: 'tagName'
  },
  {
    label: '标记方',
    prop: 'markingSide',
    type: 'slot',
    slotName: 'markingSide'
  },
  {
    label: '标记时间',
    prop: 'markTime',
    type: 'time'
  }
]
/* 供需标签 */
const supplyLabelData = [
  {
    label: '标签',
    prop: 'name'
  },
  {
    label: '使用次数',
    prop: 'useNum'
  },
  {
    label: '最近使用时间',
    prop: 'lastTime',
    type: 'time'
  }
]
/* 行业标签 */
const industryLabelData = [
  {
    label: '标签',
    prop: 'name'
  },
  {
    label: '使用次数',
    prop: 'useNum'
  },
  {
    label: '最近使用时间',
    prop: 'lastTime',
    type: 'time'
  }
]
export default {
  components: {
    'ys-table': ysTable
  },
  data() {
    return {
      userDetail: {},
      memberList: {},
      count: 0,
      idCardVisible: false,
      idCardImage: {
        frontOfIdCard: '',
        backOfIdCard: ''
      },
      licenseVisible: false,
      licenseImage: '',
      companyIntroductionVisible: false,
      companyIntroduction: '',
      resumeVisible: false,
      resume: '',
      userInfo: {},
      telephones: [],
      contactAddress: [],
      activeName: '1',
      activeName2: '0',
      tableColumn: memberLabelData,
      tableColumn1: supplyLabelData,
      tableColumn2: memberLabelData2,
      tableColumn3: industryLabelData,
      labelData: [],
      supplyData: [],
      industryData: [],
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0
      },
      pageData1: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0
      },
      pageData2: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0
      }
    }
  },
  computed: {
    resumeCp() {
      return function(msg) {
        let result = msg
        if (!!msg && msg.length > 100) {
          result = msg.substring(0, 100) + '...'
        }
        return result
      }
    },
    companyInstrodCp() {
      return function(msg) {
        let result = msg
        if (!!msg && msg.length > 100) {
          result = msg.substring(0, 100) + '...'
        }
        return result
      }
    }
  },
  mounted() {
    console.log('this.$route.params', this.$route.params)
    if (this.$route.params.userDetail) {
      this.userDetail = this.$route.params.userDetail
      window.localStorage.setItem('detail-user', this.userDetail)
      this.init()
    }
    if (!this.userDetail) {
      this.userDetail = window.localStorage.getItem('detail-user')
    }
  },
  created() {},
  methods: {
    handleTabClick(e) {
      if (+e.name === 2) {
        // 获取会员标签
        this.activeName2 = '0'
        this.getMemberLableList()
      } else if (+e.name === 3) {
        // 获取供需标签
        this.getSupplyLabelList()
      } else if (+e.name === 4) {
        // 获取行业标签
        this.getIndustryLabelList()
      }
    },
    handleTab2Click(e) {
      this.getMemberLableList(e.name)
    },
    async getMemberLableList(type = '0') {
      const userId = this.$route.query.userId
      if (!userId) return
      const { currentpage, limit } = this.pageData
      const res = await Labels.getUserDetailLabelLst(userId, type, {
        page: currentpage,
        pageSize: limit
      })
      console.log('---会员标签---', res)
      if (res.state !== 1) return
      this.labelData = res.data.list
      this.pageData.total = res.data.totalRows
    },
    // 获取供需标签
    async getSupplyLabelList() {
      const userId = this.$route.query.userId
      let params = {
        userId: userId,
        pageNum: this.pageData1.currentpage,
        pageSize: this.pageData1.limit
      }
      console.log(params, 'params')
      const res = await Labels.getFirstInterestLabel(params)
      console.log('---供需标签---', res)
      if (res.state !== 1) return
      if (res.data) {
        this.supplyData = res.data.list
        const { totalRows } = res.data
        this.pageData1.total = totalRows
      }
    },
    // 获取行业标签
    async getIndustryLabelList() {
      const userId = this.$route.query.userId
      let params = {
        userId: userId,
        pageNum: this.pageData2.currentpage,
        pageSize: this.pageData2.limit
      }
      console.log(params, 'params')
      const res = await Labels.getTradeLabel(params)
      if (res.state !== 1) return
      this.industryData = res.data.list
      const { totalRows } = res.data
      this.pageData2.total = totalRows
      console.log(this.industryData, '行业标签')
    },
    // 分页器
    handleSizeChange(val) {
      this.pageData.limit = val
      this.pageData.page = 1
      this.getMemberLableList(this.activeName2)
    },
    handleCurrentChange(val) {
      this.pageData.currentpage = val
      this.getMemberLableList(this.activeName2)
    },
    handleSizeChange1(val) {
      this.pageData1.limit = val
      this.pageData1.page = 1
      this.getSupplyLabelList(this.activeName2)
    },
    handleCurrentChange1(val) {
      this.pageData1.currentpage = val
      this.getSupplyLabelList(this.activeName2)
    },
    handleSizeChange2(val) {
      this.pageData2.limit = val
      this.pageData2.page = 1
      this.getIndustryLabelList(this.activeName2)
    },
    handleCurrentChange2(val) {
      this.pageData2.currentpage = val
      this.getIndustryLabelList(this.activeName2)
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let params = {
        phone: this.userDetail.phone
      }
      getUserDetail(params).then(response => {
        this.memberList = response.data.dtl
        this.count = this.memberList.length
        this.userInfo = response.data.userInfo
        console.log('userInfo', this.userInfo)

        this.telephones = response.data.telephones
        this.contactAddress = response.data.contactAddress
      })
    },
    idCardDetail(row) {
      this.idCardImage.frontOfIdCard = row.frontOfIdCard
      this.idCardImage.backOfIdCard = row.backOfIdCard
      this.idCardVisible = true
    },
    licenseDetail(row) {
      this.licenseImage = row.license
      this.licenseVisible = true
    },
    resumeDetail(msg) {
      this.resume = msg
      this.resumeVisible = true
    },
    companyIntroductionDetail(msg) {
      this.companyIntroduction = msg
      this.companyIntroductionVisible = true
    }
  },
  filters: {
    dateFormat(value) {
      if (value) {
        var myDate = new Date(value.replace('-', '/').replace('-', '/'))
        return (
          myDate.getFullYear() +
          '年' +
          (myDate.getMonth() + 1) +
          '月' +
          (myDate.getDay() + 1) +
          '日'
        )
      }
      return ''
    }
  }
}
