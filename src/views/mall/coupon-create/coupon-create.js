import { createCoupon } from '@/api/mall/coupon'
import { spaceInput, intInput } from '@/utils/utils'
import addDialog from './add-dialog.vue'
import removeDialog from './remove-dialog.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    'add-dialog': addDialog,
    'remove-dialog': removeDialog
  },
  data() {
    return {
      formObj: {
        createId: 1,
        createName: '123',
        type: '1', // 优惠券类型
        scope: '', // 适用条件
        used: '', // 是否放进大礼包
        name: '', // 优惠券名称
        validType: '', // 有效期类型
        validUse: '', // 是否仅限新人使用
        validShare: '', // 是否可赠送
      },
      priceValue: '', // 面值金额
      isPutGiftPack: false, // 是否放进大礼包
      isLimit: '', // 是否满减限额
      limitValue: '',
      isIssue: '', // 是否限制发行量
      issueValue: '',
      isGain: '', // 每人获取限制
      gainValue: '',
      dayValue: '',
      rangeDay: [],
      disLimitValue: false,
      disIssueValue: false,
      disGainValue: false,
      disDayValue: false,
      disRangeDay: false,
      rules: {
        type: [
          { required: true, message: '请设置优惠券类型！', trigger: 'change' }
        ],
        scope: [
          { required: true, message: '请设置优惠券适用条件！', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请填写优惠券名称！', trigger: 'blur' }
        ],
        priceValue: [
          { required: true, message: '请填写面值金额！', trigger: 'blur' }
        ],
        validUse: [
          { required: true, message: '请设置是否仅限新人使用！', trigger: 'change' }
        ],
        validShare: [
          { required: true, message: '请设置是否可赠送！', trigger: 'change' }
        ]
      },
      createVisible: false,
      selectedItemLength: 0,
      selectedItem: []
    }
  },
  computed: {
    ...mapGetters(['profile'])
  },
  created() {
    window.addEventListener('beforeunload', e => this.removeItem(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.removeItem(e))
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
    removeItem() {
      window.localStorage.setItem('selected-item', [])
    },
    localChange(obj) {
      this.selectedItemLength = obj.data.length
      let datas = obj.data
      this.selectedItem = []
      for (let data of datas) {
        this.selectedItem.push(data.id)
      }
      if (obj.type === 'remove') {
        this.$refs['addDialog'].fetchData('update')
      } else if (obj.type === 'add') {
        this.$refs['removeDialog'].fetchData()
      }
    },
    openAddDialog() {
      this.$refs['addDialog'].fetchData('reset')
      this.$refs['addDialog'].show()
    },
    openRemoveDialog() {
      this.$refs['removeDialog'].fetchData()
      this.$refs['removeDialog'].show()
    },
    // 限制输入空格
    handleSpace(e) {
      this.formObj.name = spaceInput(e)
    },
    // 限制输入正整数
    handleNumber(e, str) {
      if (str === 'price') {
        this.priceValue = intInput(e)
      } else {
        this[str] = intInput(e)
      }
    },
    handleChange(e, val, dis) {
      if (e === '1') {
        this[dis] = true
        if (val === 'dayValue') {
          this.disRangeDay = false
        }
      } else {
        this[dis] = false
        if (val === 'dayValue') {
          this.disRangeDay = true
        }
      }
    },
    // 是否放进大礼包
    putGiftPack(e) {
      if (e) {
        this.formObj.used = 1
        this.isIssue = '1'
        this.isGain = '1'
        this.formObj.validType = '2'
      } else {
        this.formObj.used = 0
        this.isIssue = ''
        this.issueValue = ''
        this.isGain = ''
        this.gainValue = ''
        this.formObj.validType = ''
        this.dayValue = ''
        this.disRangeDay = false
      }
    },
    save() {
      this.$refs['formObj'].validate((valid) => {
        if (!this.formObj.scope) {
          return this.$message.error('请设置优惠券适用条件！')
        }
        if (this.formObj.scope === '2') {
          if (this.selectedItem.length === 0) {
            return this.$message.error('请选择可用劵商品！')
          }
        }
        if (!this.formObj.name) {
          return this.$message.error('请填写优惠券名称！')
        }
        if (!this.priceValue) {
          return this.$message.error('请填写面值金额！')
        }
        if (!this.isLimit) {
          return this.$message.error('请设置满减限额！')
        }
        if (this.isLimit === '2') {
          if (!this.limitValue) {
            return this.$message.error('请填写满减限额！')
          } else if (parseInt(this.limitValue) <= parseInt(this.priceValue)) {
            return this.$message.error('满减限额需大于面值金额！')
          } else if (parseInt(this.limitValue) > 1000000) {
            return this.$message.error('满减限额不得大于100万元！')
          }
        }
        if (!this.isIssue) {
          return this.$message.error('请设置发行量！')
        }
        if (this.isIssue === '2') {
          if (!this.issueValue) {
            return this.$message.error('请填写发行量！')
          }
        }
        if (!this.isGain) {
          return this.$message.error('请设置获取规则！')
        }
        if (this.isGain === '2') {
          if (!this.gainValue) {
            return this.$message.error('请填写最多可获得张数！')
          }
        }
        if (!this.formObj.validType) {
          return this.$message.error('请设置有效期！')
        }
        if (this.formObj.validType === '1') {
          if (!this.rangeDay) {
            return this.$message.error('请指定日期！')
          }
        }
        if (this.formObj.validType === '2') {
          if (!this.dayValue) {
            return this.$message.error('请填写有效期！')
          } else if (parseInt(this.dayValue) > 365) {
            return this.$message.error('有效期不得大于365天！')
          }
        }
        if (!this.formObj.validUse) {
          return this.$message.error('请设置是否仅限新人使用！')
        }
        if (!this.formObj.validShare) {
          return this.$message.error('请设置是否可赠送！')
        }
        if (valid) {
          let params = this.formObj
          // 适用条件1-全场券 2-商品券
          if (this.formObj.scope === '2') {
            params['goodsIds'] = this.selectedItem
          }
          // 是否会放进大礼包
          if (this.isPutGiftPack) {
            params['used'] = 1
          }
          if (!this.isPutGiftPack) {
            params['used'] = 0
          }
          params['price'] = this.priceValue * 100
          // useLimit满减限额 -1-无门槛使用 >0 满减使用
          if (this.isLimit === '1') {
            params['useLimit'] = -1
          }
          if (this.isLimit === '2') {
            params['useLimit'] = this.limitValue * 100
          }
          // quota发行量 -1-无限制 >0 限制数量
          if (this.isIssue === '1') {
            params['quota'] = -1
          }
          if (this.isIssue === '2') {
            params['quota'] = this.issueValue
          }
          // obtainLimit每人获取限制-1-无限制 >0 限制数量
          if (this.isGain === '1') {
            params['obtainLimit'] = -1
          }
          if (this.isGain === '2') {
            params['obtainLimit'] = this.gainValue
          }
          // validType有效期 1绝对时效（领取后XXX-XXX时间段有效）  2相对时效（领取后N天有效）
          if (this.formObj.validType === '1') {
            params['validStartTime'] = this.rangeDay[0]
            params['validEndTime'] = this.rangeDay[1]
          }
          if (this.formObj.validType === '2') {
            params['validDays'] = this.dayValue
          }
          params['createId'] = this.profile.id
          params['createName'] = this.profile.remark
          createCoupon(params).then(res => {
            if (res.state === 1) {
              window.localStorage.setItem('selected-item', [])
              this.$message.success(res.msg)
              this.$router.push({ name: '优惠券列表' })
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push({ name: '优惠券列表' })
    }
  }
}
