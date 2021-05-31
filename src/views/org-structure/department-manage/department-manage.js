import {
  getDepartmentList,
  saveDepartment,
  delDepartment
} from '@/api/org-structure/org'

export default {
  data() {
    return {
      showDialog: false, // 控制添加/编辑部门弹窗
      showDelDialog: false, // 控制删除部门弹窗
      departmentName: '', // 部门名称
      departmentId: '', // 部门id
      departmentParentName: '', // 上级部门名称
      departmentParentId: 0, // 上级部门id
      departmentData: [],
      type: 'add' // 判断是添加部门还是编辑部门
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
        console.log('部门列表：', res)
        if (res.state === 1) {
          this.departmentData = res.data.data
        }
      })
    },

    /**
     *添加/编辑部门
     */
    handleDialog(type, row) {
      console.log(row)
      this.type = type
      if (type === 'edit') {
        this.departmentName = row.departmentName
        this.departmentId = row.id
      } else {
        this.departmentName = ''
        this.departmentId = ''
      }
      this.departmentParentName = row.departmentName ? row.departmentName : row.name
      this.departmentParentId = row.id
      this.showDialog = true
    },

    save() {
      // 非空验证
      if (this.departmentName === null || this.departmentName.trim() === '') {
        this.$message.error('请输入部门名称')
        return
      }
      const params = {
        'ckey': this.$store.getters.ckey,
        'id': this.departmentId,
        'departmentName': this.departmentName,
        'parentId': this.departmentParentId
      }
      saveDepartment(params).then(res => {
        console.log('添加部门', res)
        if (res.state === 1) {
          this.$message.success(res.msg)
          this.showDialog = false
          this.getDepartmentList()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err);
      })
    },

    /**
     * 删除部门
     */
    handleDelDialog(row) {
      this.departmentId = row.id
      this.showDelDialog = true
    },

    del() {
      const params = {
        'id': this.departmentId
      }
      delDepartment(params).then(res => {
        console.log('删除部门', res)
        if (res.state === 1) {
          this.$message.success(res.msg)
          this.showDelDialog = false
          this.getDepartmentList()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
