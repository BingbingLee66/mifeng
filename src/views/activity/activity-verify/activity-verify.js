import {
  getActivityApplyList,
  getActivitySource
} from '@/api/activity/activity-verify'

export default {
  data() {
    return {
      ckey: '',
      type: '1',
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
    this.ckey = this.$store.getters.ckey
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
        this.chamberOptions = res.data
      })
    },
    // 切换tab
    handleClick(tab) {
      this.type = tab.name
      console.log(typeof this.type)
      if (this.type === '2') {
        this.fetchData('ohter')
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
        'ckey': e === 'other' ? 'ohter' : this.query.ckey,
        'activityId': this.query.activityId,
        'activityName': this.query.activityName,
        'activityStatus': this.query.activityStatus,
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      getActivityApplyList(params).then(res => {
        console.log('审核列表：', res)
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
    goVerifyDetail(e) {
      this.$router.push({ name: '审核详情', query: { id: '1' } })
    }
  }
}
