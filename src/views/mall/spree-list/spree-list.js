import {
  getSpreeList, updateSpreeIssue, updateIssueStatus
} from '@/api/mall/spree'
import { spaceInput, intInput } from '@/utils/utils'
import domtoimage from 'dom-to-image'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      query: {
        giftId: '',
        giftName: '',
        createName: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      issue: '',
      linkVisible: false,
      issueVisible: false,
      codeVisible: false,
      rowData: {},
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['profile'])
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
    handleSpace(e, str) {
      this.query[str] = spaceInput(e)
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
        'giftId': this.query.giftId,
        'giftName': this.query.giftName,
        'createName': this.query.createName
      }
      getSpreeList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.fetchData(1)
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    // 生成礼包二维码
    createCode(row) {
      console.log(row)
      this.rowData = row
      this.codeVisible = true
    },
    // 保存礼包二维码
    downloadCode() {
      const _this = this
      this.isLoading = true
      const node = document.getElementById('spreeQrcode')
      const options = {
        height: 600,
        width: 500
      }
      domtoimage.toJpeg(node, options)
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
    createLink(row) {
      this.rowData = row
      this.linkVisible = true
    },
    // 复制短链接
    copyUrl() {
      let url = this.rowData.sortUrl
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
      this.issue = row.quota
      this.issueVisible = true
    },
    updateIssue() {
      if (this.issue < this.rowData.quota) return this.$message.error('编辑发行量时，只能增加，不能减少。')
      let params = {
        giftId: this.rowData.giftId,
        quota: this.issue
      }
      updateSpreeIssue(params).then(res => {
        if (res.state === 1) {
          this.$message.success(res.msg)
          this.issueVisible = false
          this.fetchData()
        }
      })
    },
    // 更新发行状态
    updateIssueStatu(row, status) {
      let _this = this
      let msg = status === 0 ? '确认停发吗?' : '确认继续发吗?'
      _this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          giftId: parseInt(row.giftId),
          status: status,
          updateId: _this.profile.id
        }
        updateIssueStatus(params).then(res => {
          if (res.state === 1) {
            _this.$message.success('操作成功')
            _this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    // 跳转创建大礼包
    create() {
      window.localStorage.setItem('spreelist', this.$route.path)
      this.$router.push(`/mall/spreeCreate`)
    },
    // 查看大礼包详情
    goSpreeDetail(giftId) {
      this.$router.push({
        path: '/mall/spreeDetail',
        query: { giftId }
      })
    },
    // 查看优惠券详情
    goCouponDetail(couponId) {
      this.$router.push({
        path: '/mall/couponDetail',
        query: { couponId }
      })
    },
    // 查看已发放列表
    goIssueList(row) {
      // this.$router.push(`/mall/spreeIssued`)
      this.$router.push({
        path: '/mall/spreeIssued',
        query: { giftId: row.giftId, giftName: row.giftName }
      })
    }
  }
}
