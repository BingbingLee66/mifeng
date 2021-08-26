import { getList, del, save, checkUpperLimit, upload, editlevel } from '@/api/content/bannerImg'

export default {
  components: {},
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!/^([0-9]{0,3})$/.test(value)) {
        return callback(new Error('必须是0-999的整数'))
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
    var checkName = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback(new Error('轮播图标题不能为空'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      list: [],
      listLoading: false,
      ckey: this.$store.getters.ckey === null ? '' : this.$store.getters.ckey,
      formObj: {
        type: null,
        title: '',
        articleId: '',
        level: '',
        img: ''
      },
      visible: false,
      addDialogTitle: '',
      rules: {
        articleId: [
          { required: true, message: 'ID不能为空', trigger: 'blur' },
          { validator: checkId, trigger: 'blur' }
        ],
        title: [
          { required: true, message: '轮播图标题不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        level: [
          { required: true, message: '权重不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        img: [
          { required: true, message: '图片必须上传', trigger: 'blur' }
        ]
      },
      rules2: {
        level: [
          { required: true, message: '权重不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      showLevelDialog: false,
      levelForm: {
        level: null,
        id: null
      }
    }
  },
  mounted() {
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init() {
      this.fetchData()
    },
    beforeAvatarUpload(file) {
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
    upload(content) {
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
    openVisible(row) {
      this.formObj = row
    },
    add(e, num) {
      let actionid = e.currentTarget.getAttribute('actionid')
      this.addDialogTitle = '添加轮播图'
      let params = {
        'ckey': this.ckey
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
            img: '',
            type: null
          }
          this.visible = true
        }
      })
    },
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.addDialogTitle = '编辑轮播图'
      this.formObj = {
        id: row.id,
        title: row.title,
        articleId: row.articleId,
        level: row.level,
        type: row.type === 0 ? null : row.type,
        img: row.img
      }
      if (!this.formObj.articleId) {
        this.formObj.articleId = ''
      }
      this.visible = true
    },
    save() {
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (that.formObj.type === 1) {
            if (that.formObj.title.trim().length > 60) return this.$message.error('文章标题请控制在60字内')
          } else if (that.formObj.type === 2) {
            if (that.formObj.title.trim().length > 30) return this.$message.error('商品标题请控制在30字内')
          }
          // 编辑
          if (this.formObj.id) {
            this.formObj['ckey'] = this.ckey
            if (this.formObj.type === null) {
              this.formObj.type = 0
            }
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
            // 添加
            let params = {
              'ckey': this.ckey
            }
            checkUpperLimit(params).then(response => {
              const count = response.data.count
              if (count >= 10) {
                this.$alert('轮播图数量已达上限10张', {
                  confirmButtonText: '确定'
                })
                return
              } else {
                this.formObj['ckey'] = this.ckey
                if (this.formObj.type === null) {
                  this.formObj.type = 0
                }
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
    del(e, row) {
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
    },

    handleClear(e) {
      if (e === undefined) {
        this.formObj.type = null
        this.formObj.articleId = ''
        this.formObj.title = ''
      }
    },

    // 修改权重
    showLevel(row) {
      this.levelForm.level = row.level
      this.levelForm.id = row.id
      this.showLevelDialog = true
    },
    submitLevel(levelForm) {
      this.$refs[levelForm].validate((valid) => {
        if (valid) {
          this.levelForm.level = parseInt(this.levelForm.level)
          editlevel(this.levelForm).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
              this.showLevelDialog = false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
