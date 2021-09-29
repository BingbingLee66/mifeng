import {
  getExplodeGoodsList, getSpreeQrCode, getSpreeLink, updateSpreeIssue, stopGrantSpree, continueGrantSpree
} from '@/api/mall/spree'
import { spaceInput, intInput } from '@/utils/utils'
import domtoimage from 'dom-to-image'

export default {
  data() {
    return {
      // 查询优惠劵列表
      query: {
        id: '',
        name: '',
        create: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      // 发行量
      issue: '',
      // 控制变量
      spreeLink: '',
      linkVisible: false,
      listLoading: false,
      showIssueDialog: false,
      codeVisible: false,
      rowData: null,
      isLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // 限制输入空格
    handleSpace(e) {
      this.query.name = spaceInput(e)
    },
    // 限制输入正整数
    handleNumber(e, str) {
      if (str === 'id') {
        this.query.id = intInput(e)
      } else if (str === 'issue') {
        this.issue = intInput(e)
      }
    },
    // 查询优惠券列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'id': this.query.id,
        'status': this.query.status,
        'name': this.query.name
      }
      getExplodeGoodsList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
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
    // 生成礼包二维码
    createCode(e, row) {
      this.codeVisible = true
      this.rowData = row
      getSpreeQrCode({ id: row.id }).then(res => {
        if (res.state === 1) {
          this.qrCode = res.data
        }
      })
    },
    // 保存礼包二维码
    downloadCode() {
      const _this = this
      this.isLoading = true
      const node = document.getElementById('postdiv')
      domtoimage.toPng(node)
        .then((dataUrl) => {
          var a = document.createElement('a')
          a.download = '礼包二维码'
          a.href = dataUrl
          a.click()
          _this.isLoading = false
        })
        .catch(function(error) {
          console.error('oops, something went wrong!', error)
          _this.isLoading = false
        })
    },
    // 生成短链接
    createLink(e, row) {
      this.linkVisible = true
      getSpreeLink({ id: row.id }).then(res => {
        if (res.state === 1) {
          this.spreeLink = res.data
        } else {
          console.log(res)
        }
      })
    },
    // 复制短链接
    copyUrl() {
      let url = this.spreeLink
      let oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('Copy')
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      this.$message.success('链接已复制')
    },
    // 更新发行量
    showIssue(row) {
      this.rowData = row
      this.issue = row.id
      this.showIssueDialog = true
    },
    updateIssue() {
      let params = {
        id: this.rowData.id,
        issue: this.issue
      }
      updateSpreeIssue(params).then(res => {
        if (res.state === 1) {
          console.log(res)
          this.showIssueDialog = false
          this.fetchData(1)
        }
      })
    },
    // 停止发送
    stopSend() {
      console.log('停止发送')
      this.$confirm('确认停发吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {}
        stopGrantSpree(params).then(res => {
          if (res.state === 1) {
            console.log(res)
            this.$message.success('操作成功')
            this.fetchData(1)
          }
        })
      }).catch(() => {
      })
    },
    // 继续发送
    continueSend() {
      console.log('继续发送')
      this.$confirm('确认继续发吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {}
        continueGrantSpree(params).then(res => {
          if (res.state === 1) {
            console.log(res)
            this.$message.success('操作成功')
            this.fetchData(1)
          }
        })
      }).catch(() => {
      })
    },
    // 跳转创建大礼包
    create() {
      this.$router.push(`/mall/spreeCreate`)
    },
    // 查看大礼包详情
    goSpreeDetail() {
      this.$router.push(`/mall/spreeDetail`)
    },
    // 查看优惠券详情
    goCouponDetail() {
      this.$router.push(`/mall/couponDetail`)
    },
    // 查看已发放列表
    goIssueList() {
      this.$router.push(`/mall/spreeIssued`)
    }
  }
}
