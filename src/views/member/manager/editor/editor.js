import { memberMe, memberAuditMe, uploadPortrait, uploadIdCard, uploadCompanyLogo, uploadLicense, add, update } from '@/api/member/manager'
import { getMemberOptions } from '@/api/member/post'
import { getTradeOptions } from '@/api/system/trade'
import { getPositionOptions } from '@/api/system/position'
import area from '@/utils/area'

export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      } else {
        return callback()
      }
    }
    var checkTel = (rule, value, callback) => {
      if (!/^$|^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(value)) {
        return callback(new Error('电话号码格式不正确'))
      } else {
        return callback()
      }
    }
    var checkIdCard = (rule, value, callback) => {
      if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        return callback(new Error('身份证格式不正确'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      memberId: '',
      formObj: {
        name: '',
        portrait: '',
        nativePlace: '',
        nativeCas: '',
        birthday: '',
        gender: 1,
        phone: '',
        joinedTs: '',
        memberPostId: '',
        idCard: '',
        frontOfIdCard: '',
        backOfIdCard: '',
        resume: '',
        companyName: '',
        companyLogo: '',
        tradeId: '',
        tradeCas: '',
        companyPhone: '',
        companyAddress: '',
        companyPositionId: '',
        license: '',
        companyIntroduction: '',
        type: 0
      },
      memberPostOptions: [],
      tradeOptions: [],
      positionOptions: [],
      nativeOptions: [],
      type: 'add',
      rules: {
        name: [
          { required: true, message: '会员名称不能为空', trigger: 'blur' }
        ],
        portrait: [
          { required: true, message: '头像不能为空', trigger: 'blur' }
        ],
        nativeCas: [
          { required: true, message: '籍贯不能为空', trigger: 'change' }
        ],
        birthday: [
          { required: true, message: '生日不能为空', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'change' }
        ],
        joinedTs: [
          { required: true, message: '入会时间不能为空', trigger: 'blur' }
        ],
        memberPostId: [
          { required: true, message: '职位不能为空', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '身份证号码不能为空', trigger: 'blur' },
          { validator: checkIdCard, tigger: 'change' }
        ],
        frontOfIdCard: [
          { required: true, message: '身份证头像面必须上传', trigger: 'blur' }
        ],
        backOfIdCard: [
          { required: true, message: '身份证国徽面必须上传', trigger: 'blur' }
        ],
        resume: [
          { required: true, message: '个人履历不能为空', trigger: 'blur' }
        ],
        // company
        companyName: [
          // { required: true, message: '公司名称不能为空', trigger: 'blur' }
        ],
        companyLogo: [
          // { required: true, message: '公司LOGO必须上传', trigger: 'blur' }
        ],
        tradeCas: [
          // { required: true, message: '行业类型不能为空', trigger: 'blur' }
        ],
        companyPhone: [
          // { required: true, message: '电话号码不能为空', trigger: 'blur' },
          { validator: checkTel, tigger: 'change' }
        ],
        companyAddress: [
          // { required: true, message: '办公地址不能为空', trigger: 'blur' }
        ],
        companyPositionId: [
          // { required: true, message: '职务不能为空', trigger: 'blur' }
        ],
        license: [
          // { required: true, message: '营业执照必须上传', trigger: 'blur' }
        ],
        companyIntroduction: [
          // { required: true, message: '公司介绍不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getNativeOptions()
    if (this.$route.params.memberId) {
      this.memberId = this.$route.params.memberId
      this.type = 'edit'
      this.init()
    } else {
      this.getTradeType()
    }
    if (this.$route.params.querytype) {
      this.querytype = this.$route.params.querytype
      window.localStorage.setItem('detail-type', this.type)
    }
    if (this.querytype === '') {
      this.querytype = window.localStorage.getItem('detail-type')
    }
  },
  computed: {
  },
  created () {
    this.getMemberType()
    this.getPositionType()
  },
  methods: {
    closeTab () {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem('membereditor')
      let tagsViews = this.$store.state.tagsView.visitedViews
      let selectView = null
      for (let view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({ path: openPath })
          })
          break
        }
      }
    },
    init () {
      return new Promise((resolve, reject) => {
        let params = {
          ckey: this.$store.getters.ckey
        }
        getTradeOptions(params).then(response => {
          this.tradeOptions = response.data.data
          this.fetchData()
        }).catch(error => {
          reject(error)
        })
      })
    },
    fetchData () {
      let params = {
        'memberId': this.memberId
      }
      if (this.querytype === '0') {
        memberMe(params).then(response => {
          this.formObj = response.data.data
          this.formObj['tradeCas'] = this.transTrade(this.formObj)
          this.formObj['nativeCas'] = this.transNativePlace(this.formObj)
          if (this.formObj.companyPhone === null) {
            this.formObj.companyPhone = ''
          }
        })
      } else {
        params['type'] = this.type
        memberAuditMe(params).then(response => {
          this.formObj = response.data.data
          this.formObj['tradeCas'] = this.transTrade(this.formObj)
          this.formObj['nativeCas'] = this.transNativePlace(this.formObj)
          if (this.formObj.companyPhone === null) {
            this.formObj.companyPhone = ''
          }
        })
      }


    },
    transNativePlace (obj) {
      let nativePlace = obj.nativePlace
      let cas = []
      if (nativePlace !== '') {
        let place = nativePlace.split('-')
        let province = area.province_list
        let city = area.city_list
        let county = area.county_list
        for (let i = 0; i < place.length; i++) {
          if (i === 0) {
            for (let p in province) {
              if (place[i] === province[p]) {
                cas.push(p)
                break
              }
            }
          } else if (i === 1) {
            for (let c in city) {
              if (place[i] === city[c]) {
                cas.push(c)
                break
              }
            }
          } else if (i === 2) {
            for (let c in county) {
              if (place[i] === county[c]) {
                cas.push(c)
                break
              }
            }
          }
        }
      }
      return cas
    },
    transTrade (obj) {
      let trade = this.formObj['tradeId']
      let cas = []
      if (trade !== null && trade !== '') {
        for (let pTrade of this.tradeOptions) {
          if (trade === pTrade.value) {
            cas.push(pTrade.value)
            break
          }
          let children = pTrade.children
          let findFlag = false
          for (let cTrade of children) {
            if (trade === cTrade.value) {
              cas.push(cTrade.value)
              findFlag = true
              break
            }
          }
          if (findFlag) {
            cas.unshift(pTrade.value)
            break
          }
        }
      }
      return cas
    },
    getMemberType () {
      let params = {
        ckey: this.$store.getters.ckey
      }
      getMemberOptions(params).then(response => {
        this.memberPostOptions = response.data.data
      })
    },
    getTradeType () {
      let params = {
        ckey: this.$store.getters.ckey
      }
      getTradeOptions(params).then(response => {
        this.tradeOptions = response.data.data
      })
    },
    getPositionType () {
      getPositionOptions().then(response => {
        this.positionOptions = response.data.data
      })
    },
    getNativeOptions () {
      let province = area.province_list
      let city = area.city_list
      let county = area.county_list
      for (let provinceKey in province) {
        let provinceOption = {
          label: province[provinceKey],
          value: provinceKey,
          children: []
        }
        let province_relat_Key = provinceKey.substring(0, 2)
        for (let cityKey in city) {
          if (cityKey.startsWith(province_relat_Key)) {
            let cityOption = {
              label: city[cityKey],
              value: cityKey
              // children: []
            }
            // 只需要省市，不需要区
            // let city_relat_Key = cityKey.substring(0, 4)
            // for (let countyKey in county) {
            //   if (countyKey.startsWith(city_relat_Key)) {
            //     let option = {
            //       label: county[countyKey],
            //       value: countyKey
            //     }
            //     cityOption.children.push(option)
            //   }
            // }
            provinceOption.children.push(cityOption)
          }
        }
        this.nativeOptions.push(provinceOption)
      }
    },
    beforeAvatarUpload (file) {
      if (file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    uploadPortrait (content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadPortrait(formData).then(response => {
        this.formObj.portrait = response.data.filePath
      })
    },
    uploadFrontOfIdCard (content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadIdCard(formData).then(response => {
        this.formObj.frontOfIdCard = response.data.filePath
      })
    },
    uploadBackOfIdCard (content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadIdCard(formData).then(response => {
        this.formObj.backOfIdCard = response.data.filePath
      })
    },
    uploadLogo (content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadCompanyLogo(formData).then(response => {
        console.log(response.data.filePath)
        this.formObj.['companyLogo'] = response.data.filePath
      })
      console.log(this.formObj.companyLogo)
    },
    uploadLicense (content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadLicense(formData).then(response => {
        console.log(response.data.filePath)
        this.formObj['license'] = response.data.filePath
      })
      console.log(this.formObj.license)
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            this.formObj['ckey'] = this.$store.getters.ckey
            add(this.formObj).then(response => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.closeTab()
            })
          } else if (this.type === 'edit') {
            update(this.formObj).then(response => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.closeTab()
            })
          }
        } else {
          return false
        }
      })
    },
    handleItemChange(val) {
      let province = area.province_list
      let city = area.city_list
      let county = area.county_list
      let result = ''
      for (let i = 0; i < val.length; i++) {
        if (i === 0) {
          result = province[val[i]]
        } else if (i === 1) {
          result = result + '-' + city[val[i]]
        } else if (i === 2) {
          result = result + '-' + county[val[i]]
        }
      }
      this.formObj.nativePlace = result
      // console.log(this.formObj.nativePlace)
    },
    handlerChange (value) {
      this.formObj.tradeId = value[value.length - 1]
    },
  }
}
