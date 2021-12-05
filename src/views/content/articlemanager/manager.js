import {
  getManagerList,
  updateStatusPlatform,
  getDetail,
  updateAudit,
  del,
  countTop,
  setTop
} from '@/api/content/article'
import { getAllContentColumnOptions,getOptionsWithCkey } from '@/api/content/columnsetup'
import { getChamberOptions } from '@/api/finance/finance'

export default {
  data() {
    return {
      visible: false,
      activeName: '1',
      query: {
        title: '',
        status: 1,
        ckey: '',
        contentColumnId: '',
        publishTimeType: 3,
        contentModuleId: 1
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      chamberName: '',
      currentpage: 1,
      limit: 10,
      listLoading: false,
      sortFlag: '',
      selectionDatas: [],
      detailObj: {
        title: '',
        contentHtml: ''
      },
      selectId: '',
      remark: '内容违规',
      contentColumnOptions: [],
      chamberOptions: []
    }
  },
  computed: {},
  created() {
    this.getContentColumnType()
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // 浏览量排序
    handleSortChange(e) {
      // let sort = ''
      this.currentpage = 1
      if (e.prop) {
        if (e.order === 'descending') {
          this.sortFlag = (e.prop === 'readCount' ? 'read_count' : e.prop === 'commentLikeNums' ? 'like_nums' : 'comment_nums') + ' desc'
        } else {
          this.sortFlag = e.prop === 'readCount' ? 'read_count' : e.prop === 'commentLikeNums' ? 'like_nums' : 'comment_nums'
        }
        this.fetchData(1)
      }
    },
    selectionChange() {
      let params = {
        'ckey': this.query.ckey,
        'contentModuleId': this.query.contentModuleId
      }

      // 指定模块下商会全部栏目
      getOptionsWithCkey(params).then(response => {
        this.contentColumnOptions = response.data.data
        this.contentColumnOptions.unshift({ 'label': '全部', 'value': -1 })
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
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    getContentColumnType() {
      let params = {
        'ckey': this.query.ckey,
        'contentModuleId': this.query.contentModuleId
      }
      // 指定模块下商会全部列表
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
        this.chamberOptions.unshift({ 'label': '全部', 'value': '' })
      })
      // 指定模块下商会全部栏目
      getOptionsWithCkey(params).then(response => {
        this.contentColumnOptions = response.data.data
        this.contentColumnOptions.unshift({ 'label': '全部', 'value': '' })
      })
    },
    queryData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.currentpage = 1
      this.fetchData(e)
    },
    handleClick() {
      this.currentpage = 1,
      this.query.contentModuleId = this.activeName,
      this.fetchData()
    },
    fetchData(e, sort) {
      if (e !== undefined && e !== 1) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      let params = {
        'order': this.sortFlag,
        'pageSize': this.limit,
        'page': this.currentpage,
        'title': this.query.title,
        'ckey': this.query.ckey,
        'contentColumn': this.query.contentColumnId,
        'status': this.query.status,
        'contentModuleId': this.query.contentModuleId,
        'publishTimeType': this.query.publishTimeType
      }
      // if (sort) {
      //   params['order'] = sort
      // }
      getManagerList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail(e, row) {
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
    handlerChange(value) {
      this.query.tradeType = value[value.length - 1]
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    },
    delArticle(e, row) {
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
    batchDelArticle(e) {
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
        } else if (row.status === 1) {
          this.$message({
            message: '冻结成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    batchUpdateStatus(e) {
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
    top(e, row) {
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
    edit(row) {
      window.localStorage.setItem('articleeditor', this.$route.path)
      this.$router.push({ name: '添加或编辑文章', params: { 'articleId': row.id } })
    },
    goSettop(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '置顶管理' })
    }
  }
}
