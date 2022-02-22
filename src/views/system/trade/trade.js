import { getTradeList, addTrade, updateTrade, delTrade } from '@/api/system/trade'

export default {
  data () {
    return {
      firstlist: [],
      secondlist: [],
      flistLoading: false,
      slistLoading: false,
      parentId: 0,
      sTableTitle: '二级行业分类'
    }
  },
  computed: {},
  created () {
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init () {
      this.firstlist = []
      this.secondlist = []
      this.parentId = 0
      this.sTableTitle = '二级行业分类'
      this.firstTrade()
    },
    firstTrade () {
      this.flistLoading = true
      let params = {
        'rank': 0,
        'parentId': 0
      }
      getTradeList(params).then(response => {
        this.firstlist = response.data.data
        this.flistLoading = false
      })
    },
    rowClick (row, event, column) {
      this.parentId = row.id
      this.sTableTitle = '二级行业分类---' + row.typeName
      this.secondTrade()
    },
    secondTrade () {
      this.slistLoading = true
      let params = {
        'rank': 1,
        'parentId': this.parentId
      }
      getTradeList(params).then(response => {
        this.secondlist = response.data.data
        this.slistLoading = false
      })
    },
    setCurrent(row) {
      this.$refs.myTable.setCurrentRow(row);
    },
    updateTrade (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$prompt('请输入行业分类名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.typeName,
        inputPattern: /^\S{1,15}$/,
        inputErrorMessage: '内容长度为1-15个字'
      }).then(({ value }) => {
        let data = {
          'id': row.id,
          'typeName': value
        }
        updateTrade(data).then(response => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          if(row.parentId!==0){
            this.firstlist.find(item=>{
              if(item.parentId===row.parentId){
                this.setCurrent(item)
              }
            })
            this.secondTrade ()
          }else{
            this.firstTrade()
          }
        
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    delTrade (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('', '确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'id': row.id
        }
        delTrade(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          if(row.parentId!==0){
            this.firstlist.find(item=>{
              if(item.parentId===row.parentId){
                this.setCurrent(item)
              }
            })
            this.secondTrade ()
          }else{
            this.init()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    addFirstTrade (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$prompt('请输入行业分类名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S{1,15}$/,
        inputErrorMessage: '内容长度为1-15个字'
      }).then(({ value }) => {
        let data = {
          'parentId': 0,
          'rank': 0,
          'typeName': value
        }
        addTrade(data).then(response => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.firstTrade()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    addSecondTrade (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$prompt('请输入行业分类名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S{1,15}$/,
        inputErrorMessage: '内容长度为1-15个字'
      }).then(({ value }) => {
        let data = {
          'parentId': this.parentId,
          'rank': 1,
          'typeName': value
        }
        addTrade(data).then(response => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.secondTrade()
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
