import { createActivity, uploadPortrait } from '@/api/activity/activity'
import Ckeditor from '@/components/CKEditor'
import area from '@/utils/area'

export default {
  components: {
    Ckeditor
  },
  data() {
    return {
      formObj: {
        activityName: '', // 活动名称
        headImage: '', // 活动头图
        listImage: '', // 活动列表图
        date: '', // 活动时间
        province: '', // 活动地点(省)
        city: '', // 活动地点(市)
        area: '', // 活动地点(区)
        addressInfo: '', // 活动地点（详细地址）
        applyObject: '', // 报名对象
        applyCountLimit: null, // 是否限制参加人数
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
      areaData: null,
      rules: {
        activityName: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' }
        ],
        headImage: [
          { required: true, message: '活动头图不能为空', trigger: 'blur' }
        ],
        listImage: [
          { required: true, message: '活动列表图不能为空', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '活动时间不能为空', trigger: 'blur' }
        ],
        addressInfo: [
          { required: true, message: '活动地点不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.handleArea()
    this.$refs.ckeditor1.init()
    setTimeout(() => {
      this.$refs.ckeditor1.initHtml('')
    }, 500)
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
    provinceChange() {
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
        this.applyObject.limit = false
        this.formObj.applyObject = 0
      } else {
        this.applyObject.unlimit = false
        this.formObj.applyObject = 1
      }
    },
    // 选择参加人数
    handleCheckNum(e, val) {
      if (val === 0) {
        this.applyCount.limit = false
        this.formObj.applyCountLimit = 0
      } else {
        this.applyCount.unlimit = false
        this.formObj.applyCountLimit = 1
      }
    },
    // 编辑活动介绍
    getHtml(htmlStr) {
      this.formObj.introduce = htmlStr
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.areaData.province.name || !this.areaData.city.name || !this.areaData.country.name) {
            return this.$message.error('活动地点不能为空')
          } else if (!this.formObj.applyObject && this.formObj.applyObject !== 0) {
            return this.$message.error('请选择报名对象')
          } else if (!this.formObj.applyCountLimit && this.formObj.applyCountLimit !== 0) {
            return this.$message.error('请选择参加人数')
          } else if (!this.formObj.introduce) {
            return this.$message.error('活动介绍不能为空')
          }
          this.formObj['activityStartTime'] = this.formObj['date'][0]
          this.formObj['activityEndTime'] = this.formObj['date'][1]
          this.formObj.province = this.areaData.province.name
          this.formObj.city = this.areaData.city.name
          this.formObj.area = this.areaData.country.name
          createActivity(this.formObj).then(response => {
            console.log(response)
            this.closeTab()
          })
        } else {
          return false
        }
      })
    }
  }
}
