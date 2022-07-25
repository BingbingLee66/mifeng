import { downloadFile } from '@/utils/index'
import { getListInfo, delOrganization } from '@/api/chamber/directoryOrganizations'
import { getAreaTree } from '@/api/area'
import { inSource, inSourceObj, inState,inStateObj,dataSource, dataSourceObj,organizationState } from './state.js'
import Weight from './components/Weight/index'
import UploadList from './components/UploadList'
import AddInfo from './components/AddInfo.vue'
import OrganizationsDetail from './components/OrganizationsDetail'
import ClaimIn from './components/ClaimIn'

export default {
  components: {
    Weight,
    UploadList,
    AddInfo,
    OrganizationsDetail,
    ClaimIn
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
      regionData: [], // 地区选项
      query: {
        name: '',
        auditStatus: '',
        settledSource: '',
        dataSource: '',
        cities: '',
        status: '',
        pageNum: 1,
        pageSize: 10,
      },
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
        tabName, actionName
      })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({
        tabName, actionName
      })
    },
    init() {
      this.query.pageNum = 1
      this.fetchData()
    },
    fetchData() {
      this.loading = true
      const { cities } = this.query
      const params = {
        ...this.query,
        cities: cities.length > 0 ? cities[1] : ''
      }
      getListInfo(params).then(response => {
        this.list = response.data.list
        this.total = response.data.totalRows
      }).finally(() => {
        this.loading = false
      })
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
        url: 'https://ysh-cdn.kaidicloud.com/ysh-prod/user/81b23a7afd8b478c965a5e45492ab7d0.xlsx',
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
      if (!this.multipleSelection.length) return this.$message({ message: '请选择删除的数据', type: 'warning' })
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
    }
  }
}
