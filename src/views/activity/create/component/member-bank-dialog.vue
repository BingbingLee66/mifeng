<template>
  <el-dialog title="从会员库选嘉宾" :visible="visible" width="800px" @close="onClose">
    <div class="search-wrap flex-x">
      <el-input v-model="query.name" placeholder="搜索姓名" style="width: 200px;" />
      <el-button class="ml-20" type="primary" @click="onQueryChange">查询</el-button>
    </div>

    <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <div class="flex-x-center-center mt-20">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script >
export default {
  name: 'GuestFormDialog',
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      tableData: [
        {
          id: '1',
          avator: 'https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF',
          name: '诸葛亮',
          post: '产品专员',
          company: '广东省实力科技信息有限公司',
          introduce: '热爱运动，喜欢旅游，性格开朗乐观，热情友好，能吃苦耐劳，学习能力强。三年的校园学习生活经历使我积累了较强的组织、协调沟通能力和团队合作精神。'
        }
      ],
      query: {
        pageNum: 1,
        pageSize: 10,
        name: '',
      },
      total: 0,
      timer: null,
    }
  },
  computed: {
    columns() {
      return [
        { type: 'selection' },
        {
          label: '头像', render: ({ row }) =>
            <div>
              <img src={row.avator} alt="" width="50" height="50" />
            </div>
        },
        { label: '姓名', prop: 'name' },
        { label: '职位/称谓', prop: 'post' },
        { label: '所在公司/组织', prop: 'company' },
        { label: '嘉宾介绍', prop: 'introduce' },
      ]
    },
  },

  methods: {
    onQueryChange() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.queryTableData(), 300)
    },
    async queryTableData() {
      this.loading = true
      try {
        // TODO fetchData
      } finally {
        this.loading = false
      }
    },

    onConfirm() {},

    onClose() {
      this.$emit('update:visible', false)
    },

  }
}
</script>

<style scoped lang="scss">

</style>
