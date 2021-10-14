import { createSend } from '@/api/mall/issued'
import { queryCouponInfo } from '@/api/mall/coupon'
import { getChamberAllList } from '@/api/goods/goods'
import draggable from 'vuedraggable' // 拖拽组件

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
  created() {
    this.getChamberOptions()
  },
  methods: {
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
    },
    delCoupon(index) {
      this.couponList.splice(index, 1)
    },
    couponListStart() {
      this.couponListDrag = true
    },
    couponListEnd() {
      this.couponListDrag = false
    },
    handleChange(e) {
      if (e === '1') {
        this.showPhoneInput = true
      } else if (e === '2') {
        this.showChamberSelect = true
      }
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
      console.log('提交参数：', params)
      createSend(params).then(res => {
        console.log(res)
        if (res.state === 1) {
          this.$router.push({ name: '已发放的劵' })
        }
      })
    }
  }
}
