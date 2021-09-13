import {
  getActivityApplyList,
  getActivitySource
} from '@/api/activity/activity-verify'

export default {
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!/^([0-9]{0,3})$/.test(value)) {
        return callback(new Error('必须是0-999的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      ckey: '',
      type: '1',
      previewImgVisible: false,
      previewUrl: '',
      query: {
        activityId: '', // 活动ID
        activityName: '', // 活动名称
        activityStatus: '', // 活动状态
        chamberId: '' // 活动状态
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      rejectReason: '',
      sourceOptions: [], // 活动来源数据
      showRejectDialog: false,
      showDetailDialog: false,
      showTipDialog: false
    }
  },
  computed: {
    sourceName() {
      return function(ckey) {
        let sourceName = ''
        for (let source of this.sourceOptions) {
          if (ckey === source.value) {
            sourceName = source.label
            break
          }
        }
        return sourceName
      }
    }
  },
  created() {
    this.ckey = this.$store.getters.ckey
    this.fetchData()
    this.getSourceOptions()
  },
  methods: {
    handleClick(tab) {
      this.type = tab.name
      this.fetchData()
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
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // 编辑活动
    goEdit() {
      window.localStorage.setItem('activityeditor', this.$route.path)
      this.$router.push({ name: '创建新活动' })
    },
    // 获取活动来源
    getSourceOptions() {
      getActivitySource().then(response => {
        this.sourceOptions = response.data.data
      })
    },
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    },
    // 查询活动报名审核列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'cket': this.ckey,
        'activityId': this.query.activityId,
        'activityName': this.query.activityName,
        'activityStatus': this.query.activityStatus,
        'chamberId': this.query.chamberId,
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      getActivityApplyList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    // 去审核
    goVerifyDetail(e) {
      console.log(e)
    }
  }
}
