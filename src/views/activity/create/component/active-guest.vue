<template>
  <div class="guest-wrap">
    <div class="header-wrap">
      <el-button @click="onAdd">添加嘉宾</el-button>
      <el-button @click="guestBankVisible = true">从嘉宾库选</el-button>
      <el-button icon="el-icon-plus" @click="memberBankVisible = true">{{ ckey ? '从会员库选' : '从用户库选' }}</el-button>
    </div>

    <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" />

    <GuestFormDialog
      :id="editId"
      :static-data="staticData"
      :visible.sync="formVisible"
      :show-bank="!isBankEdit"
      :end-time="endTime"
      @add="addStaticData"
      @edit="editStaticData"
    />
    <GuestBankDialog :visible.sync="guestBankVisible" :static-data="tableData" @edit="onBankEdit" />
    <MemberBankDialog :visible.sync="memberBankVisible" />
  </div>
</template>

<script>
import { delGuest, getGuestList } from '@/api/activity/activity-guest'

export default {
  name: 'ActiveGuest',
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    GuestFormDialog: () => import('./guest-form-dialog'),
    GuestBankDialog: () => import('./guest-bank-dialog'),
    MemberBankDialog: () => import('./member-bank-dialog'),
  },
  props: {
    endTime: {
      type: [String, Number],
      default: ''
    }
  },

  data() {
    return {
      loading: false,
      tableData: [],
      staticData: {},
      query: {
        pageNum: 1,
        pageSize: 100,
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
            <img src={row.portrait} alt="" width="50" height="50" />
          </div>
        },
        { label: '姓名', prop: 'name' },
        { label: '职位/称谓', prop: 'post' },
        { label: '所在公司/组织', prop: 'unit' },
        { label: '嘉宾介绍', prop: 'introduction' },
        {
          label: '操作',
          fixed: 'right',
          width: '120',
          render: ({ row, index }) => <div>
            <el-button type="text" onClick={() => this.onEdit(row)}>编辑</el-button>
            <el-button type="text" onClick={() => this.onDel(row, index)}>移除</el-button>
          </div>
        },
      ]
    },
    activityId() {
      return this.$route.query.activityId || ''
    },
    ckey() {
      return this.$store.getters.ckey || ''
    }
  },
  created() {
    this.onQueryChange()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    onQueryChange() {
      // 创建活动时候，活动嘉宾都是存在本地
      if (!this.activityId) return

      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.queryTableData(), 300)
    },
    async queryTableData() {
      this.loading = true
      try {
        const { query: { pageNum: page, pageSize }, activityId } = this
        const { data: { totalRows, list } } = await getGuestList({
          activityId,
          page,
          pageSize,
        })
        this.total = totalRows
        this.tableData = list
        this.$emit('guestList', this.tableData)
      } finally {
        this.loading = false
      }
    },
    onAdd() {
      this.editId = ''
      this.isBankEdit = false
      this.formVisible = true
    },
    onEdit(row) {
      this.staticData = row
      this.isBankEdit = false
      this.editId = row.id
      this.formVisible = true
    },

    onBankEdit(row) {
      this.isBankEdit = true
      this.editId = row.id
      this.staticData = row
      this.formVisible = true
    },

    async onDel(row, index) {
      await this.$confirm('', '确定要删除吗？')
      if (this.activityId) {
        const { state } = await delGuest(row.id)

        if (!state) return
        this.$message.success('操作成功')
        this.onQueryChange()
      } else {
        this.tableData.splice(index, 1)
        this.$emit('guestList', this.tableData)
      }
    },

    addStaticData(val) {
      this.tableData.unshift(val)
      this.$emit('guestList', this.tableData)
    },

    editStaticData(val) {
      const findIndex = this.tableData.findIndex(v => v.id === val.id)
      this.tableData.splice(findIndex, 1, val)
      this.$emit('guestList', this.tableData)
    }
  }
}
</script>

<style scoped lang="scss">
.guest-wrap {
  margin-bottom: 20px;
}
</style>
