import { createActivity, uploadPortrait, getActivity } from '@/api/activity/activity'
import Ckeditor from '@/components/CKEditor'
import area from '@/utils/area'
import draggable from 'vuedraggable' // 拖拽组件

export default {
  components: {
    Ckeditor,
    draggable
  },
  data() {
    return {
      couponListDrag: false,
      ruleForm: {
        couponList: ['133365', '133365'],
        name: '',
        region: '1',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      activityId: null,
      type: null,
      ckey: '',
      formObj: {
        id: '',
        activityName: '', // 活动名称
        headImage: '', // 活动头图
        listImage: '', // 活动列表图
        date: '', // 活动时间
        province: '', // 活动地点(省)
        city: '', // 活动地点(市)
        area: '', // 活动地点(区)
        addressInfo: '', // 活动地点（详细地址）
        applyObject: '', // 报名对象
        isLimit: null, // 是否限制参加人数
        applyCount: '', // 参加人数
        introduce: '', // 活动介绍
      },
      // 是否限制报名对象
      applyObject: {
        unlimit: false,
        limit: false
      },
      // 是否限制报名人数
      applyCount: {
        unlimit: false,
        limit: false
      },
      // 活动地点选择
      provinceValue: '',
      cityValue: '',
      countryValue: '',
      provinceOptions: [],
      cityOptions: [],
      countryOptions: [],
      areaData: null
    }
  },
  created() {
    this.ckey = this.$store.getters.ckey
    this.activityId = this.$route.query.activityId
    this.type = this.$route.query.type
  },
  mounted() {
    // this.handleArea()
    // this.$refs.ckeditor1.init()
    // if (!this.activityId) {
    //   setTimeout(() => {
    //     this.$refs.ckeditor1.initHtml('')
    //   }, 500)
    // } else {
    //   this.fetchData()
    // }
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
    couponListStart() {
      this.couponListDrag = true
    },
    couponListEnd(evt) {
      this.couponListDrag = false
    },
    addCoupon() {
      this.ruleForm.couponList.push('')
    },
    delCoupon(index) {
      this.ruleForm.couponList.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取活动详情
    fetchData() {
      getActivity({ id: this.activityId }).then(res => {
        let resData = res.data
        this.formObj.activityName = resData.activityName
        this.formObj.headImage = resData.headImage
        this.formObj.listImage = resData.listImage
        // 活动时间回显
        let activityTime = []
        if (resData.startTime && resData.endTime) {
          activityTime.push(resData.startTime)
          activityTime.push(resData.endTime)
        }
        this.$set(this.formObj, 'date', activityTime)
        // 活动地点回显
        this.provinceValue = resData.province
        this.cityValue = resData.city
        this.countryValue = resData.area
        this.formObj.addressInfo = resData.addressInfo
        this.areaData = {
          province: {
            name: resData.province,
            code: resData.provinceCode,
          },
          city: {
            name: resData.city,
            code: resData.cityCode,
          },
          country: {
            name: resData.area,
            code: resData.areaCode,
          }
        }
        // 报名对象回显
        if (resData.applyObject === 0) {
          this.applyObject.limit = false
          this.applyObject.unlimit = true
          this.formObj.applyObject = 0
        } else {
          this.applyObject.limit = true
          this.applyObject.unlimit = false
          this.formObj.applyObject = 1
        }
        // 参加人数回显
        if (resData.isLimit === 0) {
          this.applyCount.unlimit = true
          this.applyCount.limit = false
          this.formObj.isLimit = 0
        } else {
          this.applyCount.unlimit = false
          this.applyCount.limit = true
          this.formObj.isLimit = 1
          this.formObj.applyCount = resData.applyCount
        }
        // 活动介绍回显
        // this.$refs.ckeditor1.init()
        setTimeout(() => {
          this.$refs.ckeditor1.initHtml(resData.introduce ? resData.introduce : '')
        }, 500)
        this.formObj.introduce = resData.introduce
      })
    },
    // 上传图片校验
    beforeUpload(file) {
      if (file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
    },
    // 上传活动头图
    uploadHeadImage(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadPortrait(formData).then(response => {
        this.formObj.headImage = response.data.filePath
      })
    },
    // 上传活动列表图
    uploadListImage(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadPortrait(formData).then(response => {
        this.formObj.listImage = response.data.filePath
      })
    },
    // 选择活动地点
    handleArea() {
      this.provinceOptions = []
      this.provinceValue = ''
      for (const key in area['86']) {
        this.provinceOptions.push({
          value: key,
          label: area['86'][key]
        })
      }
    },
    resetCityAndCountryData() {
      this.cityValue = ''
      this.countryValue = ''
      this.cityOptions = []
      this.countryOptions = []
    },
    resetCountryData() {
      this.countryValue = ''
      this.countryOptions = []
    },
    provinceChange(e) {
      this.resetCityAndCountryData()
      for (const key in area[this.provinceValue]) {
        this.cityOptions.push({
          value: key,
          label: area[this.provinceValue][key]
        })
      }
      this.chooseData()
    },
    cityChange() {
      this.resetCountryData()
      for (const key in area[this.cityValue]) {
        this.countryOptions.push({
          value: key,
          label: area[this.cityValue][key]
        })
      }
      this.chooseData()
    },
    countryChange() {
      this.chooseData()
    },
    chooseData() {
      let data = null
      if (this.countryValue) {
        data = {
          province: {
            code: this.provinceValue,
            name: area['86'][this.provinceValue]
          },
          city: {
            code: this.cityValue,
            name: area[this.provinceValue][this.cityValue]
          },
          country: {
            code: this.countryValue,
            name: area[this.cityValue][this.countryValue]
          }
        }
      } else if (this.cityValue) {
        data = {
          province: {
            code: this.provinceValue,
            name: area['86'][this.provinceValue]
          },
          city: {
            code: this.cityValue,
            name: area[this.provinceValue][this.cityValue]
          }
        }
      } else if (this.provinceValue) {
        data = {
          province: {
            code: this.provinceValue,
            name: area['86'][this.provinceValue]
          }
        }
      } else {
        data = null
      }
      this.areaData = data
    },
    // 选择报名对象
    handleCheckTarget(e, val) {
      if (val === 0) {
        this.applyObject.unlimit = true
        this.applyObject.limit = false
        this.formObj.applyObject = 0
      } else {
        this.applyObject.unlimit = false
        this.applyObject.limit = true
        this.formObj.applyObject = 1
      }
    },
    // 选择参加人数
    handleCheckNum(e, val) {
      if (val === 0) {
        this.applyCount.unlimit = true
        this.applyCount.limit = false
        this.formObj.isLimit = 0
      } else {
        this.applyCount.unlimit = false
        this.applyCount.limit = true
        this.formObj.isLimit = 1
      }
    },
    // 编辑活动介绍
    getHtml(htmlStr) {
      this.formObj.introduce = htmlStr
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.areaData) {
            return this.$message.error('请选择省份')
          } else if (!this.areaData.hasOwnProperty('city')) {
            return this.$message.error('请选择城市')
          } else if (!this.formObj.applyObject && this.formObj.applyObject !== 0) {
            return this.$message.error('请选择报名对象')
          } else if (!this.formObj.isLimit && this.formObj.isLimit !== 0) {
            return this.$message.error('请选择参加人数')
          } else if (this.formObj.isLimit === 1) {
            let regexp = /^[1-9]\d*$/
            if (!regexp.test(this.formObj.applyCount)) {
              return this.$message.error('参加人数为大于0的正整数')
            }
          } else if (!this.formObj.introduce) {
            return this.$message.error('活动介绍不能为空')
          }
          let introHtml = this.formObj.introduce.replace(/<\/?p[^>]*>/gi, '')
          let introHtml2 = introHtml.replace(/&nbsp;/ig, '')
          if (introHtml2.match(/^\s+$/) || introHtml2.length === 0) {
            return this.$message.error('活动介绍不能为空')
          }
          this.formObj.ckey = this.ckey
          this.formObj['activityStartTime'] = this.formObj['date'][0]
          this.formObj['activityEndTime'] = this.formObj['date'][1]
          this.formObj.province = this.areaData.province.name
          this.formObj.provinceCode = this.areaData.province.code
          this.formObj.city = this.areaData.city.name
          this.formObj.cityCode = this.areaData.city.code
          if (this.areaData.hasOwnProperty('country')) {
            this.formObj.area = this.areaData.country.name
            this.formObj.areaCode = this.areaData.country.code
          }
          if (this.activityId) {
            this.formObj['id'] = this.activityId
          }
          createActivity(this.formObj).then(res => {
            this.$message.success(res.msg)
            this.$router.push({
              name: '活动列表',
              params: {
                type: this.activityId ? this.type : 0
              }
            })
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
