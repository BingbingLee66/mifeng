<template>
  <div class="guest-wrap">
    <div class="header-wrap">
      <el-button @click="onAdd">添加嘉宾</el-button>
      <el-button @click="guestBankVisible = true">从嘉宾库选</el-button>
      <el-button icon="el-icon-plus" @click="memberBankVisible = true">从用户库选</el-button>
    </div>

    <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <GuestFormDialog :id="editId" :visible.sync="formVisible" :show-bank="!isBankEdit" />
    <GuestBankDialog :visible.sync="guestBankVisible" @edit="onBankEdit" />
    <MemberBankDialog :visible.sync="memberBankVisible" />
  </div>
</template>

<script>
export default {
  name: 'ActiveGuest',
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    GuestFormDialog: () => import('./guest-form-dialog'),
    GuestBankDialog: () => import('./guest-bank-dialog'),
    MemberBankDialog: () => import('./member-bank-dialog'),
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
        albumName: '',
      },
      total: 0,
      timer: null,

      formVisible: false,
      guestBankVisible: false,
      memberBankVisible: false,
      editId: '',
      isBankEdit: false,
    }
  },

  computed: {
    columns() {
      return [
        { label: '头像', render: ({ row }) =>
          <div>
            <img src={row.avator} alt="" width="50" height="50" />
          </div>
        },
        { label: '姓名', prop: 'name' },
        { label: '职位/称谓', prop: 'post' },
        { label: '所在公司/组织', prop: 'company' },
        { label: '嘉宾介绍', prop: 'introduce' },
        {
          label: '操作',
          fixed: 'right',
          width: '120',
          render: ({ row }) => <div>
            <el-button type="text" onClick={() => this.onEdit(row)}>编辑</el-button>
            <el-button type="text" onClick={() => this.onDel(row)}>移除</el-button>
          </div>
        },
      ]
    },
  },
  created() {
    this.onQueryChange()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
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
    onAdd() {
      this.editId = ''
      this.formVisible = true
    },
    onEdit(row) {
      this.isBankEdit = false
      this.editId = row.id
      this.formVisible = true
    },
    onBankEdit(id) {
      this.isBankEdit = true
      this.editId = id
      this.formVisible = true
    },
    async onDel(row) {
      await this.$confirm('', '确定要删除吗？')
      // TODO del
      console.log(row)
    },
  }
}
</script>

<style scoped lang="scss">
.guest-wrap {
  margin-bottom: 20px;
}
</style>
