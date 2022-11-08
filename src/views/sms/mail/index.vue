<template>
  <div class="app-container">
    <div v-loading="listLoading" class="mail-content">
      <div v-if="!list.length" class="mail-not">暂无数据~</div>
      <div v-else>
        <div v-for="item in list" :key="item.gsId" class="mail-box" @click="goDetails(item)">
          <!-- 未读标记 -->
          <div v-if="item.readStatus == '2'" class="mail-dot" />
          <div class="box-left">
            <img :src="item.logo" alt="">
          </div>
          <div class="box-right">
            <div class="mail-top">
              <div class="mail-title">您收到一条平台消息</div>
              <div>{{ item.sendTs }}</div>
            </div>
            <div class="mail-mat">{{ item.title }}</div>
          </div>
        </div>
      </div>

    </div>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { timeFormat } from '@/utils/index.js'
import { stationPageList, readStationMail } from '@/api/mass-notification/index'
export default {
  components: {},
  data() {
    return {
      list: [],
      listLoading: false,
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100],
      total: 0,
    }
  },

  created() {
    this.fetchData()
  },
  methods: {
    timeFormat,
    // 获取数据,
    async fetchData() {
      const { currentpage, limit } = this
      const params = { page: currentpage, pageSize: limit }
      this.listLoading = true
      const res = await stationPageList(params)
      // readstatus 2是未读1是已读
      this.list = res.data.list || []
      this.total = res.data.totalRows
      this.listLoading = false
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    },
    // 跳转站内信
    async goDetails(row) {
      if (row.readStatus === '2') await readStationMail({ id: row.shrId })
      this.$router.push({
        name: '站内信详情',
        params: {
          id: row.gsId,
        }
      })
    }
  },

}
</script>

<style lang="scss" scoped>
.app-container{
  .mail-content{
    margin-bottom: 20px;
    .mail-not{
      margin: 100px auto;
      width: 200px;
    }
    .mail-box{
      display: flex;
      align-items: center;
      padding: 20px;
      background: #f1f1f1;
      width: 900px;
      position: relative;
      overflow: hidden;
      margin-bottom: 20px;
      .mail-dot{
        position: absolute;
        right: 7px;
        top: 6px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: red;
      }
      .box-left{
        margin-right: 20px;
        img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      .box-right{
        width: 90%;
        .mail-top{
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          .mail-title{
            font-weight: bold;
          }
        }
        .mail-mat{
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          width: 100%;
        }
      }
    }
  }
}
</style>
