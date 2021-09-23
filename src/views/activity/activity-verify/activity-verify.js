import {
  getActivityApplyList,
  getActivitySource
} from '@/api/activity/activity-verify'

export default {
  data() {
    return {
      type: '1',
      yunCkey: '',
      query: {
        ckey: '',
        activityId: '',
        activityName: '',
        activityStatus: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      chamberOptions: [],
      previewUrl: '',
      previewImgVisible: false,
    }
  },
  created() {
    this.query.ckey = this.$store.getters.ckey
    this.getChamberOptions()
    this.fetchData()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // 获取活动来源
    getChamberOptions() {
      getActivitySource().then(res => {
        let res2 = res.data.filter(item => item.name !== '凯迪云商会')
        this.chamberOptions = res2
      })
    },
    // 切换tab
    handleClick(tab) {
      this.type = tab.name
      if (this.type === '2') {
        // this.query.ckey = 'other'
        this.fetchData('other')
      } else {
        this.query.ckey = ''
        this.fetchData(1)
      }
    },
    // 查询活动报名审核列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'ckey': e === 'other' ? 'other' : this.query.ckey,
        'activityId': this.query.activityId,
        'activityName': this.query.activityName,
        'activityStatus': this.query.activityStatus,
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      getActivityApplyList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.fetchData(1)
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    // 查看审核详情
    goVerifyDetail(e, type, status) {
      let chamberName = null
      if (this.type === '1' && !this.ckey) {
        chamberName = 'yun'
      }
      this.$router.push({
        name: '审核详情',
        query: {
          activityId: e.activityId,
          type: type,
          status: status,
          chamberName
        }
      })
    }
  }
}
