<template>
  <div>
    <ysh-table :table-config="tableConfig" :table-column="tableColumn" :table-data="tableData">
      <template v-slot:operate="row">
        <span class="text-blue cur ml-10" @click="handleEvent('edit', row.data)">编辑</span>
        <span class="text-blue cur ml-10" @click="handleEvent('show', row.data)">显示</span>
        <span class="text-yellow cur ml-10" @click="handleEvent('hide', row.data)">隐藏</span>
      </template>
    </ysh-table>
    <!-- 编辑轮播推荐 -->
    <carousel-recommend ref="dialogRef1" @Refresh="fetchData" />
    <!-- 编辑内容推荐 -->
    <content-recommend ref="dialogRef2" @Refresh="fetchData" />
    <!-- 编辑内容推荐卡片 -->
    <card-recommend ref="dialogRef3" @Refresh="fetchData" />
  </div>
</template>

<script>

import TableMixins from '@/mixins/yshTable'
import Kingkong from '@/api/home-config/KingKong'
import CarouselRecommend from '../Dialog/CarouselRecommend'
import ContentRecommend from '../Dialog/ContentRecommend'
import CardRecommend from '../Dialog/CardRecommend'
import _data from './data'

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
      tableData: [
        {
          id: 1,
          name: '轮播推荐',
          type: '活动、招商活动',
          content: 1,
          status: 1,
          updateTs: '1651809772790',
          updateName: 'caiweihai'
        },
        {
          id: 2,
          name: '内容推荐',
          type: '供需、资讯、招商资讯',
          content: 2,
          status: 2,
          updateTs: '1651809772790',
          updateName: 'caiweihai'
        },
        {
          id: 3,
          name: '内容推荐卡片',
          type: '平台资讯、招商资讯',
          content: 3,
          status: 3,
          updateTs: '1651809772790',
          updateName: 'caiweihai'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 获取推荐位列表数据 */
    async fetchData() {
      this.tableConfig.loading = true
      const params = {
        clientType: 0,
        name: '',
        creatorName: '',
        createdTsBegin: '',
        createdTsEnd: '',
        pageNum: 1,
        pageSize: 100
      }
      const res = await Kingkong.getKingkongList(params)
      if (res.state !== 1) return
      res.data.list.forEach((item, index) => {
        item.serialNumber = index + 1
      })
      this.tableConfig.loading = false
      // this.tableData = res.data.list
      // this.pageData.total = res.data.totalRows
    },

    /** 推荐位|编辑|隐藏|显示 */
    handleEvent(event, data) {
      switch (event) {
        case 'edit':
          this.handleDialog('edit', data)
          break
        case 'hide':
          this.handleShow('hide', data)
          break
        case 'show':
          this.handleShow('show', data)
          break
        default:
          break
      }
    },

    /** 编辑推荐位 */
    handleDialog(event, data) {
      const { name } = data
      switch (name) {
        case '轮播推荐':
          this.$refs.dialogRef1.$emit(event, data)
          break
        case '内容推荐':
          this.$refs.dialogRef2.$emit(event, data)
          break
        case '内容推荐卡片':
          this.$refs.dialogRef3.$emit(event, data)
          break
      }
    },

    /** 启用/冻结金刚区 */
    handleShow(event, data) {
      console.log(event, data)
    }
  }
}
</script>
