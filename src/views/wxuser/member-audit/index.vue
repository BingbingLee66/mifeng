<template>
  <div class="mt-20 ml-10">
    <ys-form
      :form-item="formItem"
      :form-config="formConfig"
      :form-obj="formData"
      @query="queryData"
      @reset="resetData"
    />
    <div class="mb-20">
      <el-button
        type="success"
        icon="el-icon-check"
        :loading="passBtn"
        @click="passMember"
      >通过</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        :loading="rejectBtn"
        @click="rejectMember"
      >驳回</el-button>
      <el-button type="primary" plain @click="exportExcel">导出</el-button>
    </div>
    <div />
    <ys-table
      ref="tableRef"
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      :page-data="pageData"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      @handleSelectionChange="handleSelectionChange"
    />
  </div>
</template>

<script>
import { exportJson2Excel } from '@/utils/exportExcel'
import ysTable from '@/components/ys-table'
import ysForm from '@/components/ys-form'
import data from './data'
import { getAllAuditList, rejectAuditStatus } from '@/api/wx-user'
export default {
  components: {
    'ys-table': ysTable,
    'ys-form': ysForm,
  },
  data() {
    return {
      tableConfig: {
        loading: false,
        reserve: true,
        rowKey: 'id',
        selection: true,
      },
      formConfig: {
        type: 'query',
        inline: true,
        labelWidth: '100px',
      },
      formItem: data.formItem,
      formData: data.formData,
      tableColumn: data.tableColumn,
      chamberOptions: [],
      multipleSelection: [],
      tableData: [],
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
      },
      selectExportList: [],
      passBtn: false,
      rejectBtn: false,
    }
  },
  async created() {
    await this.fetchData(1)
  },
  methods: {
    async fetchData(e) {
      this.tableConfig.loading = true
      this.pageData.currentpage = e === 1 ? 1 : this.pageData.currentpage
      const { currentpage, limit } = this.pageData
      console.log(limit, 'limit')
      const { chamberName, contactPhone, name, type, status, applySource } =
        this.formData
      let params = {
        chamberName,
        contactPhone,
        name,
        type,
        status,
        applySource,
        pageNum: currentpage,
        pageSize: limit,
      }
      if (this.formData.requestTime) {
        params['joinStartTime'] = this.formData.requestTime[0]
        params['joinEndTime'] = this.formData.requestTime[1]
      }
      console.log(params)
      let res = await getAllAuditList(params)
      console.log(res)
      this.tableData = res.data.list || []
      this.pageData.total = res.data.totalRows
      this.tableConfig.loading = false
    },
    async queryData(formData) {
      this.formData = { ...formData }
      await this.fetchData()
      this.$refs.tableRef.handleSelectionClear()
    },
    resetData() {
      this.formData = { ...data.formData }
    },
    // 通过
    async passMember() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('没有选择纪录，操作失败')
      }
      if (this.multipleSelection.every((item) => item.status !== 0)) {
        return this.$message.error('请至少选择一个未审核的条目')
      }
      this.passBtn = true
      let params = {
        auditStatus: 1,
        memberId: [],
        remark: '',
      }
      this.multipleSelection.forEach((item) => {
        params.memberId.push(item.id)
      })
      console.log(params)
      let res = await rejectAuditStatus(params)
      if (res.state !== 1) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      console.log(res)
      await this.fetchData()
      this.passBtn = false
      this.$refs.tableRef.handleSelectionClear()
      console.log('通过操作')
    },
    // 驳回
    async rejectMember() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('没有选择纪录，操作失败')
      }
      if (this.multipleSelection.every((item) => item.status !== 0)) {
        return this.$message.error('请至少选择一个未审核的条目')
      }
      this.rejectBtn = true

      let params = {
        auditStatus: 2,
        memberId: [],
        remark: '',
      }
      this.multipleSelection.forEach((item) => {
        params.memberId.push(item.id)
      })
      console.log(params)
      let res = await rejectAuditStatus(params)
      console.log(res)
      if (res.state !== 1) this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.$refs.tableRef.handleSelectionClear()
      await this.fetchData()
      this.rejectBtn = false
    },
    exportExcel(e) {
      if (this.multipleSelection.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败',
        })
        return
      }
      window.localStorage.setItem(
        'actionId',
        e.currentTarget.getAttribute('actionid')
      )
      console.log(this.selectExportList)
      exportJson2Excel('会员审核', this.selectExportList)
      this.$refs.tableRef.handleSelectionClear()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentpage = 1
      this.pageData.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageData.currentpage = val
      this.fetchData()
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
      // console.log(this.multipleSelection);
      let datas = value
      this.selectExportList = []
      for (let data of datas) {
        // console.log(data);
        let new_data = {
          商协会名称: data.chamberName,
          入会类型: data.type === 0 ? '个人' : '企业/团体入驻',
          申请来源:
            data.type === 0
              ? '未知'
              : data.type === 1
                ? '小程序会员入驻'
                : data.type === 2
                  ? '小程序商会主页'
                  : data.type === 3
                    ? 'app会员入驻'
                    : 'app商会主页',
          入会名称: data.name,
          会内职位: data.postName,
          个人姓名: data.contactName,
          联系人电话: data.phone,
          审核时间: data.auditTime,
          审核人: data.auditor,
          审核状态:
            data.status === 0 ? '未审核' : data.status === 2 ? '驳回' : '通过',
        }
        this.selectExportList.push(new_data)
      }
    },
  },
}
</script>

<style></style>
