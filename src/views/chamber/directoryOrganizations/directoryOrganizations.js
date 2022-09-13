import { downloadFile } from '@/utils/index'
import {
  getListInfo,
  delOrganization
} from '@/api/chamber/directoryOrganizations'
import { getAreaTree } from '@/api/area'
import {
  inSource,
  inSourceObj,
  inState,
  inStateObj,
  dataSource,
  dataSourceObj,
  organizationState,
  codestatusOptions
} from './state.js'
import Weight from './components/Weight/index'
import { batchUpdateOrganization } from '@/api/chamber/directoryOrganizations'
import UploadList from './components/UploadList'
import AddInfo from './components/AddInfo.vue'
import OrganizationsDetail from './components/OrganizationsDetail'
import ClaimIn from './components/ClaimIn'
import levelDialog from '@/components/levelDialog'
export default {
  components: {
    Weight,
    UploadList,
    AddInfo,
    OrganizationsDetail,
    ClaimIn,
    levelDialog
  },
  data() {
    return {
      loading: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      // 入驻来源
      inSource,
      inSourceObj,
      // 入驻状态
      inState,
      inStateObj,
      // 数据来源
      dataSource,
      dataSourceObj,
      // 组织状态
      organizationState,
      codestatusOptions,
      regionData: [], // 地区选项
      query: {
        name: '',
        auditStatus: '',
        settledSource: '',
        dataSource: '',
        cities: '',
        status: '',
        wight: '',
        codestatus: '-1',
        pageNum: 1,
        pageSize: 10
      },
      // 展示权重
      levelVisible: true,
      multipleSelection: []
    }
  },
  created() {
    this.fetchData()
    this.getAreaList()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({
        tabName,
        actionName
      })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({
        tabName,
        actionName
      })
    },
    init() {
      this.query.pageNum = 1
      this.fetchData()
    },
    async fetchData() {
      this.loading = true
      const { cities } = this.query
      const params = {
        ...this.query,
        cities: cities.length > 0 ? cities[1] : ''
      }
      try {
        let res = await getListInfo(params)
        this.list = res.data.list
        this.total = res.data.totalRows
        console.log(res)
      } catch (error) {
        this.list = []
      }
      this.loading = false
    },
    // 获取地区信息
    async getAreaList() {
      const { data } = await getAreaTree({ level: 2 })
      if (data) {
        data.forEach(p => {
          p.children.forEach(c => (c.children = undefined))
        })
        this.regionData = data
      }
    },
    handleSizeChange(val) {
      this.query.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.query.pageNum = val
      this.fetchData()
    },
    // 添加社会组织
    addOrganization() {
      this.$refs.addInfo.init()
    },
    // 详情
    detail(data) {
      this.$refs.organDetail.init(data)
    },
    // 认领入驻
    toClaim() {
      if (this.multipleSelection.length === 0) {
        this.$message.info('请选择列表中的一个社会组织')
      } else if (this.multipleSelection.length > 1) {
        this.$message.info('只能选择列表中的一个社会组织')
      } else {
        this.$refs.claimIn.init(this.multipleSelection[0])
      }
    },
    updateLevel(data) {
      this.$refs.weight.init(data)
    },
    checkSelectable(row) {
      return row.auditStatus !== 1
    },
    // 下载模板
    downloadExcel() {
      downloadFile({
        url:
          'https://ysh-cdn.kaidicloud.com/ysh-prod/user/f672877aaf30452aba69fd168f6654ff.xlsx',
        title: '社会组织名录导入模板.xlsx'
      })
    },
    upload() {
      this.$refs.uploadList.init()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除提示
    delConfirm() {
      if (!this.multipleSelection.length) {
        return this.$message({ message: '请选择删除的数据', type: 'warning' })
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delInfo()
      })
    },
    delInfo() {
      let ids = this.multipleSelection.map(item => item.id)
      delOrganization({
        ids
      }).then(res => {
        const { state, msg } = res
        if (state === 1) {
          this.$message.success('删除成功')
          this.init()
        } else {
          this.$message.error(msg)
        }
      })
    },
    setWeights() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('没有选择记录无法操作。')
      }
      this.$refs.levelDialog.show()
    },
    async subConfirm(val) {
      console.log(val, 'asd')
      let socialId = []
      this.multipleSelection.forEach(item => {
        socialId.push(item.id)
      })
      let weight = val.level
      let params = {
        weight,
        ids: socialId
      }

      const res = await batchUpdateOrganization(params)
      if (res.state !== 1) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.init()
      console.log(params)
      console.log(res)
    }
  }
}
