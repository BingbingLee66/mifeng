<template>
  <div>
    <ysh-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      :page-data="pageData"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <template v-slot:operate="row">
        <span class="text-blue cur ml-10" @click="handleEvent('edit', row.data)">编辑</span>
        <span
          v-if="row.data.status === 0"
          class="text-blue cur ml-10"
          @click="handleEvent('status', row.data)"
        >显示</span>
        <span
          v-if="row.data.status === 1"
          class="text-yellow cur ml-10"
          @click="handleEvent('status', row.data)"
        >隐藏</span>
      </template>
    </ysh-table>

    <!-- 编辑轮播推荐 -->
    <carousel-recommend ref="dialogRef1" @refresh="fetchData" />
    <!-- 编辑内容推荐 -->
    <content-recommend ref="dialogRef2" @refresh="fetchData" />
    <!-- 编辑内容推荐卡片 -->
    <card-recommend ref="dialogRef3" @refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import CarouselRecommend from '../Dialog/CarouselRecommend'
import ContentRecommend from '../Dialog/ContentRecommend'
import CardRecommend from '../Dialog/CardRecommend'
import _data from './data'
import Home from '@/api/home-config/Home'

export default {
  components: {
    CarouselRecommend,
    ContentRecommend,
    CardRecommend
  },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  data() {
    return {
      tableColumn: _data.tableColumn,
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 获取推荐位列表数据 */
    async fetchData(page) {
      this.tableConfig.loading = true
      const { currentpage, limit } = this.pageData
      const res = await Home.getRecommendList({
        platform: '2',
        pageNum: page === 1 ? 1 : currentpage,
        pageSize: limit
      })
      if (res.state !== 1) return
      const resData = res.data
      console.log(resData, 'res')
      this.tableData = resData.list
      this.pageData.total = resData.totalRows
      this.tableConfig.loading = false
    },

    /** 推荐位|编辑|隐藏|显示 */
    handleEvent(event, data) {
      switch (event) {
        case 'edit':
          this.handleDialog('edit', data)
          break
        case 'status':
          this.handleStatus(data)
          break
      }
    },

    /** 显示/隐藏 */
    async handleStatus(data) {
      const res = await Home.changeRecommendStatus({
        id: data.id,
        status: data.status === 1 ? 0 : 1
      })
      if (res.state === 1) {
        this.$message.success(res.msg)
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    },

    /** 编辑推荐位 */
    handleDialog(event, data) {
      switch (data.position) {
        case 1:
          this.$refs.dialogRef1.$emit(event, data)
          break
        case 2:
          this.$refs.dialogRef2.$emit(event, data)
          break
        case 3:
          this.$refs.dialogRef3.$emit(event, data)
          break
      }
    }
  }
}
</script>
