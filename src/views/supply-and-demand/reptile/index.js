import {
  getWebnameOptions,
  getChannelOptions,
  getCollectList,
  getRecycleList,
  del,
  getDetail,
  publish,
  toRecycleBin,
  toCollectionResult
} from '@/api/content/crawler'
import { getContentColumnOptions } from '@/api/content/columnsetup'

export default {
  components: {},
  data() {
    return {
      detailVisible: false,
      publishVisible: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      query: {
        crawlerId: -1,
        channel: '-1'
      },
      detailObj: {
        title: '',
        contentHtml: ''
      },
      crawlerOptions: [],
      channelOptions: [],
      formObj: {
        contentColumnId: '',
        status: 1,
        publishTs: ''
      },
      activeName: '1',
      selectionDatas: [],
      contentColumnOptions: [],
      rules: {
        contentColumnId: [
          { required: true, message: '对应栏目不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    let activename = window.localStorage.getItem('activenamec')
    if (!!activename) {
      this.activeName = activename
    }
    this.init()
  },
  computed: {},
  created() {
    this.getWebNameType()
    this.getContentColumnType()
  },
  methods: {
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
      window.localStorage.setItem('activenamec', this.activeName)
      this.init()
    },
    init() {
      this.selectionDatas = []
      this.query = {
        crawlerId: -1,
        channel: '-1'
      }
      this.list = []
      this.currentpage = 1
      this.limit = 10
      this.fetchData()
      // if (this.activeName === '1' && this.has('采集结果', '查询')) {
      //   this.fetchData()
      // } else if (this.activeName === '2' && this.has('回收站', '查询')) {
      //   this.fetchData()
      // }
    },
    getWebNameType() {
      getWebnameOptions().then(response => {
        this.crawlerOptions = response.data.data
        this.crawlerOptions.unshift({ 'label': '所有', 'value': -1 })
      })
    },
    getContentColumnType() {
      getContentColumnOptions().then(response => {
        this.contentColumnOptions = response.data.data
      })
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'crawlerId': this.query.crawlerId,
        'channel': this.query.channel
      }
      console.log(this.activeName+"feffefe")
      if (this.activeName === '1') {
        getCollectList(params).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        })
      } else if (this.activeName === '2') {
        getRecycleList(params).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        })
      }
    },
    openPublish(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        'id': row.id,
        'count': 1,
        'contentColumnId': '',
        'status': 1,
        'publishTs': ''
      }
      this.publishVisible = true
    },
    openPublishBatch(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        'count': this.selectionDatas.length,
        'contentColumnId': '',
        'status': 1,
        'publishTs': ''
      }
      this.publishVisible = true
    },
    publish(e) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let ids = []
          if (this.formObj.hasOwnProperty('id')) {
            ids.push(this.formObj.id)
          } else {
            ids = this.selectionDatas
          }
          let params = {
            'articleIds': ids,
            'contentColumnId': this.formObj.contentColumnId,
            'status': this.formObj.status,
            'publishTs': this.formObj.publishTs
          }
          publish(params).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '发布成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
            this.fetchData()
          })
          this.publishVisible = false
        } else {
          return false
        }
      })
    },
    toRecycleBin(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let ids = []
      ids.push(row.id)
      let params = {
        'articleIds': ids
      }
      toRecycleBin(params).then(response => {
        this.$message({
          message: '移入回收站成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    batchToRecycleBin(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'articleIds': this.selectionDatas
      }
      toRecycleBin(params).then(response => {
        this.$message({
          message: '移入回收站成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    toCollectionResult(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'id': row.id
      }
      toCollectionResult(params).then(response => {
        this.$message({
          message: '移出回收站成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    delArticle(e, row) {
      let actionid = e.currentTarget.getAttribute('actionid')
      const h = this.$createElement
      this.$msgbox({
        title: '确定删除文章？',
        message: h('p', null, [
          h('p', null, '此删除会把文章直接从数据库删除'),
          h('p', null, '不可恢复，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        window.localStorage.setItem('actionId', actionid)
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
          message: '已取消删除'
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
      let actionid = e.currentTarget.getAttribute('actionid')
      const h = this.$createElement
      this.$msgbox({
        title: '确定删除文章？',
        message: h('p', null, [
          h('p', null, '此删除会把文章直接从数据库删除'),
          h('p', null, '不可恢复，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        window.localStorage.setItem('actionId', actionid)
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

    },
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('crawlermanager', this.$route.path)
      this.$router.push({ name: '编辑采文', params: { 'articleId': row.id } })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.selectId = row.id
      let params = {
        id: this.selectId
      }
      getDetail(params).then(response => {
        this.detailObj.title = response.data.dtl.title
        this.detailObj.contentHtml = response.data.dtl.webContent
      }).catch(error => {
        reject(error)
      })
      this.detailVisible = true
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    }
  }
}
