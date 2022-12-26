<template>
  <div class="">
    <el-form inline>
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
    <el-button class="mb-10" type="primary" @click="createDialog={visible: true,value:''}">创建问卷</el-button>
    <KdTable v-loading="loading" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <el-dialog title="创建问卷" width="500px" :visible.sync="createDialog.visible">
      <el-input v-model="createDialog.value" placeholder="请输入标题" :maxlength="30" show-word-limit />
      <el-button slot="footer" type="primary" @click="onCreateSure">确 定</el-button>
    </el-dialog>
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
      createDialog: {
        visible: false,
        value: ''
      },
      query: {
        title: '', // 问卷标题
        status: '', // 问卷状态
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      columns: [
        { label: 'ID' },
        { label: '问卷标题' },
        { label: '状态' },
        { label: '答卷' },
        { label: '创建时间' },
        {
          label: '操作',
          render: ({ row }) => (<div>
            <el-button type="text" onClick={() => this.onPublish(row)}>发布</el-button>
            <el-button type="text">短信通知</el-button>
            <el-button type="text">分享</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </div>)
        }
      ],
      loading: false,
      tableData: [{}]
    }
  },
  methods: {
    onQueryChange() {},
    async onCreateSure() {
      const value = this.createDialog.value.trim()
      if (!value) return this.$message.error('请输入标题')
      this.$router.push({ path: '/quest-survey/create', query: { title: value } })
    },
  },
}
</script>

<style lang="scss" scoped>
//
</style>
