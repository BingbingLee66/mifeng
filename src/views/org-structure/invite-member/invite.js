import {
  getInviteLogo,
  updateInviteLogo
} from '@/api/org-structure/org'

import domtoimage from 'dom-to-image'
import {refreshGetInfo} from "@/api/system/property";

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
      const params = {
        ckey: this.$store.getters.ckey,
        departmentId: this.$route.query.departmentId
      }
      getInviteLogo(params).then(res => {
        if (res.state === 1) {
          this.chamberName = res.data.data.chamberName
          this.departmentName = res.data.data.departmentName
          this.qrcode = res.data.data.systemJoinQrcode
        }
      })
    },

    /*
    * 刷新入会专属二维码
    * */
    refresh() {
      const params = {
        ckey: this.$store.getters.ckey,
        departmentId: this.$route.query.departmentId
      }
      updateInviteLogo(params).then(res => {
        if (res.state === 1) {
          this.chamberName = res.data.data.chamberName
          this.departmentName = res.data.data.departmentName
          this.qrcode = res.data.data.systemJoinQrcode
          this.$router.go(0)
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
