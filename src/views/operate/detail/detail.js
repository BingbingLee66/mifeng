import {
  detailList,
  guideTable
} from '@/api/operate/operate'

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
    exportList() {
      let params = {
        'id': this.operateId,
      }
      guideTable(params).then(res => {
        console.log(res);
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型

        //浏览器兼容，Google和火狐支持a标签的download，IE不支持
        if (window.navigator && window.navigator.msSaveBlob) {
          //IE浏览器、微软浏览器
          /* 经过测试，微软浏览器Microsoft Edge下载文件时必须要重命名文件才可以打开，
            IE可不重命名，以防万一，所以都写上比较好 */
          window.navigator.msSaveBlob(blob, '文件.xlsx');
        } else {
          //其他浏览器
          let link = document.createElement('a'); // 创建a标签
          link.style.display = 'none';
          let objectUrl = URL.createObjectURL(blob);
          link.href = objectUrl;
          link.click();
          URL.revokeObjectURL(objectUrl);
        }
        }).catch(err => {
        this.$message.error(err.message);
      });
    }
  }
}
