import { getApplyList } from '@/api/zhaoshang/activity/activity-verify'
import { getInfoList } from '@/api/attract'

export default {
  data() {
    return {
      query: {
        invesKey: '',
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
    this.getChamberOptions()
    this.fetchData()
  },
  methods: {
    // 获取活动来源
    getChamberOptions() {
      getInfoList().then(res => {
        this.chamberOptions = res.data
      })
    },

    handleInput(e) {
      let regexp = /^[1-9]\d*$/
      if (!regexp.test(e)) {
        this.query.activityId = ''
      }
    },

    // 查询活动报名审核列表
    fetchData(isReset = false) {
      if (isReset) this.currentpage = 1
      this.listLoading = true
      let params = {
        'invesKey': this.query.invesKey || '',
        'activityId': this.query.activityId,
        'activityName': this.query.activityName,
        'activityStatus': this.query.activityStatus,
        'pageSize': this.limit,
        'page': this.currentpage,
      }

      getApplyList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },

    handleSizeChange(val) {
      this.limit = val
      this.fetchData(true)
    },

    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },

    // 查看审核详情
    goVerifyDetail(e, type, status) {
      this.$router.push({
        path: '/zhaoshang/activity/verifyDetail',
        query: {
          activityId: e.activityId,
          status: status,
        }
      })
    }
  }
}
