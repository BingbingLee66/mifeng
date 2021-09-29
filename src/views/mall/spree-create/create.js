import { continueGrantSpree, createSpree, queryDetail } from '@/api/mall/spree'
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
        name: '', // 大礼包名称
        couponList: [{ id: '', name: '' }], // 包含优惠券
        issue: '', // 大礼包发行量
        limit: '1',
        person: '1',
        date: null // 有效期
      },
      couponName: '',
      rules: {
        name: [
          { required: true, message: '请填写大礼包名称！', trigger: 'blur' }
        ],
        couponList: [
          { type: 'array', required: true, message: '请填写至少一个优惠券ID', trigger: 'change' }
        ],
        issue: [
          { required: true, message: '请填写发行量！', trigger: 'blur' }
        ],
        limit: [
          { required: true, message: '请填获取规则！', trigger: 'blur' }
        ],
        person: [
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
      this.formObj.name = spaceInput(e)
    },
    // 限制输入正整数
    handleNumber(e, str) {
      if (str === 'id') {
        this.formObj.id = intInput(e)
      } else if (str === 'issue') {
        this.formObj.issue = intInput(e)
      }
    },
    couponListStart() {
      this.couponListDrag = true
    },
    couponListEnd(evt) {
      this.couponListDrag = false
    },
    addCoupon() {
      if (this.formObj.couponList.length > 9) {
        this.$confirm('配置大礼包时，优惠券需控制在1-10张！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
        }).catch(() => {
        })
      } else {
        this.formObj.couponList.push({
          id: '',
          name: ''
        })
      }
    },
    delCoupon(index) {
      this.formObj.couponList.splice(index, 1)
    },
    handleInt(e, index) {
      let regexp = /^[1-9]\d*$/
      if (!regexp.test(e)) {
        this.formObj.couponList[index].id = ''
      } else {
        this.formObj.couponList[index].id = e
      }
    },
    handleBlur(e, index) {
      let val = e.target.value
      if (val) {
        // 失焦查询优惠劵名称
        queryDetail({ id: val }).then(res => {
          console.log(res)
          this.formObj.couponList[index].name = res.data.goodsDetail.name
        })
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = this.formObj
          let ids = []
          if (!this.formObj.couponList[0]['id']) return this.$message.warning('请填写优惠券id')
          for (let data of this.formObj.couponList) {
            ids.push(data.id)
          }
          params['ids'] = ids
          params['startTime'] = this.formObj.date[0]
          params['endTime'] = this.formObj.date[1]
          console.log('提交的参数：', params)
          createSpree(params).then(res => {
            console.log(res)
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push({
        name: '活动列表',
        params: {
          type: this.activityId ? this.type : 1
        }
      })
    }
  }
}
