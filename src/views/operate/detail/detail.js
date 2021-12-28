import { detailList } from '@/api/operate/operate'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDateTime } from '@/utils/date' // 格式化时间戳

export default {
  directives: {
    downLoad: {
      inserted: (el, binding) => {
        el.style.cssText = 'cursor:pointer;'
        el.addEventListener('click', () => {
          console.log(binding.value)
          let link = document.createElement('a')
          let url = binding.value
          fetch(url).then(res => res.blob()).then(blob => {
            link.href = URL.createObjectURL(blob)
            console.log(link.href)
            link.download = '商会成员信息导入模板.xlsx'
            document.body.appendChild(link)
            link.click()
          })
        })
      }
    }
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      operateId: '',
      beginTime: '',
      endTime: '',
      selectionDatas: [],
      exportUrl: ''
    }
  },
  created() {
    if (this.$route.params.operateId) {
      this.operateId = this.$route.params.operateId
      this.beginTime = this.$route.params.beginTime
      this.endTime = this.$route.params.endTime
    }
    this.fetchData()
  },
  methods: {
    // 查询活动列表
    fetchData(e) {
      if (e !== undefined) {
        this.currentpage = 1
      }
      this.listLoading = true
      let params = {
        'id': this.operateId,
        'pageSize': this.limit,
        'page': this.currentpage,
      }
      detailList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
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
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []

      for (let data of datas) {
        let chambers = ''
        if (data.inviteeChamberNames){
          for (let chamber of data.inviteeChamberNames) {
            chambers = chambers + chamber + ';'
          }
        }
        let new_data = {
          '邀请成功时间': formatDateTime(new Date(data.createdTs), 'yyyy-MM-dd hh:mm:ss'),
          '邀请者': data.inviterName ? data.inviterName : '--',
          '邀请者-奖励金额': data.inviterAmount,
          '受邀者': data.inviteeName ? data.inviteeName : '--',
          '受邀者-所属商会': chambers,
          '受邀者-奖励': data.inviteeAmount,
        }
        this.selectionDatas.push(new_data)
      }
    },
    exportExcel() {
      let params = {
        'id': this.operateId,
        'pageSize': 10000,
        'page': 1,
      }
      detailList(params).then(res => {
        this.handleSelectionChange(res.data.list)
        exportJson2Excel('邀请列表', this.selectionDatas)
      })
    },
  }
}
