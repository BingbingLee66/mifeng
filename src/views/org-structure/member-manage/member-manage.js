import {
  getDepartmentList,
  getMemberList,
  updateDepartment
} from '@/api/org-structure/org'

export default {
  data() {
    return {
      currentKey: 0,
      departmentTree: [], // 组织架构树
      memberData: [], // 成员数据

      searchValue: '', // 搜索值
      searchResult: [], // 搜索结果
      showFlag: false, // 是否展示搜索结果

      departmentId: 0, // 部门id
      departmentName: '', // 部门名称

      page: 1,
      pageSize: 10,
      searchPage: 20,
      totalPages: 0,
      currentpage: 1,

      showDialog: false, // 控制调整部门弹窗
      departmentOptions: [],
      departmentCas: [],
      memberIds: '', // 会员id
      firstDepartmentId: 0, // 调整前部门id
      finalDepartmentId: 0, // 调整后部门id

      allParentId: ''
    }
  },
  computed: {},
  created() {
    this.getDepartmentList()
  },
  mounted() {
    const box = this.$refs.searchBox
    box.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    /**
     * 获取部门列表
     */
    getDepartmentList() {
      const params = {
        'ckey': this.$store.getters.ckey,
        'parentId': 0
      }
      getDepartmentList(params).then(res => {
        console.log('部门树结构：', res)
        if (res.state === 1) {
          this.departmentOptions = res.data.data[0].departmentRespList
          this.departmentTree = res.data.data
          this.departmentTree[0]['departmentName'] = this.departmentTree[0].name
          this.departmentTree[0]['peopleCount'] = this.departmentTree[0].count
          this.departmentTree[0]['id'] = this.departmentTree[0].chamberId
          this.currentKey = this.departmentTree[0].chamberId
          this.departmentName = this.departmentTree[0].name
          this.getMemberList()
        }
      })
    },

    /*
    * 获取成员管理列表
    * */
    getMemberList() {
      const params = {
        'ckey': this.$store.getters.ckey,
        'departmentId': this.departmentId,
        'memberName': this.searchValue,
        'page': this.page,
        'pageSize': this.pageSize
      }
      getMemberList(params).then(res => {
        console.log('成员列表：', res)
        if (res.state === 1 && JSON.stringify(res.data) !== '{}') {
          this.memberData = res.data.page.list
          this.totalPages = res.data.page.totalRows
          // console.log(res.data)
        }
      })
    },

    /*
    * 分页查询
    * */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.page = 1
      this.pageSize = val
      this.getMemberList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getMemberList()
    },

    /*
    * 部门切换
    * */
    handleNodeClick(data) {
      console.log('当前部门', data)
      this.currentpage = 1
      this.page = 1
      if (this.currentKey === data.id) {
        this.departmentId = 0
      } else {
        this.departmentId = data.id
      }
      this.departmentName = data.departmentName
      this.allParentId = !data.allParentId ? '' : data.parentId !== 0 ? data.allParentId : data.id
      this.memberData = []
      this.getMemberList()
    },

    skipToDetail(row, column, event) {
      console.log(row, column, event)
      this.$router.push({
        name: '会员详情',
        params: {
          'memberDetail': row,
          'querytype': '0'
        }
      })
    },

    /*
    * 搜索成员
    * */
    handleValueChange(e) {
      console.log(e)
      this.page = 1
      if (e.length > 0) {
        this.searchValue = e
        this.showFlag = true
        this.search()
      } else {
        this.showFlag = false
      }
    },

    /*
    * 获取成员列表
    * */
    search() {
      if (this.page === 1) {
        this.searchResult = []
      }
      const params = {
        'ckey': this.$store.getters.ckey,
        'departmentId': 0,
        'memberName': this.searchValue,
        'page': this.page,
        'pageSize': this.searchPage
      }
      getMemberList(params).then(res => {
        console.log('搜索结果：', res)
        if (res.state === 1 && JSON.stringify(res.data) !== '{}') {
          if (this.page === 1) {
            this.searchResult = res.data.page.list
          } else {
            this.searchResult.push(...res.data.page.list)
          }
        } else {
          return
        }
      })
    },
    handleScroll(e) {
      var scrollTop = e.target.scrollTop
      var windowHeight = e.target.clientHeight
      var scrollHeight = e.target.scrollHeight
      if (scrollTop + windowHeight === scrollHeight) {
        console.log('触底了')
        this.page += 1
        this.search()
      }
    },

    goDetail(id) {
      const memberDetail = {}
      memberDetail['id'] = id
      this.$router.push({
        name: '会员详情',
        params: {
          'memberDetail': memberDetail,
          'querytype': '0'
        }
      })
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    /*
    * 调整部门
    * */
    handleOpenAdjustDialog() {
      this.departmentCas = []
      if (this.memberIds.length === 0) return this.$message.error('请先选择部门成员')
      this.showDialog = true
    },
    handleSelectionChange(val) {
      let arr = []
      let index
      for (index in val) {
        arr.push(val[index].id)
      }
      arr = arr.join(',')
      this.memberIds = arr
    },

    handlerDepartmentChange(val) {
      this.finalDepartmentId = [...val].pop()
    },

    save() {
      const params = {
        'finalDepartmentId': this.finalDepartmentId, // 调整后的部门
        'firstDepartmentId': this.departmentId, // 调整前的部门
        'memberIds': this.memberIds
      }
      updateDepartment(params).then(res => {
        console.log('调整部门：', res)
        if (res.state === 1) {
          this.memberData = []
          this.$message.success('操作成功')
          this.showDialog = false
          this.getMemberList()
          this.getDepartmentList()
        }
      })
    },

    /**
     * 跳转邀请成员加入页面
     */
    invite() {
      console.log('部门id', this.departmentId)
      if (this.departmentId === 0) {
        this.$router.push({
          path: '/sys/member/qrcode'
        })
      } else {
        this.$router.push({
          path: '/org-structure/invite-member',
          query: {
            departmentId: this.departmentId
          }
        })
      }
    },

    /*
    *  跳转添加会员页面
    * */
    add() {
      this.$router.push({
        path: '/member/add',
        query: {
          sign: 'org-member',
          allParentId: this.allParentId
        }
      })
    }
  }
}
