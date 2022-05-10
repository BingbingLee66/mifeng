<template>
  <div class="demand-management">
    <el-form ref="query" :inline="true" label-position="right" :model="query">
      <el-row>
        <el-form-item :span="8" label="供需标题">
          <el-input v-model="query.title" clearable placeholder="关键词" />
        </el-form-item>
        <el-form-item :span="8" label="供需状态">
          <el-select v-model="query.contentColumnId">
            <el-option label="全部" value="全部" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="冻结状态">
          <el-select v-model="query.contentColumnId">
            <el-option label="全部" value="全部" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="删除状态">
          <el-select v-model="query.contentColumnId">
            <el-option label="全部" value="全部" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :span="8" label="举报状态">
          <el-select v-model="query.contentColumnId">
            <el-option label="全部" value="全部" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="发布时间">
          <el-date-picker
            v-model="query.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item :span="8" label="供需ID">
          <el-input v-model="query.title" placeholder="关键词" clearable />
        </el-form-item>
        <el-button :span="8" type="primary">查询</el-button>
      </el-row>
      <el-row>
        <el-button type="primary">批量认证身份信息</el-button>
      </el-row>
    </el-form>

    <el-table
      ref="table"
      :data="tableData"
      style="width:100%;"
      stripe
      border
      header-row-class-name="tableheader"
      empty-text="暂无数据"
    >
      <el-table-column width="55px" type="selection" />
      <el-table-column v-for="it in tableRows" :key="it.prop" :prop="it.prop" :label="it.lable" min-width="100px" />
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100, 500]"
      :page-size="pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { supplyDemandList } from '@/api/home/supplyDemandManger'
import { formatDate } from '@/utils/date'

const reportMap = {
  1: '正常',
  2: '被举报'
}

const supplyDemandMap = {
  1: '生效中',
  2: '已关闭（过期关闭）',
  3: '已关闭（成功合作）',
  4: '已关闭（终止对接）',
}

const freezeMap = {
  1: '正常',
  2: '平台冻结',
  3: '商会冻结',
}

const deleteMap = {
  1: '正常',
  2: '用户删除',
  3: '平台删除',
  4: '商会删除',
}

export default {
  data() {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        deleteStatus: -1,
        reportStatus: -1,
        status: -1,
        freezeStatus: -1,
        visibility: -1,
        readSort: 0,
        collectSort: 0,
        chatSort: 0,
        isHot: -1,
        publishTime: -1
      },
      total: 0,

      tableData: [],

      tableRows: [
        { prop: 'id', lable: '供需ID' },
        { prop: 'title', lable: '供需标题' },
        { prop: 'readPeopleNum', lable: '浏览量' },
        { prop: 'collectNum', lable: '收藏量' },
        { prop: 'chatPeopleNum', lable: '洽谈量' },
        { prop: 'publishInfo', lable: '发布信息' },
        { prop: 'reportDesc', lable: '举报状态' },
        { prop: 'repostNum', lable: '举报信息' },
        { prop: 'supplyDemandDesc', lable: '供需状态' },
        { prop: 'isSyncChamber', lable: '是否同步本商/协会' },
        { prop: 'freezeDesc', lable: '冻结状态' },
        { prop: 'deleteDesc', lable: '删除状态' },
        { prop: 'chamberName', lable: '供需成功匹配人' },
        { prop: 'chamberName', lable: '是否后台发布' },
        { prop: 'chamberName', lable: '创建信息（后台发布）' },
        { prop: 'chamberName', lable: '更新信息' },
        { prop: 'chamberName', lable: '商/协会认证状态' },
      ]
    }
  },
  created() {
    this.querySupplyDemandList()
  },
  methods: {
    nomorlizeData(data) {
      // 发布信息
      data.publishInfo = `${data.sourceInfo.userName}
      ${formatDate(new Date(data.createdTs, 'yyyy-MM-dd hh:mm:ss'))}`
      // 举报状态
      data.reportDesc = reportMap[data.reportStatus]
      // 供需状态
      data.supplyDemandDesc = supplyDemandMap[data.status]
      // 是否同步商协会
      data.isSyncChamber = !!data.syncChamberVOList.length
      // 冻结状态
      data.freezeDesc = freezeMap[data.freezeStatus]
      // 删除状态
      data.deleteDesc = deleteMap[data.deleteStatus]
      // 供需成功匹配人
      data.matchDesc = matchInfo
      return data
    },
    async querySupplyDemandList() {
      const { data: { list, totalRows }} = await supplyDemandList(this.query)
      this.tableData = list.map(this.nomorlizeData)
      this.total = totalRows
    },
    handleSizeChange() {},
    handleCurrentChange() {},
  },
}
</script>

<style scoped lang="scss">
.demand-management {
  padding: 20px;
}
</style>
