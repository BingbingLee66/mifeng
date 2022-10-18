<template>
  <div>
    <el-dialog title="从嘉宾库选" :visible="visible" width="800px" @close="onClose">
      <div class="search-wrap flex-x">
        <el-input v-model="query.name" placeholder="搜索姓名" style="width: 200px;" />
        <el-button class="ml-20" type="primary" @click="onQueryChange">查询</el-button>
      </div>

      <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" @selection-change="onSelectChange" />
      <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

      <div class="flex-x-center-center mt-20">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="嘉宾介绍" :visible="textVisible" width="800px" @close="textVisible = false">
      <div>{{ introduction }}</div>
    </el-dialog>
  </div>
</template>

<script>
import { delChamberGuest, getChamberGuestList } from '@/api/activity/activity-guest'

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
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      query: {
        pageNum: 1,
        pageSize: 10,
        name: '',
      },
      total: 0,
      timer: null,
      selectData: [],
      textVisible: false,
      introduction: ''

    }
  },
  computed: {
    columns() {
      return [
        { type: 'selection' },
        {
          label: '头像', render: ({ row }) =>
            <div>
              <img src={row.portrait} alt="" width="50" height="50" />
            </div>
        },
        { label: '姓名', prop: 'name' },
        { label: '职位/称谓', prop: 'post' },
        { label: '所在公司/组织', prop: 'unit' },
        { label: '嘉宾介绍', prop: 'introduction', render: ({ row }) => {
          return <div>
            <div class="text-overflow">{row.introduction || '/'}</div>
            { row.introduction && row.introduction.length >= 30
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
            <el-button type="text" onClick={() => this.onDel(row)}>从嘉宾库移除</el-button>
            <el-button type="text" onClick={() => this.onEdit(row)}>编辑</el-button>
          </div>
        },
      ]
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.onQueryChange()
      }
    },
  },
  methods: {
    showText(val) {
      this.textVisible = true
      this.introduction = val
    },
    onQueryChange() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.queryTableData(), 300)
    },
    async queryTableData() {
      this.loading = true
      try {
        const { query: { pageNum: page, pageSize, name } } = this
        const { data: { totalRows, list } } = await getChamberGuestList({
          name,
          cKey: this.$store.getters.ckey || 'ysh',
          page,
          pageSize,
        })
        this.total = totalRows
        this.tableData = list
      } finally {
        this.loading = false
      }
    },

    onClose() {
      this.$emit('update:visible', false)
    },

    onEdit(row) {
      this.$emit('edit', row)
    },

    onConfirm() {
      if (!this.selectData.length) return this.$message.error('请选择嘉宾')

      this.$emit('confirm', this.selectData.map((v, i) => {
        delete v.ckey
        return {
          ...v,
          id: +`${Date.now()}${i}`,
          isChamber: 1
        }
      }))
      this.onClose()
    },

    async onDel(row) {
      await this.$confirm('不影响本次所选嘉宾，仅对嘉宾库进行移除', '确认从嘉宾库中移除该嘉宾？')
      const { state, msg } = await delChamberGuest(row.id)

      if (!state) return this.$message.error(msg)
      this.$message.success('操作成功')
      this.onQueryChange()
    },

    onSelectChange(val) {
      this.selectData = val
    }
  }
}
</script>

