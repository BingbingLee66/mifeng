import {
  getGoodsQrcode,
  getList,
  getTopList,
  updateGoodsStatus,
  batchUpdateGoodsStatus,
  del,
  batchDel,
  countTop,
  cancelSetTop,
  updateSetTop,
  setTop
} from '@/api/goods/goods'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      previewImgVisible: false,
      previewUrl: '',
      activeName: '8',
      query: {
        id: '',
        name: '',
        status: '',
        date: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: []
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    this.init()
  },
  methods: {
    // 生成商品小程序二维码
    createCode(e, row) {
      console.log(row.id)
      getGoodsQrcode({ id: row.id }).then(res => {
        if (res.state === 1) {
          let imgUrl = res.data.qrCode
          let alink = document.createElement('a')
          alink.href = imgUrl
          alink.target = '_blank'
          alink.click()
        } else {
          console.log(res)
        }
      })
    },

    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    init() {
      if (this.has('商品列表', '查询')) {
        this.fetchData()
      }
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
        this.limit = 10
        this.currentpage = 1
      }
      this.listLoading = true
      if (this.activeName === '8') {
        let params = {
          'pageSize': this.limit,
          'page': this.currentpage,
          'goodId': this.query.id,
          'goodsName': this.query.name,
          'status': this.query.status
        }
        if (this.query.date) {
          params['startTime'] = this.query.date[0]
          params['endTime'] = this.query.date[1]
        }
        getList(params).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        })
      } else if (this.activeName === '9') {
        let params = {
        }
        getTopList(params).then(response => {
          this.list = response.data.lst
          this.listLoading = false
        })
      }
    },
    handleSelectionChange (value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    },
    handleClick () {
      this.total = 0
      this.list = []
      this.currentpage = 1
      this.limit =10
      this.fetchData()
    },
    updateStatus(e, id, status) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'goodId': id,
        'status': status
      }
      updateGoodsStatus(params).then(response => {
        if (status === 1) {
          this.$message({
            message: '上架成功',
            type: 'success'
          })
        } else if (status === 2) {
          this.$message({
            message: '下架成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    batchUpdateStatus(e, status) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'goodsIds': this.selectionDatas,
        'status': status
      }
      batchUpdateGoodsStatus(params).then(response => {
        if (status === 1) {
          if (response.data.flagStatus) { // 部分成功
            this.$message({
              message: '部分商品上架成功，' + response.data.msg,
              type: 'warning'
            })
          } else {
            this.$message({
              message: '上架成功',
              type: 'success'
            })
          }
        } else if (status === 2) {
          if (response.data.flagStatus) { // 部分成功
            this.$message({
              message: '部分商品下架成功，' + response.data.msg,
              type: 'warning'
            })
          } else {
            this.$message({
              message: '下架成功',
              type: 'success'
            })
          }
        }
        this.fetchData()
      })
    },
    del(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'goodId': row.id
        }
        del(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    batchDel(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'goodsIds': this.selectionDatas
        }
        batchDel(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    addGoods (e) {
      const actionId = e.currentTarget.getAttribute('actionid')
      window.localStorage.setItem('goodsSku', this.$route.path)
      this.$router.push({ name: '发布新商品/编辑商品' })
    },
    edit (e, row) {
      const actionId = e.currentTarget.getAttribute('actionid')
      window.localStorage.setItem('goodsSku', this.$route.path)
      this.$router.push({ name: '发布新商品/编辑商品', params: { 'goodsId': row.id } })
    },
    openPreviewModal (url) {
      this.previewImgVisible = true
      this.previewUrl = url
    },
    setTop (e, row) {
      const actionId = e.currentTarget.getAttribute('actionid')
      countTop().then(response => {
        const count = response.data.count
        if (count >= 5) {
          this.$alert('5个置顶位已有商品，请到置顶商品管理页面调整后再置顶', {
            confirmButtonText: '确定'
          })
        } else {
          window.localStorage.setItem('actionId', actionId)
          this.$prompt('设置置顶排序', '置顶商品', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: row.typeName,
            inputPattern: /^[1-9][0-9]{0,1}$/,
            inputErrorMessage: '只能1-99的数字'
          }).then(({ value }) => {
            let params = {
              'goodId': row.id,
              'topLevel': value
            }
            setTop(params).then(response => {
              this.$message({
                message: '置顶成功',
                type: 'success'
              })
              this.fetchData()
            })
          }).catch((error) => {
            console.log(error)
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
        }
      })
    },
    cancelSetTop (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'goodId': row.id
      }
      cancelSetTop(params).then(response => {
        this.$message({
          message: '取消置顶成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    editSetTop (e, row) {
      const actionId = e.currentTarget.getAttribute('actionid')
      this.$prompt('设置置顶排序', '置顶商品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.typeName,
        inputPattern: /^[1-9][0-9]{0,1}$/,
        inputErrorMessage: '只能1-99的数字'
      }).then(({ value }) => {
        let params = {
          'goodId': row.id,
          'topLevel': value
        }
        updateSetTop(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  }
}
