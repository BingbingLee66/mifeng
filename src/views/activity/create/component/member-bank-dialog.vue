<template>
  <el-dialog :title="`从${ckey ? '会员' : '用户'}库选嘉宾`" :visible="visible" width="800px" @close="onClose">
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
</template>

<script >
import { getMemberList, getWxUserList } from '@/api/activity/activity-guest'

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
      tableData: [],
      query: {
        pageNum: 1,
        pageSize: 10,
        name: '',
      },
      total: 0,
      timer: null,
      selectData: []
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
        { label: '嘉宾介绍', prop: 'introduction' },
      ]
    },
    ckey() {
      return this.$store.getters.ckey || ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.onQueryChange()
      }
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
        const { query: { pageNum: page, pageSize, name } } = this
        const api = this.ckey ? getMemberList : getWxUserList
        const { data: { totalRows, list } } = await api({
          name,
          phone: '',
          page,
          pageSize,
        })
        this.total = totalRows
        this.tableData = list
      } finally {
        this.loading = false
      }
    },

    onConfirm() {
      this.$emit('confirm', this.selectData.map(v => {
        delete v.ckey
        delete v.nickname
        delete v.resume
        delete v.phone

        return {
          ...v,
          isChamber: 1,
          introduction: v.introduction || '',
          post: v.post || '',
          userId: this.$store.getters.profile?.id || ''
        }
      }))
      this.onClose()
    },

    onClose() {
      this.$emit('update:visible', false)
    },

    onSelectChange(val) {
      this.selectData = val
    }
  }
}
</script>

<style scoped lang="scss">

</style>
