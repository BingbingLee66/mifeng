import {
  getChamberContentList,
  updateStatus,
  getDetail,
  updateChamberTop,
  del
} from '@/api/content/article'
import {
  getContentColumnOptionsWithCkey,
  updateColumnLevel
} from '@/api/content/columnsetup'
import router from '../../../router'
import videoComponent from '@/components/video/index'
export default {
  components: {
    videoComponent
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      if (!/^([0-9]{0,3})$/.test(value)) {
        return callback(new Error('必须是0-999的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      detailVisible: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      sortFalg: '',
      listLoading: false,
      query: {
        title: '',
        contentColumnId: -1,
        status: -1,
        date: '',
        column: '',
        orderType: 1,
        creatorId: ''
      },
      detailObj: {
        contentHtml: '',
        auditStatus: '',
        auditRemark: ''
      },
      contentColumnOptions: [],
      formObj: {},
      activeName: '5',
      showSortDialog: false,
      sortForm: {
        id: null,
        sort: null
      },

      sortFormRules: {
        sort: [
          {
            required: true,
            message: '权重不能为空',
            trigger: 'blur'
          },
          {
            validator: checkNumber,
            trigger: 'blur'
          }
        ]
      },
    }
  },
  created() {
    const activename = window.localStorage.getItem('activename')
    if (activename) {
      this.activeName = activename
    }
    const { id } = this.$store.getters.profile
    this.creatorId = id
    console.log(this.creatorId, 'creatorId 啊啊啊啊')
    this.getContentColumnType()
    this.init()
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
    // 排序
    handleSortChange(e) {
      // let sort = ''

      console.log('e', e)
      if (!e.prop) {
        return
      }
      this.query.column = e.prop
      // 有序
      if (e.order) {
        this.query.orderType = e.order === 'ascending' ? 1 : -1
      } else {
        // 无序
        this.query.orderType = ''
      }
      this.currentpage = 1
      this.fetchData(1)
    },
    // 修改权重
    showSort(row) {
      this.sortForm.id = row.contentColumnId
      this.sortForm.sort = row.sort
      this.showSortDialog = true
    },
    updateSort(sortForm) {
      this.$refs[sortForm].validate(valid => {
        if (valid) {
          const params = {
            ...this.sortForm,
            level: this.sortForm.sort
          }
          updateColumnLevel(params).then(response => {
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
    init() {
      this.total = 0
      this.list = []
      this.currentpage = 1
      this.limit = 10
      this.fetchData()
    },
    getContentColumnType() {
      const contentModuleId = 3
      const params = {
        ckey: this.$store.getters.ckey,
        contentModuleId,
        isSpecialCommittee: 1
      }
      getContentColumnOptionsWithCkey(params).then(response => {
        this.contentColumnOptions = response.data.data
        this.contentColumnOptions.unshift({
          label: '全部',
          value: -1
        })
      })
    },
    fetchData(e) {
      if (e !== undefined && e !== 1) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
        this.currentpage = 1
      }
      this.listLoading = true
      const params = {
        // 'order': this.sortFalg,
        pageSize: this.limit,
        page: this.currentpage,
        ckey: this.$store.getters.ckey,
        title: this.query.title,
        contentModuleId: this.activeName,
        contentColumnId: this.query.contentColumnId,
        status: this.query.status,
        articleId: this.query.articleId,
        creator: this.query.creator,
        column: this.query.column,
        orderType: this.query.orderType,
        creatorId: this.creatorId
      }
      // if (sort) {
      //   params['order'] = sort
      // }
      if (this.query.date) {
        // eslint-disable-next-line prefer-destructuring
        params['startTs'] = this.query.date[0]
        // eslint-disable-next-line prefer-destructuring
        params['endTs'] = this.query.date[1]
      }
      getChamberContentList(params).then(response => {
        try {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        } catch (error) {
          this.list = []
          this.total = 0
        }
      })
    },
    openVisible(row) {
      this.formObj = row
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      const params = {
        id: row.id,
        action: row.status === 0 ? 'active' : 'notactive'
      }
      updateStatus(params).then(() => {
        if (row.status === 0) {
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '文章已冻结',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    add(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('articleupdate', this.$route.path)
      this.$router.push({
        name: '添加/修改文章',
        params: {
          activeName: this.activeName,
          committee: true
        }
      })
    },
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('articleupdate', this.$route.path)
      this.$router.push({
        name: '添加/修改文章',
        query: {
          activeName: this.activeName,
          articleId: row.id,
          committee: true
        }
      })
    },
    editColumn(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('articleupdate', this.$route.path)
      console.log('row', row)
      this.$router.push({
        name: '修改栏目内容',
        params: {
          activeName: this.activeName,
          articleObj: row
        }
      })
    },
    /* detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '文章详情', params: { 'articleId': row.id } })
    }, */
    openDetail(row) {
      const params = {
        id: row.id
      }
      getDetail(params).then(response => {
        this.detailObj = response.data.dtl
        if (this.detailObj.vid) this.$refs['videoRef'].show(this.detailObj.vid)
      }).catch(() => {})
      this.detailVisible = true
    },
    // 去置顶管理页面
    toStick() {
      router.push({
        path: '/content/article-stick'
      })
    },
    // update置顶
    updateTop(row) {
      console.log('row', row)
      const params = {
        articleId: row.id,
        ckey: row.ckey,
        type: 1
        // type: row.istop ? 0 : 1
      }
      updateChamberTop(params).then(res => {
        if (res.state === 1) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 删除文章
    delArticle(row) {
      this.$confirm('确认删除该文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {}
        const articleIds = []
        articleIds.push(row.id + '')
        params.articleIds = articleIds
        del(params).then(response => {
          if (response.state === 1) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: response.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
