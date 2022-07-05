import { createActivity, uploadPortrait, getActivity,setLinkAndCompetence } from '@/api/activity/activity'
import { getDepartmentListTreeSelect } from '@/api/org-structure/org'
import { getListOfSelect } from '@/api/member/post'
import Ckeditor from '@/components/CKEditor'
import area from '@/utils/area'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import preview from './component/preview'
export default {
  components: {
    Ckeditor,
   Treeselect,
   preview,
  },
  data() {
    var checkSpace = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('不能为空'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      // 编辑字段限制标识
      status:1,
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
        msgAlert: '',  //输入框提示
        lengthLimit: '', //输入字数限制
        check: 1,  // 是否 必填 选填
        key:'', // 下拉框需要把数据拼接成字符串
        // 下拉框
        pulldown:[
          {
            option:'', //选项1
          },{
            option:'', //选项2
          }
        ],
        key:'' , // 参数名称，下拉框情况下多个参数请;拼接
        type:'' // 0: 输入框  1：下拉框
      },
      // 信息类型
      infoDate:{
        info:'',
      },

      dialogFormVisible: false,
      editCol: false, // 是否编辑
      editIndex: 0, // 编辑索引
      // 活动报名表参数 end
      formObj: {
        id: '',
        activityName: '', // 活动名称
        headImage: '', // 活动头图
        listImage: '', // 活动列表图
        date: '', // 活动时间
        applyDate: '', // 报名时间
        province: '', // 活动地点(省)
        city: '', // 活动地点(市)
        area: '', // 活动地点(区)
        addressInfo: '', // 活动地点（详细地址）
        addresscon:'', // 搜索内容
        applyObject: 0, // 报名对象
        isLimit: 0, // 是否限制参加人数
        applyCount: '', // 参加人数
        introduce: '', // 活动介绍
        competence:'0',//观看权限 0 不限 1 限本商会会员
        link:'',//直播链接   
        signType:0,  // 报名方式是否必填 0否 1是
        arriveType:0,  // 到场人数是否必填 0否 1是
        longitude:113.326548, // 经度
        latitude:23.125821, // 纬度 
        auditStatus:0, // 报名审核
        extraSignin: 0 ,  // 拓展功能签到 0否 1是
        extraSignout:0 , // 拓展功能签退 0否 1是
        extraSeat: 0 , // 拓展功能座位 0否 1是
        isPublish:0 , //是否发布 0否 1是
      },
      roleIds:[],  //多选框 扩展功能
      addressList:[] , //搜索数组
      // 是否限制报名对象
      applyObject: {
        unlimit: true,
        limit: false,
        port: false,
        department: false
      },
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
      isPresent:false, 
      iscustom:false, // 自定义信息弹窗
      // 活动地点选择
      provinceValue: '',
      cityValue: '',
      countryValue: '',
      provinceOptions: [],
      cityOptions: [],
      countryOptions: [],
      areaData: null,
      // 直播活动ckey
      ruleCkeys:['nJ3VNk','Jtn1w3','3cWTv8','fIk3Ay','EbOpOz','q7fiqR','bSQk8X','Ip2cCA'],
      rules: {
        activityName: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' },
          { validator: checkSpace, trigger: 'blur' }
        ],
        // headImage: [
        //   { required: true, message: '活动头图不能为空', trigger: 'blur' }
        // ],
        // listImage: [
        //   { required: true, message: '活动列表图不能为空', trigger: 'blur' }
        // ],
        date: [
          { required: true, message: '活动时间不能为空', trigger: 'blur' }
        ],
        applyDate: [
          { required: true, message: '报名时间不能为空', trigger: 'blur' }
        ],
        // addressInfo: [
        //   { required: true, message: '活动地点不能为空', trigger: 'blur' },
        //   { validator: checkSpace, trigger: 'blur' }
        // ]
      },
      // 腾讯地图实例
      defaultParams :{
        map: null, // 地图实例 （地图）
        marker: '', // 地图的标识（标注的点）（地图）
        appkey: 'CGFBZ-T3JRX-MVQ4U-76AKV-2XCY3-OKBEG', // appkey是开发者key（地图
        suggest: null, //  新建一个关键字输入提示类
        infowindow:null, //地图信息
      },
     
    }
  },
  created() {
    this.ckey = this.$store.getters.ckey
    this.activityId = this.$route.query.activityId
    this.type = this.$route.query.type
  },
  async mounted() {
    await this.initMap()  // 初始化地图
    this.handleArea()
    this.$refs.ckeditor1.init()
    if (!this.activityId) {
      setTimeout(() => {
        this.$refs.ckeditor1.initHtml('')
      }, 500)
    } else {
      this.fetchData()
    }
    this.postSelectInit();
    if(this.$store.getters.ckey){
      this.treeSelectInit()
    }

  },
  methods: {
    loadScript(src){
        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
        })
    },
    postSelectInit() {
      const params = {
        'ckey': this.$store.getters.ckey,
      }
      getListOfSelect(params).then(response => {
        console.log(response.data.data)
        this.portSelect = response.data.data
      })
    },
    treeSelectInit() {
      const params = {
        'ckey': this.$store.getters.ckey,
        'parentId': 0
      }
      getDepartmentListTreeSelect(params).then(response => {
        console.log(response.data.data)
        this.options = response.data.data
      })
    },
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children == null || node.children == 'null' || node.children && !node.children.length) {
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
        pulldown:[
          {
            option:'', //选项1
          },{
            option:'', //选项2
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
      if(this.infoDate.info == 1){
        this.colData.pulldown.forEach((v)=>{
          if(v.option == '') completely = true
        })
      }
      if(completely) return this.$message.error('请填写选项标题')

      // if (this.arrayData.length >= 6) {
      //   this.$message({
      //     message: '报名信息请限制在 10 个以内',
      //     type: 'warning'
      //   });
      //   return
      // }
      if(this.colData.lengthLimit != '' && this.infoDate.info == 0){
        if(this.colData.lengthLimit < 0){
          this.$message({
            message: '字数限制必须大于0',
            type: 'warning'
          });
          return
        }else if(this.colData.lengthLimit > 200 && this.infoDate.info == 0){
          this.$message({
            message: '字数限制必须小于200',
            type: 'warning'
          });
          return
        }
      }
      let key = []
      this.colData.pulldown.forEach((v)=>{
        key.push(v.option)
      })
      this.colData.key = key.join()
    
     
      this.$refs['f2'].validate((valid) => {
        if (valid) {
          this.colData.type =  this.infoDate.info
         
          if (this.editCol) {
            // 编辑
            this.arrayData[this.editIndex] = {...this.colData}
          } else {
            // 新增
            this.arrayData.push(
              {...this.colData}
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
    edit(index,type) {
     
      this.infoDate.info = type + ''
      this.dialogFormVisible = true
      this.colData = {...this.arrayData[index]}
      this.editCol = true
      this.editIndex = index
    },
    // 上移
    up(index) {
    
      if (index === 0) {
        return
      } else {
        let data = this.arrayData[index]
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
        let data = this.arrayData[index]
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
      getActivity({ id: this.activityId }).then(res => {
        let resData = res.data
        this.status = resData.status
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

        // 报名时间回显
        let applyTime = []
        if (resData.applyStartTime && resData.applyEndTime) {
          applyTime.push(resData.applyStartTime)
          applyTime.push(resData.applyEndTime)
        }
        this.$set(this.formObj, 'applyDate', applyTime)
        //  扩展功能
        if(resData.extraSignin == 1) this.roleIds.push(1)
        if(resData.extraSignout == 1) this.roleIds.push(2)
        if(resData.extraSeat == 1) this.roleIds.push(3)
    
        // 活动地点回显
        this.provinceValue = resData.province
        this.cityValue = resData.city
        this.countryValue = resData.area
        this.formObj.province = resData.province
        this.formObj.city = resData.city
        this.formObj.area = resData.area
        this.formObj.addressInfo = resData.addressInfo
        this.formObj.title = resData.addressInfo
        this.formObj.longitude = resData.longitude
        this.formObj.latitude = resData.latitude
    
        this.formObj.district = resData.area
        
        this.formObj.signType = resData.signType
        this.formObj.arriveType = resData.arriveType
       
        // this.areaData = {
        //   province: {
        //     name: resData.province,
        //     // code: resData.provinceCode,
        //   },
        //   city: {
        //     name: resData.city,
        //     // code: resData.cityCode,
        //   },
        //   country: {
        //     name: resData.area,
        //     // code: resData.areaCode,
        //   }
        // }
        // 报名对象回显
        this.applyObject.limit = false
        this.applyObject.unlimit = false
        this.applyObject.department = false
        this.applyObject.port = false
        this.portValue = []
        this.valueTree = []
        if (resData.applyObject === 0) {
          this.applyObject.unlimit = true
          this.formObj.applyObject = 0
        } else if (resData.applyObject === 1) {
          this.applyObject.limit = true
          this.formObj.applyObject = 1
        } else if (resData.applyObject === 2) {
          this.applyObject.port = true
          this.formObj.applyObject = 2
          this.portValue = resData.applyIdsArray
        } else {
          this.applyObject.department = true
          this.formObj.applyObject = 3
          this.valueTree = resData.applyIdsArray
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

        // 报名审核
        if (resData.auditStatus === 1) {
          this.auditStatus.unlimit = false
          this.auditStatus.limit = true
        } 
        this.formObj.auditStatus = resData.auditStatus
        this.formObj.link=resData.link;
        this.formObj.competence=resData.competence+''

      
      
        this.onselect(this.formObj)
      
        // 活动介绍回显
        // this.$refs.ckeditor1.init()
        setTimeout(() => {
          this.$refs.ckeditor1.initHtml(resData.introduce ? resData.introduce : '')
        }, 500)
        this.formObj.introduce = resData.introduce
     
      
        // 动态字段回显
        // this.arrayData = resData.dtos.map(({title, msgAlert, lengthLimit, check}) => ({title, msgAlert, lengthLimit, check}));
      
        this.arrayData  = resData.dtos.map(({title, msgAlert, lengthLimit, check,type,selects,key}) => ({title, msgAlert, lengthLimit, check,type,selects,key,pulldown:[]}));
        let arr = []
        this.arrayData.forEach((v)=>{
           //  0 : 输入框  1：下拉框
          if(v.type == 1){
            v.msgAlert = ''
            v.key = v.selects[0].value
            let arrlist = v.selects[0].value.split(',')
            arr = arrlist.map((e) => ({ option:e }))
            v.pulldown= arr
          } 
        })
      
        
     
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
      this.applyObject.unlimit = false
      this.applyObject.limit = false
      this.applyObject.port = false
      this.applyObject.department = false
      if (val === 0) {
        this.applyObject.unlimit = true
        this.formObj.applyObject = 0
      } else if (val === 1) {
        this.applyObject.limit = true
        this.formObj.applyObject = 1
      } else if (val === 2) {
        this.applyObject.port = true
        this.formObj.applyObject = 2
        this.valueTree = []
      } else if (val === 3) {
        this.applyObject.department = true
        this.formObj.applyObject = 3
        this.portValue = []
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
      this.formObj.introduce = htmlStr
    },
    onnext(){
     
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.activeName = '2'
        }
      }) 
    },
    save(e) {
      this.formObj.isPublish = e
      this.$refs['form'].validate((valid) => {
        if (valid) {
           // 扩展功能
          this.roleIds.forEach((v)=>{
            if(v == 1) this.formObj.extraSignin = 1
            if(v == 2) this.formObj.extraSignout = 1
            if(v == 3) this.formObj.extraSeat = 1
          })
          // if (!this.areaData) {
          //   return this.$message.error('请选择省份')
          // } else if (!this.areaData.hasOwnProperty('city')) {
          //   return this.$message.error('请选择城市')
          // } else
          if (!this.formObj.applyObject && this.formObj.applyObject !== 0) {
            return this.$message.error('请选择报名对象')
          } else if (!this.formObj.isLimit && this.formObj.isLimit !== 0) {
            return this.$message.error('请选择参加人数')
          } else if (this.formObj.isLimit === 1) {
            let regexp = /^[1-9]\d*$/
            if (!regexp.test(this.formObj.applyCount)) {
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
          this.formObj['activityStartTime'] = this.formObj['date'][0]
          this.formObj['activityEndTime'] = this.formObj['date'][1]

          // 报名时间
          if(this.formObj['applyDate'] && this.formObj['applyDate'].length > 0){
            this.formObj['applyStartTime'] = this.formObj['applyDate'][0]
            this.formObj['applyEndTime'] = this.formObj['applyDate'][1]
          }else{
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

          if (this.arrayData.length > 0) {
            this.formObj['dtos'] = this.arrayData
          }
          if(this.formObj.competence){
            this.formObj['competence'] = Number(this.formObj['competence'])
          }

      
          createActivity(this.formObj).then(res => {
            if(res.state===1){
              this.$message.success(res.msg)
              this.$router.push({
                name: '活动列表',
                params: {
                  type: this.activityId ? this.type : 0
                }
              })
            }else{
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
        name: '活动列表',
        params: {
          type: this.activityId ? this.type : 1
        }
      })
    },
    onCancelDate(){
      this.infoDate.info = ''
      this.iscustom = false
    },
    // 下拉框添加选项
    onOptions(){
      let obj = {
        option : ''
      }
      if(this.colData.pulldown.length >= 10) return this.$message.error('最多只能添加10个')
      this.colData.pulldown.push(obj)
     
    },
    onInfoDate(){
    
      if (this.infoDate.info == '') return this.$message.error('请选择类型') 
      if(this.infoDate.info == 0 || this.infoDate.info == 1) this.dialogFormVisible = true
      this.iscustom = false
    },

    // 预览
    onpreview(){
      this.$refs['preview'].open(this.formObj)
    },
    // 搜索地址
    addressChange(e){
      this.ongetSuggestions(e)
    },

    onaddress(e){
      this.formObj.province = e.province // 活动地点(省)
      this.formObj.city = e.city // 活动地点(市)
      this.formObj.area = e.district // 活动地点(区)
      this.formObj.addressInfo = e.title // 活动地点（详细地址）
      this.formObj.longitude = e.location.lng // 经度
      this.formObj.latitude = e.location.lat // 纬度
      this.onselect(e)
    
    },  
    // 选择地址
    onselect(e){
     
      const myLatLng = this.createZuoBiao(this.formObj.latitude, this.formObj.longitude)

      //更新地图中心位置
      this.defaultParams.map.setCenter(
        new TMap.LatLng(this.formObj.latitude, this.formObj.longitude)
      );
      //初始化marker 清除数据
      if (this.defaultParams.marker) {
        this.defaultParams.marker.setMap(null);
        this.defaultParams.marker = null;
        this.defaultParams.infowindow.close()
      }
      this.defaultParams.marker = new TMap.MultiMarker({
        map: this.defaultParams.map,  //指定地图容器
        styles: {
          //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          myStyle: new TMap.MarkerStyle({ 
              width: 25,  // 点标记样式宽度（像素）
              height: 35, // 点标记样式高度（像素）
              anchor: { x: 16, y: 32 },
              src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',  //图片路径
          }) 
        },
        geometries: [{
          id: "1",   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
          styleId: 'myStyle',  //指定样式id
          position: myLatLng,  //点标记坐标位置
          properties: {//自定义属性
          title: "marker"
          }
        }]
      })
   
      this.addressList = []
      //创建InfoWindow实例，并进行初始化
      this.defaultParams.infowindow =new TMap.InfoWindow({
        position:myLatLng,//显示信息窗口的坐标
        map:this.defaultParams.map,
        content:`<h3 style="margin-top:-19px;">${e.title}</h3><p style="margin-top:-18px;">地址:${e.province}${e.city}${e.district}</p>`, //信息窗口内容
        offset: { x: 0, y: -50 },
      });
     
    },

    // 初始化地图
   async initMap(){
      await this.loadScript(`https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=${this.defaultParams.appkey}`)
     
      const myLatLng = this.createZuoBiao(this.formObj.latitude, this.formObj.longitude)

      this.defaultParams.map = new TMap.Map(this.$refs.mapBox, { // 实例化地图，赋值给data中的map
        center: myLatLng, // 目前的位置
        zoom: 17.2,//设置地图缩放级别
        rotation: 20,//设置地图旋转角度
        pitch:30, //设置俯仰角度（0~45）
      })

      // 新建一个关键字输入提示类
      this.defaultParams.suggest = new TMap.service.Suggestion({
        pageSize: 20, // 返回结果每页条目数
      });

    },
    // 调用腾讯接口获取地址信息
    ongetSuggestions(value){
      this.addressList = []
      this.defaultParams.suggest.getSuggestions({ 
        keyword: value, 
        location: this.defaultParams.map.getCenter() 
      })
      .then((result) => {
        this.addressList = result.data || []
      })
    },

    // 创建经纬度
    createZuoBiao(myLatitude, myLongitude) {
      return new TMap.LatLng(myLatitude, myLongitude)
    },

  }
}
