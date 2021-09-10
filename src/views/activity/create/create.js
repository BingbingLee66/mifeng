import { createActivity } from '@/api/activity/activity'
import Ckeditor from '@/components/CKEditor'
import area from '@/utils/area'

export default {
  components: {
    Ckeditor
  },
  data() {
    return {
      formObj: {
        name: '', // 活动名称
        pic: '', // 活动头图
        lpic: '', // 活动列表图
        date: '', // 活动时间
        address: '', // 活动地点
        target: '', // 报名对象
        number: [], // 参加人数
        number2: '',
        intro: '', // 活动介绍
      },
      // 是否限制报名对象
      target: {
        unlimit: false,
        limit: false
      },
      // 是否限制报名人数
      number: {
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
        name: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' }
        ],
        pic: [
          { required: true, message: '活动头图不能为空', trigger: 'blur' }
        ],
        lpic: [
          { required: true, message: '活动列表图不能为空', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '活动时间不能为空', trigger: 'blur' }
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
    handleClick(tab) {
      this.type = tab.name
      this.fetchData()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    closeTab() {
      // 退出当前tab, 打开指定tab
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
    uploadPic(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      console.log(content.file)
      /* uploadGoodsImg(formData).then(response => {
        this.formObj.pic = response.data.filePath
        this.descriptValid = true
      }) */
    },
    // 上传活动头图
    uploadLpic(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      console.log(content.file)
      /* uploadGoodsImg(formData).then(response => {
        this.formObj.pic = response.data.filePath
        this.descriptValid = true
      }) */
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
      if (val === 1) {
        this.target.limit = false
        this.formObj.target === 1
      } else {
        this.target.unlimit = false
        this.formObj.target === 2
      }
    },
    // 选择参加人数
    handleCheckNum(e, val) {
      if (val === 1) {
        this.number.limit = false
        this.formObj.number === 1
      } else {
        this.number.unlimit = false
        this.formObj.number === 2
      }
    },
    // 编辑活动介绍
    getHtml(htmlStr) {
      this.formObj.intro = htmlStr
      console.log('this.formObj.intro', this.formObj.intro)
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          createActivity(this.formObj).then(response => {
            console.log(response)
          })
        } else {
          return false
        }
      })
    },
  }
}
