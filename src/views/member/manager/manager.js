import {
  list,
  updateStatus,
  transferPresident,
  authorizeMemberAuthBatch
} from '@/api/member/manager'
import { getMemberOptions, deleteManyMember } from '@/api/member/post'
import { getTradeOptions } from '@/api/system/trade'
import { exportJson2Excel } from '@/utils/exportExcel'
import { sendSmsBatch } from '@/api/sms/sms.js'
import { getDepartmentList } from '@/api/org-structure/org'
// import { downLoad } from '@/directive/down-load-url'
import { getToken } from '@/utils/auth'
const baseUrl = process.env.VUE_APP_BASE_API
import attachLabel from '@/components/Label/attach-label'
import moreLabel from '@/components/Label/more-label'
import Labels from '@/api/labels/labels'
import { getAvailableLabelList, getTradeLabelList } from '@/api/lable'
export default {
  name: '商/协会成员',
  components: {
    'attach-label': attachLabel,
    'more-label': moreLabel
  },

  // directives: { downLoad },
  directives: {
    downLoad: {
      inserted: (el, binding) => {
        el.style.cssText = 'cursor:pointer;'
        el.addEventListener('click', () => {
          let link = document.createElement('a')
          let url = binding.value
          fetch(url)
            .then(res => res.blob())
            .then(blob => {
              link.href = URL.createObjectURL(blob)
              link.download = '商会成员信息导入模板.xlsx'
              document.body.appendChild(link)
              link.click()
            })
        })
      }
    }
  },

  data() {
    var checkPass = (rule, value, callback) => {
      if (!/^\w*$/.test(value)) {
        return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      exportExcelModel:
        'https://ysh-cdn.kaidicloud.com/prod/static/%E5%95%86%E4%BC%9A%E6%88%90%E5%91%98%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%20%281%29.xlsx',
      departmentOptions: [],
      memberPostOptions: [],
      tradeOptions: [],
      tradeCas: -1,
      departmentCas: -1,
      query: {
        status: 1, // 状态
        sendStatus: -1,
        uname: '', // 用户名
        name: '', // 会员姓名
        phone: '', // 会员手机号
        contactName: '', // 联系人姓名
        contactPhone: '', // 联系人电话
        companyName: '', // 企业/团体名称
        memberPostType: -1, // 职位
        department: -1, // 部门
        type: -1, // 入会类型
        tradeType: -1, // 行业
        date: '', // 入会时间
        supplyId: '', // 供需标签
        industryId: '', // 行业标签
        activatedState: 0 // 激活状态 -1未激活 0全部 1已激活
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      selectionIds: [],
      roleId: this.$store.state.user.profile.roleId,
      transferVisible: false,
      formObj: {},
      rules: {
        password: [
          { required: true, message: '账号密码不能为空', trigger: 'blur' },
          { validator: checkPass, trigger: 'change' }
        ]
      },
      visible: false,
      importUrl: '',
      execelDate: {},
      importQuery: {
        ckey: ''
      },
      uploadHeaders: {
        'access-token': ''
      },
      multipleSelection: [],
      attachVisible: false,
      moreVisible: false,
      moreType: '',
      moreData: {},
      memberLabelIds: [],
      labelOptions: [],
      platformLabelIds: [],
      PlatformOptions: [],
      supplyIds: [],
      industryIds: [],
      SupplyformOptions: [],
      IndustryformOptions: [],
      // 移除标签对话框
      removeMemberDialog: false,
      notActiveMember: 0
    }
  },

  computed: {
    nativePlaceStr() {
      return function(str) {
        if (str === null) {
          return ''
        }
        return str.replace(new RegExp('-', 'gm'), '')
      }
    },
    labelProps() {
      return {
        multiple: true
        // checkStrictly: true,
        // lazy: true,
        // lazyLoad: this.lazyLoad
      }
    }
  },
  created() {
    this.getMemberType() // 获取商会职位数据
    this.getTradeType() // 获取行业数据
    this.getdepartmentType() // 获取部门数据
    this.query.memberPostType = +this.$route.query.memberPostType || -1
    this.init()
    this.importUrl = baseUrl + '/ec/member/import-excel'
    this.importQuery.ckey = this.$store.getters.ckey
    this.uploadHeaders['access-token'] = getToken()
    this.getLabelOptions()
    this.getPlatformOptions()
    this.getSupplyformOptions()
    this.getIndustryformOptions()
  },
  mouted() {},
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    goEdit(e, row) {
      this.$router.push({
        name: '编辑会员',
        params: { memberId: row.id, querytype: 2 }
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },

    getMemberType() {
      const params = {
        ckey: this.$store.getters.ckey
      }
      getMemberOptions(params).then(response => {
        this.memberPostOptions = response.data.data ? response.data.data : []
        this.memberPostOptions.unshift({ label: '全部', value: -1 })
      })
    },

    getTradeType() {
      const params = {
        ckey: this.$store.getters.ckey
      }
      getTradeOptions(params).then(response => {
        this.tradeOptions = response.data.data ? response.data.data : []
        this.tradeOptions.unshift({ label: '全部', value: -1 })
      })
    },

    getdepartmentType() {
      const params = {
        ckey: this.$store.getters.ckey,
        parentId: 0
      }
      getDepartmentList(params).then(res => {
        if (res.state === 1) {
          this.departmentOptions = res.data.data[0].departmentRespList
          this.departmentOptions.unshift({ departmentName: '全部', id: -1 })
        }
      })
    },

    init() {
      // if (this.has('', '查询')) {
      //   console.info('111111111111111111')
      this.fetchData()
      // }
    },
    async fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
        if (e !== 1) {
          window.localStorage.setItem(
            'actionId',
            e.currentTarget.getAttribute('actionid')
          )
        }
      }
      let _tagIds = ''
      if (this.memberLabelIds.length > 0) {
        let ids = this.memberLabelIds.map(item => {
          item = item.filter((id, idx) => {
            return idx === 1
          })
          return item[0]
        })
        ids = ids.slice(0, 200)
        _tagIds = ids.join(',')
      }
      if (this.platformLabelIds.length > 0) {
        let ids = this.platformLabelIds.map(item => {
          item = item.filter((id, idx) => {
            return idx === 1
          })
          return item[0]
        })
        ids = ids.slice(0, 200)
        _tagIds = _tagIds + ',' + ids.join(',')
        _tagIds = _tagIds.replace(/^(\s|,)+|(\s|,)+$/g, '')
      }
      if (this.memberLabelIds.length > 200 || this.platformLabelIds.length > 200) {
        this.$message.warning('每次最多支持查询200个标签')
      }
      let supIds
      if (this.supplyIds.length > 0) {
        supIds = this.supplyIds.join(',')
      }
      let indusIds
      if (this.industryIds.length > 0) {
        indusIds = this.industryIds.map(item => item[1]).join(',')
      }
      const params = {
        status: this.query.status,
        uname: this.query.uname,
        ckey: this.$store.getters.ckey,
        companyName: this.query.companyName,
        contactName: this.query.contactName,
        contactPhone: this.query.contactPhone,
        name: this.query.name,
        phone: this.query.phone,
        memberPostType: this.query.memberPostType,
        type: this.query.type,
        tradeType: this.query.tradeType,
        department: this.query.department,
        activatedState: this.query.activatedState,
        memberLabelIds: _tagIds,
        pageSize: this.limit,
        page: this.currentpage,
        // 供需标签id
        demandLabelIds: supIds,
        tradeLabelIds: indusIds
      }
      if (this.query.date) {
        params['startTs'] = this.query.date[0]
        params['endTs'] = this.query.date[1]
      }
      if (this.query.sendStatus !== -1) {
        params['sendStatus'] = this.query.sendStatus
      }
      try {
        const {
          data: { data = {}}
        } = await list(params)
        this.list = data.list || []
        this.list.forEach(item => {
          if (!item.memberLabelList) {
            item.memberLabelList = []
          }
          if (!item.tradeBridges) {
            item.tradeBridges = []
          }
          if (!item.bridgeLabels) {
            item.bridgeLabels = []
          }
        })
        this.total = data.totalRows || 0
      } catch (error) {
        /*  */
      }
      this.listLoading = false
    },
    add(e) {
      window.localStorage.setItem(
        'actionId',
        e.currentTarget.getAttribute('actionid')
      )
      window.localStorage.setItem('membereditor', this.$route.path)
      this.$router.push({ name: '编辑会员' })
    },
    detail(e, row) {
      window.localStorage.setItem(
        'actionId',
        e.currentTarget.getAttribute('actionid')
      )
      window.localStorage.setItem('membereditor', this.$route.path)
      this.$router.push({
        name: '会员详情',
        query: { userId: row.wxUserId },
        params: { memberDetail: row, querytype: '0' }
      })
    },
    updateStatus(e, row) {
      window.localStorage.setItem(
        'actionId',
        e.currentTarget.getAttribute('actionid')
      )
      let params = {
        id: row.id,
        action: row.status === 0 ? 'active' : 'notactive'
      }
      updateStatus(params).then(response => {
        if (row.status === 0) {
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '冻结成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    handlerChange(value) {
      this.query.tradeType = value[value.length - 1]
    },

    /*
     * 选择行业
     * */
    handlerDepartmentChange(val) {
      this.query.department = [...val].pop()
    },

    handleSelectionChange(value) {
      this.multipleSelection = value
      let datas = value
      this.selectionDatas = []
      this.selectionIds = []
      this.selectionWxUserIds = []
      for (let data of datas) {
        this.selectionIds.push(data.id)
        this.selectionWxUserIds.push(data.wxUserId)
        let new_data = {
          用户名: data.uname,
          入会类型: data.type === 0 ? '个人' : '企业',
          联系信息:
            data.type === 0
              ? '【会员姓名】' +
                data.name +
                '\n' +
                '【会员手机号】' +
                data.phone
              : '【企业/团体名称】' +
                data.companyName +
                '\n【联系人姓名】' +
                data.contactName +
                '\n【联系人手机号】' +
                data.contactPhone,
          入会时间: data.joinedTs ? data.joinedTs : '',
          会内职位: data.postName ? data.postName : '',
          部门: data.departmentName ? data.departmentName : '',
          账号状态: data.status === 1 ? '正常' : '已冻结',
          激活状态: data.activatedState === 1 ? '已激活' : '未激活',
          短信发送状态:
            data.activatedState === 1
              ? '--'
              : data.sendStatus === 1
                ? '已发送'
                : '未发送'
        }
        if (data.identityVOList.length > 0) {
          let str = ''
          data.identityVOList.forEach(element => {
            if (element.type === 1) {
              str = str + '【企业】' + element.unit
            } else {
              str = str + '【机构】' + element.unit
            }
            str = str + '【职务】' + element.post
            str = str + '\n'
          })
          new_data['身份信息'] = str
        }
        if (data.memberLabelList && data.memberLabelList.length > 0) {
          let arr = data.memberLabelList.map(item => {
            return item.tagName
          })
          let str = arr.join('、')
          new_data['会员标签'] = str
        }
        if (data.bridgeLabels && data.bridgeLabels.length > 0) {
          let arr = data.bridgeLabels.map(item => {
            return item.name
          })
          let str = arr.join('、')
          new_data['供需标签'] = str
        }
        if (data.tradeBridges && data.tradeBridges.length > 0) {
          let arr = data.tradeBridges.map(item => {
            return item.name
          })
          let str = arr.join('、')
          new_data['行业标签'] = str
        }
        this.selectionDatas.push(new_data)
      }
    },
    successImport(response, file, fileList) {
      this.execelDate = response
    },
    exportExcel(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem(
        'actionId',
        e.currentTarget.getAttribute('actionid')
      )
      exportJson2Excel('商会会员', this.selectionDatas)
    },
    // 认证会员身份
    async authMember() {
      const { selectionWxUserIds = [] } = this
      if (!selectionWxUserIds.length) {
        return this.$message({ message: '请选择认证数据', type: 'warning' })
      }
      try {
        await this.$confirm(
          `
        <div>确定给该用户进行商会认证吗？</div>
        <div style="color:red;">商会认证主要是对该用户的个人信息、企业信息进行认证</div>
        <div style="color:#ccc;">1、认证后，该用户显示“商会认证”标识</div>
        <div style="color:#ccc;">2、认证后，可在【商协会成员-详情】页取消认证</div>
        `,
          '商会认证',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true
          }
        )
        const { state, msg } = await authorizeMemberAuthBatch({
          ckey: this.$store.getters.ckey,
          wxUserIds: selectionWxUserIds
        })
        this.$message({
          message: msg,
          type: state === 1 ? 'success' : 'error'
        })
        state === 1 && this.fetchData()
      } catch (error) {
        /*  */
      }
    },
    openSmsTab() {
      if (this.selectionIds.length === 0) {
        this.$message.error({
          message: '请至少选择一位未激活的会员'
        })
        return
      }
      this.$confirm('确认发送短信?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sendSmsBatch(this.selectionIds)
          .then(res => {
            if (res.state === 1) {
              this.$message({
                type: 'success',
                message: '短信发送成功!'
              })
              this.selectionIds = []
              this.selectionDatas = []
              this.handleSizeChange(this.limit)
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
          .catch(() => {})
      })
    },
    // 导入excel表格打开弹窗
    openVisible() {
      this.visible = true
    },
    closeVisible() {
      this.visible = false
      this.execelDate = {}
    },
    openTransfer(row) {
      this.formObj = row
      this.transferVisible = true
    },
    transferPresident() {
      this.$confirm(
        '确认转换会长将会把平台所有权转换，请谨慎操作',
        '确定转换给该会员？',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      ).then(() => {
        let params = {
          memberId: this.formObj.id,
          ckey: this.$store.getters.ckey,
          phone: this.formObj.phone,
          president: this.formObj.name,
          password: this.formObj.password
        }
        transferPresident(params).then(response => {
          this.$message({
            message: '转换成功',
            type: 'success'
          })
          this.transferVisible = false
        })
      })
    },
    // 选择会员选择标签
    handleLabelChange() {
      /* if (this.memberLabelIds.length === 0) {
        let eleLabel = this.$refs.eleLabel;
        eleLabel.panel.activePath = [];
        eleLabel.panel.loadCount = 0;
        eleLabel.panel.lazyLoad();
      } */
    },
    async getPlatformOptions() {
      const res = await Labels.getLabelGroupLst({
        noPaging: true,
        dataSource: 0,
        freeze: 0
      })
      let memberLabelList = res.data.list || []
      let _memberLabelList = memberLabelList.map(item => {
        let obj = {
          value: item.id,
          label: item.name,
          children: item.memberLabelVOList.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
        return obj
      })
      this.PlatformOptions = _memberLabelList
    },
    async getLabelOptions() {
      const res = await Labels.getLabelGroupLst({
        noPaging: true,
        sourceCkeyList: this.$store.getters.ckey,
        freeze: 0
      })
      let memberLabelList = res.data.list || []
      let _memberLabelList = memberLabelList.map(item => {
        let obj = {
          value: item.id,
          label: item.name,
          children:
            item.memberLabelVOList &&
            item.memberLabelVOList.map(item => {
              return {
                value: item.id,
                label: item.name
              }
            })
        }
        return obj
      })
      this.labelOptions = _memberLabelList
    },
    async getSupplyformOptions() {
      // 供需
      const res = await getAvailableLabelList()
      if (res.state !== 1) return '供需标签请求失败'
      this.SupplyformOptions = res.data
    },
    async getIndustryformOptions() {
      const res = await getTradeLabelList()
      // 行业
      if (res.state !== 1) return this.$message.error('行业标签请求失败')
      this.IndustryformOptions = res.data.map(item => {
        return {
          value: item.id,
          label: item.typeName,
          children: item.subList.map(item1 => {
            return {
              value: item1.id,
              label: item1.typeName
            }
          })
        }
      })
    },
    /* async lazyLoad(node, resolve) {
      let level = node.level;
      let result;
      const res = await Labels.getLabelGroupLst({
        noPaging: true,
        sourceCkeyList: this.$store.getters.ckey,
        freeze: 0
      });
      const memberLabelList = res.data.list;
      switch (level) {
        case 0:
          result = memberLabelList.map(item => {
            return {
              value: item.id,
              label: item.name
            };
          });
          break;
        case 1:
          const index1 = memberLabelList.findIndex(
            item => item.id == node.data.value
          );
          result = memberLabelList[index1].memberLabelVOList.map(item => {
            return {
              value: item.id,
              label: item.name
            };
          });
          break;
        default:
          result = [];
          break;
      }
      resolve(result);
    }, */
    /* 打标签 */
    handleAttachLabel() {
      if (this.multipleSelection.length === 0) {
        console.log(this.multipleSelection)
        return this.$message.error('请至少选择一位会员')
      }
      // 至少判断是否选择了一个已激活的会员
      console.log(this.multipleSelection)
      if (!this.multipleSelection.some(item => item.activatedState === 1)) {
        this.$confirm(
          '不支持给未激活的会员打标签，请至少选择一个已激活的会员。',
          '提示',
          {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'warning'
          }
        )
          .then(() => {})
          .catch(() => {})
        return
      }
      this.attachVisible = true
      this.$refs.eleAttach.labelObj.selectType = '1'
      this.$refs.eleAttach.labelObj = {
        labelGroupName: '',
        labelName: '',
        selectType: '1'
      }
      this.$refs.eleAttach.fetchData(1)
    },
    async handleConfirmAttach(labelIds) {
      if (labelIds.length === 0) {
        return this.$message.error('请至少选择一个标签')
      }
      let wxUserIds = this.multipleSelection.map(item => {
        return item.wxUserId
      })
      const res = await Labels.attachLabel({
        labelIds,
        wxUserIds
      })
      if (res.state !== 1) return
      this.$message.success(res.msg)
      this.attachVisible = false
      this.fetchData(1)
    },

    /** 查看更多标签 */
    handleMoreLabel(rowData) {
      this.moreType = ''
      let moreData = {
        labeList: []
      }
      moreData.labeList = rowData.memberLabelList.map(item => {
        return {
          id: item.tagId,
          name: item.tagName
        }
      })
      this.moreData = moreData
      this.moreVisible = true
    },
    handleMorebridgeLabels(rowData) {
      this.moreType = ''
      let moreData = {
        labeList: []
      }
      moreData.labeList = rowData.bridgeLabels.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })
      this.moreData = moreData
      this.moreVisible = true
    },
    handleMoretradeBridges(rowData) {
      this.moreType = ''
      let moreData = {
        labeList: []
      }
      moreData.labeList = rowData.tradeBridges.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })
      this.moreData = moreData
      this.moreVisible = true
    },
    handleCloseMore() {
      this.moreVisible = false
    },
    handleCloseAttach() {
      this.attachVisible = false
    },

    handleRemoveLabel(rowData) {
      this.moreType = 'delete'
      let moreData = {
        wxUserId: rowData.wxUserId,
        uname: rowData.uname,
        lableList: []
      }
      moreData.lableList = rowData.memberLabelList.map(item => {
        return {
          id: item.tagId,
          name: item.tagName
        }
      })
      this.moreData = moreData
      this.moreVisible = true
    },
    handleRemoveLabelConfirm() {
      this.moreVisible = false
      this.fetchData(1)
    },
    getPathFun() {
      if (this.$route.path === '/member/manager') {
        this.getLabelOptions()
        this.getPlatformOptions()
      }
    },
    showRemoveDialog() {
      this.notActiveMember = 0
      if (this.multipleSelection.every(item => item.activatedState !== -1)) {
        return this.$message.error('请至少选择一位 “未激活” 的会员')
      }
      this.multipleSelection.forEach(item => {
        if (item.activatedState === -1) {
          this.notActiveMember++
        }
      })
      this.removeMemberDialog = true
    },
    async confirmRemoveMember() {
      let params = {
        ids: []
      }
      this.multipleSelection.forEach(item => {
        if (item.activatedState === -1) {
          params.ids.push(item.id)
        }
      })
      params.ids = params.ids.join(',')
      let res = await deleteManyMember(params)
      if (res.state === -1) return this.$message.error(res.msg)
      this.init()
      this.$message.success(res.msg)
      this.removeMemberDialog = false
      this.$refs['tableRef'].clearSelection()
    }
  },
  watch: {
    $route: 'getPathFun'
  }
}
