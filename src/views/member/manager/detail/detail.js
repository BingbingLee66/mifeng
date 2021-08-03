import { getMemberDetail, getMemberAuditDetail, updateAudit, updateReaudit } from '@/api/member/manager'

export default {
  name: 'memebrDetails',
  data() {
    return {
      type: '', // 0会员 1提交审核 2修改审核
      memberDetail: {},
      member: {},
      count: 0,
      idCardVisible: false,
      idCardImage: {
        frontOfIdCard: '',
        backOfIdCard: ''
      },
      licenseVisible: false,
      licenseImage: '',
      companyIntroductionVisible: false,
      companyIntroduction: '',
      resumeVisible: false,
      resume: '',
      rejectVisible: false,
      audit: {
        id: [],
        remark: '资料乱填',
      },
      userInfo: {}
    }
  },
  computed: {
    resumeCp() {
      return function(msg) {
        let result = msg
        if (!!msg && msg.length > 100) {
          result = msg.substring(0, 100) + '...'
        }
        return result
      }
    },
    companyInstrodCp() {
      return function(msg) {
        let result = msg
        if (!!msg && msg.length > 100) {
          result = msg.substring(0, 100) + '...'
        }
        return result
      }
    }
  },
  activated() {
    console.log('缓存')
  },
  deactivated() {
    console.log('出去缓存')
  },
  mounted() {
    if (this.$route.params.memberDetail) {
      this.memberDetail = this.$route.params.memberDetail
      window.localStorage.setItem('detail-member', JSON.stringify(this.memberDetail))
    }
    if (!this.memberDetail.id) {
      this.memberDetail = JSON.parse(window.localStorage.getItem('detail-member'))
    }
    if (this.$route.params.querytype) {
      this.type = this.$route.params.querytype
      window.localStorage.setItem('detail-type', this.type)
    }
    if (this.type === '') {
      this.type = window.localStorage.getItem('detail-type')
    }
    this.init()
  },
  created() {
  },
  methods: {
    closeTab() {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem('memberaudit')
      let tagsViews = this.$store.state.tagsView.visitedViews
      let selectView = null
      for (let view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({ path: openPath })
          })
          break
        }
      }
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const params = {
        'memberId': this.memberDetail.id
      }
      if (this.type === '0') {
        getMemberDetail(params).then(response => {
          this.member = response.data.dtl[0]
          if (response.data.userInfo) {
            this.userInfo = response.data.userInfo
          }

          console.log('member', this.member)
        })
      } else {
        params['type'] = this.type
        getMemberAuditDetail(params).then(response => {
          this.member = response.data.dtl[0]
        })
      }
    },
    idCardDetail(row) {
      this.idCardImage.frontOfIdCard = row.frontOfIdCard
      this.idCardImage.backOfIdCard = row.backOfIdCard
      this.idCardVisible = true
    },
    licenseDetail(row) {
      this.licenseImage = row.license
      this.licenseVisible = true
    },
    resumeDetail(msg) {
      this.resume = msg
      this.resumeVisible = true
    },
    companyIntroductionDetail(msg) {
      this.companyIntroduction = msg
      this.companyIntroductionVisible = true
    },
    goEdit() {
      this.$router.push({ name: '编辑会员', params: { 'memberId': this.memberDetail.id, 'querytype': this.type }})
    },
    approved(row) {
      let arr = []
      arr.push(row.id)
      let params = {
        'memberId': arr,
        'auditStatus': 1
      }
      if (this.type === '1') {
        updateAudit(params).then(response => {
          this.$message({
            message: '已通过',
            type: 'success'
          })
          this.closeTab()
        })
      } else if (this.type === '2') {
        updateReaudit(params).then(response => {
          this.$message({
            message: '已通过',
            type: 'success'
          })
          this.closeTab()
        })
      }
    },
    rejectRemark(row) {
      this.audit.id.push(row.id)
      this.audit.remark = '资料乱填'
      this.rejectVisible = true
    },
    reject() {
      let params = {
        'memberId': this.audit.id,
        'auditStatus': 2,
        'remark': this.audit.remark
      }
      if (this.type === '1') {
        updateAudit(params).then(response => {
          this.$message({
            message: '已驳回',
            type: 'success'
          })
          this.closeTab()
        })
      } else if (this.type === '2') {
        updateReaudit(params).then(response => {
          this.$message({
            message: '已驳回',
            type: 'success'
          })
          this.closeTab()
        })
      }
      this.rejectVisible = false
    }
  }
}
