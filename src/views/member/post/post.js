import { getList, save, updateStatus, del,postNameExistValid } from '@/api/member/post'
// import { mapGetters } from 'vuex'

export default {
  data() {
    var checkFee = (rule, value, callback) => {
      if (!/^[0]$|^(([1-9]\d*)|[0]\.\d{1,2}|([1-9]\d*)\.\d{1,2})$/.test(value)) {
        return callback(new Error('可以为0或最多两位小数的正数'))
      } else {
        return callback()
      }
    }
    var checkNumber = (rule, value, callback) => {
      if (!/^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      visible: false,
      formObj: {
        id: 0,
        postName: '',
        memberFee: 0,
        level: ''
      },
      list: [],
      listLoading: false,
      type: 'add',
      rules: {
        // postName: [
        //   { required: true, message: '排序不能为空', trigger: 'blur' },
        //   { validator: postNameVaild, trigger: 'blur' }
        // ],
        memberFee: [
          { validator: checkFee, trigger: 'change' }
        ],
        level: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    memberFeeCp() {
      return function(memberFee) {
        let result = '￥' + memberFee
        if (memberFee >= 100000000) {
          result = '￥' + (memberFee / 100000000) + '亿'
        } else if (memberFee >= 10000) {
          result = '￥' + (memberFee / 10000) + '万'
        }
        return result
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // input标签失焦点 校验职位是否重复
    postNameVaild(rule, value, callback) {
      if (this.formObj.id) {
        callback()
      }
      // 如果没有输入任何东西，不调用接口
      if (value === '') {
        callback(new Error('职位名称不能为空'))
        return false
      }
      if (!value) {
        callback(new Error())
        return false
      }
      // 职位名称查重
      let params = {
        ckey: this.$store.getters.ckey,
        postName: this.formObj.postName
      }
      postNameExistValid(params).then(response => {
        if (response.state === 1) {
          callback()
        } else {
          return callback(new Error(response.msg))
        }
      })
    },
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let params = {
        ckey: this.$store.getters.ckey
      }
      getList(params).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    add(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        'ckey': this.$store.getters.ckey,
        'postName': '',
        'memberFee': 0,
        'level': ''
      }
      this.type = 'add'
      this.visible = true
    },
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.type = 'edit'
      this.formObj = {
        'id': row.id,
        'ckey': row.ckey,
        'postName': row.postName,
        'memberFee': row.memberFee,
        'level': row.level
      }
      this.visible = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save(this.formObj).then(response => {
            if(response.state===1){
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
            }else{
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
           
            this.visible = false
          })
        } else {
          return false
        }
      })
    },
    del(row,len) {
      console.log("数据："+row+"。。。长度："+len);
      // return
      if(len <= 1){
        this.$alert('无法删除，请至少保留一个职位', '温馨提示', {
          confirmButtonText: '我知道了'
        });
        return;
      }

      this.$confirm( '确定删除'+row.postName+'职位吗？','删除职位', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'id': row.id
        }
        del(params).then(res => {
          if(res.state == 0){
            this.$confirm( res.msg,'删除职位', {
              confirmButtonText: '去替换',
              cancelButtonText: '取消删除'
            }).then(() => {
              this.$router.push({
                name:'商/协会成员',
                query:{memberPostType: row.id}
              })
            })
          }else if(res.state == 1){
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.init()
          }
        })
      })
    },
    updateStatus(row) {
      let params = {
        'id': row.id,
        'action': row.status === 0 ? 'active' : 'notactive'
      }
      updateStatus(params).then(response => {
        if (row.status === 0) {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    }
  }
}
