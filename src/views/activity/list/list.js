import {
  getActivitySource,
  getActivityList,
  publishActivity,
  updateActivitySort,
  delActivity
} from '@/api/activity/activity'

export default {
  data() {
    const checkNumber = (rule, value, callback) => {
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
        ckey: '', // 来源
        id: '', // 活动ID
        activityName: '', // 活动名称
        status: '' // 活动状态
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      chamberOptions: [],
      isPublish: '',
      rowId: '',
      showSortDialog: false,
      showDelDialog: false,
      showUpdateDialog: false,
      sortForm: {
        id: null,
        sort: null
      },
      sortRules: {
        sort: [
          { required: true, message: '权重不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.ckey = this.$store.getters.ckey
    if (this.$route.params.type !== undefined) {
      this.type = this.$route.params.type + ''
    }
    this.getChamberOptions()
    this.fetchData()
  },
  methods: {
    handleClick(tab) {
      this.type = tab.name
      this.query.id = ''
      this.query.activityName = ''
      this.query.ckey = ''
      this.query.status = ''
      this.fetchData(1)
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
    // 获取活动来源
    getChamberOptions() {
      getActivitySource().then(response => {
        this.chamberOptions = response.data
      })
    },
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    },
    handleInput(e) {
      const regexp = /^[1-9]\d*$/
      if (!regexp.test(e)) {
        this.query.id = ''
      }
    },
    // 查询活动列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      const params = {
        isPublish: this.type,
        ckey: this.ckey ? this.ckey : this.query.ckey,
        id: this.query.id,
        activityName: this.query.activityName,
        status: this.query.status,
        pageSize: this.limit,
        page: this.currentpage,
      }
      getActivityList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    // 修改活动发布状态
    showUpdate(row, isPublish) {
      this.rowId = row.id
      this.isPublish = isPublish
      this.showUpdateDialog = true
    },
    upadteActivity() {
      const params = {
        id: this.rowId,
        isPublish: this.isPublish
      }
      publishActivity(params).then(res => {
        if (res.state === 1) {
          if (this.isPublish === 0) {
            this.type = '0'
          } else if (this.isPublish === 1) {
            this.type = '1'
          }
          this.list = []
          this.fetchData(1)
          this.showUpdateDialog = false
          this.$message.success(res.msg)
        }
      })
    },
    // 编辑活动
    editActivity(row) {
      window.localStorage.setItem('activityeditor', this.$route.path)
      this.$router.push({
        name: '创建活动',
        query: {
          activityId: row.id,
          type: this.type
        }
      })
    },
    // 活动详情
    detail(row) {
      this.$router.push({ path: `/activity/${row.id}/detail` })
    },
    // 删除活动
    showDel(row) {
      this.rowId = row.id
      this.showDelDialog = true
    },
    delActivity() {
      const params = {
        id: this.rowId
      }
      delActivity(params).then(res => {
        if (res.state === 1) {
          this.$message.success(res.msg)
          this.fetchData(1)
          this.showDelDialog = false
        }
      })
    },
    // 修改权重
    showSort(row) {
      this.sortForm.id = row.id
      this.sortForm.sort = row.sort
      this.showSortDialog = true
    },
    updateSort(sortForm) {
      this.$refs[sortForm].validate(valid => {
        if (valid) {
          updateActivitySort(this.sortForm).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
              this.showSortDialog = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
