<!-- DetailModal -->
<template>
  <a-modal v-model:visible="visible" @cancel="cancel" title="详情" width="1000px">
    <table border="1" style="border-collapse: collapse" class="detail-table">
      <tr>
        <th class="th_title">修改项</th>
        <th>修改前</th>
        <th>修改后</th>
      </tr>
      <tr v-if="afterRevision.companyName != beforeRevision.companyName">
        <td class="th_title">企业/团体名称</td>
        <td>{{ beforeRevision.companyName }}</td>
        <td>{{ afterRevision.companyName }}</td>
      </tr>
      <tr v-if="afterRevision.contactName != beforeRevision.contactName">
        <td class="th_title">联系人姓名</td>
        <td>{{ beforeRevision.contactName }}</td>
        <td>{{ afterRevision.contactName }}</td>
      </tr>

      <tr v-if="afterRevision.contactPhone != beforeRevision.contactPhone">
        <td class="th_title">联系人电话</td>
        <td>{{ beforeRevision.contactPhone }}</td>
        <td>{{ afterRevision.contactPhone }}</td>
      </tr>
      <tr v-if="afterRevision.postName != beforeRevision.postName">
        <td class="th_title">会内职位</td>
        <td>{{ beforeRevision.postName }}</td>
        <td>{{ afterRevision.postName }}</td>
      </tr>
      <tr v-if="afterRevision.name != beforeRevision.name">
        <td class="th_title">姓名</td>
        <td>{{ beforeRevision.name }}</td>
        <td>{{ afterRevision.name }}</td>
      </tr>
      <tr v-if="afterRevision.license != beforeRevision.license">
        <td class="th_title">营业执照</td>
        <td>
          <a-image v-if="beforeRevision.license" class="updateImg" :src="beforeRevision.license" />
        </td>
        <td>
          <a-image v-if="afterRevision.license" class="updateImg" :src="afterRevision.license" />
        </td>
      </tr>
      <tr v-if="afterRevision.companyPosition != beforeRevision.companyPosition">
        <td class="th_title">企业职位</td>
        <td>{{ beforeRevision.companyPosition }}</td>
        <td>{{ afterRevision.companyPosition }}</td>
      </tr>
      <tr v-if="afterRevision.joinedTs != beforeRevision.joinedTs">
        <td class="th_title">入会时间</td>
        <td>{{ beforeRevision.joinedTs }}</td>
        <td>{{ afterRevision.joinedTs }}</td>
      </tr>
    </table>
    <template #footer>
      <div v-if="afterRevision?.auditStatus !== 0" class="audit-result-view" style="font-size: 15px">
        <div class="linemargin">
          审核结果：
          <span v-if="afterRevision.auditStatus === 1">通过</span>
          <span v-else-if="afterRevision.auditStatus === 2">已驳回</span>
        </div>
        <div v-if="afterRevision.auditStatus === 2" class="linemargin">驳回理由：{{ afterRevision.rejectRemark }}</div>
        <div class="linemargin">审核人：{{ afterRevision.auditor }}</div>

        <div class="linemargin">审核时间：{{ afterRevision.auditedTs }}</div>
        <div class="linemargin">提交时间：{{ afterRevision.createdTs }}</div>
        <a-button key="back" @click="cancel">关闭</a-button>
      </div>
      <div v-if="afterRevision?.auditStatus === 0">
        <a-button key="submit" type="primary" @click="confirm('pass', [afterRevision.id])">通过</a-button>
        <a-button key="submit" @click="confirm('reject', [afterRevision.id])">驳回</a-button>
        <a-button key="back" @click="cancel">关闭</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { getMemberAuditDetail } from '@/api/member/manager'
import { defineComponent, toRefs, reactive, watchEffect } from 'vue'
import { closeModal } from '@/hooks/useModal'

export default defineComponent({
  props: {
    recordData: [Object, Array]
  },
  setup(props, { emit }) {
    const { visible, cancel } = closeModal('DetailModal')
    const modalState = reactive({
      beforeRevision: {},
      afterRevision: {}
    })
    watchEffect(async () => {
      if (props.recordData.memberAuditLogsId) {
        const { data } = await getMemberAuditDetail({
          memberId: props.recordData.id,
          type: 2,
          memberAuditLogsId: props.recordData.memberAuditLogsId
        })
        modalState.beforeRevision = data.member
        modalState.afterRevision = data.dtl
      }
    })
    const confirm = (e, memberId) => {
      emit('confirm', e, memberId)
      cancel()
    }
    return { visible, cancel, confirm, ...toRefs(modalState) }
  }
})
</script>

<style lang="less" scoped>
.detail-table {
  th,
  td {
    height: 45px;
    line-height: 45px;
    border: 1px solid #ccc;
    text-align: center;
    min-width: 100px;
  }

  width: 90%;
  margin: 10px auto;
  border-collapse: collapse; /*合并内外边距*/

  .th_title {
    width: 100px;
  }
}

.audit-result-view {
  margin-left: 50px;

  .linemargin {
    margin-bottom: 5px;
  }
}
</style>
