import { getChamberContentList, getAboutChamberList, getContactUs, save, updateStatus } from '@/api/content/article'
import { getContentColumnOptionsWithCkey } from '@/api/content/columnsetup'

export default {
  components: {
  },
  data() {
    return {
      detailVisible: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      query: {
        title: '',
        contentColumnId: -1,
        status: -1,
        date: ''
      },
      detailObj: {
        contentHtml: '',
        auditStatus: '',
        auditRemark: ''
      },
      contentColumnOptions: [],
      formObj: {},
      activeName: '5'
    }
  },
  mounted () {
  },
  computed: {
  },
  created() {
    let activename = window.localStorage.getItem('activename')
    if (!!activename) {
      this.activeName = activename
    }
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
    handleClick () {
      this.total = 0
      this.list = []
      this.currentpage = 1
      this.limit = 10
      window.localStorage.setItem('activename', this.activeName)
      this.fetchData()
    },
    init() {
      this.total = 0
      this.list = []
      this.currentpage = 1
      this.limit = 10
      if (this.has('商会资讯', '查询')) {
        this.fetchData()
      }
    },
    getContentColumnType () {
      let contentModuleId = 7
      if (this.activeName === '5') {
        contentModuleId = 3
      } else if (this.activeName === '6') {
        contentModuleId = 4
      }
      let params = {
        ckey: this.$store.getters.ckey,
        contentModuleId: contentModuleId
      }
      getContentColumnOptionsWithCkey(params).then(response => {
        this.contentColumnOptions = response.data.data
        this.contentColumnOptions.unshift({ 'label': '全部', 'value': -1 })
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
        'ckey': this.$store.getters.ckey,
        'title': this.query.title,
        'contentModuleId': this.activeName,
        'contentColumnId': this.query.contentColumnId,
        'status': this.query.status
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      if (this.activeName === '5') {
        getChamberContentList(params).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        })
      } else if (this.activeName === '6') {
        getAboutChamberList(params).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })
      } else if (this.activeName === '7') {
        getContactUs(params).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })
      }
    },
    openVisible (row) {
      this.formObj = row
    },
    updateStatus (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'id': row.id,
        'action': row.status === 0 ? 'active' : 'notactive'
      }
      updateStatus(params).then(response => {
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
    add (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('articleupdate', this.$route.path)
      this.$router.push({ name: '添加/修改文章', params: { 'activeName': this.activeName } })
    },
    edit (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('articleupdate', this.$route.path)
      this.$router.push({ name: '添加/修改文章', params: { 'activeName': this.activeName, 'articleId': row.id } })
    },
    editColumn (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '修改栏目内容', params: { 'activeName': this.activeName, 'articleObj': row } })
    },
    detail (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$router.push({ name: '文章详情', params: { 'articleId': row.id } })
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.formObj['ckey'] = this.$store.getters.ckey
          this.formObj['contentModuleId'] = this.activeName
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
    },
    openDetail (row) {
      this.detailObj.contentHtml = row.contentHtml
      this.detailObj.auditStatus = row.auditStatus
      this.detailObj.auditRemark = row.auditRemark
      this.detailVisible = true
    }
  }
}
