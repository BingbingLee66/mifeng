<template>
  <PlusTable
    :loading="loading"
    :dataSource="tableData"
    :columns="columns"
    :pagination="pagination"
    @change="handleTableChange"
    :row-selection="rowSelection"
    row-key="memberAuditLogsId"
  >
    <template #filterItem>
      <a-form-item label="状态">
        <a-Select
          v-model:value="tableFilter.auditStatus"
          style="width: 240px"
          placeholder="请选择"
          :options="auditStatusOptions"
          @change="handleChange"
        />
      </a-form-item>
    </template>
    <template #searchToolBar>
      <div v-if="tableFilter.auditStatus === AUDIT_STATUS.AUDIT">
        <a-button
          type="primary"
          class="ml20"
          @click="updateAuditStatus(rowSelection.selectedRowKeys, AUDIT_STATUS.PASS)"
          >通过</a-button
        >
        <a-button
          type="primary"
          class="ml20"
          @click="
            handleOpenModal(
              'RejectModal',
              rowSelection.selectedRowItems.map(i => i.id)
            )
          "
          >驳回</a-button
        >
      </div>
      <div v-else></div>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'name'">
        {{ record.type === TYPE.PERSON ? record.name : record.contactName }}
      </template>
      <template v-if="column.dataIndex === 'phone'">
        {{ record.type === TYPE.PERSON ? record.phone : record.contactPhone }}
      </template>
      <template v-if="column.dataIndex === 'auditStatus'">
        <a-badge :status="AUDIT_POINT_MAP.get(+record.auditStatus)" />
        {{ AUDIT_STATUS_MAP.get(record.auditStatus) }}
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="link" class="mr10" @click="handleOpenModal('DetailModal', record)">详情</a-button>
        <a-button
          v-if="record.auditStatus === AUDIT_STATUS.AUDIT"
          class="mr10"
          type="link"
          @click="updateAuditStatus([record.id], AUDIT_STATUS.PASS)"
          >通过</a-button
        >
        <a-button
          v-if="record.auditStatus === AUDIT_STATUS.AUDIT"
          class="mr10"
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
  <detail-modal :recordData="recordData" @confirm="handleCallback" />
</template>

<script>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import useConstant from '@/constant/member-manager'
import useTableColumns from './table/columns'
import { useTableData } from './table/data'
import { updateReaudit } from '@/api/member/manager'

import { message } from 'ant-design-vue'
import { getMapDict } from '@/utils'

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
    const { AUDIT_STATUS_MAP } = useConstant
    const auditStatusOptions = getMapDict(AUDIT_STATUS_MAP)
    const {
      tableData,
      tableFilter,
      pagination,
      rowSelection,
      loading,
      fetchTableData,
      handleTableChange,
      handleChange
    } = useTableData()

    const { handleOpenModal, recordData } = useOpenModal(rowSelection)

    /**
     * 通过/驳回
     * @param {array} memberId id数组集合
     * @param {number} auditStatus 审核状态
     * @param {string} remark 驳回原因
     */
    const updateAuditStatus = async (memberId, auditStatus, remark = '') => {
      if (!memberId?.length) return message.warn('没有选择记录，操作失败')
      await updateReaudit({ memberId, auditStatus, remark })
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

    /**
     * 详情弹窗回调
     * @param {*} e
     * @param {*} memberId
     */
    const handleCallback = (e, memberId) => {
      const {
        AUDIT_STATUS: { PASS }
      } = useConstant
      if (e === 'pass') {
        updateAuditStatus(memberId, PASS)
      } else {
        handleOpenModal('RejectModal', memberId)
      }
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
      handleChange,
      updateAuditStatus,
      handleReject,
      handleCallback,
      auditStatusOptions,
      handleOpenModal,
      recordData
    }
  }
})
</script>
