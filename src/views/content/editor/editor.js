import { getGlobalContentList, save, updateStatusPlatform } from '@/api/content/article'
import { getContentColumnOptions } from '@/api/content/columnsetup'

export default {
  components: {
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      query: {
        title: '',
        contentColumnId: -1,
        articleId: '',
        status: -1,
        creator: '',
        column: '',
        orderType: 0,
        date: ''
      },
      optionList: [
        '标签聚合页',
        '商会必参',
        '标签聚合页/商会必参'
      ],
      contentColumnOptions: [],
      formObj: {}
    }
  },
  mounted() {
  },
  computed: {
  },
  created() {
    this.getContentColumnType()
    this.init()
  },
  methods: {

    // 选择指定列进行排序
    changeTableSort(column) {
      console.log(column)

      // 获取字段名称和排序类型
      var fieldName = column.prop
      var sortingType = column.order
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'title': this.query.title,
        'contentColumnId': this.query.contentColumnId,
        'creator': this.query.creator,
        'articleId': this.query.articleId,
        'column': fieldName,
        'orderType': sortingType === 'ascending' ? 1 : -1,
        'status': this.query.status
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      getGlobalContentList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
      console.log(this.tableData)
    },
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
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
    handleClick() {
      this.fetchData()
    },
    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    getContentColumnType() {
      getContentColumnOptions().then(response => {
        this.contentColumnOptions = response.data.data
        this.contentColumnOptions.unshift({ 'label': '全部', 'value': -1 })
      })
    },
    queryData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.currentpage = 1
      this.fetchData(e)
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'title': this.query.title,
        'contentColumnId': this.query.contentColumnId,
        'creator': this.query.creator,
        'articleId': this.query.articleId,
        'column': this.query.column,
        'orderType': this.query.orderType,
        'status': this.query.status
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      getGlobalContentList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    openVisible(row) {
      this.formObj = row
    },
    updateStatus(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let ids = []
      ids.push(row.id)
      let params = {
        'articleIds': ids,
        'action': row.status === 3 ? 'active' : 'notactive'
      }
      updateStatusPlatform(params).then(response => {
        if (row.status === 3) {
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
    add() {
      window.localStorage.setItem('articleeditor', this.$route.path)
      this.$router.push({ name: '添加或编辑文章' })
    },
    edit(row) {
      window.localStorage.setItem('articleeditor', this.$route.path)
      this.$router.push({ name: '添加或编辑文章', params: { 'articleId': row.id }})
    },
    articleSourceManager(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '文章来源管理' })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '文章详情', params: { 'articleId': row.id }})
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save(this.formObj).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
            this.visible = false
          })
        } else {
          return false
        }
      })
    }
  }
}
