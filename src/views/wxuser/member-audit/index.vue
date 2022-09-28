<template>
  <div class="mt-20 ml-10">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="身份审核" name="identify" />
      <el-tab-pane label="会员审核" name="member" />
    </el-tabs>
    <ys-form
      :form-item="formItem"
      :form-config="formConfig"
      :form-obj="formData"
      @query="queryData"
      @reset="resetData"
    />
    <div v-if="activeName === 'member'" class="mb-20">
      <el-button type="success" icon="el-icon-check" :loading="passBtn" @click="passMember">通过</el-button>
      <el-button type="danger" icon="el-icon-delete" :loading="rejectBtn" @click="rejectMember">驳回</el-button>
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
    >
      <template v-if="activeName === 'identify'" v-slot:operate="row">
        <el-link type="primary" :underline="false" class="ml-10" @click="showDetail(row.data.id)"> 详情 </el-link>
        <template v-if="row.data.auditStatus === 0">
          <el-link type="success" :underline="false" class="ml-10" @click="handleResolve(row.data.id)"> 通过 </el-link>
          <el-link :underline="false" class="ml-10" type="danger" @click="handleReject(row.data.id)">拒绝</el-link>
        </template>
      </template>
    </ys-table>
    <!-- 详情弹出框 -->
    <Details
      :details-visible="detailsVisible"
      :detail="detailsObject"
      @handleResolve="handleDetailResolve"
      @handleReject="handleReject"
      @detailsClose="detailsClose"
    />
    <!--拒绝弹出框-->
    <el-dialog title="提示" :visible.sync="rejectVisible" width="20%" :before-close="rejectDialogClose">
      <div>
        <el-select v-model="rejectReason" placeholder="请选择">
          <el-option v-for="item in rejectOptions" :key="item.label" :label="item.label" :value="item.label" />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogClose">取 消</el-button>
        <el-button type="primary" @click="confirmReject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { exportJson2Excel } from '@/utils/exportExcel'
