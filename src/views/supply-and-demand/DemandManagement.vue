<template>
  <div class="demand-management">
    <el-form ref="query" :inline="true" label-position="right" :model="query">
      <el-row>
        <el-form-item :span="8" label="供需标题">
          <el-input v-model="query.title" clearable placeholder="关键词" maxlength="40" />
        </el-form-item>
        <el-form-item :span="8" label="来源商/协会">
          <el-select v-model="query.ckey" filterable no-match-text="暂无数据">
            <el-option
              v-for="cc in chamberOptions"
              :key="cc.value"
              :label="cc.label"
              :value="cc.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="供需状态">
          <el-select v-model="query.status">
            <el-option label="全部" :value="-1" />
            <el-option label="生效中" :value="1" />
            <el-option label="已关闭（过期关闭）" :value="2" />
            <el-option label="已关闭（成功合作）" :value="3" />
            <el-option label="已关闭（终止对接）" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="冻结状态">
          <el-select v-model="query.freezeStatus">
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="1" />
            <el-option label="平台冻结" :value="2" />
            <el-option label="商会冻结" :value="3" />
          </el-select>
        </el-form-item>

      </el-row>
      <el-row>
        <el-form-item :span="8" label="删除状态">
          <el-select v-model="query.deleteStatus">
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="1" />
            <el-option label="用户删除" :value="2" />
            <el-option label="商会后台删除" :value="3" />
            <el-option label="总后台删除" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="举报状态">
          <el-select v-model="query.reportStatus">
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="1" />
            <el-option label="被举报" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="发布时间">
          <el-select v-model="query.publishTime">
            <el-option label="全部" :value="-1" />
            <el-option label="24小时内" :value="1" />
            <el-option label="3天内" :value="2" />
            <el-option label="7天内" :value="3" />
            <el-option label="一个月内" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="供需ID">
          <el-input v-model="query.id" placeholder="关键词" clearable />
        </el-form-item>
        <el-button :span="8" type="primary" @click="handleCurrentChange(1)">查询</el-button>
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
      <!-- <el-table-column width="55" type="selection" /> -->
      <el-table-column label="供需ID" width="120" prop="id" />
      <el-table-column label="供需标题" width="240">
        <template slot-scope="{row}">
          <el-tooltip effect="light" :content="row.title" placement="top">
            <div class="ellipsis">{{ row.title }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
          {{ row.readPeopleNum || 0 }}
        </template>
        <template slot="header">
          <el-button type="text" @click="handleSort('readSort')">浏览量<i class="el-icon-sort" /></el-button>
        </template>

      </el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
          {{ row.collectNum || 0 }}
        </template>
        <template slot="header">
          <el-button type="text" @click="handleSort('collectSort')">收藏量<i class="el-icon-sort" /></el-button>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
          {{ row.chatPeopleNum || 0 }}
        </template>
        <template slot="header">
          <el-button type="text" @click="handleSort('chatSort')">洽谈量<i class="el-icon-sort" /></el-button>
        </template>
      </el-table-column>
      <el-table-column label="发布信息" width="180">
        <template slot-scope="{row}">
          <div>{{ row.sourceInfo ? row.sourceInfo.userName : '' }}</div>
          <div>{{ +row.createdTs | dateFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column label="来源商/协会" width="180">
        <template slot-scope="{row}">
          <div v-for="item in row.sourceChamberVOList" :key="item.id">{{ item.name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="可见性" width="120">
        <template slot-scope="{row:{visibility}}">
          <div v-if="+visibility === -1">计算中</div>
          <div v-else-if="+visibility === 1">全平台可见</div>
          <div v-else-if="+visibility === 2">部分商会可见</div>
        </template>
      </el-table-column>
      <el-table-column label="举报状态">
        <template slot-scope="{row:{reportStatus}}">
          <div v-if="+reportStatus === 1">正常</div>
          <div v-else-if="+reportStatus === 2">被举报</div>
        </template>
      </el-table-column>
      <el-table-column label="举报信息">
        <template slot-scope="{row}">
          <el-button :disabled="!+row.repostNum" type="text" size="small" @click="showRepostInfo(row)">{{ row.repostNum }}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="供需状态">
        <template slot-scope="{row:{status,closeReason}}">
          <div v-if="+status === 1">生效中</div>
          <div v-else-if="+status === 2">已关闭（过期关闭）</div>
          <div v-else-if="+status === 3">已关闭（成功合作）</div>
          <div v-else-if="+status === 4">
            <div>已关闭（终止对接）</div>
            <el-button v-if="closeReason" type="text" size="small" @click="$confirm(closeReason, '关闭原因', { showCancelButton: false, confirmButtonText: '我知道了', })">查看原因</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="同步商/协会" width="180">
        <template slot-scope="{row}">
          <div v-for="item in row.syncChamberVOList" :key="item.id">{{ item.name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="冻结状态" width="180">
        <template slot-scope="{row}">
          <div v-if="+row.freezeStatus === 1">正常</div>
          <div v-else-if="+row.freezeStatus === 2">
            <strong>【平台冻结】</strong>
            <div v-for="item in row.syncPlatformFreezeChamberVOList" :key="item.id">{{ item.name }}</div>
          </div>
          <div v-else-if="+row.freezeStatus === 3">
            <strong>【商会冻结】</strong>
            <div v-for="item in row.syncChamberFreezeChamberVOList" :key="item.id">{{ item.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="删除状态">
        <template slot-scope="{row:{deleteStatus}}">
          <div v-if="+deleteStatus === 1">正常</div>
          <div v-else-if="+deleteStatus === 2">用户删除</div>
          <div v-else-if="+deleteStatus === 3">商会后台删除</div>
          <div v-else-if="+deleteStatus === 4">总后台删除</div>
        </template>
      </el-table-column>
      <el-table-column label="供需成功匹配人" width="180">
        <template slot-scope="{row:{matchInfo}}">
          <template v-if="matchInfo">
            <div>{{ matchInfo.userName }}</div>
            <div>{{ matchInfo.phone }}</div>
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column label="是否后台发布" width="120">
        <template slot-scope="{row:{source}}">
          <div v-if="+source === 1">是（平台）</div>
          <div v-else-if="+source === 2">是（商会）</div>
          <div v-else-if="+source === 3">否</div>
        </template>
      </el-table-column>
      <el-table-column label="创建信息 (后台发布)" width="180">
        <template slot-scope="{row:{createInfo}}">
          <template v-if="createInfo">
            <div>{{ createInfo.userName }}</div>
            <div>{{ +createInfo.time | dateFormat }}</div>
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column label="更新信息" width="180">
        <template slot-scope="{row:{updateInfo}}">
          <template v-if="updateInfo">
            <div>{{ updateInfo.userName }}</div>
            <div>{{ +updateInfo.time | dateFormat }}</div>
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column label="商/协会认证状态">
        <template slot-scope="{row:{authenticate}}">
          <div v-if="authenticate">已认证</div>
          <div v-else>未认证</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" size="small">编辑</el-button> <br>
          <el-button type="text" size="small" @click="showFreezeDialog(row)">冻结</el-button> <br>
          <el-button type="text" size="small">详情</el-button> <br>
          <el-button type="text" size="small">删除</el-button> <br>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100, 500]"
      :page-size="query.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog :visible.sync="freezeVisible" title="冻结">
      <div style="margin-bottom:10px;">请选择冻结发布商/协会 <span style="color:red;">（可复选，冻结后，该动态不展示在已选商会中）</span></div>
      <el-checkbox-group v-model="freezeCheckList">
        <template v-for="item in freezeAbleList">
          <el-checkbox v-if="item.value" :key="item.id" style="display:block;margin-bottom:10px;" :label="item.label" />
        </template>
      </el-checkbox-group>
      <div slot="footer">
        <el-button @click.native="freezeVisible=false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { supplyDemandList, getReportList, getFreezeAbleList, getUnFreezeAbleList } from '@/api/home/supplyDemandManger'
import { getChamberOptions } from '@/api/finance/finance'
import { formatDateTime } from '@/utils/date'

export default {
  data() {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        deleteStatus: -1,
        ckey: '',
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

      chamberOptions: [],

      tableData: [],

      freezeVisible: false,
      freezeData: { },
      freezeAbleList: [],
      unFreezeAbleList: [],
      freezeCheckList: []

    }
  },
  created() {
    this.querySupplyDemandList()
    this.getChamberOptions()
  },
  methods: {
    async getChamberOptions() {
      const { data } = await getChamberOptions()
      this.chamberOptions = data.data
      this.chamberOptions.unshift({ 'label': '全部商会', 'value': '' }, { 'label': '凯迪云商会', 'value': 'kaidiyun' })
    },

    async querySupplyDemandList() {
      const params = { ...this.query }
      Object.entries(params).forEach(([key, value]) => {
        if (value === '') delete params[key]
      })
      const { data: { list, totalRows }} = await supplyDemandList(params)
      this.tableData = list
      this.total = totalRows
    },

    handleSizeChange(val) {
      this.query.pageSize = val
      this.querySupplyDemandList()
    },
    handleCurrentChange(val) {
      this.query.pageNum = val
      this.querySupplyDemandList()
    },

    handleSort(sortType) {
      const oldSort = this.query[sortType]
      this.query.readSort = 0
      this.query.collectSort = 0
      this.query.chatSort = 0
      this.query[sortType] = ({ '-1': 1, 0: 1, 1: -1 })[oldSort]
      this.querySupplyDemandList()
    },

    async showRepostInfo(row) {
      const { data: { list = [] }} = await getReportList({ tarId: row.id, page: 1, pageSize: 100 })

      this.$confirm(`
        <div style="margin:-10px -15px;border-top:1px solid #eee;">
          ${list.map(v => `<div style="padding:20px;border-bottom:1px solid #eee;">
            <div>举报人信息：${v.uname}</div>
            <div>举报人手机号：${v.phone}</div>
            <div>举报内容：${v.reason}</div>
            <div>举报时间：${formatDateTime(new Date(+v.createdTs), 'yyyy-MM-dd hh:mm:ss')}</div>
          </div>`).join('')}
        </div>
      `,
      '举报信息', {
        showCancelButton: false,
        confirmButtonText: '我知道了',
        dangerouslyUseHTMLString: true
      })
    },

    async getFreezeAbleList(id) {
      const { data = [] } = await getFreezeAbleList({ id })
      this.freezeAbleList = data
    },

    async getUnFreezeAbleList(id) {
      const { data } = await getUnFreezeAbleList({ id })
      this.unFreezeAbleList = data
    },

    async showFreezeDialog(row) {
      this.freezeVisible = true
      this.freezeData = row
      this.getFreezeAbleList(row.id)
      this.getUnFreezeAbleList(row.id)
    }
  },
}
</script>

<style scoped lang="scss">
.demand-management {
  padding: 20px;
}

.ellipsis {
  @include ellipsis(2)
}
</style>
