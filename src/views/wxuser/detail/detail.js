import { getUserDetail } from '@/api/member/manager'

export default {
  data() {
    return {
      userDetail: {},
      memberList: {},
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
  mounted() {
    console.log('this.$route.params', this.$route.params)
    if (this.$route.params.userDetail) {
      this.userDetail = this.$route.params.userDetail
      window.localStorage.setItem('detail-user', this.userDetail)
    }
    if (!this.userDetail) {
      this.userDetail = window.localStorage.getItem('detail-user')
    }
    this.init()
  },
  created() {
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'phone': this.userDetail.phone
      }
      getUserDetail(params).then(response => {
        this.memberList = response.data.dtl
        this.count = this.memberList.length
        this.userInfo = response.data.userInfo
        console.log('userInfo', this.userInfo)
      })
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
    }
  }
}
