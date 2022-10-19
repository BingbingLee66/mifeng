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
      :table-data="tableData"
      :visible.sync="formVisible"
      :show-bank="!isBankEdit"
      :end-time="endTime"
      @add="addStaticData"
      @edit="editStaticData"
      @editChamber="editChamberData"
      @fetchData="onQueryChange"
    />
    <GuestBankDialog ref="guestBankDialog" :static-data="tableData" :visible.sync="guestBankVisible" @edit="onBankEdit" @confirm="addStaticData" />
    <MemberBankDialog :static-data="tableData" :visible.sync="memberBankVisible" @confirm="addStaticData" />

    <el-dialog title="嘉宾介绍" :visible="textVisible" width="800px" @close="textVisible = false">
      <div>{{ introduction }}</div>
    </el-dialog>
  </div>
</template>

<script>
import { getGuestList } from '@/api/activity/activity-guest'

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
      textVisible: false,
      introduction: ''

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
        { label: '嘉宾介绍', prop: 'introduction', width: 200, render: ({ row }) => {
          return <div>
            <div class="text-overflow">{row.introduction || '/'}</div>
            { row.introduction && row.introduction.length >= 60
              ? <div>【<el-button type="text" onClick={() => this.showText(row.introduction)}>查看更多</el-button>】</div>
              : ''
            }
          </div>
        } },
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
    showText(val) {
      this.textVisible = true
      this.introduction = val
    },
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
      this.staticData = {}
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

    async onDel(row) {
      await this.$confirm('此次移除不影响嘉宾库数据', '确认移除该嘉宾？')

      const index = this.tableData.findIndex(v => v.id === row.id)

      this.tableData.splice(index, 1)
      this.$emit('guestList', this.tableData)
    },

    addStaticData(val) {
      if (val.length) {
        this.tableData = this.tableData.concat(val)
      } else {
        this.tableData.unshift(val)
      }

      this.$emit('guestList', this.tableData)
    },

    editStaticData(val, type) {
      const findIndex = this.tableData.findIndex(v => (type === 'chamber' ? v.chamberGuestsId : v.id) === val.id)

      if (findIndex < 0) return
      this.tableData.splice(findIndex, 1, val)
      this.$emit('guestList', this.tableData)
    },

    editChamberData(val) {
      this.$refs.guestBankDialog.onQueryChange()
      this.editStaticData(val, 'chamber')
    }
  }
}
</script>

<style lang="scss">
.text-overflow {
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-line-clamp:5;
  -webkit-box-orient:vertical;
}
</style>
<style scoped lang="scss">
.guest-wrap {
  margin-bottom: 20px;
}
</style>
