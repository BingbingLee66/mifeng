import {
  addHotActivity,
  delHotActivity,
  getActivitySource,
  getHotActivityList,
  updateHotActivitySort
} from '@/api/activity/hot-activity'

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
      // 热门活动
      list: [],
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      query: {
        activityId: '',
        activityName: '',
        activityStatus: -1,
        isPublish: -1,
        chamberId: '',
        isAdd: 0,
      },
      // 可添加活动
      actList: [],
      actPage: {
        currentpage: 1,
        page: 1,
        pageSize: 100,
        allTotal: 0
      },
      actquery: {
        activityId: '',
        activityName: '',
        activityStatus: -1,
        isPublish: -1,
        chamberId: '',
        isAdd: 1,
      },
      actIdsList: [],
      selectionDatas: [],
      chamberOptions: [],
      numberValidateForm: {
        weight: 0
      },
      sortForm: {
        id: null,
        sort: null
      },
      sortFormRules: {
        sort: [
          { required: true, message: '权重不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      previewUrl: '',
      // 控制变量
      listLoading: false,
      actLoading: false,
      showSortDialog: false,
      showAddDialog: false,
      previewImgVisible: false,
    }
  },
  created() {
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
    fetchData() {
      this.listLoading = true
      let params = {
        'activityId': this.query.activityId,
        'activityName': this.query.activityName,
        'activityStatus': this.query.activityStatus,
        'chamberId': this.query.chamberId,
        'isPublish': this.query.isPublish,
        'isAdd': this.query.isAdd,
        'page': this.currentpage,
        'pageSize': this.limit,
      }
      getHotActivityList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    getChamberOptions() {
      getActivitySource().then(res => {
        this.chamberOptions = res.data
      })
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
    // 获取可添加活动列表
    showActivityList() {
      this.actquery.activityId = ''
      this.actquery.activityName = ''
      this.actquery.activityStatus = -1
      this.actquery.chamberId = ''
      this.showAddDialog = true
      this.getActivityLists()
    },
    getActivityLists() {
      this.actLoading = true
      let params = {
        'page': this.actPage.page,
        'pageSize': this.actPage.pageSize,
        'activityName': this.actquery.activityName,
        'activityId': this.actquery.activityId,
        'chamberId': this.actquery.chamberId,
        'activityStatus': this.actquery.activityStatus,
        'isAdd': this.actquery.isAdd,
      }
      getHotActivityList(params).then(res => {
        console.log('可添加活动列表：', res)
        this.actList = res.data.list
        this.actPage.allTotal = res.data.totalRows
        this.actLoading = false
      })
    },
    handleAllSizeChange(val) {
      this.allPage.currentpage = 1
      this.allPage.page = 1
      this.allPage.pageSize = val
      this.getAllGoodsLists()
    },
    handleAllCurrentChange(val) {
      this.allPage.currentpage = val
      this.getAllGoodsLists()
    },
    // 添加热门活动
    handleAllSelectionChange(value) {
      let datas = value
      this.actIdsList = []
      for (let data of datas) {
        this.actIdsList.push(data.id)
      }
    },
    addHotAct() {
      if (this.actIdsList.length === 0) {
        return this.$message.error('请先选择活动')
      }
      addHotActivity(this.actIdsList).then(res => {
        if (res.state === 1) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.getActivityLists()
          this.fetchData()
          this.showAddDialog = false
        }
      })
    },
    // 移除热门活动
    showdel(row) {
      let delIds = []
      delIds.push(row.id)
      this.$confirm('', '确定移除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        delHotActivity(delIds).then(res => {
          if (res.state === 1) {
            this.$message({
              message: '移除成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消移除'
        })
      })
    },
    // 批量移除
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    },
    delMulActivity() {
      if (this.selectionDatas.length === 0) {
        return this.$message.error('请先选择活动')
      }
      this.$confirm('', '确定移除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        delHotActivity(this.selectionDatas).then(res => {
          if (res.state === 1) {
            this.$message({
              message: '移除成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消移除'
        })
      })
      /* delHotActivity(this.selectionDatas).then(res => {
        if (res.state === 1) {
          this.fetchData()
        }
      }) */
    },
    // 修改权重
    showSort(row) {
      this.sortForm.id = row.id
      this.sortForm.sort = row.sort
      this.showSortDialog = true
    },
    updateSort(sortForm) {
      this.$refs[sortForm].validate((valid) => {
        if (valid) {
          updateHotActivitySort(this.sortForm).then(response => {
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
