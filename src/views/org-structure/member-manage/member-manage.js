import {
  getDepartmentList,
  getMemberList
} from '@/api/org-structure/org'

export default {
  data() {
    return {
      departmentTree: [],
      currentKey: 0,
      searchValue: '',
      departmentId: 0,
      departmentName: '',
      page: 1,
      pageSize: 5,
      totalPages: 0,
      currentpage: 1,
      memberData: [],
      searchResult: [],
      multipleSelection: [],
      showFlag: false
    }
  },
  computed: {},
  created() {
    this.getDepartmentList()
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
      if (this.currentKey === data.id) {
        this.departmentId = 0
      } else {
        this.departmentId = data.id
      }
      this.memberData = []
      this.departmentName = data.departmentName
      this.getMemberList()
    },

    /*
    * 搜索成员
    * */
    handleValueChange(e) {
      console.log(e)
      if (e.length > 0) {
        this.showFlag = true
        const params = {
          'ckey': this.$store.getters.ckey,
          'departmentId': 0,
          'memberName': e,
          'page': this.page,
          'pageSize': this.pageSize
        }
        getMemberList(params).then(res => {
          console.log('搜索结果：', res)
          if (res.state === 1 && JSON.stringify(res.data) !== '{}') {
            this.searchResult = res.data.page.list
          } else {
            this.searchResult = []
          }
        })
      } else {
        this.showFlag = false
      }
    },

    goDetail(id) {
      this.$router.push({
        name: '会员详情',
        params: {
          'memberDetail': id,
          'querytype': '0'
        }
      })
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /**
     * 跳转邀请成员加入页面
     */
    invite() {
      this.$router.push({name: '邀请成员'})
    },

    /*
    *  跳转添加会员页面
    * */
    add() {
      this.$router.push({name: '添加会员'})
    }
  }
}
