import { getActionList, getRoleActions, save } from '@/api/authority/setup'

export default {
  data () {
    return {
      spanArr1: [],
      spanArr2: [],
      spanArr3: [],
      spanArr4: [],
      list: [],
      listLoading: false,
      checkList: [],
      roleId: 0,
      isIndeterminate: false,
      checkAll: false,
      checkAllCount: 0
    }
  },
  computed: {},
  mounted () {
    if (this.$route.params.roleId) {
      this.roleId = this.$route.params.roleId
    }
  },
  created () {
    this.init()
  },
  methods: {
    closeTab () {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem('authority-manager')
      let tagsViews = this.$store.state.tagsView.visitedViews
      let selectView = null
      for (let view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({ path: openPath })
          })
          break
        }
      }
    },
    init () {
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      getActionList().then(response => {
        this.list = response.data.data
        let cList = []
        for (let obj of this.list) {
          if (!!obj.pMenuId) {
            cList.push(obj.pMenuId + '@menu1')
          }
          if (!!obj.cMenuId) {
            cList.push(obj.cMenuId + '@menu2')
          }
          if (!!obj.tabId) {
            cList.push(obj.tabId + '@tab')
          }
          if (!!obj.id) {
            cList.push(obj.id + '@auth')
          }
        }
        for (let cobj of cList) {
          if (this.checkList.indexOf(cobj) === -1) {
            this.checkList.push(cobj)
          }
        }
        this.checkAllCount = this.checkList.length
        this.checkList = []
        this.roleActions()
        this.getSpanArr(this.list)
        this.listLoading = false
      })
    },
    roleActions () {
      let params = {
        'roleId': this.roleId
      }
      getRoleActions(params).then(response => {
        this.checkList = response.data.data
        if (this.checkAllCount === this.checkList.length) {
          this.isIndeterminate = false
          this.checkAll = true
        }
      })
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr1[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 1) {
        const _row = this.spanArr2[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 2) {
        const _row = this.spanArr3[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 3) {
        const _row = this.spanArr4[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    save () {
      let data = {
        'roleId': this.roleId,
        'actions': this.checkList
      }
      save(data).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.closeTab()
      })
    },
    getSpanArr(data) {
      let pos1, pos2, pos3, pos4
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr1.push(1)
          this.spanArr2.push(1)
          this.spanArr3.push(1)
          this.spanArr4.push(1)
          pos1 = 0
          pos2 = 0
          pos3 = 0
          pos4 = 0
          if (!data[i].level1) {
            data[i].level1 = '——'
          }
          if (!data[i].level2) {
            data[i].level2 = '——'
          }
          if (!data[i].level3) {
            data[i].level3 = '——'
          }
          if (!data[i].level4) {
            data[i].level4 = '——'
          }
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].level1) {
            if (data[i].level1 === data[i - 1].level1) {
              this.spanArr1[pos1] += 1
              this.spanArr1.push(0)
            } else {
              this.spanArr1.push(1)
              pos1 = i
            }
          } else {
            data[i].level1 = '——'
            this.spanArr1.push(1)
            pos1 = i
          }
          if (data[i].level2) {
            if (data[i].level2 === data[i - 1].level2) {
              this.spanArr2[pos2] += 1
              this.spanArr2.push(0)
            } else {
              this.spanArr2.push(1)
              pos2 = i
            }
          } else {
            data[i].level2 = '——'
            this.spanArr2.push(1)
            pos2 = i
          }
          if (data[i].level3) {
            if (data[i].level3 === data[i - 1].level3) {
              this.spanArr3[pos3] += 1
              this.spanArr3.push(0)
            } else {
              this.spanArr3.push(1)
              pos3 = i
            }
          } else {
            data[i].level3 = '——'
            this.spanArr3.push(1)
            pos3 = i
          }
          if (data[i].level4) {
            if (data[i].level4 === data[i - 1].level4) {
              this.spanArr4[pos4] += 1
              this.spanArr4.push(0)
            } else {
              this.spanArr4.push(1)
              pos4 = i
            }
          } else {
            data[i].level4 = '——'
            this.spanArr4.push(1)
            pos4 = i
          }
        }
      }
    },
    changeAll (checked) {
      this.checkList = []
      if (checked) { // 全选中
        let cList = []
        for (let obj of this.list) {
          if (!!obj.pMenuId) {
            cList.push(obj.pMenuId + '@menu1')
          }
          if (!!obj.cMenuId) {
            cList.push(obj.cMenuId + '@menu2')
          }
          if (!!obj.tabId) {
            cList.push(obj.tabId + '@tab')
          }
          if (!!obj.id) {
            cList.push(obj.id + '@auth')
          }
        }
        for (let cobj of cList) {
          if (this.checkList.indexOf(cobj) === -1) {
            this.checkList.push(cobj)
          }
        }
        this.isIndeterminate = false
        this.checkAll = true
      } else { // 取消全选中
        this.isIndeterminate = false
        this.checkAll = false
      }
    },
    changeChecked (checked, val, row) {
      if (checked) { // 选中
        if (val.indexOf('menu1') !== -1) { // 1级
          // 跳过
          this.addRelatedAuth(row.pMenuId, 1)
        } else if (val.indexOf('menu2') !== -1) { // 2级
          // 2级要添加1级选中
          this.addAuth(row.pMenuId, 'menu1')
          this.addRelatedAuth(row.cMenuId, 2)
        } else if (val.indexOf('tab') !== -1) { // 3级
          // 3级要添加1、2级选中
          this.addAuth(row.pMenuId, 'menu1')
          this.addAuth(row.cMenuId, 'menu2')
          this.addRelatedAuth(row.tabId, 3)
        } else if (val.indexOf('auth') !== -1) { // 4级
          // 4级要添加1、2、3级选中
          this.addAuth(row.pMenuId, 'menu1')
          this.addAuth(row.cMenuId, 'menu2')
          this.addAuth(row.tabId, 'tab')
        }
      } else { // 取消选中
        if (val.indexOf('menu1') !== -1) { // 1级
          // 1级要取消2、3、4级选中
          this.removeRelatedAuth(row.pMenuId, 1)
        } else if (val.indexOf('menu2') !== -1) { // 2级
          // 2级要取消3、4级选中
          this.removeRelatedAuth(row.cMenuId, 2)
        } else if (val.indexOf('tab') !== -1) { // 3级
          // 3级要取消4级选中
          this.removeRelatedAuth(row.tabId, 3)
        } else if (val.indexOf('auth') !== -1) { // 4级
          // 跳过
        }
      }
      if (this.checkList.length === 0) {
        this.isIndeterminate = false
        this.checkAll = false
      } else {
        this.isIndeterminate = true
        this.checkAll = false
        if (this.checkAllCount === this.checkList.length) {
          this.isIndeterminate = false
          this.checkAll = true
        }
      }
    },
    addRelatedAuth (key, level) {
      if (level === 1) {
        // 1级要添加2、3、4级
        for (let obj of this.list) {
          if (obj.pMenuId === key) {
            this.addAuth(obj.cMenuId, 'menu2')
            this.addAuth(obj.tabId, 'tab')
            this.addAuth(obj.id, 'auth')
          }
        }
      } else if (level === 2) {
        // 2级要添加3、4级
        for (let obj of this.list) {
          if (obj.cMenuId === key) {
            this.addAuth(obj.tabId, 'tab')
            this.addAuth(obj.id, 'auth')
          }
        }
      } else if (level === 3) {
        // 3级要添加4级
        for (let obj of this.list) {
          if (obj.tabId === key) {
            this.addAuth(obj.id, 'auth')
          }
        }
      }
    },
    addAuth (key, subfix) {
      if (!!key && this.checkList.indexOf(key + '@' + subfix) === -1) {
        this.checkList.push(key + '@' + subfix)
      }
    },
    removeRelatedAuth (key, level) {
      if (level === 1) {
        for (let obj of this.list) {
          if (obj.pMenuId === key) {
            this.removeAuth(obj.cMenuId, 'menu2')
            this.removeAuth(obj.tabId, 'tab')
            this.removeAuth(obj.id, 'auth')
          }
        }
      } else if (level === 2) {
        for (let obj of this.list) {
          if (obj.cMenuId === key) {
            this.removeAuth(obj.tabId, 'tab')
            this.removeAuth(obj.id, 'auth')
          }
        }
      } else if (level === 3) {
        for (let obj of this.list) {
          if (obj.tabId === key) {
            this.removeAuth(obj.id, 'auth')
          }
        }
      }
    },
    removeAuth (key, subfix) {
      if (!!key) {
        let index = this.checkList.indexOf(key + '@' + subfix)
        if (index !== -1) {
          this.checkList.splice(index, 1)
        }
      }
    }
  }
}
