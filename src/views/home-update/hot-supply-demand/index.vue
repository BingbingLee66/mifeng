<template>
  <div class="app-container">
    <!-- 搜索表单start -->
    <el-form
      ref="formSupplyDemand"
      label-position="right"
      :inline="true"
      :model="query"
    >
      <el-form-item label="供需标题">
        <el-input v-model="query.title" clearable placeholder="关键词" />
      </el-form-item>
      <el-form-item v-if="isTopBackStage" label="来源商会">
        <el-select
          v-model="query.ckey"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="chamber in chamberOptions"
            :key="chamber.value"
            :label="chamber.label"
            :value="chamber.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="供需状态">
        <el-select v-model="query.status" placeholder="请选择状态">
          <el-option
            v-for="chamber in statusList"
            :key="chamber.value"
            :label="chamber.label"
            :value="chamber.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="冻结状态">
        <el-select v-model="query.publishStatus" placeholder="请选择状态">
          <el-option
            v-for="chamber in publishStatusList"
            :key="chamber.value"
            :label="chamber.label"
            :value="chamber.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-select v-model="query.publishTime" placeholder="请选择">
          <el-option
            v-for="chamber in publishTimeList"
            :key="chamber.value"
            :label="chamber.label"
            :value="chamber.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供需ID">
        <el-input v-model="query.id" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="">
        <el-button
          type="primary"
          @click="handleCurrentChange(1)"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索表单end -->

    <!-- 按钮栏目 -->
    <div style="margin-bottom: 10px">
      <el-button type="danger" @click="onBatchDelete">移除</el-button>
      <el-button type="primary" @click="$refs.hotSupplyDemandAdder.show()">添加供需 </el-button>
    </div>
    <!-- 供需列表start -->
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="供需ID/名称" width="400">
        <template slot-scope="scope">
          <div style="color: red">{{ scope.row.demandId }}</div>
          <div class="ellipsis">{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发布信息">
        <template slot-scope="scope">
          <div>{{ scope.row.publishName }}</div>
          <div>{{ +scope.row.publishTime | dateFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="isTopBackStage" label="可见性">
        <template slot-scope="scope">
          <div v-if="scope.row.platform === -1">系统加载中</div>
          <div v-else-if="scope.row.platform === 1">全平台可见</div>
          <div v-else>部分商会可见</div>
        </template>
      </el-table-column>
      <el-table-column label="供需状态">
        <template slot-scope="{ row: { status } }">
          <div v-if="status === 1">生效中</div>
          <div v-else-if="status === 2">已关闭(过期关闭)</div>
          <div v-else-if="status === 3">已关闭(成功合作)</div>
          <div v-else-if="status === 4">已关闭(终止对接)</div>
        </template>
      </el-table-column>
      <el-table-column label="冻结状态">
        <template slot-scope="{row}">
          <template v-if="isTopBackStage">
            <div v-if="!row.syncPlatformFreezeChamberVOList.length && !row.syncChamberFreezeChamberVOList.length">正常</div>
            <div v-if="row.syncPlatformFreezeChamberVOList.length">
              <strong>【平台冻结】</strong>
              <div v-for="(item,i) in row.syncPlatformFreezeChamberVOList" :key="`${item.id}-${i}`">{{ item.name }}</div>
            </div>
            <div v-if="row.syncChamberFreezeChamberVOList.length">
              <strong>【商会冻结】</strong>
              <div v-for="(item,i) in row.syncChamberFreezeChamberVOList" :key="`${item.id}-${i}`">{{ item.name }}</div>
            </div>
          </template>
          <template v-else>
            <div v-if="!row.syncChamberVOList.some(v => v.ckey === ckey)">--</div>
            <div v-else-if="+row.freezeStatus === 1">正常</div>
            <div v-else-if="+row.freezeStatus === 2"> 平台冻结 </div>
            <div v-else-if="+row.freezeStatus === 3"> 商会冻结 </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="创建信息">
        <template slot-scope="{ row }">
          <div>{{ row.operatorName }}</div>
          <div>{{ +row.createdTs | dateFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="权重">
        <template slot-scope="scope">
          <el-button type="text" @click="updateWeight(scope.row)">
            {{ scope.row.weight }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDelete([scope.row.id])">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 供需列表end -->
    <!-- 分页start -->
    <div class="block">
      <el-pagination
        :current-page="query.pageNum"
        :page-sizes="pageSizes"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 分页end -->
    <!-- 添加供需对话框 -->
    <HotSupplyDemandAdder
      ref="hotSupplyDemandAdder"
      :chamber-options="chamberOptions"
      @success="hotSupplyDemandListFunc"
    />
    <!-- 编辑权重对话框 -->
    <weightKdDialog ref="weightKdDialog" />
  </div>
</template>

<script>
import {
  hotSupplyDemandList,
  deleteHotSupplyDemand,
  weightSupplyDemand,
} from '@/api/home/hotSupplyDemand'
import {
  statusList,
  publishStatusList,
  publishTimeList,
} from './utils/utilsData'
import HotSupplyDemandAdder from './components/HotSupplyDemandAdder'
import { getChamberOptions } from '@/api/mall/channel'
import weightKdDialog from './components/weight'
export default {
  components: { HotSupplyDemandAdder, weightKdDialog },
  data() {
    return {
      // 查询表单对象
      query: {
        title: null,
        ckey: null,
        // 0-全部 1-生效中 2-已关闭(过期关闭) 3-已关闭(成功合作) 4-已关闭(终止对接)
        status: '0',
        // 冻结状态  0-全部 1-正常 2-平台冻结 3-商会冻结,
        publishStatus: '0',
        id: null,
        // 发布时间 1-24小时,2-3天,3-7天,4-本月,0-所有
        publishTime: '0',
        pageSize: 10,
        pageNum: 1,
      },
      // 表格数据
      tableData: [],

      statusList,
      publishStatusList,
      publishTimeList,

      // 商会数据
      chamberOptions: [],

      /** 分页相关 */
      pageSizes: [10, 50, 100, 200],
      // 总数
      total: 0,

      loading: false,
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    },
    // 是否为总后台
    isTopBackStage() {
      return !this.ckey
    },
  },
  created() {
    if (this.ckey) {
      this.query.ckey = this.ckey
    } else {
      this.getChamberOptionsFunc()
    }
    this.hotSupplyDemandListFunc()
  },
  methods: {
    // 拉取商会
    async getChamberOptionsFunc() {
      const {
        data: { data = [] },
      } = await getChamberOptions()
      this.chamberOptions = data
      this.chamberOptions.unshift(
        { label: '全部商会', value: '' }
        // ,{ label: '凯迪云商会', value: 'kaidiyun' }
      )
    },

    // 拉取热门供需
    async hotSupplyDemandListFunc() {
      this.loading = true
      try {
        const {
          data: { list = [], totalRows = 0 },
        } = await hotSupplyDemandList(this.query)
        this.tableData = list
        this.total = totalRows
      } catch (error) {
        /*  */
      }
      this.loading = false
    },
    // 批量删除供需
    async deleteHotSupplyDemandFunc(ids) {
      const { state, msg } = await deleteHotSupplyDemand(ids)
      if (state === 1) {
        this.$message({ message: '已成功移除', type: 'success' })
        this.hotSupplyDemandListFunc()
        return
      }
      this.$message({ message: msg, type: 'error' })
    },
    // 表格复选框改变
    handleSelectionChange(val) {
      this.selectedData = val
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.query.pageSize = val
      this.hotSupplyDemandListFunc()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.query.pageNum = val
      this.hotSupplyDemandListFunc()
    },
    // 批量删除
    onBatchDelete() {
      const { selectedData = [] } = this
      if (!selectedData.length) {
        return this.$message({ message: '请勾选移除供需', type: 'warning' })
      }
      this.handleDelete(selectedData.map(v => v.id))
    },

    handleDelete(ids) {
      this.$confirm(
        '移除后，该供需将不再展示在热门供需板块，不影响在其他页面展示',
        '确认将供需从热门供需中移除？',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          this.deleteHotSupplyDemandFunc(ids)
        })
        .catch(() => {
          this.$message({ type: 'warning', message: '已取消移除' })
        })
    },

    // 点击权重编辑
    updateWeight(row) {
      this.$refs['weightKdDialog']
        .open(row.id, row.weight, weightSupplyDemand)
        .then(() => {
          this.hotSupplyDemandListFunc()
        })
    },
  },
}
</script>

<style lang="scss" scoped>

.ellipsis {
  @include ellipsis(2);
}
</style>
