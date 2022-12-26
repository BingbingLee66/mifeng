<template>
  <div class="">
    <el-form inline>
      <el-form-item label="商协会">
        <el-input v-model="query.chamber" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="问卷名称">
        <el-input v-model="query.title" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="问卷状态">
        <el-select v-model="query.status">
          <el-option label="全部" value="" />
          <el-option label="未发布" value="1" />
          <el-option label="已发布" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item><el-button type="primary">查询</el-button> </el-form-item>
    </el-form>
    <KdTable v-loading="loading" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />
  </div>
</template>

<script>

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination')

  },
  props: {},
  data() {
    return {
      query: {
        chamber: '',
        title: '', // 问卷标题
        status: '', // 问卷状态
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      columns: [
        { label: 'ID' },
        { label: '商协会' },
        { label: '问卷标题' },
        { label: '状态' },
        { label: '答卷' },
        { label: '创建时间' },
        {
          label: '操作',
          render: ({ row }) => (<div>
            <el-button type="text" onClick={() => this.onViewQuestionnaire(row)}>查看</el-button>
            <el-button type="text">分享</el-button>
            <el-button type="text">冻结</el-button>
          </div>)
        }
      ],
      loading: false,
      tableData: []
    }
  },
  methods: {
    onQueryChange() {}
  },
}
</script>

<style lang="scss" scoped>
//
</style>
