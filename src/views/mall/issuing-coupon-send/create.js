import { createSend } from '@/api/mall/issued'
import draggable from 'vuedraggable' // 拖拽组件
import { getChamberOptions } from '@/api/finance/finance'
import { queryDetail } from "@/api/mall/spree";

export default {
  components: {
    draggable
  },
  data() {
    return {
      issueType: '',
      phone: '',
      couponListDrag: false,
      formObj: {
        receive: '',
        phone: '',
        ckey: ''
      },
      couponList: [{ id: '', name: '', number: '', tip: '', errTips: '' }],
      chamberOptions: [],
      showPhoneInput: false,
      showChamberSelect: false
    }
  },
  created() {
    this.getChamberOptions()
  },
  methods: {
    handleInt(e, index, str) {
      let regexp = /^[1-9]\d*$/
      if (!regexp.test(e)) {
        if (str === 'id') {
          this.couponList[index].id = ''
        } else if (str === 'num') {
          this.couponList[index].number = ''
        }
      } else {
        if (str === 'id') {
          this.couponList[index].id = e
        } else if (str === 'num') {
          this.couponList[index].number = e
        }
      }
    },
    handleBlur(e, index, str) {
      let val = e.target.value
      // 失焦查询优惠劵名称
      if (str === 'id') {
        if (!val) {
          this.couponList[index].name = ''
          this.couponList[index].errTips = '请填写优惠券ID'
        } else {
          queryDetail({ id: val }).then(res => {
            console.log(res)
            this.couponList[index].errTips = ''
            this.couponList[index].name = res.data.goodsDetail.name
          })
        }
      } else if (str === 'num') {
        if (!val) {
          this.couponList[index].tip = '请填写券数量'
        } else if (val > 10) {
          this.couponList[index].tip = '券数量需控制在1-10张'
        } else {
          this.couponList[index].tip = ''
        }
      }
    },
    couponListStart() {
      this.couponListDrag = true
    },
    couponListEnd(evt) {
      this.couponListDrag = false
    },
    addCoupon() {
      if (this.couponList.length > 9) {
        this.$confirm('配置大礼包时，优惠券需控制在1-10张！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
        }).catch(() => {
        })
      } else {
        this.couponList.push({ id: '', name: '', number: '', tip: '', errTips: '' })
      }
    },
    delCoupon(index) {
      this.couponList.splice(index, 1)
    },
    handleChange(e) {
      if (e === '1') {
        this.showPhoneInput = true
      } else if (e === '2') {
        this.showChamberSelect = true
      }
    },
    getChamberOptions() {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
    },
    checkCouponList() {
      let vaild = true
      let _this = this
      _this.couponList.forEach((item, index) => {
        if (!item.id) {
          _this.couponList[index].errTips = '请填写优惠券ID'
          vaild = false
        }
        if (!item.number) {
          _this.couponList[index].tip = '请填写券数量'
          vaild = false
        }
      })
      return vaild
    },
    save() {
      if (!this.checkCouponList()) return
      if (!this.phone) {
        return this.$message.error('请设置指定手机号！')
      }
      let params = {
        couponList: this.couponList,
        chamberId: '',
        issueType: this.issueType,
        phone: this.phone.split(/[\s\n]/)
      }
      console.log('提交参数：', params)
      createSend(params).then(res => {
        console.log(res)
      })
    }
  }
}
