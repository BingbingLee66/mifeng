import { getList, del, save, checkUpperLimit, upload } from '@/api/content/bannerImg'

export default {
  components: {
  },
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!/(^[1-9]$|^[1][0]$)/.test(value)) {
        return callback(new Error('必须是1-10的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var checkId = (rule, value, callback) => {
      if (!/^$|^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      list: [],
      listLoading: false,
      ckey: this.$store.getters.ckey === null ? '' : this.$store.getters.ckey,
      formObj: {
        title: '',
        articleId: '',
        level: '',
        img: ''
      },
      visible: false,
      rules: {
        articleId: [
          { validator: checkId, trigger: 'change' }
        ],
        level: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'change' }
        ],
        img: [
          { required: true, message: '图片必须上传', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  computed: {
  },
  created() {
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init() {
      this.fetchData()
    },
    beforeAvatarUpload (file) {
      if (file.type !== 'image/jpeg' &&
            file.type !== 'image/jpg' &&
            file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
    },
    upload (content) {
      let formData = new FormData()
      formData.append('file', content.file)
      upload(formData).then(response => {
        this.formObj.img = response.data.filePath
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'ckey': this.ckey,
        'type': 1 // 主页 banner类型
      }
      getList(params).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    openVisible (row) {
      this.formObj = row
    },
    add (e) {
      let actionid = e.currentTarget.getAttribute('actionid')
      let params = {
        'ckey': this.ckey,
        'type': 1
      }
      checkUpperLimit(params).then(response => {
        const count = response.data.count
        if (count >= 10) {
          this.$alert('轮播图数量已达上限10张', {
            confirmButtonText: '确定'
          })
        } else {
          window.localStorage.setItem('actionId', actionid)
          this.formObj = {
            title: '',
            articleId: '',
            level: '',
            img: ''
          }
          this.visible = true
        }
      })
    },
    edit (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        id: row.id,
        title: row.title,
        articleId: row.articleId,
        level: row.level,
        type: row.type,
        img: row.img
      }
      if (!this.formObj.articleId) {
        this.formObj.articleId = ''
      }
      this.visible = true
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!!this.formObj.id) {
            save(this.formObj).then(response => {
                if (response.state === 1) {
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.fetchData()
                  this.visible = false
                } else {
                  this.$alert(response.msg, '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.visible = false
                    }
                  })
                }
              })
          } else {
            let params = {
              'ckey': this.ckey,
              'type': 1
            }
            checkUpperLimit(params).then(response => {
              const count = response.data.count
              if (count >= 10) {
                this.$alert('轮播图数量已达上限10张', {
                  confirmButtonText: '确定'
                })
              } else {
                this.formObj['ckey'] = this.ckey
                this.formObj['type'] = 1
                save(this.formObj).then(response => {
                  if (response.state === 1) {
                    this.$message({
                      message: '操作成功',
                      type: 'success'
                    })
                    this.fetchData()
                    this.visible = false
                  } else {
                    this.$alert(response.msg, '提示', {
                      confirmButtonText: '确定',
                      callback: action => {
                        this.visible = false
                      }
                    })
                  }
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    del (e, row) {
      const actionId = e.currentTarget.getAttribute('actionid')
      this.$confirm('', '确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        window.localStorage.setItem('actionId', actionId)
        let params = {
          'id': row.id
        }
        del(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.init()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    }
  }
}
