
export default {

  data() {
    return {
      formConfig: {
        type: 'query',
        inline: true,
      },
      tableConfig: {
        loading: false,
      },
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
      },
      selectionData: []
    }
  },
  methods: {
    queryData(data) {
      this.formObj = { ...data }
      this.fetchData(1)
    },

    resetData(data) {
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          data[key] = ''
        }
      }
      this.formObj = { ...data }
      this.fetchData(1)
    },

    handleSizeChange(val) {
      this.pageData.limit = val
      this.fetchData(1)
    },

    handleCurrentChange(val) {
      this.pageData.currentpage = val
      this.fetchData()
    },

    handleSelectionChange(val) {
      this.selectionData = val
    },
  }
}