import ysTable from '@/components/ys-table'
import ysForm from '@/components/ys-form'
import data from './data'
import {
  getAllAuditList,
  rejectAuditStatus,
  getidentityList,
  getApproveDetail,
  getAuditDetail,
  approveIdentity
} from '@/api/wx-user'
import details from './components/details.vue'
export default {
  components: {
    'ys-table': ysTable,
    'ys-form': ysForm,
    Details: details
  },
  data() {
    return {
      tableConfig: {
        loading: false,
        reserve: true,
        rowKey: 'id',
        selection: false
      },
      formConfig: {
        type: 'query',
        inline: true,
        labelWidth: '100px'
      },
      formItem: data.identityFormItem,
      formData: data.identityFormData,
      tableColumn: data.identityTableColumn,
      chamberOptions: [],
      multipleSelection: [],
      tableData: [],
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0
      },
      selectExportList: [],
      // 节流控制
      passBtn: false,
      rejectBtn: false,
      activeName: 'identify',
      // 详情对话框
      detailsVisible: false,
      detailsObject: {
        trades: [{}]
      },
      // 驳回对话框
      rejectReason: '',
      rejectVisible: false,
      rejectOptions: data.rejectOptions,
      currentId: ''
    }
  },
  async created() {
    await this.fetchIdentityData(1)
  },
  methods: {
    async fetchMemberData(e) {
      this.tableConfig.loading = true
      this.pageData.currentpage = e === 1 ? 1 : this.pageData.currentpage
      const { currentpage, limit } = this.pageData
      console.log(limit, 'limit')
      const { chamberName, contactPhone, name, type, status, applySource } = this.formData
      const params = {
        chamberName,
        contactPhone,
        name,
        type,
        status,
        applySource,
        pageNum: currentpage,
        pageSize: limit
      }
      if (this.formData.requestTime) {
        params['joinStartTime'] = this.formData.requestTime[0]
        params['joinEndTime'] = this.formData.requestTime[1]
      }
      console.log(params)
      const res = await getAllAuditList(params)
      console.log(res, '会员审核')
      this.tableData = res.data.list || []
      this.pageData.total = res.data.totalRows
      this.tableConfig.loading = false
    },
    async fetchIdentityData(e) {
      this.tableConfig.loading = true
      this.pageData.currentpage = e === 1 ? 1 : this.pageData.currentpage
      const { currentpage, limit } = this.pageData
      console.log(limit, 'limit')
      const { auditType, auditStatus, source, type, userId } = this.formData
      const params = {
        auditType,
        auditStatus,
        source,
        type,
        userId,
        page: currentpage,
        pageSize: limit
      }
      // 申请
      if (this.formData.requestTime) {
        params['joinStartTime'] = this.formData.requestTime[0]
        params['joinEndTime'] = this.formData.requestTime[1]
      }
      // 审核时间
      if (this.formData.approvalTime) {
        params['auditStartTime'] = this.formData.approvalTime[0]
        params['auditEndTime'] = this.formData.approvalTime[1]
      }
      console.log(params, '身份审核params')
      const res = await getidentityList(params)
      console.log(res, '身份审核')
      if (res.state !== 1) return this.$message.error(res.msg)
      this.tableData = res.data.list || []
      this.pageData.total = res.data.totalRows
      this.tableConfig.loading = false
    },
    async queryData(formData) {
      this.formData = { ...formData }
      if (this.activeName === 'identify') {
        await this.fetchIdentityData(1)
      } else {
        await this.fetchMemberData(1)
      }
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
      if (this.multipleSelection.every(item => item.status !== 0)) {
        return this.$message.error('请至少选择一个未审核的条目')
      }
      if (this.multipleSelection.some(item => item.flag === 0)) {
        return this.$message.error('您选择了有未入驻的商协会，请检查')
      }
      this.passBtn = true
      const params = {
        auditStatus: 1,
        memberId: [],
        remark: ''
      }
      this.multipleSelection.forEach(item => {
        params.memberId.push(item.id)
      })
      const res = await rejectAuditStatus(params)
      if (res.state !== 1) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.fetchMemberData()
      this.passBtn = false
      this.$refs.tableRef.handleSelectionClear()
    },
    // 驳回
    async rejectMember() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('没有选择纪录，操作失败')
      }
      if (this.multipleSelection.every(item => item.status !== 0)) {
        return this.$message.error('请至少选择一个未审核的条目')
      }
      if (this.multipleSelection.some(item => item.flag === 0)) {
        return this.$message.error('您选择了有未入驻的商协会，请检查')
      }
      this.rejectBtn = true

      const params = {
        auditStatus: 2,
        memberId: [],
        remark: ''
      }
      this.multipleSelection.forEach(item => {
        params.memberId.push(item.id)
      })
      const res = await rejectAuditStatus(params)
      if (res.state !== 1) this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.$refs.tableRef.handleSelectionClear()
      await this.fetchMemberData()
      this.rejectBtn = false
    },
    exportExcel(e) {
      if (this.multipleSelection.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      console.log(this.selectExportList)
      exportJson2Excel('会员审核', this.selectExportList)
      this.$refs.tableRef.handleSelectionClear()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentpage = 1
      this.pageData.limit = val
      if (this.activeName === 'identify') {
        this.fetchIdentityData()
      } else {
        this.fetchMemberData()
      }
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageData.currentpage = val
      if (this.activeName === 'identify') {
        this.fetchIdentityData()
      } else {
        this.fetchMemberData()
      }
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
      // console.log(this.multipleSelection);
      const datas = value
      this.selectExportList = []
      for (const data of datas) {
        // console.log(data);
        const new_data = {
          商协会名称: data.chamberName,
          入会类型: data.applySource === 0 ? '个人' : '企业/团体入驻',
          申请来源:
            data.applySource === 0
              ? '未知'
              : data.applySource === 1
                ? '小程序会员入驻'
                : data.applySource === 2
                  ? '小程序商会主页'
                  : data.applySource === 3
                    ? 'app会员入驻'
                    : 'app商会主页',
          申请时间: data.joinTime,
          入会名称: data.name,
          商会入驻状态: data.flag === 1 ? '已入驻' : '未入驻',
          会内职位: data.postName,
          个人姓名: data.contactName,
          联系人电话: data.phone,
          审核时间: data.auditTime,
          审核人: data.auditor,
          审核状态: data.status === 0 ? '未审核' : data.status === 2 ? '驳回' : '通过'
        }
        this.selectExportList.push(new_data)
      }
    },
    async changeIdentity() {
      this.tableConfig.selection = false
      this.tableColumn = data.identityTableColumn
      this.formItem = data.identityFormItem
      this.formData = data.identityFormData
      await this.fetchIdentityData(1)
    },
    async changeMember() {
      this.tableConfig.selection = true
      this.tableColumn = data.tableColumn
      this.formItem = data.formItem
      this.formData = data.formData
      await this.fetchMemberData(1)
    },
    handleClick() {
      if (this.activeName === 'identify') {
        this.changeIdentity()
      } else {
        this.changeMember()
      }
      // console.log(this.activeName)
    },
    // 审核详情
    async showDetail(id) {
      this.currentId = id
      this.detailsVisible = true
      this.handleDetails()
    },
    async handleDetails() {
      const approveDetail = await getApproveDetail({ id: this.currentId })
      const auditDetail = await getAuditDetail({ id: this.currentId })
      this.detailsObject = { ...approveDetail.data, ...auditDetail.data }
      this.detailsObject.trades = this.detailsObject.trades ? this.detailsObject.trades : [{}]
      console.log(this.detailsObject, '详情内容啊')
    },
    detailsClose() {
      this.detailsVisible = false
    },
    // 列表通过
    async handleResolve(id) {
      // console.log(id)
      const params = {
        id,
        flag: 1
      }
      const res = await approveIdentity(params)
      if (res.state !== 1) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.fetchIdentityData()
      // console.log(params, '详情里面通过')
    },
    // 详情通过
    async handleDetailResolve() {
      // console.log(id)
      const params = {
        id: this.currentId,
        flag: 1
      }
      const res = await approveIdentity(params)
      if (res.state !== 1) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      await this.handleDetails()
      await this.fetchIdentityData()
      // console.log(params, '详情里面通过')
    },
    // 拒绝弹出框
    rejectDialogClose() {
      // console.log('拒绝弹出框')
      this.rejectReason = ''
      this.rejectVisible = false
    },
    handleReject(id) {
      this.rejectVisible = true
      this.currentId = id || this.currentId
      console.log(this.currentId)
    },
    async confirmReject() {
      if (this.rejectReason === '') {
        return this.$message.error('请选择拒绝理由')
      }
      const params = {
        flag: 2,
        id: this.currentId,
        remark: this.rejectReason
      }
      // console.log(params, '拒绝的提交啊')
      this.rejectVisible = false
      this.rejectReason = ''
      try {
        const res = await approveIdentity(params)
        if (res.state !== 1) return this.$message.error(res.msg)
        this.$message.success(res.msg)
      } catch (error) {
        this.$message.error('请求错误')
      }
      await this.handleDetails()
      await this.fetchIdentityData()
    }
  }
}
</script>

<style></style>
