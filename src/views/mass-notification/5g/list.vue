<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item label="标题">
        <el-input v-model="query.title" placeholder="搜索" clearable />
      </el-form-item>
      <el-form-item label="模板状态">
        <el-select v-model="query.state">
          <el-option label="全部" value="" />
          <el-option label="已审核" value="1" />
          <el-option label="未审核" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button class="mb-10" type="primary" @click="$router.push('/mass-notification/5g/create')">新建模板</el-button>

    <KdTable v-loading="loading" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />
  </div>
</template>

<script>

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  props: {},
  data() {
    return {
      query: {
        title: '',
        state: '',
        pageSize: 10,
        pageNum: 1,
      },
      total: 0,
      loading: false,
      columns: [
        { label: '模板ID', prop: 'id' },
        { label: '标题', prop: 'title' },
        { label: '大小' },
        { label: '提审时间' },
        { label: '审核状态' },
        { label: '操作', render: ({ row }) => this.generateActions(row) }
      ],
      tableData: [{}]
    }
  },
  methods: {
    generateActions() {
      return (<div>
        <el-button type="text">预览</el-button>
        <el-button type="text">删除</el-button>
      </div>)
    },
    onQueryChange(e) {
      this.query = { ...this.query, ...e }
    }
  },
}
</script>

<style lang="scss" scoped>
//
</style>
