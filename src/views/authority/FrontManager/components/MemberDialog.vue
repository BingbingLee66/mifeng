<template>
  <el-dialog title="选择会员" width="70%" v-bind="$attrs" v-on="$listeners" @open="onMemberDialogShow">
    <el-form inline>
      <el-form-item label="用户名">
        <el-input v-model="query.uname" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader
          v-model="query.department"
          :show-all-levels="false"
          :options="departmentOptions"
          :props="{
            checkStrictly: true,
            value: 'id',
            label: 'departmentName',
            children: 'departmentRespList',
          }"
        />
      </el-form-item>
      <el-form-item label="会内职务">
        <el-select v-model="query.memberPostType">
          <el-option label="全部" value="-1" />
          <el-option v-for="item of postOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onMemberQueryChange({pageNum:1})">查询</el-button>
      </el-form-item>
    </el-form>
    <KdTable v-loading="loading" :columns="columns" :rows="tableData" @selection-change="selectionDatas=$event" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onMemberQueryChange" />
    <div slot="footer">
      <el-button @click="$emit('update:visible',false)">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getChoosedMemberList, addMemberPermission } from '@/api/authority/front-manager'
import { getMemberOptions } from '@/api/member/post'
import { getDepartmentList } from '@/api/org-structure/org'

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  inheritAttrs: false,
  data() {
    return {
      query: {
        uname: '',
        department: ['-1'],
        memberPostType: '-1',
        pageNum: 1,
        pageSize: 10
      },
      columns: [
        { type: 'selection' },
        { label: '用户名', prop: 'memberName' },
        { label: '部门', prop: 'department' },
        { label: '会内职务', prop: 'memberPost' },
      ],
      tableData: [],
      total: 0,
      loading: false,
      postOptions: [],
      departmentOptions: [],
      selectionDatas: []
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    }
  },
  methods: {
    // 显示选择会员弹窗
    onMemberDialogShow() {
      this.query = { uname: '', department: ['-1'], memberPostType: '-1', pageNum: 1, pageSize: 10 }
      this.selectionDatas = []
      this.getChoosedMembers()
      this.getPostOptions()
      this.getDepartmentOptions()
    },
    // 获取职位配置
    async getPostOptions() {
      if (this.postOptions.length) return
      const { data } = await getMemberOptions({ ckey: this.ckey })
      if (data.data) this.postOptions = data.data
    },
    // 获取部门配置
    async getDepartmentOptions() {
      if (this.departmentOptions.length) return
      const { data } = await getDepartmentList({ ckey: this.ckey, parentId: 0 })
      if (data.data[0]) {
        const { departmentRespList = [] } = data.data[0]
        this.delEmptyChildren(departmentRespList, 'departmentRespList')
        departmentRespList.unshift({ departmentName: '全部', id: '-1' })
        this.departmentOptions = departmentRespList
      }
    },
    delEmptyChildren(arr, childKey) {
      arr.length && arr.forEach(v => {
        if (v[childKey].length) {
          this.delEmptyChildren(v[childKey], childKey)
        } else {
          v[childKey] = undefined
        }
      })
    },
    // 获取选择会员列表
    async getChoosedMembers() {
      this.loading = true
      try {
        const { ckey, query: { pageNum, department, ...query }} = this
        const { data: { list, totalRows }} = await getChoosedMemberList({
          ...query,
          department: department[department.length - 1],
          ckey,
          page: pageNum
        })
        this.tableData = list || []
        this.total = totalRows || 0
      } catch (error) {
        // console.log(error)
      }
      this.loading = false
    },

    onMemberQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.getChoosedMembers()
    },

    async onConfirm() {
      const { selectionDatas } = this
      if (!selectionDatas.length) return this.$message({ message: '请至少选择一位会员', type: 'warning' })
      const { state, msg } = await addMemberPermission({
        ckey: this.ckey,
        memberIds: selectionDatas.map(v => v.memberId)
      })
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.$emit('update:visible', false)
        this.$emit('confirm')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
//
</style>
