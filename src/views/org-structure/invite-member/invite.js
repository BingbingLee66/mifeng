import {
  getInviteLogo
} from '@/api/org-structure/org'
import domtoimage from 'dom-to-image'

export default {
  data() {
    return {
      departmentId: 0,
      chamberName: '',
      departmentName: '',
      qrcode: '',
      isLoading: false
    }
  },

  created() {
    this.getInviteLogo()
  },
  methods: {
    /*
    *  获取入会专属二维码
    * */
    getInviteLogo() {
      const departmentId = this.$route.query.departmentId
      const params = {
        ckey: this.$store.getters.ckey,
        departmentId
      }
      getInviteLogo(params).then(res => {
        if (res.state === 1) {
          this.chamberName = res.data.data.chamberName
          this.departmentName = res.data.data.departmentName
          this.qrcode = res.data.data.systemJoinQrcode
        }
      })
    },
    domtoimage() {
      const _this = this
      this.isLoading = true
      const node = document.getElementById('postdiv')
      domtoimage.toPng(node)
        .then((dataUrl) => {
          var a = document.createElement('a')
          a.download = '入会二维码'
          a.href = dataUrl
          a.click()
          _this.isLoading = false
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
          _this.isLoading = false
        })
    }
  }
}
