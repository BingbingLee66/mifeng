import { uploadPortrait } from '@/api/activity/activity'
import { getDepartmentListTreeSelect } from '@/api/org-structure/org'
import { getListOfSelect } from '@/api/member/post'
import Ckeditor from '@/components/CKEditor'
import WangEditor from '@/components/wangEditor/index'
import { getFile2name, getInfoList, getActivitySaveV1, getEcActivity } from '@/api/attract'
import MakeTagDialog from '@/views/zhaoshang/activity/create/component/make-tag-dialog'
import TagFormDialog from '@/views/zhaoshang/activity/create/component/tag-form-dialog'
import { ACTIVE_MODE, activeModeMap, stageMap, getMapDict } from '@/consts'
import area from '@/utils/area'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import preview from './component/preview'
import getAreaList from '@/utils/get-area-list'
export default {
  components: {
    Ckeditor,
    WangEditor,
    MakeTagDialog,
    TagFormDialog,
    Treeselect,
    preview,
  },
  data() {
    const checkSpace = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('不能为空'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      // 编辑字段限制标识
      status: 1,
      // 树形下拉框 begin
      valueTree: [],
      options: [],
      // 树形下拉框 end
      activeName: '1',
      activityId: null,
      type: null,
      ckey: '',
      // 下拉选择 begin
      portSelect: [],
      portValue: '',
      // 下拉选择 begin
      // 活动报名表参数 begin
      arrayData: [],
      colData: {
        title: '', // 标题
        msgAlert: '', // 输入框提示
        lengthLimit: '', // 输入字数限制
        check: 1, // 是否 必填 选填
        // 下拉框
        selects: [
          {
            value: '', // 选项1
          }, {
            value: '', // 选项2
          }
        ],
        key: '', // 参数名称，下拉框情况下多个参数请;拼接
        type: '' // 0: 输入框  1：下拉框
      },
      // 信息类型
      infoDate: {
        info: '',
      },

      makeTagDialogVisible: false,
      tagFormDialogVisible: false,
      dialogFormVisible: false,
      editCol: false, // 是否编辑
      editIndex: 0, // 编辑索引
      // 活动报名表参数 end
      customTagGroup: {},
      formObj: {
        id: '', // 编辑状态需要id
        activityName: '', // 活动名称
        headImage: '', // 活动头图
        listImage: '', // 活动列表图
        date: '', // 活动时间
        applyDate: '', // 报名时间
        addressInfo: '', // 活动地点（详细地址）
        addresscon: '', // 搜索内容
        isLimit: 0, // 是否限制参加人数
        activityCount: '', // 参加人数
        introduce: '', // 活动介绍
        zhiboAddress: '', // 直播链接
        signType: 0, // 报名方式是否必填 0否 1是
        arriveType: 1, // 到场人数是否必填 0否 1是
        longitude: 113.326548, // 经度
        latitude: 23.125821, // 纬度
        auditStatus: 0, // 报名审核
        extraSignin: 0, // 拓展功能签到 0否 1是
        extraSignout: 0, // 拓展功能签退 0否 1是
        extraSeat: 0, // 拓展功能座位 0否 1是
        isPublish: 0, // 是否发布 0否 1是
        zhiboAddressType: 1, // 直播链接类型 1 云会播小程序 2 H5链接
        invesKey: '', // 关联招商办
        phaseStatus: null, // 招商阶段  0筹备阶段 1拟策阶段 2公开招商阶段
        chamberAddress: [], // 招商地区
        sort: 0, // 权重
        labels: [],
        applyMode: 3, // 活动模式
        attachment: [], // 上传文件 内容附件
        province: '', // 省（招商地区）
        provinceCode: '', // 省code（招商地区
        cityCode: '', // 	市code（招商地区）
        city: '', // 	市（招商地区）
        area: '', // 区（招商地区）
        areaCode: '', // 区code（招商地区）
      },
      roleIds: [], // 多选框 扩展功能
      addressList: [], // 搜索数组

      // 是否限制报名人数
      applyCount: {
        unlimit: true,
        limit: false
      },
      // 是否报名审核
      auditStatus: {
        unlimit: true,
        limit: false
      },
      isPresent: false,
      iscustom: false, // 自定义信息弹窗
      modalKey: 0,
      // 活动地点选择
      provinceValue: '',
      cityValue: '',
      countryValue: '',
      provinceOptions: [],
      cityOptions: [],
      countryOptions: [],
      areaData: null,
      // 直播活动ckey
      ruleCkeys: ['nJ3VNk', 'Jtn1w3', '3cWTv8', 'fIk3Ay', 'EbOpOz', 'q7fiqR', 'bSQk8X', 'Ip2cCA'],
      rules: {
        activityName: [
          { required: true, message: '活动名称不能为空', trigger: 'change' },
          { validator: checkSpace, trigger: 'change' }
        ],
        // headImage: [
        //   { required: true, message: '活动头图不能为空', trigger: 'blur' }
        // ],
        // listImage: [
        //   { required: true, message: '活动列表图不能为空', trigger: 'blur' }
        // ],
        date: [{ required: true, message: '活动时间不能为空', trigger: 'blur' }],
        applyDate: [{ required: true, message: '报名时间不能为空', trigger: 'blur' }],

        invesKey: [{ required: true, message: '招商办不能为空', trigger: 'change' }],
        chamberAddress: [{ required: true, message: '招商地区不能为空', trigger: 'change' }],
        labels: [{ required: true, message: '类型摘要不能为空', trigger: ['blur', 'change'] }],
        applyMode: [{ required: true, message: '活动模式不能为空', trigger: 'blur' }],
        // addressInfo: [
        //   { required: true, message: '活动地点不能为空', trigger: 'blur' },
        //   { validator: checkSpace, trigger: 'blur' }
        // ]
      },
      stageMap,
      ACTIVE_MODE,
      activeModeMap,
      getMapDict,
      // 腾讯地图实例
      defaultParams: {
        map: null, // 地图实例 （地图）
        marker: '', // 地图的标识（标注的点）（地图）
        appkey: 'CGFBZ-T3JRX-MVQ4U-76AKV-2XCY3-OKBEG', // appkey是开发者key（地图
        suggest: null, //  新建一个关键字输入提示类
        infowindow: null, // 地图信息
      },
      areaOptions: [], // 招商地区
      chamberOptions: [], // 招商办来源信息
      contentHtml: ''
    }
  },
  created() {
    this.ckey = this.$store.getters.ckey
    this.activityId = this.$route.query.activityId
    this.type = this.$route.query.type
    // 招商办来源信息
    this.ongetInfoList()
  },
  async mounted() {
    await this.initMap() // 初始化地图
    this.handleArea()
    this.areaOptions = await getAreaList(3)
    // this.$refs.ckeditor1.init()
    if (!this.activityId) {
      this.contentHtml = ''
      // setTimeout(() => {
      //   this.$refs.ckeditor1.initHtml('')
      // }, 500)
    } else {
      this.fetchData()
    }
    this.postSelectInit()
    if (this.$store.getters.ckey) {
      this.treeSelectInit()
    }
  },
  methods: {

    postSelectInit() {
      const params = {
        ckey: this.$store.getters.ckey,
      }
      getListOfSelect(params).then(response => {
        console.log(response.data.data)
        this.portSelect = response.data.data
      })
    },
    treeSelectInit() {
      const params = {
        ckey: this.$store.getters.ckey,
        parentId: 0
      }
      getDepartmentListTreeSelect(params).then(response => {
        console.log(response.data.data)
        this.options = response.data.data
      })
    },
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children === null || node.children === 'null' || node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.value,
        label: node.label,
        children: node.children
      }
    },
    // 动态表单
    // 取消
    cancel1() {
      this.dialogFormVisible = false
      this.colData = {
        title: '',
        msgAlert: '',
        lengthLimit: '',
        check: 1,
        selects: [
          {
            value: '', // 选项1
          }, {
            value: '', // 选项2
          }
        ],
      }
      this.editCol = false
      this.infoDate.info = ''
      this.$refs['f2'].resetFields()
    },
    test() {
      console.log(this.valueTree)
    },
    // 新增
    add() {
      let completely = false
      if (this.infoDate.info === 1) {
        this.colData.selects.forEach(v => {
          if (v.value === '') completely = true
        })
      }
      if (completely) return this.$message.error('请填写选项标题')

      // if (this.arrayData.length >= 6) {
      //   this.$message({
      //     message: '报名信息请限制在 10 个以内',
      //     type: 'warning'
      //   });
      //   return
      // }
      if (this.colData.lengthLimit !== '' && this.infoDate.info === 0) {
        if (this.colData.lengthLimit < 0) {
          this.$message({
            message: '字数限制必须大于0',
            type: 'warning'
          })
          return
        } else if (this.colData.lengthLimit > 200 && this.infoDate.info === 0) {
          this.$message({
            message: '字数限制必须小于200',
            type: 'warning'
          })
          return
        }
      }
      const key = []
      if (this.colData.selects) {
        this.colData.selects.forEach(v => {
          key.push(v.value)
        })
      }

      this.colData.key = key.join(';')

      this.$refs['f2'].validate(valid => {
        if (valid) {
          this.colData.type = this.infoDate.info

          if (this.editCol) {
            // 编辑
            this.arrayData[this.editIndex] = { ...this.colData }
          } else {
            // 新增
            this.arrayData.push(
              { ...this.colData }
            )
          }
          this.cancel1()
          return
        } else {
          console.log('error submit!!')
          return
        }
      })
    },
    // 删除
    del(index) {
      this.arrayData.splice(index, 1)
    },
    // 修改
    edit(index, type) {
      this.infoDate.info = type + ''
      this.dialogFormVisible = true
      this.colData = { ...this.arrayData[index] }
      this.editCol = true
      this.editIndex = index
    },
    // 上移
    up(index) {
      if (index === 0) {
        return
      } else {
        const data = this.arrayData[index]
        this.arrayData[index] = this.arrayData[index - 1]
        this.arrayData[index - 1] = data
        this.$forceUpdate()
      }
    },
    // 下移
    down(index) {
      if (index === this.arrayData.length - 1) {
        return
      } else {
        const data = this.arrayData[index]
        this.arrayData[index] = this.arrayData[index + 1]
        this.arrayData[index + 1] = data
        this.$forceUpdate()
      }
    },

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
    // 获取活动详情
    fetchData() {
      getEcActivity({ id: this.activityId }).then(res => {
        const resData = res.data
        this.status = resData.status
        this.formObj.activityName = resData.activityName
        this.formObj.headImage = resData.headImage
        this.formObj.listImage = resData.listImage
        this.formObj.applyMode = resData.applyMode
        // 活动时间回显
        const activityTime = []
        if (resData.activityStartTime && resData.activityEndTime) {
          activityTime.push(resData.activityStartTime)
          activityTime.push(resData.activityEndTime)
        }
        this.$set(this.formObj, 'date', activityTime)

        // 报名时间回显
        const applyTime = []
        if (resData.applyStartTime && resData.applyEndTime) {
          applyTime.push(resData.applyStartTime)
          applyTime.push(resData.applyEndTime)
        }
        this.$set(this.formObj, 'applyDate', applyTime)
        //  扩展功能
        if (resData.extraSignin === 1) this.roleIds.push(1)
        if (resData.extraSignout === 1) this.roleIds.push(2)
        if (resData.extraSeat === 1) this.roleIds.push(3)

        // 活动地点回显
        this.provinceValue = resData.province
        this.cityValue = resData.city
        this.countryValue = resData.area
        this.formObj.district = resData.area
        this.formObj.signType = resData.signType
        this.formObj.arriveType = resData.arriveType
        this.formObj.zhiboAddressType = resData.zhiboAddressType || 1
        // 活动地点
        this.formObj.addressInfo = resData.addressInfo
        if (resData.longitude) this.formObj.longitude = resData.longitude
        if (resData.latitude) this.formObj.latitude = resData.latitude
        // 招商地区
        this.formObj.province = resData.province
        this.formObj.provinceCode = resData.provinceCode
        this.formObj.city = resData.city
        this.formObj.cityCode = resData.cityCode
        this.formObj.area = resData.area
        this.formObj.areaCode = resData.areaCode

        this.formObj.chamberAddress.push(resData.provinceCode, resData.cityCode, resData.areaCode)
        this.modalKey++

        // 参加人数回显
        if (resData.isLimit === 0) {
          this.applyCount.unlimit = true
          this.applyCount.limit = false
          this.formObj.isLimit = 0
        } else {
          this.applyCount.unlimit = false
          this.applyCount.limit = true
          this.formObj.isLimit = 1
          this.formObj.activityCount = resData.activityCount
        }

        // 报名审核
        if (resData.auditStatus === 1) {
          this.auditStatus.unlimit = false
          this.auditStatus.limit = true
        }
        this.formObj.auditStatus = resData.auditStatus
        this.formObj.zhiboAddress = resData.zhiboAddress

        if (resData.longitude || resData.latitude) this.onselect()

        // 活动介绍回显
        // this.$refs.ckeditor1.init()
        console.log('=== resData.introduce ===', resData.introduce)
        this.contentHtml = resData.introduce ? resData.introduce : ''
        /* setTimeout(() => {
          this.$refs.ckeditor1.initHtml(resData.introduce ? resData.introduce : '')
        }, 500) */
        this.formObj.introduce = resData.introduce

        this.formObj.invesKey = resData.invesKey
        this.formObj.phaseStatus = resData.phaseStatus
        this.formObj.sort = resData.sort
        this.formObj.labels = resData.labels

        if (resData.attachment && resData.attachment.length > 0) {
          this.formObj.attachment = resData.attachment.map(v => {
            return {
              fileName: v.fileName,
              name: v.fileName,
              ossUrl: v.ossUrl
            }
          })
        }

        // 动态字段回显
        // this.arrayData = resData.dtos.map(({title, msgAlert, lengthLimit, check}) => ({title, msgAlert, lengthLimit, check}));

        this.arrayData = resData.dtos.map(({ title, msgAlert, lengthLimit, check, type, selects, key }) => ({ title, msgAlert, lengthLimit, check, type, selects, key }))
        this.arrayData.forEach(v => {
          //  0 : 输入框  1：下拉框
          if (v.type === 1) {
            v.msgAlert = ''
            const key = []
            v.selects.forEach(j => {
              key.push(j.value)
            })
            v.key = key.join(';')
          }
        })
      })
    },

    // 上传文件校验
    beforeUploadFile(file) {
      if (!['docx', 'doc', 'xls', 'xlsx', 'pdf', 'ppt'].includes(file.name.split('.')[1])) {
        this.$message.error('上传文件只能是 word、excel、pdf、ppt 格式!')
        return false
      }
    },
    // 上传文件
    uploadFile(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      const folder = 'government'
      getFile2name(formData, folder).then(res => {
        if (res.state === 1) {
          const obj = {
            fileName: content.file.name,
            name: content.file.name,
            ossUrl: res.data
          }
          this.formObj.attachment.push(obj)
        } else {
          const idx = this.$refs.uploadFile.uploadFiles.findIndex(item => item.uid === content.file.uid)
          this.$refs.uploadFile.uploadFiles.splice(idx, 1)
          return this.$message.error('上传失败,请重试')
        }
      })
    },
    // 删除上传文件
    handleRemoveAttachment(file) {
      this.formObj.attachment = this.formObj.attachment.filter(item => item.uid !== file.uid)
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
      const formData = new FormData()
      formData.append('file', content.file)
      uploadPortrait(formData).then(response => {
        this.formObj.headImage = response.data.filePath
      })
    },
    // 上传活动列表图
    uploadListImage(content) {
      const formData = new FormData()
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

    // 报名审核
    handleAuditStatus(val) {
      if (val === 0) {
        this.auditStatus.unlimit = true
        this.auditStatus.limit = false
        this.formObj.auditStatus = 0
      } else {
        this.auditStatus.unlimit = false
        this.auditStatus.limit = true
        this.formObj.auditStatus = 1
      }
    },

    // 编辑活动介绍
    getHtml(htmlStr) {
      // console.log('=== htmlStr ===', htmlStr)
      this.formObj.introduce = htmlStr
    },
    onnext() {
      if (this.status === 2 || this.status === 3) {
        this.activeName = '2'
      } else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.activeName = '2'
          }
        })
      }
    },
    save(e) {
      this.formObj.isPublish = e
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 扩展功能
          this.roleIds.forEach(v => {
            if (v === 1) this.formObj.extraSignin = 1
            if (v === 2) this.formObj.extraSignout = 1
            if (v === 3) this.formObj.extraSeat = 1
          })
          // if (!this.areaData) {
          //   return this.$message.error('请选择省份')
          // } else if (!this.areaData.hasOwnProperty('city')) {
          //   return this.$message.error('请选择城市')
          // } else
          if (!this.formObj.isLimit && this.formObj.isLimit !== 0) {
            return this.$message.error('请选择参加人数')
          } else if (this.formObj.isLimit === 1) {
            const regexp = /^[1-9]\d*$/
            if (!regexp.test(this.formObj.activityCount)) {
              return this.$message.error('参加人数为大于0的正整数')
            }
          }
          // } else if (!this.formObj.introduce) {
          //   this.activeName='2'
          //   return this.$message.error('活动介绍不能为空')
          // }
          // let introHtml = this.formObj.introduce.replace(/<\/?p[^>]*>/gi, '')
          // let introHtml2 = introHtml.replace(/&nbsp;/ig, '')
          // if (introHtml2.match(/^\s+$/) || introHtml2.length === 0) {
          //   this.activeName='2'
          //   return this.$message.error('活动介绍不能为空')
          // }
          this.formObj.ckey = this.ckey
          // eslint-disable-next-line prefer-destructuring
          this.formObj['activityStartTime'] = this.formObj['date'][0]
          // eslint-disable-next-line prefer-destructuring
          this.formObj['activityEndTime'] = this.formObj['date'][1]

          // 报名时间
          if (this.formObj['applyDate'] && this.formObj['applyDate'].length > 0) {
            // eslint-disable-next-line prefer-destructuring
            this.formObj['applyStartTime'] = this.formObj['applyDate'][0]
            // eslint-disable-next-line prefer-destructuring
            this.formObj['applyEndTime'] = this.formObj['applyDate'][1]
          } else {
            this.formObj['applyStartTime'] = null
            this.formObj['applyEndTime'] = null
          }

          // if (this.areaData) {
          //   this.formObj.province = this.areaData.province.name
          //   this.formObj.provinceCode = this.areaData.province.code
          //   if (this.areaData.hasOwnProperty('city')) {
          //     this.formObj.city = this.areaData.city.name
          //     this.formObj.cityCode = this.areaData.city.code
          //   }
          //   if (this.areaData.hasOwnProperty('country')) {
          //     this.formObj.area = this.areaData.country.name
          //     this.formObj.areaCode = this.areaData.country.code
          //   }
          // }

          if (this.activityId) {
            this.formObj['id'] = this.activityId
          }

          if (this.valueTree.length > 0) {
            this.formObj['applyIds'] = this.valueTree.join(',')
          }
          if (this.portValue.length > 0) {
            this.formObj['applyIds'] = this.portValue.join(',')
          }
          // 如果选择了自定义报名 但是没有选择自定义报名信息 就返回提示
          if (this.formObj.signType === 0 && !this.arrayData.length) return this.$message.error('自定义报名表需添加报名信息才可以发布活动，若无需自定义报名表，请选择【一键报名】')

          if (this.arrayData.length > 0) {
            this.formObj['dtos'] = this.arrayData
          }

          // 如果地址没选则去除地址信息
          if (this.formObj.addressInfo === '') {
            this.formObj.longitude = ''
            this.formObj.latitude = ''
          }

          getActivitySaveV1(this.formObj).then(res => {
            if (res.state === 1) {
              this.$message.success(res.msg)
              this.$router.push({
                name: '招商活动管理',
              })
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
      this.$router.push({
        name: '招商活动管理',
      })
    },
    onCancelDate() {
      this.infoDate.info = ''
      this.iscustom = false
    },
    // 下拉框添加选项
    onOptions() {
      const obj = {
        value: ''
      }
      if (this.colData.selects.length >= 10) return this.$message.error('最多只能添加10个')
      this.colData.selects.push(obj)
    },
    onInfoDate() {
      if (this.infoDate.info === '') return this.$message.error('请选择类型')
      if (this.infoDate.info === 0 || this.infoDate.info === 1) this.dialogFormVisible = true
      this.iscustom = false
    },
    // 选择招商地区
    handleChange() {
      const getCheckedNodes = this.$refs.cascader.getCheckedNodes()[0]
      // eslint-disable-next-line prefer-destructuring
      this.formObj.province = getCheckedNodes.pathLabels[0] // 省
      // eslint-disable-next-line prefer-destructuring
      this.formObj.provinceCode = getCheckedNodes.path[0]
      // eslint-disable-next-line prefer-destructuring
      this.formObj.city = getCheckedNodes.pathLabels[1] // 市
      // eslint-disable-next-line prefer-destructuring
      this.formObj.cityCode = getCheckedNodes.path[1]
      // eslint-disable-next-line prefer-destructuring
      this.formObj.area = getCheckedNodes.pathLabels[2] // 区
      // eslint-disable-next-line prefer-destructuring
      this.formObj.areaCode	 = getCheckedNodes.path[2]
    },

    // 选择标签
    onConfirm(e) {
      this.formObj.labels = e
      if (this.formObj.labels.length > 0) this.$refs.form.validateField('labels')
    },
    // 预览
    onpreview() {
      this.$refs['preview'].open(this.formObj)
    },
    // 搜索地址
    addressChange(e) {
      this.ongetSuggestions(e)
    },

    onaddress(e) {
      this.formObj.addressInfo = e.address // 活动地点（详细地址）
      this.formObj.longitude = e.location.lng // 经度
      this.formObj.latitude = e.location.lat // 纬度
      this.onselect()
    },
    // 选择地址
    onselect() {
      const myLatLng = this.createZuoBiao(this.formObj.latitude, this.formObj.longitude)
      // 更新地图中心位置
      this.defaultParams.map.setCenter(
        new TMap.LatLng(this.formObj.latitude, this.formObj.longitude)
      )
      // 初始化marker 清除数据
      if (this.defaultParams.marker) {
        this.defaultParams.marker.setMap(null)
        this.defaultParams.marker = null
        this.defaultParams.infowindow.close()
      }
      this.defaultParams.marker = new TMap.MultiMarker({
        map: this.defaultParams.map, // 指定地图容器
        styles: {
          // 创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          myStyle: new TMap.MarkerStyle({
            width: 25, // 点标记样式宽度（像素）
            height: 35, // 点标记样式高度（像素）
            anchor: { x: 16, y: 32 },
            src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png', // 图片路径
          })
        },
        geometries: [
          {
            id: '1', // 点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
            styleId: 'myStyle', // 指定样式id
            position: myLatLng, // 点标记坐标位置
            properties: {// 自定义属性
              title: 'marker'
            }
          }
        ]
      })

      this.addressList = []
      // 创建InfoWindow实例，并进行初始化
      this.defaultParams.infowindow = new TMap.InfoWindow({
        position: myLatLng, // 显示信息窗口的坐标
        map: this.defaultParams.map,
        // <p style="margin-top:-18px;">地址:${e.province}${e.city}${e.district || ''}</p>
        content: `<p>${this.formObj.addressInfo}</p>`, // 信息窗口内容
        offset: { x: 0, y: -50 },
      })
    },

    // 初始化地图
    async initMap() {
      const myLatLng = this.createZuoBiao(this.formObj.latitude, this.formObj.longitude)

      this.defaultParams.map = new TMap.Map(this.$refs.mapBox, { // 实例化地图，赋值给data中的map
        center: myLatLng, // 目前的位置
        zoom: 17.2, // 设置地图缩放级别
        rotation: 20, // 设置地图旋转角度
        pitch: 30, // 设置俯仰角度（0~45）
      })

      // 新建一个关键字输入提示类
      this.defaultParams.suggest = new TMap.service.Suggestion({
        pageSize: 20, // 返回结果每页条目数
      })
    },
    // 调用腾讯接口获取地址信息
    ongetSuggestions(value) {
      this.addressList = []
      this.defaultParams.suggest.getSuggestions({
        keyword: value,
        location: this.defaultParams.map.getCenter()
      })
        .then(result => {
          this.addressList = result.data || []
        })
    },

    // 创建经纬度
    createZuoBiao(myLatitude, myLongitude) {
      return new TMap.LatLng(myLatitude, myLongitude)
    },
    ongetInfoList() {
      getInfoList({ status: 0 }).then(res => {
        this.chamberOptions = res.data || []
      })
    },
  }
}
