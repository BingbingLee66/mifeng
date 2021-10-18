import { createSpree } from '@/api/mall/spree'
import { queryCouponInfo } from '@/api/mall/coupon'
import { spaceInput, intInput } from '@/utils/utils'
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'

export default {
  components: {
    draggable
  },
  data() {
    return {
      couponListDrag: false,
      formObj: {
        giftName: '', // 大礼包名称
        quota: '', // 大礼包发行量
        obtainLimit: '1',
        date: null // 有效期
      },
      couponList: [{ id: '', name: '', errTip: '' }], // 包含优惠券
      rules: {
        giftName: [
          { required: true, message: '请填写大礼包名称！', trigger: 'blur' }
        ],
        quota: [
          { required: true, message: '请填写发行量！', trigger: 'blur' }
        ],
        obtainLimit: [
          { required: true, message: '请填获取规则！', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请设置有效期！', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['profile'])
  },
  created() {
    let spreeItem = window.localStorage.getItem('spree-item')
    let giftnameItem = window.localStorage.getItem('giftname-item')
    let quotaItem = window.localStorage.getItem('quota-item')
    if (spreeItem) {
      this.couponList = JSON.parse(spreeItem)
    }
    if (giftnameItem) {
      this.formObj.giftName = giftnameItem
    }
    if (quotaItem) {
      this.formObj.quota = quotaItem
    }
  },
  destroyed() {
    window.localStorage.setItem('spree-item', JSON.stringify([{ id: '', name: '', errTip: '' }]))
    window.localStorage.setItem('giftname-item', '')
    window.localStorage.setItem('quota-item', '')
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // 退出当前tab, 打开指定tab
    closeTab() {
      const openPath = window.localStorage.getItem('activityeditor')
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
    // 限制输入空格
    handleSpace(e) {
      this.formObj.giftName = spaceInput(e)
      window.localStorage.setItem('giftname-item', this.formObj.giftName)
    },
    // 限制输入正整数
    handleNumber(e, str) {
      this.formObj[str] = intInput(e)
    },
    handleInt(e, index) {
      let regexp = /^[1-9]\d*$/
      if (!regexp.test(e)) {
        this.couponList[index].id = ''
      } else {
        this.couponList[index].id = e
      }
    },
    handleBlur(e, index) {
      let val = e.target.value
      if (val) {
        // 失焦查询优惠劵名称
        let params = {
          couponId: val,
          type: 1
        }
        queryCouponInfo(params).then(res => {
          if (res.state === 1) {
            this.couponList[index].name = res.msg
            this.couponList[index].errTip = ''
          } else {
            this.couponList[index].errTip = res.msg
            this.couponList[index].name = ''
          }
        })
      } else {
        this.couponList[index].errTip = '该优惠券不存在'
        this.couponList[index].name = ''
      }
      window.localStorage.setItem('spree-item', JSON.stringify(this.couponList))
    },
    handleGiftName(e) {
      let val = e.target.value
      window.localStorage.setItem('giftname-item', val)
    },
    handleQuota(e) {
      let val = e.target.value
      window.localStorage.setItem('quota-item', val)
    },
    couponListStart() {
      this.couponListDrag = true
      window.localStorage.setItem('spree-item', JSON.stringify(this.couponList))
    },
    couponListEnd(evt) {
      this.couponListDrag = false
      window.localStorage.setItem('spree-item', JSON.stringify(this.couponList))
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
        this.couponList.push({
          id: '',
          name: '',
          errTip: ''
        })
      }
      window.localStorage.setItem('spree-item', JSON.stringify(this.couponList))
    },
    delCoupon(index) {
      this.couponList.splice(index, 1)
      window.localStorage.setItem('spree-item', JSON.stringify(this.couponList))
    },
    checkIds() {
      let vaild = true
      let _this = this
      _this.couponList.forEach((item, index) => {
        if (!item.id) {
          _this.couponList[index].errTip = '请填写至少一个优惠券ID！'
          vaild = false
        }
        if (item.errTip) {
          _this.couponList[index].errTips = item.errTip
          vaild = false
        }
      })
      return vaild
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (!this.checkIds()) return
        if (valid) {
          let params = this.formObj
          let ids = []
          for (let data of this.couponList) {
            data.id && ids.push(parseInt(data.id))
          }
          if (ids.length === 0) return this.$message.warning('请填写至少一个优惠券ID！')
          params['couponIdList'] = ids
          params['validStartTime'] = this.formObj.date[0]
          params['validEndTime'] = this.formObj.date[1]
          params['createId'] = this.profile.id
          params['createName'] = this.profile.remark
          createSpree(params).then(res => {
            if (res.state === 1) {
              this.$message.success(res.msg)
              this.$router.push('/mall/spree-list')
            }
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push('/mall/spree-list')
    },
    // 查看大礼包详情
    goSpreeDetail() {
      this.$router.push(`/mall/spreeDetail`)
    },
    // 查看优惠券详情
    goCouponDetail() {
      this.$router.push(`/mall/couponDetail`)
    }
  }
}
