import {
  memberMe,
  uploadCompanyLogo,
  add,
  update
} from '@/api/member/manager'

import {
  getDepartmentList
} from '@/api/org-structure/org'
import tree from "element-ui/packages/table/src/store/tree";

export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      } else {
        return callback()
      }
    }
    var checkTel = (rule, value, callback) => {
      if (!/^$|^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(value)) {
        return callback(new Error('电话号码格式不正确'))
      } else {
        return callback()
      }
    }
    return {
      memberId: '',
      formObj: {
        type: 1,
        name: '',
        phone: '',
        companyName: '',
        companyPhone: '',
        companyLogo: '',
        departmentId: ''
      },
      type: 'add',
      rules: {
        companyName: [{
          required: true,
          message: '企业名称不能为空',
          trigger: 'blur'
        }],
        companyLogo: [{
          required: true,
          message: '公司logo必须上传',
          trigger: 'blur'
        }],
        companyPhone: [{
          required: true,
          message: '联系方式不能为空',
          trigger: 'blur'
        }, {
          validator: checkTel,
          tigger: 'change'
        }],
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '手机号码不能为空',
          trigger: 'blur'
        }, {
          validator: checkPhone,
          trigger: 'change'
        }]
      },
      departmentOptions: [],
      departmentCas: []
    }
  },

  created() {
    console.log('allParentId:', this.$route.query.allParentId)
    if (this.$route.query.sign) {
      if (typeof this.$route.query.allParentId === 'number') {
        this.departmentCas.push(this.$route.query.allParentId)
        this.formObj.departmentId = this.$route.query.allParentId
      } else {
        let arr = this.$route.query.allParentId.split(',')
        arr.shift()
        arr = arr.map(i => parseInt(i, 0))
        this.departmentCas = arr
        const did = [...arr].pop()
        this.formObj.departmentId = did
      }
    }
    this.getdepartmentType()
  },

  mounted() {
    if (this.$route.params.memberId) {
      this.memberId = this.$route.params.memberId
      this.type = 'edit'
      this.fetchData()
    }
    if (this.$route.params.querytype) {
      this.querytype = this.$route.params.querytype
      window.localStorage.setItem('detail-type', this.type)
    }
    if (this.querytype === '') {
      this.querytype = window.localStorage.getItem('detail-type')
    }
  },

  methods: {
    /*
    * 获取部门列表数据
    * */
    getdepartmentType() {
      const params = {
        'ckey': this.$store.getters.ckey,
        'parentId': 0
      }
      getDepartmentList(params).then(res => {
        console.log('部门列表：', res.data.data[0].departmentRespList)
        if (res.state === 1) {
          this.departmentOptions = res.data.data[0].departmentRespList
          this.setData(this.departmentOptions)
        }
      })
    },

    /*
    * 递归遍历部门树结构，添加disabled属性
    * */
    setData(treeDatas) {
      for (const i in treeDatas) {
        this.$set(treeDatas[i], 'disabled', false)
        if (treeDatas[i].departmentRespList.length > 0) {
          this.setData(treeDatas[i].departmentRespList)
        }
      }
    },

    /*
    * 递归遍历部门树结构，改变disabled属性
    * */
    changeData(list, treeDatas) {
      // console.log('treeData', treeDatas)
      console.log('list:', list)
      let ids = []
      list.forEach(val => {
        val.forEach((v, i, arr) => {
          if (i !== arr.length - 1) {
            ids.push(v)
          }
        })
      })
      treeDatas.forEach((item, index) => {
        if (ids.includes(item.id)) {
          this.$set(item, 'disabled', false)
        }
        if (item.departmentRespList.length > 0) {
          // this.changeData(list, item.departmentRespList)
        }
      })
      // for (const i in treeDatas) {
      //   console.log(treeDatas[i].id)
      //   if (treeDatas[i].departmentRespList.length > 0) {
      //     console.log('执行了')
      //     this.setData(treeDatas[i].departmentRespList)
      //   }
      // }
      // let cid = []
      // for (const j in ids) {
      //   for (const k in ids[j]) {
      //     cid.push(ids[j][k])
      //   }
      // }
      // for (const i in treeDatas) {
      //   console.log(treeDatas[i].id)
      //   cid = [...new Set(cid)]
      //   console.log('cid', cid)
      //   if (treeDatas[i].departmentRespList.length > 0) {
      //     this.setData(treeDatas[i].departmentRespList)
      //   }
      // }
    },

    /*
    * 选择部门
    * */
    handlerDepartmentChange(list) {
      this.changeData(list, this.departmentOptions)
    },

    // 根据会员id查询会员信息
    fetchData() {
      const params = {
        'memberId': this.memberId
      }
      memberMe(params).then(response => {
        this.formObj = response.data.data
        if (this.formObj.companyPhone === null) {
          this.formObj.companyPhone = ''
        }
      })
    },

    beforeAvatarUpload(file) {
      if (file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },

    uploadLogo(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadCompanyLogo(formData).then(response => {
        this.formObj['companyLogo'] = response.data.filePath
      })
    },

    save() {
      this.$refs['form'].validate((valid) => {
        if (this.formObj.type === 1) {
          this.formObj.phone = this.formObj.companyPhone
        }
        console.log('提交的参数：', this.formObj)
        if (valid) {
          if (this.type === 'add') {
            this.formObj['ckey'] = this.$store.getters.ckey
            add(this.formObj).then(response => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              if (this.$route.query.sign) {
                this.$router.push({
                  name: '成员管理',
                  params: this.departmentId
                })
              } else {
                this.closeTab()
              }
            })
          } else if (this.type === 'edit') {
            update(this.formObj).then(response => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              if (this.$route.query.sign) {
                this.$router.push({
                  name: '成员管理',
                  params: this.departmentId
                })
              } else {
                this.closeTab()
              }
            })
          }
        } else {
          return false
        }
      })
    },

    closeTab() {
      // 退出当前tab, 打开指定tab
      const openPath = window.localStorage.getItem('membereditor')
      const tagsViews = this.$store.state.tagsView.visitedViews
      // let selectView = null
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
    }
  },

  watch: {
    formObj: {
      handler(val) {
        if (val.type === 1) {
          this.$refs['form'].clearValidate(['name'])
          this.$refs['form'].clearValidate(['phone'])
        } else {
          this.$refs['form'].clearValidate(['companyName'])
          this.$refs['form'].clearValidate(['companyLogo'])
          this.$refs['form'].clearValidate(['companyPhone'])
        }
      },
      deep: true
    }
  }

}
