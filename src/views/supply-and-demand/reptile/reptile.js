import {
  publish,
  getReptileDemands,
  moveToRecycleStationBatch,
  shiftOutFromRecycleStationBatch,
  details,
  getWebSites,
  reptileDelBatch,
  delBatch
} from '@/api/content/crawler'
import kdDialog from '@/components/common/kdDialog'
import addWebSite from './components/addWebSite'

export default {
  components: {
    kdDialog,
    addWebSite,
  },
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
        website: '',
        websiteId: '',
        operator: '',
        status: 1,
        collectStatus: '',
        articleIds: []
      },
      detailObj: {
        title: '',
        contentHtml: ''
      },
      websites: [],
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
    this.getWebSites()
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
      this.query.status = this.activeName
      this.list = []
      this.currentpage = 1
      this.limit = 10
      this.fetchData()
    },
    getWebSites() {
      getWebSites().then(response => {
        this.websites = response.data.list
        this.websites.unshift({ 'label': '所有', 'value': '-1' })
      })
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      if (this.activeName === '0' || this.activeName === '1') {
        let params = {
          'pageSize': this.limit,
          'pageNum': this.currentpage,
          'websiteId': this.query.websiteId,
          'status': this.query.status
        }
        getReptileDemands(params).then(response => {
          this.list = response.data.list
          this.total = response.data.totalRows
          this.listLoading = false
        })
      } else {
        let params = {
          'pageSize': this.limit,
          'pageNum': this.currentpage,
          'name': this.query.websiteId,
          'type': 2,
          'collectStatus': this.query.collectStatus,
          'creatorName': this.query.operator,
        }
        getWebSites(params).then(response => {
          this.list = response.data.list
          this.total = response.data.totalRows
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
    inRecycle(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let ids = []
      ids.push(row.id)
      moveToRecycleStationBatch(ids).then(response => {
        this.$message({
          message: '移入回收站成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    inRecycleBatch(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      // let params = {
      //   'ids': this.selectionDatas
      // }
      moveToRecycleStationBatch(this.selectionDatas).then(response => {
        this.$message({
          message: '移入回收站成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    toCollectionResult(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let ids = []
      ids.push(row.id)
      shiftOutFromRecycleStationBatch(ids).then(response => {
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
        reptileDelBatch(ids).then(response => {
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
    delWebSite(e, row) {
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
        delBatch(ids).then(response => {
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
        reptileDelBatch(this.selectionDatas).then(response => {
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
      if (this.activeName === '0' || this.activeName === '1') {
        // this.$router.push({ name: '编辑供需', params: { 'id': row.id} })
        this.$router.push({ path: '/supply-and-demand/edit-supply-demand', query: { id: row.id, type: 1 }})
      } else {
        this.$router.push({ name: '编辑采文', params: { 'articleId': row.id } })
      }
    },
    editWebSite(e, row) {
      this.$refs['addWebSite'].edit(row)
        .then(() => {
          this.fetchData()
        })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      details(row.id).then(response => {
        this.detailObj.title = response.data.yshContentEditVO.title
        this.detailObj.contentHtml = response.data.yshContentEditVO.content
      }).catch(error => {
        reject(error)
      })
      this.detailVisible = true
    },
    showAddWebSite() {
      this.$refs['addWebSite'].open().then(() => {
        this.fetchData()
      })
    },
    handleSelectionChange(value) {
      // this.selectionDatas = value.map(v => v.id)
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    }
  }
}
