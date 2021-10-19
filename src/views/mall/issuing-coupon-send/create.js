import { createSend } from '@/api/mall/issued'
import { queryCouponInfo } from '@/api/mall/coupon'
import { getChamberAllList } from '@/api/goods/goods'
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'

export default {
  components: {
    draggable
  },
  data() {
    return {
      couponList: [{ couponId: '', name: '', couponNum: '', tip: '', errTips: '' }],
      issueType: '',
      phone: '',
      chamberId: '',
      couponListDrag: false,
      chamberOptions: [],
      showPhoneInput: false,
      showChamberSelect: false
    }
  },
  computed: {
    ...mapGetters(['profile'])
  },
  created() {
    this.getChamberOptions()
    let sendItem = window.localStorage.getItem('send-item')
    let phoneItem = window.localStorage.getItem('phone-item')
    let issueType = window.localStorage.getItem('issue-type')
    if (sendItem) {
      this.couponList = JSON.parse(sendItem)
    }
    if (phoneItem) {
      this.phone = JSON.parse(phoneItem)
    }
    if (issueType) {
      this.issueType = issueType
    }
  },
  methods: {
    // 退出当前tab, 打开指定tab
    closeTab() {
      const openPath = window.localStorage.getItem('issuedlist')
      const tagsViews = this.$store.state.tagsView.visitedViews
      for (const view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({
              path: openPath
            })
          })
          break
        }
      }
    },
    // 工具类函数 查找数组重复元素
    findSameEle(arr) {
      var tmp = []
      arr.forEach(function(item) {
        (arr.indexOf(item) !== arr.lastIndexOf(item) && tmp.indexOf(item) === -1) && tmp.push(item)
      })
      return tmp
    },
    getChamberOptions() {
      getChamberAllList().then(response => {
        this.chamberOptions = response.data.data
      })
    },
    handleInt(e, index, str) {
      let regexp = /^[1-9]\d*$/
      if (!regexp.test(e)) {
        if (str === 'couponId') {
          this.couponList[index].couponId = ''
        } else if (str === 'num') {
          this.couponList[index].couponNum = ''
        }
      } else {
        if (str === 'couponId') {
          this.couponList[index].couponId = e
        } else if (str === 'num') {
          this.couponList[index].couponNum = e
        }
      }
    },
    handleBlur(e, index, str) {
      let val = e.target.value
      // 失焦查询优惠劵名称
      if (str === 'couponId') {
        if (!val) {
          this.couponList[index].name = ''
          this.couponList[index].errTips = '请设置所包含的优惠券'
        } else {
          let params = {
            type: 2,
            couponId: val
          }
          queryCouponInfo(params).then(res => {
            if (res.state === 1) {
              this.couponList[index].errTips = ''
              this.couponList[index].name = res.msg
            } else {
              this.couponList[index].name = ''
              this.couponList[index].errTips = res.msg
            }
          })
        }
      } else if (str === 'couponNum') {
        if (!val) {
          this.couponList[index].tip = '请填写券数量'
        } else if (val > 10) {
          this.couponList[index].tip = '券数量需控制在1-10张'
        } else {
          this.couponList[index].tip = ''
        }
      }
      window.localStorage.setItem('send-item', JSON.stringify(this.couponList))
    },
    addCoupon() {
      if (this.couponList.length > 9) {
        this.$confirm('优惠券ID需控制在1-10个，针对单个优惠券ID，券数量需控制在1-10张！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
        }).catch(() => {
        })
      } else {
        this.couponList.push({ couponId: '', name: '', couponNum: '', tip: '', errTips: '' })
      }
      window.localStorage.setItem('send-item', JSON.stringify(this.couponList))
    },
    delCoupon(index) {
      this.couponList.splice(index, 1)
      window.localStorage.setItem('send-item', JSON.stringify(this.couponList))
    },
    couponListStart() {
      this.couponListDrag = true
      window.localStorage.setItem('send-item', JSON.stringify(this.couponList))
    },
    couponListEnd() {
      this.couponListDrag = false
      window.localStorage.setItem('send-item', JSON.stringify(this.couponList))
    },
    handleChange(e) {
      if (e === '1') {
        this.showPhoneInput = true
      } else if (e === '2') {
        this.showChamberSelect = true
      }
      window.localStorage.setItem('issue-type', this.issueType)
    },
    checkCouponList() {
      let vaild = true
      let _this = this
      _this.couponList.forEach((item, index) => {
        if (!item.couponId) {
          _this.couponList[index].errTips = '请设置所包含的优惠券'
          vaild = false
        }
        if (!item.couponNum) {
          _this.couponList[index].tip = '请填写券数量'
          vaild = false
        }
        if (item.couponNum > 10 || item.couponNum < 1) {
          _this.couponList[index].tip = '券数量需控制在1-10张'
          vaild = false
        }
        if (item.errTips) {
          _this.couponList[index].errTips = '该优惠券不存在'
          vaild = false
        }
      })
      return vaild
    },
    handlePhoneBlur(e) {
      let val = e.target.value
      val && window.localStorage.setItem('phone-item', JSON.stringify(val))
    },
    save() {
      if (!this.checkCouponList()) return
      if (!this.issueType) return this.$message.error('请设置优惠券接收方！')
      if (this.issueType === '1' && !this.phone) return this.$message.error('请设置指定手机号！')
      if (this.issueType === '1' && this.phone && this.phone.split(/[\s\n]/).length > 1000) return this.$message.error('单次发送的手机号不得大于1000个！')
      if (this.issueType === '2' && !this.chamberId) return this.$message.error('请选择某个商/协会！')
      // 判断输入的优惠券id是否有重复
      let _couponList = []
      for (let item of this.couponList) {
        _couponList.push({ couponId: item.couponId, couponNum: item.couponNum })
      }
      const ids = _couponList.map(value => value.couponId)
      const idsSet = new Set(ids)
      if (idsSet.size !== ids.length) {
        let newArr = this.findSameEle(ids)
        let newStr = newArr.toString()
        return this.$message.error(`所设置的优惠券，存在重复的情况！【${newStr}】`)
      }
      // 根据回车键切割字符串
      let _phoneList = []
      _phoneList = this.phone.split(/[\s\n]/)
      let params = {
        couponList: _couponList,
        chamberId: this.chamberId,
        issueType: this.issueType,
        phone: _phoneList
      }
      params['createId'] = this.profile.id
      params['createName'] = this.profile.remark
      createSend(params).then(res => {
        if (res.state === 1) {
          window.localStorage.setItem('send-item', JSON.stringify([{
            couponId: '',
            name: '',
            couponNum: '',
            tip: '',
            errTips: ''
          }]))
          window.localStorage.setItem('phone-item', '')
          window.localStorage.setItem('issue-type', '')
          this.$router.push({ name: '已发放的劵' })
        }
      })
    },
    cancel() {
      window.localStorage.setItem('send-item', JSON.stringify([{
        couponId: '',
        name: '',
        couponNum: '',
        tip: '',
        errTips: ''
      }]))
      window.localStorage.setItem('phone-item', '')
      window.localStorage.setItem('issue-type', '')
      this.closeTab()
    }
  }
}
