import { getManagerList, updateStatusPlatform, getDetail, updateAudit, del, countTop, setTop } from '@/api/content/article'
import { getAllContentColumnOptions } from '@/api/content/columnsetup'

export default {
  data() {
    return {
      visible: false,
      query: {
        title: '',
        status: 1,
        contentColumnId: -1,
        publishTimeType: 3
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      detailObj: {
        title: '',
        contentHtml: ''
      },
      selectId: '',
      remark: '内容违规',
      contentColumnOptions: []
    }
  },
  computed: {
  },
  created() {
    this.getContentColumnType()
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
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
    init() {
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    getContentColumnType () {
      getAllContentColumnOptions().then(response => {
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
        'contentColumn': this.query.contentColumnId,
        'status': this.query.status,
        'publishTimeType': this.query.publishTimeType
      }
      getManagerList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.selectId = row.id
      let params = {
        id: this.selectId
      }
      getDetail(params).then(response => {
        this.detailObj = response.data.dtl
      }).catch(error => {
        reject(error)
      })
      this.visible = true
    },
    handlerChange (value) {
      this.query.tradeType = value[value.length - 1]
    },
    handleSelectionChange (value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    },
    delArticle (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('此删除会把文章直接从数据库删除不可恢复，请谨慎操作', '确定删除文章？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let ids = []
        ids.push(row.id)
        let params = {
          'articleIds': ids
        }
        del(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    batchDelArticle (e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('此删除会把文章直接从数据库删除不可恢复，请谨慎操作', '确定删除文章？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'articleIds': this.selectionDatas
        }
        del(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    updateStatus (e, row) {
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
        } else if (row.status === 1) {
          this.$message({
            message: '冻结成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    batchUpdateStatus (e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'articleIds': this.selectionDatas,
        'action': 'notactive'
      }
      updateStatusPlatform(params).then(response => {
        this.$message({
          message: '冻结成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    top (e, row) {
      const actionId = e.currentTarget.getAttribute('actionid')
      countTop().then(response => {
        const count = response.data.count
        if (count >= 3) {
          this.$alert('3个置顶位已有内容，请到置顶管理页面调整后再置顶', {
            confirmButtonText: '确定'
          })
        } else {
          console.log(actionId)
          window.localStorage.setItem('actionId', actionId)
          this.$prompt('设置置顶位置', '置顶文章', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: row.typeName,
            inputPattern: /^[0-9]{1,2}$/,
            inputErrorMessage: '只能填数字'
          }).then(({ value }) => {
            let params = {
              'id': row.id,
              'level': value
            }
            setTop(params).then(response => {
              this.$message({
                message: '置顶成功',
                type: 'success'
              })
              this.fetchData()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
        }
      })
    },
    edit (row) {
      window.localStorage.setItem('articleeditor', this.$route.path)
      this.$router.push({ name: '添加或编辑文章', params: { 'articleId': row.id } })
    },
    goSettop (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '置顶管理' })
    }
  }
}
