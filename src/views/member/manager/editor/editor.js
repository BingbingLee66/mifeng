import {
  memberMe,
  uploadPortrait,
  uploadIdCard,
  uploadCompanyLogo,
  uploadLicense,
  add,
  update
} from '@/api/member/manager'

import {
  getMemberOptions
} from '@/api/member/post'

import {
  getTradeOptions
} from '@/api/system/trade'

import {
  getPositionOptions
} from '@/api/system/position'

import area from '@/utils/area'

import {
  getDepartmentList
} from '@/api/org-structure/org'

export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      } else {
        return callback()
      }
    }
    return {
      memberId: '',
      currentItem: null,
      ids: [],
      parentIds: [],
      currentId: null,
      formObj: {
        type: 1,
        name: '',
        phone: '',
        companyName: '',
        contactPhone: '',
        companyLogo: '',
        portrait: '',
        nativePlace: '',
        nativeCas: '', // 籍贯
        birthday: '',
        gender: 1,
        joinedTs: '', // 入会时间
        memberPostId: '', // 会内职位
        idCard: '',
        frontOfIdCard: '',
        backOfIdCard: '',
        resume: '', // 个人简介
        tradeId: '',
        companyAddress: '',
        companyPositionId: '', // 会内职位
        license: '',
        companyIntroduction: '',
        departmentId: ''
      },
      memberPostOptions: [], // 会内职位选择列表
      bindTradeIds: [], // 已选择行业
      tradeOptions: [], // 行业选择列表
      positionOptions: [], // 企业职位选择列表
      nativeOptions: [],
      type: 'add',
      rules: {},
      companyRules: {
        companyName: [{
          required: true,
          message: '企业名称不能为空',
          trigger: 'blur'
        }],
        companyLogo: [{
          required: true,
          message: '公司logo必须上传',
          trigger: 'blur'
        }],
        contactPhone: [{
          required: true,
          message: '联系方式不能为空',
          trigger: 'blur'
        }],
        memberPostId: [
          {
            required: true,
            message: '请选择会内职位',
            trigger: 'change'
          }
        ],
        contactName: [
          {
            required: true,
            message: '请输入联系人姓名',
            trigger: 'blur'
          }
        ],

      },
      personalRules: {
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '手机号码不能为空',
          trigger: 'blur'
        }, {
          validator: checkPhone,
          trigger: 'change'
        }],
        memberPostId: [
          {
            required: true,
            message: '请选择会内职位',
            trigger: 'change'
          }
        ]
      },
      departmentOptions: [],
      departmentCas: null
    }
  },

  created() {
    this.$nextTick(() => {
      this.$refs['form'].clearValidate()
    })
  },

  mounted() {
    if (this.formObj.type === 1) {
      this.rules = this.companyRules
    } else {
      this.rules = this.personalRules
    }
    this.getNativeOptions()
    this.getMemberType()
    this.getPositionType()
    this.getdepartmentType()
    if (this.$route.params.memberId) {
      this.memberId = this.$route.params.memberId
      this.type = 'edit'
      this.init()
    }
  },

  methods: {
    closeTab() {
      // 退出当前tab, 打开指定tab
      const openPath = window.localStorage.getItem('membereditor')
      const tagsViews = this.$store.state.tagsView.visitedViews
      // let selectView = null
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

    init() {
      return new Promise((resolve, reject) => {
        const params = {
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

    fetchData() {
      const params = {
        'memberId': this.memberId
      }
      memberMe(params).then(res => {
        this.formObj = res.data.data
        // 行业回显
        this.editFlagNum(this.formObj.tradeId)
        // 籍贯回显
        this.formObj['nativeCas'] = this.transNativePlace(this.formObj)
        // 部门回显
        if (!res.data.departmentId) {
          this.formObj.departmentId = ''
        } else {
          const did = parseInt(res.data.departmentId.split(',')[0])
          this.departmentCas = did
          this.formObj.departmentId = did + ''
        }
        if (this.formObj.contactPhone === null) {
          this.formObj.contactPhone = ''
        }
      })
    },

    /*
    * 获取部门列表数据
    * */
    getdepartmentType() {
      const params = {
        'ckey': this.$store.getters.ckey,
        'parentId': 0
      }
      getDepartmentList(params).then(res => {
        if (res.state === 1) {
          this.departmentOptions = res.data.data[0].departmentRespList
          this.setData(this.departmentOptions)
        }
      })
    },

    /*
    * 递归遍历部门树结构，添加disabled属性
    * */
    setData(treeDatas) {
      for (const i in treeDatas) {
        this.$set(treeDatas[i], 'disabled', false)
        if (treeDatas[i].departmentRespList.length > 0) {
          this.setData(treeDatas[i].departmentRespList)
        }
      }
    },

    /*
    * 递归遍历部门树结构，改变disabled属性
    * */
    changeData(ids, treeDatas) {
      this.ids = ids
    },

    /*
    * 选择部门
    * */
    handlerDepartmentChange(ids) {
      // console.log(typeof ids)
      // this.ids = ids
      // const departmentStr = ids.join(',')
      console.log(ids)
      this.formObj.departmentId = ids + ''
    },

    /**
     * 递归找出当前item项
     */
    handleCurrentItemForEach(currentId, treeDatas) {
      treeDatas.forEach((item, index) => {
        if (!currentId) {
          this.parentIds = []
          return
        }
        if (item.id === currentId) {
          this.currentItem = item.departmentRespList
          this.parentIds = item.allParentId.split(',')
          this.parentIds.shift()
          this.allParentIds = this.parentIds
          this.parentIds.pop()
          this.parentIds = this.parentIds.map(item => {
            return parseInt(item)
          })
        } else {
          // this.parentIds = []
        }
        if (item.departmentRespList.length > 0) {
          this.handleCurrentItemForEach(currentId, item.departmentRespList)
        }
      })
    },

    /**
     * 递归设置当前item项所有儿子的disabled属性为true
     */
    handleItemSonForEach(currentId, treeDatas) {
      treeDatas.forEach(item => {
        if (currentId && treeDatas.length > 0) {
          this.$set(item, 'disabled', true)
        } else {
          this.$set(item, 'disabled', false)
        }
        if (item.departmentRespList.length > 0) {
          this.handleItemSonForEach(currentId, item.departmentRespList)
        }
      })
    },

    /**
     * 递归设置当前item项父亲项的disabled属性为true
     */
    handleItemParentForEach(parentIds, treeDatas, allParentIds) {
      const ids = []
      if (parentIds.length > 0) {
        parentIds.forEach(val => {
          ids.push(val)
        })
      }
      treeDatas.forEach((item, index) => {
        if (!ids.includes(allParentIds)) {
          if (ids.includes(item.id)) {
            this.$set(item, 'disabled', true)
          }
        } else {
          this.$set(item, 'disabled', false)
        }
        if (item.departmentRespList.length > 0) {
          this.handleItemParentForEach(parentIds, item.departmentRespList, allParentIds)
        }
      })
    },

    transNativePlace(obj) {
      const nativePlace = obj.nativePlace
      const cas = []
      if (nativePlace !== '' && nativePlace !== undefined && nativePlace !== null) {
        const place = nativePlace.split('-')
        const province = area.province_list
        const city = area.city_list
        const county = area.county_list
        for (let i = 0; i < place.length; i++) {
          if (i === 0) {
            for (const p in province) {
              if (place[i] === province[p]) {
                cas.push(p)
                break
              }
            }
          } else if (i === 1) {
            for (const c in city) {
              if (place[i] === city[c]) {
                cas.push(c)
                break
              }
            }
          } else if (i === 2) {
            for (const c in county) {
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

    // 行业回显
    editFlagNum(obj) {
      const echoTreeArr = []
      let eachAry
      // 回显分类value转为数组
      if (obj === undefined || obj === null) {
        eachAry = []
      } else {
        eachAry = obj.split(',')
      }
      const itemAry = [] // 分类树组件，每一项的value数组
      // 递归分类数据
      const recursionCategory = (data) => {
        const len = data.length
        for (let i = 0; i < len; i++) { // 循环data参数，匹配回显的value
          itemAry.push(data[i].value) // 构建分类树数组项,入栈
          for (let j = 0; j < eachAry.length; j++) { // 遍历子节点分类value，拼凑成数组项value，并终止循环
            if (eachAry[j] == data[i].value) { // 匹配到子节点value
              echoTreeArr.push(JSON.parse(JSON.stringify(itemAry))) // push进树分类数据
              eachAry.splice(j, 1) // 删除以匹配到的value
              break
            }
          }
          if (eachAry.length <= 0) { // 所有回显value匹配完成后，跳出循环
            break
          } else if (data[i].children && data[i].children.length > 0) { // 如果存在子分类，递归继续
            recursionCategory(data[i].children)
          }
          itemAry.pop() //  出栈
        }
      }
      recursionCategory(this.tradeOptions) // 调用递归
      this.bindTradeIds = echoTreeArr
      // console.log(this.bindTradeIds, '处理后将要回显的数组')
    },
    transTrade(obj) {
      const trade = this.formObj['tradeId']
      const cas = []
      if (trade !== null && trade !== '') {
        for (const pTrade of this.tradeOptions) {
          if (trade === pTrade.value) {
            cas.push(pTrade.value)
            break
          }
          const children = pTrade.children
          let findFlag = false
          for (const cTrade of children) {
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
    getMemberType() {
      const params = {
        ckey: this.$store.getters.ckey
      }
      getMemberOptions(params).then(response => {
        this.memberPostOptions = response.data.data
      })
    },
    getTradeType() {
      const params = {
        ckey: this.$store.getters.ckey
      }
      getTradeOptions(params).then(response => {
        this.tradeOptions = response.data.data
      })
    },
    getPositionType() {
      getPositionOptions().then(response => {
        this.positionOptions = response.data.data
      })
    },
    getNativeOptions() {
      const province = area.province_list
      const city = area.city_list
      // const county = area.county_list
      for (const provinceKey in province) {
        const provinceOption = {
          label: province[provinceKey],
          value: provinceKey,
          children: []
        }
        const province_relat_Key = provinceKey.substring(0, 2)
        for (const cityKey in city) {
          if (cityKey.startsWith(province_relat_Key)) {
            const cityOption = {
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

    beforeAvatarUpload(file) {
      if (file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 50) {
        this.$message.error('上传图片大小不能超过 50MB!')
        return false
      }
    },

    uploadLogo(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadCompanyLogo(formData).then(response => {
        this.formObj['companyLogo'] = response.data.filePath
      })
    },

    uploadPortrait(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadPortrait(formData).then(response => {
        this.formObj.portrait = response.data.filePath
      })
    },

    uploadFrontOfIdCard(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadIdCard(formData).then(response => {
        this.formObj.frontOfIdCard = response.data.filePath
      })
    },

    uploadBackOfIdCard(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadIdCard(formData).then(response => {
        this.formObj.backOfIdCard = response.data.filePath
      })
    },

    uploadLicense(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadLicense(formData).then(response => {
        console.log(response.data.filePath)
        this.formObj['license'] = response.data.filePath
      })
      console.log(this.formObj.license)
    },

    handlerChange(val) {
      if (val !== undefined) {
        if (val.length >= 5) {
          this.bindTradeIds = this.bindTradeIds.reverse().slice(0, 5)
          console.log('删除后', this.bindTradeIds)
          return this.$message.error('最多只能选择5个行业')
        }
        const ids = []
        val.forEach((item) => {
          ids.push(item[item.length - 1])
        })
        this.formObj.tradeId = ids.join(',')
      }
    },

    handleItemChange(val) {
      if (val === undefined) return
      const province = area.province_list
      const city = area.city_list
      const county = area.county_list
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

    save() {
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
            console.log('修改后提交的参数：', this.formObj)
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
    }
  },

  watch: {
    formObj: {
      handler(val) {
        if (val.type === 1) {
          this.rules = this.companyRules
          this.$refs['form'].clearValidate()
        } else {
          this.rules = this.personalRules
          this.$refs['form'].clearValidate()
        }
      },
      deep: true
    },

    ids: {
      handler(newVal, oldVal) {
        const currentIds = newVal.filter(items => {
          if (!oldVal.includes(items)) return items
        })
        const currentId = currentIds[0]
        this.handleCurrentItemForEach(currentId, this.departmentOptions)
        this.handleItemParentForEach(this.parentIds, this.departmentOptions)
        this.handleItemSonForEach(currentId, this.currentItem)
      },
      deep: true
    }
  }

}
