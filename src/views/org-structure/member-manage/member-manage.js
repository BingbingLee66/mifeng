import {
  getDepartmentList,
  getMemberList,
  updateDepartment
} from '@/api/org-structure/org'

export default {
  data() {
    return {
      departmentTree: [], // 组织架构树
      memberData: [], // 成员数据

      searchValue: '', // 搜索值
      searchResult: [], // 搜索结果
      showFlag: false, // 是否展示搜索结果
      showMore: false,
      totalSearch: 0,
      departmentId: 0, // 部门id
      departmentName: '', // 部门名称

      page: 1,
      pageSize: 10,
      searchPage: 20,
      totalPages: 0,
      currentpage: 1,

      showDialog: false, // 控制调整部门弹窗
      departmentOptions: [],
      departmentCas: null,
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
        ckey: this.$store.getters.ckey,
        parentId: 0
      }
      getDepartmentList(params).then(res => {
        let newArry = []
        // 深拷贝数组
        newArry = JSON.parse(JSON.stringify(res.data.data))
        if (res.state === 1) {
          this.departmentOptions = newArry
          this.departmentTree = newArry
          this.departmentTree[0]['departmentName'] = this.departmentTree[0].name
          this.departmentTree[0]['peopleCount'] = this.departmentTree[0].count
          this.departmentTree[0]['id'] = -1
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
        ckey: this.$store.getters.ckey,
        departmentId: this.departmentId,
        memberName: this.searchValue,
        page: this.page,
        pageSize: this.pageSize
      }
      getMemberList(params).then(res => {
        if (res.state === 1 && JSON.stringify(res.data) !== '{}') {
          console.log(res, 'wuhuqifei')
          this.memberData = res.data.page.list
          this.totalPages = res.data.page.totalRows
        } else {
          this.totalPages = 0
        }
      })
    },

    /*
    * 获取成员管理列表
    * */
    getMemberLists() {
      const params = {
        ckey: this.$store.getters.ckey,
        departmentId: this.departmentId,
        memberName: '',
        page: this.page,
        pageSize: this.pageSize
      }
      getMemberList(params).then(res => {
        if (res.state === 1 && JSON.stringify(res.data) !== '{}') {
          this.memberData = res.data.page.list
          this.totalPages = res.data.page.totalRows
        }
      })
    },

    /*
    * 分页查询
    * */
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getMemberLists()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getMemberLists()
    },

    /*
    * 部门切换
    * */
    handleNodeClick(data) {
      this.currentpage = 1
      this.page = 1
      if (data.id === -1) {
        this.departmentId = 0
      } else {
        this.departmentId = data.id
      }
      this.departmentName = data.departmentName
      this.allParentId = !data.allParentId ? '' : data.parentId !== 0 ? data.allParentId : data.id
      this.memberData = []
      this.getMemberList()
    },
    skipToDetail(row) {
      this.$router.push({
        name: '会员详情',
        params: {
          memberDetail: row,
          querytype: '0'
        }
      })
    },

    /*
    * 搜索成员
    * */
    handleValueChange(e) {
      this.page = 1
      if (e.length > 0) {
        this.searchValue = e
        this.search()
        this.showFlag = true
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
        ckey: this.$store.getters.ckey,
        departmentId: 0,
        memberName: this.searchValue,
        page: this.page,
        pageSize: this.searchPage
      }
      getMemberList(params).then(res => {
        if (res.state === 1 && JSON.stringify(res.data) !== '{}') {
          console.log(res, 66666)
          const listData = res.data.page
          this.totalSearch = listData.totalPages || 0
          if (this.totalSearch === this.page) {
            this.showMore = false
          } else {
            this.showMore = true
          }
          if (this.page === 1) {
            this.searchResult = listData.list
          } else {
            this.searchResult.push(...listData.list)
          }
        } else {
          return
        }
      })
    },
    loadMore() {
      this.page += 1
      if (this.totalSearch === this.page) {
        this.showMore = false
      } else {
        this.showMore = true
      }
      this.search()
    },
    /* handleScroll(e) {
      var scrollTop = e.target.scrollTop
      var windowHeight = e.target.clientHeight
      var scrollHeight = e.target.scrollHeight
      if (scrollTop + windowHeight === scrollHeight) {
        this.page += 1
        this.search()
      }
    }, */
    goDetail(id) {
      const memberDetail = {}
      memberDetail['id'] = id
      this.$router.push({
        name: '会员详情',
        params: {
          memberDetail,
          querytype: '0'
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
      if (this.memberIds.length === 0) return this.$message.error('请先选择部门成员')
      if (this.departmentId === 0) {
        this.departmentCas = -1
      } else {
        this.departmentCas = this.departmentId
      }
      this.showDialog = true
    },

    /*
    * 选择成员
    * */
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
      if (val === -1 || val === null) {
        this.finalDepartmentId = 0
      } else {
        this.finalDepartmentId = val + ''
      }
    },

    save() {
      // if(this.departmentId)
      const params = {
        finalDepartmentId: this.finalDepartmentId, // 调整后的部门
        firstDepartmentId: this.departmentId, // 调整前的部门
        memberIds: this.memberIds
      }
      updateDepartment(params).then(res => {
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
