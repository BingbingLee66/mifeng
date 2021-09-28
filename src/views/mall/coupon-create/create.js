import {
  createCoupon, getExplodeGoodsList
} from '@/api/mall/coupon'
import { spaceInput, intInput } from '@/utils/utils'
import { getChamberAllList } from "@/api/goods/goods";

export default {
  data() {
    return {
      formObj: {
        type: '1', // 优惠券类型
        condition: '', // 适用条件
        isGiftPack: false, // 是否放进大礼包
        name: '', // 优惠券名称
        amount: '', // 面值金额
        isLimit: '', // 是否满减限额
        isIssue: '', // 是否限制发行量
        isGain: '', // 是否限制获得张数
        timeType: '', // 有效期类型
        isNew: '', // 是否仅限新人使用
        isGive: '', // 是否可赠送
      },
      limitValue: '',
      issueValue: '',
      gainValue: '',
      dayValue: '',
      rangeDay: [],
      disLimitValue: false,
      disIssueValue: false,
      disGainValue: false,
      disDayValue: false,
      disRangeDay: false,
      giftPackFlag: false,
      // 选择可用商品劵
      query: {
        ckey: '',
        goodsId: '',
        goodsName: '',
        status: ''
      },
      listLoading: false,
      list: [],
      chamberOptions: [],
      goodsIds: [],
      selectedItem: [],
      showCouponListDialog: false,
      showCouponListType: '',
      selectionDatas: [],
      previewImgVisible: false,
      previewUrl: '',
      rules: {
        type: [
          { required: true, message: '请设置优惠券类型！', trigger: 'change' }
        ],
        condition: [
          { required: true, message: '请设置优惠券适用条件！', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请填写优惠券名称！', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请填写面值金额！', trigger: 'blur' }
        ],
        // isLimit: [
        //   { required: true, message: '请设置满减限额！', trigger: 'change' }
        // ],
        // isIssue: [
        //   { required: true, message: '请设置发行量！' }
        // ],
        // isGain: [
        //   { required: true, message: '请设置获取规则！', trigger: 'change' }
        // ],
        // timeType: [
        //   { required: true, message: '请设置有效期！', trigger: 'change' }
        // ],
        isNew: [
          { required: true, message: '请设置是否仅限新人使用！', trigger: 'change' }
        ],
        isGive: [
          { required: true, message: '请设置是否可赠送！', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getChamberList()
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
    openPreviewModal(url) {
      this.previewImgVisible = true
      this.previewUrl = url
    },
    // 选择可用劵商品
    getChamberList() {
      getChamberAllList().then(res => {
        if (res.state === 1) {
          this.chamberOptions = res.data.data
          this.chamberOptions.unshift({ 'name': '全部', 'id': -1 })
        }
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'page': 1,
        'pageSize': 100,
        'goodsName': this.query.goodsName,
        'goodsId': this.query.goodsId,
        'status': this.query.status,
        'ckey': this.query.ckey
      }
      getExplodeGoodsList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },
    add() {
      if (this.selectionDatas.length === 0) {
        return this.$message.error('请选择商品！')
      } else {
        this.$message.success('添加成功')
        this.showCouponListDialog = false
      }
    },
    remove() {
      console.log('移除')
    },
    showCouponList(str) {
      this.showCouponListType = str
      if (str === 'remove') {
        let _list = window.localStorage.getItem('selected-item')
        _list = JSON.parse(_list)
        this.selectedItem = _list
        this.list = _list
      } else {
        this.fetchData()
      }
      this.showCouponListDialog = true
    },
    handleSelectionChange(value) {
      if (this.showCouponListType === 'add') {
        window.localStorage.setItem('selected-item', JSON.stringify(value))
        this.selectedItem = value
        let datas = value
        this.selectionDatas = []
        for (let data of datas) {
          this.selectionDatas.push(data.id)
        }
      }
    },
    // 输入框限制
    handleSpace(e) {
      this.formObj.name = spaceInput(e)
    },
    handleNumber(e, str) {
      if (str === 'amount') {
        this.formObj.amount = intInput(e)
      } else {
        this[str] = intInput(e)
      }
    },
    handleChange(e, val, dis) {
      if (e === '1') {
        // this[val] = ''
        this[dis] = true
        if (val === 'dayValue') {
          this.disRangeDay = false
        }
      } else {
        // this[val] = ''
        this[dis] = false
        if (val === 'dayValue') {
          // this.rangeDay = []
          this.disRangeDay = true
        }
      }
    },
    // 是否放进大礼包
    putGiftPack(e) {
      this.giftPackFlag = e
      if (e) {
        this.formObj.isIssue = '1'
        this.formObj.isGain = '1'
        this.formObj.timeType = '2'
      } else {
        this.formObj.isIssue = ''
        this.issueValue = ''
        this.formObj.isGain = ''
        this.gainValue = ''
        this.formObj.timeType = ''
        this.dayValue = ''
        this.disRangeDay = false
      }
    },
    save() {
      console.log('提交参数：', this.formObj)
      this.$refs['formObj'].validate((valid) => {
        if (!this.formObj.condition) {
          return this.$message.error('请设置优惠券适用条件！')
        }
        if (this.formObj.condition === '2') {
          if (this.selectionDatas.length === 0) {
            return this.$message.error('请选择可用劵商品！')
          }
        }
        // this.selectionDatas
        if (!this.formObj.name) {
          return this.$message.error('请填写优惠券名称！')
        }
        if (!this.formObj.amount) {
          return this.$message.error('请填写面值金额！')
        }
        if (!this.formObj.isLimit) {
          return this.$message.error('请设置满减限额！')
        }
        if (this.formObj.isLimit === '2') {
          if (!this.limitValue) {
            return this.$message.error('请填写满减限额！')
          } else if (parseInt(this.limitValue) <= parseInt(this.formObj.amount)) {
            return this.$message.error('满减限额需大于面值金额！')
          } else if (parseInt(this.limitValue) > 1000000) {
            return this.$message.error('满减限额不得大于100万元！')
          }
        }
        if (!this.formObj.isIssue) {
          return this.$message.error('请设置发行量！')
        }
        if (this.formObj.isIssue === '2') {
          if (!this.issueValue) {
            return this.$message.error('请填写发行量！')
          }
        }
        if (!this.formObj.isGain) {
          return this.$message.error('请设置获取规则！')
        }
        if (this.formObj.isGain === '2') {
          if (!this.gainValue) {
            return this.$message.error('请填写最多可获得张数！')
          }
        }
        if (!this.formObj.timeType) {
          return this.$message.error('请设置有效期！')
        }
        if (this.formObj.timeType === '2') {
          if (!this.gainValue) {
            return this.$message.error('请填写有效期！')
          }
        }
        if (!this.formObj.isNew) {
          return this.$message.error('请设置是否仅限新人使用！')
        }
        if (!this.formObj.isGive) {
          return this.$message.error('请设置是否可赠送！')
        }
        if (valid) {
          let params = {}
          createCoupon(params).then(res => {
            console.log(res)
          })
        } else {
          return false
        }
      })
    }
  }
}
