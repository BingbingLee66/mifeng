import {
  getChamberOptions,
  getActivityList,
  publishActivity,
  updateActivitySort
} from '@/api/activity/activity'

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
      type: '1',
      previewImgVisible: false,
      previewUrl: '',
      query: {
        source: '', // 来源
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
      sourceOptions: [], // 活动来源数据
      showWeightDialog: false,
      showDelDialog: false,
      numberValidateForm: {
        weight: 0
      },
      weightsForm: {
        weights: null,
        goodsId: null
      },
      weightsFormRules: {
        weights: [
          { required: true, message: '权重不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
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
    this.getSourceOptions()
    // this.fetchData()
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
      getChamberOptions().then(response => {
        this.sourceOptions = response.data.data
      })
    },
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    },
    // 查询活动列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'type': this.type, // 1-已发布 2-未发布
        'source': this.query.source,
        'id': this.query.id,
        'activityName': this.query.activityName,
        'status': this.query.status,
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      getActivityList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    // 修改权重
    openUpdateWeightDialog(row) {
      this.weightsForm.goodsId = row.id
      this.weightsForm.weights = row.weights
      this.showWeightDialog = true
    },
    updateWeight(weightsForm) {
      this.$refs[weightsForm].validate((valid) => {
        if (valid) {
          /* updateWeights(this.weightsForm).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
              this.showWeightDialog = false
            }
          }) */
        } else {
          return false
        }
      })
    }
  }
}
