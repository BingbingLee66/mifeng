export default {
  data() {
    return {
      searchValue: '',
      data: [{
        id: 1,
        label: '广东省江西商会',
        children: [{
          id: 2,
          label: '秘书处'
        }, {
          id: 3,
          label: '理事会'
        }, {
          id: 4,
          label: '委员会',
          children: [{
            id: 5,
            label: '会员发展委员会'
          }, {
            id: 6,
            label: '教育委员会'
          }, {
            id: 7,
            label: '文化宣传委员会'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [{
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }, {
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }, {
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }, {
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }, {
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }, {
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }, {
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }, {
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }, {
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }, {
        name: '小猪',
        position: '会长',
        phone: '13822222222'
      }],
      multipleSelection: [],
      currentpage: 1
    }
  },
  computed: {},
  created() {
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
      this.$router.push({ name: '添加会员' })
    }
  }
}
