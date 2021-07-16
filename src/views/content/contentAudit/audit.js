import {
  getAuditList,
  getDetail,
  getCompanyDetail,
  updateAudit,
  updateCompanyAudit,
  getCompanyAuditList,
  getArticleCommentList,
  updateCommentStatus
} from '@/api/content/article'
import { logger } from "runjs/lib/common";
// import {getCollectList, getRecycleList} from "@/api/content/crawler";

export default {
  data() {
    return {
      activeName: '1',
      visible: false,
      rejectVisible: false,
      batchRejectVisible: false,
      query: {
        publishType: -1,
        publishTimeType: 4,
        auditStatus: 0
      },
      queryComment: {
        commentKey: '', // 评论关键字
        uname: '', // 发布者
        status: -1
      },
      queryDate: '',
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
      OffVisible: false,
      delVisible:false
    }
  },

  computed: {},

  created() {
  },

  mounted() {
    const activename = window.localStorage.getItem('activenamec')
    if (activename) {
      this.activeName = activename
    }
    this.init()
  },

  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({
        tabName, actionName
      })
    },

    getId(tabName, actionName) {
      return this.$store.getters.getId({
        tabName, actionName
      })
    },

    init() {
      this.selectionDatas = []
      this.list = []
      this.query = {
        publishType: -1,
        publishTimeType: 4,
        auditStatus: 0
      }
      this.currentpage = 1
      this.limit = 10
      this.total = 0
      this.fetchData()
    },

    handleClick(e) {
      console.log(e)
      console.log(this.activeName, 666)
      window.localStorage.setItem('activenamec', this.activeName)
      this.init()
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

    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      const params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'publishType': this.query.publishType,
        'publishTimeType': this.query.publishTimeType,
        'auditStatus': this.query.auditStatus
      }
      if (this.activeName === '1') {
        getAuditList(params).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        })
      } else if (this.activeName === '2') {
        getCompanyAuditList(params).then(response => {
          this.list = response.data.page.list
          this.total = response.data.page.totalRows
          this.listLoading = false
        })
      } else if (this.activeName === '3') {
        this.queryComment['pageSize'] = this.limit
        this.queryComment['page'] = this.currentpage
        if (this.queryDate) {
          this.queryComment['startTs'] = this.queryDate[0]
          this.queryComment['endTs'] = this.queryDate[1]
        }
        getArticleCommentList(this.queryComment).then(res => {
          if (res.state === 1) {
            this.list = res.data.list
            this.total = res.data.totalRows
          }
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },

    detail(row) {
      this.selectId = row.id
      const params = {
        id: this.selectId
      }
      if (this.activeName === '1') {
        getDetail(params).then(response => {
          this.detailObj = response.data.dtl
        }).catch(error => {
          console.log(error)
        })
        this.visible = true
      } else if (this.activeName === '2') {
        getCompanyDetail(params).then(res => {
          this.detailObj = res.data.companyAudit
        }).catch(error => {
          console.log(error)
        })
        this.visible = true
      } else if (this.activeName === '3') {
        this.detailObj['title'] = '评论详情'
        this.detailObj['contentHtml'] = row.commentContent
        this.visible = true
      }
    },

    rowPass(row) {
      this.selectId = row.id
      this.passThrough()
    },

    rowReject(row) {
      this.selectId = row.id
      this.remark = '内容违规'
      this.rejectVisible = true
    },

    rowOff(row) {
      this.selectId = row.id
      this.OffVisible = true
    },

    comfirmOff() {
      const params = {
        id: this.selectId,
        status: 0
      }
      updateCommentStatus(params).then(res => {
        if (res.state === 1) {
          this.OffVisible = false
          this.fetchData()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    rowDel(row) {
      this.selectId = row.id
      this.delVisible = true
    },

    comfirmDel() {
      const params = {
        id: this.selectId,
        status: 2
      }
      updateCommentStatus(params).then(res => {
        if (res.state === 1) {
          this.delVisible = false
          this.fetchData()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    rowON(row) {
      this.selectId = row.id
      const params = {
        id: row.id,
        status: 1
      }
      updateCommentStatus(params).then(res => {
        if (res.state === 1) {
          this.OffVisible = false
          this.fetchData()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    /**
     * 通过资料修改
     */
    passThrough(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      const ids = []
      ids.push(this.selectId)
      if (this.activeName === '1') {
        const params = {
          'articleIds': ids,
          'auditStatus': 1
        }
        updateAudit(params).then(response => {
          this.$message({
            message: '通过成功',
            type: 'success'
          })
          this.visible = false
          this.fetchData()
        })
      } else if (this.activeName === '2') {
        const params = {
          'ids': ids,
          'auditStatus': 1
        }
        updateCompanyAudit(params).then(response => {
          this.$message({
            message: '通过成功',
            type: 'success'
          })
          this.visible = false
          this.fetchData()
        })
      }
    },

    // 驳回资料修改
    openReject(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.rejectVisible = true
      this.remark = '内容违规'
    },
    reject() {
      const ids = []
      ids.push(this.selectId)
      if (this.activeName === '1') {
        const params = {
          'articleIds': ids,
          'auditStatus': 2,
          'remark': this.remark
        }
        updateAudit(params).then(response => {
          this.$message({
            message: '驳回成功',
            type: 'success'
          })
          this.rejectVisible = false
          this.visible = false
          this.fetchData()
        })
      } else {
        const params = {
          'ids': ids,
          'auditStatus': 2,
          'rejectRemark': this.remark
        }
        updateCompanyAudit(params).then(response => {
          this.$message({
            message: '驳回成功',
            type: 'success'
          })
          this.rejectVisible = false
          this.visible = false
          this.fetchData()
        })
      }
    },

    /*
    * 多选通过/不通过
    * */
    batchPassThrough(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      if (this.activeName === '1') {
        const params = {
          'articleIds': this.selectionDatas,
          'auditStatus': 1
        }
        updateAudit(params).then(response => {
          this.$message({
            message: '通过成功',
            type: 'success'
          })
          this.visible = false
          this.fetchData()
        })
      } else {
        const params = {
          'ids': this.selectionDatas,
          'auditStatus': 1
        }
        updateCompanyAudit(params).then(response => {
          this.$message({
            message: '通过成功',
            type: 'success'
          })
          this.visible = false
          this.fetchData()
        })
      }
    },
    openBatchReject(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.batchRejectVisible = true
      this.remark = '内容违规'
    },
    batchReject() {
      if (this.activeName === '1') {
        const params = {
          'articleIds': this.selectionDatas,
          'auditStatus': 2,
          'remark': this.remark
        }
        updateAudit(params).then(response => {
          this.$message({
            message: '驳回成功',
            type: 'success'
          })
          this.batchRejectVisible = false
          this.visible = false
          this.fetchData()
        })
      } else {
        const params = {
          'ids': this.selectionDatas,
          'auditStatus': 2,
          'rejectRemark': this.remark
        }
        updateCompanyAudit(params).then(response => {
          this.$message({
            message: '驳回成功',
            type: 'success'
          })
          this.rejectVisible = false
          this.visible = false
          this.fetchData()
        })
      }
    },

    handlerChange(value) {
      this.query.tradeType = value[value.length - 1]
    },

    handleSelectionChange(value) {
      const datas = value
      this.selectionDatas = []
      for (const data of datas) {
        this.selectionDatas.push(data.id)
      }
    }

  }

}
