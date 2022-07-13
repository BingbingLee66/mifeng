<template>
  <div class="wrap">
    <div class="flex-x-start-center">
      <h3 class="mr20">前台权限管理</h3>
      <div class="desc">配置可在前台查看数据的会员</div>
    </div>
    <el-row>
      <el-button type="primary" @click="memberDialogVisible=true">选择会员</el-button>
      <MemberDialog :visible.sync="memberDialogVisible" @confirm="getTableData" />
    </el-row>

    <KdTable v-loading="loading" :columns="tableColumns" :rows="tableData" />

    <KdPagination :page-size="pageSize" :current-page="pageNum" :total="total" />

    <el-dialog title="配置权限" :visible.sync="permissionDialog.show" width="500px">
      请选择要查看的数据
      <el-checkbox-group v-model="permissionDialog.permissions">
        <div style="margin-top:10px;"><el-checkbox :label="2">激活与活跃</el-checkbox></div>
        <div style="margin-top:10px;"><el-checkbox :label="1">供需撮合</el-checkbox></div>
      </el-checkbox-group>
      <div slot="footer">
        <el-button @click="permissionDialog.show = false">取消</el-button>
        <el-button type="primary" @click="onSetMemberPermissions">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDateTime } from '@/utils/date'
import { getMemberPermissionsList, deleteMemberPermission, setMemberPermissions } from '@/api/authority/front-manager'

export default {
  components: {
    MemberDialog: () => import('./components/MemberDialog'),
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  data() {
    return {
      memberDialogVisible: false,

      tableColumns: [
        { label: '用户名', prop: 'name' },
        { label: '部门', prop: 'departMent' },
        { label: '会内职务', prop: 'postName' },
        {
          label: '数据查看权限',
          render: ({ row: { permissions }}) => (<div>
            {permissions && permissions.length ? permissions.map(v => +v === 1 ? <div>供需撮合</div> : <div>激活与活跃</div>) : '--'}
          </div>)
        },
        {
          label: '操作', minWidth: 120,
          render: ({ row }) => (<div>
            <el-button type='text' onClick={() => this.showPermissionDialog(row)} >配置权限</el-button>
            <el-button type='text' onClick={() => this.delMemberPermission(row)} >移除</el-button>
          </div>)
        },
        {
          label: '更新信息',
          render: ({ row }) => (<div>
            <div>{row.operatorName}</div>
            <div>{formatDateTime(new Date(+row.updatedTs), 'yyyy-MM-dd hh:mm:ss')}</div>
          </div>)
        },
      ],

      tableData: [],

      pageSize: 10,
      pageNum: 1,
      total: 0,
      loading: false,

      permissionDialog: {
        show: false,
        id: '',
        permissions: []
      }
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 获取报表数据
    async getTableData() {
      this.loading = true
      try {
        const { ckey, pageSize, pageNum: page } = this
        const { data: { list, totalRows }} = await getMemberPermissionsList({ ckey, pageSize, page })
        this.tableData = list || []
        this.total = totalRows || 0
      } catch (error) {
        // console.log(error)
      }
      this.loading = false
    },

    // 移除会员权限
    delMemberPermission(row) {
      this.$confirm('移除后，该会员将无法在前台查看数据，是否继续', '移除', {
        beforeClose: async(action, instance, done) => {
          if (action !== 'confirm') return done()
          const { state, msg } = await deleteMemberPermission(row.id)
          this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
          if (state === 1) {
            this.getTableData()
            done()
          }
        }
      })
    },

    showPermissionDialog(row) {
      this.permissionDialog = { show: true, id: row.id, permissions: row.permissions || [] }
    },

    async onSetMemberPermissions() {
      const { id, permissions } = this.permissionDialog
      const { state, msg } = await setMemberPermissions({ id, permissions })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'warning' })
      if (state === 1) {
        const row = this.tableData.find(v => v.id === id)
        this.$set(row, 'permissions', permissions)
        this.permissionDialog.show = false
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 0 20px;
}
.mr20 {
  margin-right: 20px;
}
.desc {
  color: #999;
}
</style>
