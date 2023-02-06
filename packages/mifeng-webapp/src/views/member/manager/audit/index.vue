<template>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :loading="loading"
    :pagination="pagination"
    :request="handleSearch"
    @change="handleTableChange"
    :row-selection="rowSelection"
    row-key="id"
    :search="{ hiddenNum: 4, defaultCollapsed: true }"
  >
    <template #toolBar>
      <div v-if="tableFilter.auditStatus === AUDIT_STATUS.AUDIT">
        <a-button
          type="primary"
          class="ml20"
          @click="updateAuditStatus(rowSelection.selectedRowKeys, AUDIT_STATUS.PASS)"
          >通过</a-button
        >
        <a-button type="primary" class="ml20" @click="handleOpenModal('RejectModal', rowSelection.selectedRowKeys)"
          >驳回</a-button
        >
      </div>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'type'">
        {{ TYPE_MAP.get(record.type) }}
      </template>
      <template v-if="column.dataIndex === 'contactInfo'">
        <div v-if="+record.type === TYPE.PERSON">
          <div>【会员姓名】{{ record.name }}</div>
          <div>【会员手机号】{{ record.phone }}</div>
        </div>
        <div v-else-if="+record.type === TYPE.TEAM">
          <div>【企业名称】{{ record.companyName }}</div>
          <div>【联系人姓名】{{ record.contactName }}</div>
          <div>【联系人手机号】{{ record.contactPhone }}</div>
        </div>
        <div v-else-if="+record.type === TYPE.ORGANIZATION">
          <div v-if="record.socialOrganizationLogo" class="flex-x-start-center">
            【社会组织logo】
            <img class="w-16 h-16 rounded-full" :src="record.socialOrganizationLogo" />
          </div>
          <div>【社会组织名称】{{ record.companyName }}</div>
          <div>【联系人姓名】{{ record.contactName }}</div>
          <div>【联系人手机号】{{ record.contactPhone }}</div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'registerType'">
        <p>{{ record.createdTs }}</p>
        <p>{{ REGISTER_TYPE_MAP.get(record.registerType) }}</p>
      </template>
      <template v-if="column.dataIndex === 'auditStatus'">
        <a-badge :status="AUDIT_POINT_MAP.get(+record.auditStatus)" />
        {{ AUDIT_STATUS_MAP.get(record.auditStatus) }}
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button
          v-if="record.auditStatus !== AUDIT_STATUS.AUDIT"
          type="link"
          primary
          @click="handleOpenModal('DetailModal', record)"
          >详情</a-button
        >
        <a-button
          v-if="record.auditStatus === AUDIT_STATUS.AUDIT"
          type="link"
          primary
          @click="updateAuditStatus([record.id], AUDIT_STATUS.PASS)"
          >通过</a-button
        >
        <a-button
          v-if="record.auditStatus === AUDIT_STATUS.AUDIT"
          type="link"
          danger
          @click="handleOpenModal('RejectModal', [record.id])"
          >驳回</a-button
        >
      </template>
    </template>
  </PlusTable>

  <!-- 驳回 modal -->
  <reject-modal :recordData="recordData" @confirm="handleReject" />

  <!-- 详情 modal -->
  <detail-modal :recordData="recordData" />
</template>

<script>
import { defineComponent, reactive, ref, toRefs } from 'vue'
import useConstant from '@/constant/member-manager'
import useTableColumns from './table/columns'
import { useTableData } from './table/data'

import { message } from 'ant-design-vue'
import { updateAudit } from '@/api/member/manager'

import DetailModal from './modal/DetailModal.vue'
import RejectModal from './modal/RejectModal.vue'
import { openModal } from '@/hooks/useModal'
/**
 * modal 组件显示、隐藏处理
 */
function useOpenModal() {
  const { openAction: openRejectModal } = openModal('RejectModal')
  const { openAction: openDetailModal } = openModal('DetailModal')
  const recordState = reactive({ recordData: {} })
  const modalName = ref('')
  const handleOpenModal = (name, record) => {
    recordState.recordData = record
    modalName.value = name
    switch (name) {
      case 'DetailModal':
        openDetailModal()
        break
      case 'RejectModal':
        if (!record?.length) return message.warn('没有选择记录，操作失败')
        openRejectModal()
        break
    }
  }
  const { recordData } = toRefs(recordState)
  return { handleOpenModal, recordData }
}

export default defineComponent({
  components: { DetailModal, RejectModal },
  setup() {
    const {
      tableData,
      tableFilter,
      pagination,
      rowSelection,
      loading,
      fetchTableData,
      handleTableChange,
      handleSearch
    } = useTableData()

    /**
     * 通过/驳回
     * @param {array} memberId id数组集合
     * @param {number} auditStatus 审核状态
     * @param {string} remark 驳回原因
     */
    const updateAuditStatus = async (memberId, auditStatus, remark = '') => {
      if (!memberId?.length) return message.warn('没有选择记录，操作失败')
      await updateAudit({ memberId, auditStatus, remark })
      fetchTableData()
    }

    /**
     * 驳回弹窗回调
     * @param {*} memberId
     * @param {*} remark
     */
    const handleReject = (memberId, remark) => {
      const {
        AUDIT_STATUS: { REJECT }
      } = useConstant
      updateAuditStatus(memberId, REJECT, remark)
    }

    return {
      ...useConstant,
      ...useTableColumns,
      tableData,
      tableFilter,
      pagination,
      rowSelection,
      loading,
      fetchTableData,
      handleTableChange,
      handleSearch,
      updateAuditStatus,
      handleReject,
      ...useOpenModal(rowSelection)
    }
  }
})
</script>
