<template>
  <div class="app-container">
    <div class="query-form">
      <el-form
        ref="query"
        :inline="true"
        :model="query"
        label-width="100px"
        label-position="right"
        size="small"
      >
        <el-form-item label="信息来源">
          <el-select v-model="query.origin" placeholder="请选择">
            <el-option
              v-for="item in originOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="活动ID">
          <el-input v-model.trim="query.id" clearable placeholder="请输入活动ID" />
        </el-form-item>

        <el-form-item label="活动名称">
          <el-input v-model.trim="query.name" clearable placeholder="请输入活动名称" />
        </el-form-item>

        <el-form-item label="活动状态">
          <el-select v-model="query.status" placeholder="请选择">
            <el-option
              v-for="item in getMapDict(publishStatusMap)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" size="small" @click.native="fetchData(true)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="封面图" width="120px">
        <template slot-scope="scope">
          <img
            style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;"
            :src="
              scope.row.cover
                ? scope.row.cover
                : 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/default_avatar.png'
            "
            alt=""
          >
        </template>
      </el-table-column>
      <el-table-column label="活动名称/ID" width="120px">
        <template slot-scope="scope">
          {{ scope.row.name }} / {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column prop="origin" label="信息来源" width="140px" />
      <el-table-column prop="tag" label="标签" />
      <el-table-column prop="create-time" label="信息来源" width="140px" />
      <el-table-column label="招商阶段" width="150px">
        <template slot-scope="scope">
          {{ stageMap.get(scope.row.stage) }}
        </template>
      </el-table-column>
      <el-table-column label="地区">
        <template slot-scope="scope">
          {{ scope.row.province }}{{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="权重" />
      <el-table-column prop="publisher" label="发布人" />
      <el-table-column prop="releaseTime" label="发布时间" />
      <el-table-column label="状态" width="150px">
        <template slot-scope="scope">
          {{ publishStatusMap.get(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="onOffline($event, scope.row)">下线</el-button>
          <el-button type="text" @click="goTo('card', scope.row)">收到的名片</el-button>
          <el-button type="text" @click="goTo('statistics', scope.row)">数据统计</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import TableMixins from '@/mixins/table'
import { stageMap, getMapDict, publishStatusMap } from '@/consts'

export default {
  name: 'InformationList',
  mixins: [TableMixins],
  data() {
    return {
      originOpt: [{
        value: 'guangzhou',
        label: '广州招商办'
      }, {
        value: 'qingyuan',
        label: '清远招商办'
      }, {
        value: 'foshan',
        label: '佛山招商办'
      }],
      publishStatusMap,
      stageMap,
      getMapDict,
      query: {
        origin: '',
        id: '',
        name: '',
        status: null,
      },
      tableData: [{ id: 1 }]
    }
  },
  methods: {

    fetchData(reset) {
      if (reset) this.currentPage = 1
      this.loading = true
      // TODO 待完善
    },

    onOffline() {
      // TODO 待完善
      console.log('下线')
    },

    goTo(name, item) {
      switch (name) {
        case 'statistics':
          this.$router.push({
            path: `/information-publish/${item.id}/statistics`,
          })
          break
        case 'card':
          this.$router.push({
            path: `/information-publish/${item.id}/card-list`,
          })
          break
      }
    },

  }
}
</script>

<style scoped lang="scss">

</style>
