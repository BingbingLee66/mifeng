import { createSpree, queryCouponInfo } from '@/api/mall/spree'
import { spaceInput, intInput } from '@/utils/utils'
import draggable from 'vuedraggable'

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
        queryCouponInfo(val).then(res => {
          if (res.state === 1) {
            this.couponList[index].name = res.msg
            this.couponList[index].errTip = ''
          } else {
            this.couponList[index].errTip = '该优惠券不存在'
            this.couponList[index].name = ''
          }
        })
      } else {
        this.couponList[index].errTip = '该优惠券不存在'
        this.couponList[index].name = ''
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
        this.couponList.push({
          id: '',
          name: '',
          errTip: ''
        })
      }
    },
    delCoupon(index) {
      this.couponList.splice(index, 1)
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
      if (!this.checkIds()) return
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = this.formObj
          let ids = []
          for (let data of this.couponList) {
            data.id && ids.push(data.id)
          }
          if (ids.length === 0) return this.$message.warning('请填写至少一个优惠券ID！')
          params['couponIdList'] = ids
          params['validStartTime'] = this.formObj.date[0]
          params['validEndTime'] = this.formObj.date[1]
          console.log('提交的参数：', params)
          createSpree(params).then(res => {
            console.log(res)
            this.$router.push('/mall/spree-list')
          })
        } else {
          return false
        }
      })
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
