
export default {

  props: {
    fetchFunc: {
      type: Function,
    }
  },

  data() {
    return {
      loading: false, // 是否正在加载
      total: 0, // 总记录数
      currentPage: 1, // 当前页数
      limit: 10, // 每一页的条数
      pageSizes: [10, 20, 50, 100, 500],
    }
  },
  computed: {
    page() {
      return {
        limit: this.limit,
        total: this.total,
        currentPage: this.currentPage,
      }
    }
  },
  methods: {
    /**
     * 获取表格数据
     * @param reset 是否重置
     */
    fetchData(reset) {
      if (reset) {
        this.currentPage = 1
      }
      // 获取表格数据需要重写
    },

    /**
     * 处理每页数量更新
     * @param  {Number} size 每页数量
     */
    handleSizeChange(size) {
      this.limit = size
      this.fetchFunc ? this.fetchFunc(true) : this.fetchData(true)
    },

    /**
     * 处理页码更新
     * @param  {Number} page 页码
     */
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchFunc ? this.fetchFunc() : this.fetchData()
    }
  }
}
