
<template>
  <div>
    <kdDialog
      ref="kdDialog"
      :dialog-title="dialogTitle"
      dialog-width="60%"
      @savePopupData="submit"
      @hide="hide"
    >
      <div slot="content">
        <!-- 搜索表单start -->
        <el-form
          ref="formHotSupplyDemand"
          label-position="right"
          :inline="true"
          :model="query"
        >
          <el-form-item v-if="isTopBackStage" label="来源商会" prop="ckey">
            <el-select v-model="query.ckey" placeholder="请选择" clearable filterable>
              <el-option v-for="chamber in chamberOptions" :key="chamber.value" :label="chamber.label" :value="chamber.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="供需ID">
            <el-input v-model="query.id" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="供需标题">
            <el-input v-model="query.title" clearable placeholder="关键词" />
          </el-form-item>
          <!--
            <el-form-item label="供需状态">
            <el-select v-model="query.status" placeholder="请选择状态">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="冻结状态">
            <el-select v-model="query.freezeStatus" placeholder="请选择状态">
              <el-option v-for="item in freezeStatusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          -->
          <el-form-item v-if="isTopBackStage" label="可见性">
            <el-select v-model="query.visibility" placeholder="请选择">
              <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-button type="primary" @click="supplyDemandListFunc">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 搜索表单end -->
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
              <div style="color:red;">{{ scope.row.id }}</div>
              <div class="ellipsis">{{ scope.row.title }}</div>
            </template>
          </el-table-column>
          <el-table-column label="发布信息">
            <template slot-scope="{row}">
              <div>{{ row.sourceInfo ? row.sourceInfo.userName : '' }}</div>
              <div>{{ +row.createdTs | dateFormat }}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="isTopBackStage" label="可见性">
            <template slot-scope="scope">
              <div v-if="scope.row.visibility === 1">全平台可见</div>
              <div v-else>部分商会可见</div>
            </template>
          </el-table-column>
          <el-table-column label="供需状态">
            <template slot-scope="{row:{status}}">
              <div v-if="+status === 1">生效中</div>
              <div v-else-if="+status === 2">已关闭(过期关闭)</div>
              <div v-else-if="+status === 3">已关闭(成功合作)</div>
              <div v-else-if="+status === 4">已关闭(终止对接)</div>
            </template>
          </el-table-column>
          <el-table-column label="冻结状态">
            <template slot-scope="{row:{freezeStatus}}">
              <div v-if="+freezeStatus === 1">正常</div>
              <div v-else-if="+freezeStatus === 2"> 平台冻结 </div>
              <div v-else-if="+freezeStatus === 3"> 商会冻结 </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 供需列表end -->
      </div>
    </kdDialog>
  </div>
</template>

<script>
import kdDialog from '@/components/common/kdDialog'
import { addHotSupplyDemand } from '@/api/home/hotSupplyDemand'
import { supplyDemandList } from '@/api/home/supplyDemandManger'
export default {
  name: 'AddSupplyDemandDialog',
  components: { kdDialog },
  // 商会数组
  props: {
    chamberOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // 表单对象 字段注释参考父组件
      query: {
        title: '', // 供需标题
        ckey: '', // 商会来源
        status: 1, // 供需状态
        id: '', // 平台性
        visibility: -1, // 可见性

        // 一下参数写死
        pageSize: 100,
        pageNum: 1,
        readSort: 0,
        reportStatus: -1,
        collectSort: 0,
        chatSort: 0,
        freezeStatus: 1, // 冻结状态  0-全部 1-正常 2-平台冻结 3-商会冻结,
        deleteStatus: -1,
        publishTime: -1,
        isHot: 2
      },
      // 对话框标题
      dialogTitle: '添加供需',
      freezeStatusList: [
        { label: '全部', value: -1 },
        { label: '正常', value: 1 },
        { label: '平台冻结', value: 2 },
        { label: '商会冻结', value: 3 }
      ],
      statusList: [
        { label: '全部', value: -1 },
        { label: '生效中', value: 1 },
        { label: '已关闭(过期关闭)', value: 2 },
        { label: '已关闭(成功合作)', value: 3 },
        { label: '已关闭(终止对接)', value: 4 }
      ],
      platformList: [
        { label: '全部', value: -1, },
        { label: '全平台可见', value: 1, },
        { label: '部分商会可见', value: 2, },
      ],

      // 表格数据源
      tableData: [],

      demandIds: [],

      loading: false
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    },
    isTopBackStage() {
      return !this.ckey
    }
  },
  methods: {
    // 显示对话框子组件
    show() {
      this.$refs.kdDialog.show()
      this.supplyDemandListFunc()
    },
    hide() {
      this.$refs['kdDialog'].hide()
      this.$refs['formHotSupplyDemand'].resetFields()
      const { demandIds, query } = this.$options.data()
      this.demandIds = demandIds
      this.query = query
    },

    // 点击表单确定按钮
    async submit() {
      if (!this.demandIds.length) return this.$message({ message: '请选择供需', type: 'warning' })
      const { state } = await addHotSupplyDemand(this.demandIds, this.ckey || 'ysh')
      if (state === 1) {
        this.$message({ message: '添加成功', type: 'success' })
        this.hide()
        this.$emit('success')
      } else {
        this.$message({ message: '添加失败', type: 'error' })
      }
    },

    // 表单选框变化
    handleSelectionChange(val) {
      this.demandIds = val.map(v => v.id)
    },

    // 查询可添加的热门供需
    async supplyDemandListFunc() {
      this.loading = true
      try {
        const params = Object.entries(this.query).reduce((params, [key, value]) => {
          if (value !== '') params[key] = value
          return params
        }, {})
        const { data: { list = [] }} = await supplyDemandList(params)
        this.tableData = list
      } catch (error) { /*  */ }
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.ellipsis {
  @include ellipsis(2);
}
</style>

