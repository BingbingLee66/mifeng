export default {
  data() {
    return {
      showDialog: false, // 控制添加/编辑部门弹窗
      showDelDialog: false, // 控制删除部门弹窗
      name: '', // 部门名称
      tableData: [{
        id: 1,
        name: '广东省江西商会',
        num: 3,
        children: [{
          id: 2,
          name: '理事会',
          num: 10,
          children: [{
            id: 3,
            name: '理事会',
            num: 10
          }, {
            id: 4,
            name: '秘书处',
            num: 9
          }, {
            id: 5,
            name: '委员会',
            num: 6
          }]
        }, {
          id: 6,
          name: '秘书处',
          num: 9
        }, {
          id: 7,
          name: '委员会',
          num: 6
        }]
      }]
    }
  },
  computed: {},
  created() {
  },
  methods: {
    handleDialog(type, row) {
      console.log(type, row)
      this.showDialog = true
    },
    handleDelDialog() {
      this.showDelDialog = true
    },
    save() {
      console.log('保存')
    },
    del() {
      console.log('删除')
    },
    editName(e, row) {
      console.log(e, row)
    }
  }
}
