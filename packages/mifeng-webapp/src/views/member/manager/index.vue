<template>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :request="handleSearch"
    @change="handleTableChange"
    :search="{ hiddenNum: 4, defaultCollapsed: true }"
    row-key="id"
    :row-selection="rowSelection"
    :scroll="{ x: 'max-content', y: 'max-content' }"
  >
    <template #toolBar>
      <div class="flex gap-4 flex-wrap">
        <a-button type="primary" @click="handleOpenModal('AttachLabel', record)">打标签</a-button>
        <a-button type="primary" @click="$router.push({ path: '/member/editor' })"><plus-outlined />添加会员</a-button>
        <a-button type="primary" @click="exportExcel">导表</a-button>
        <a-dropdown>
          <a-button type="primary">下载导入模板</a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="(item, index) of importModelList" :key="index" @click="downloadModel(item)">
                {{ item.name }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-button type="primary" @click="handleOpenModal('ImportExcel', record)">导入</a-button>
        <a-button type="primary" @click="sendSms">
          <template #icon>
            <a-tooltip placement="top">
              <template #title>
                <span>
                  针对未激活会员，可发送一次短信；<br />短信模板示例：广东省江西商会引进凯迪云商会平台，助力商协会建设，
                  【这里是商会主页链接】 您可实时接收资讯动态。</span
                >
              </template>
              <question-circle-outlined />
            </a-tooltip>
          </template>
          发送短信
        </a-button>

        <a-button type="primary" @click="authMember">批量认证身份信息</a-button>
        <a-button type="primary" @click="deleteMemberBatch">批量移除会员</a-button>
      </div>
    </template>

    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'memberLabelList'">
        <div v-if="record.memberLabelList?.length">
          <a-tag v-for="item in record.memberLabelList.slice(0, 3)" :key="item.tagId" class="mr5 mb5">
            {{ item.tagName }}
          </a-tag>
          <div
            v-if="record.memberLabelList?.length > 3"
            class="text-btn-style"
            @click="handleOpenModal('MoreLabel', record, 'memberLabelList')"
          >
            查看更多
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'bridgeLabels'">
        <div v-if="record.bridgeLabels?.length">
          <a-tag v-for="item in record.bridgeLabels.slice(0, 3)" :key="item.id" class="mr5 mb5">
            {{ item.name }}
          </a-tag>
          <div
            v-if="record.bridgeLabels?.length > 3"
            class="text-btn-style"
            @click="handleOpenModal('MoreLabel', record, 'bridgeLabels')"
          >
            查看更多
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'tradeBridges'">
        <div v-if="record.tradeBridges?.length">
          <a-tag v-for="item in record.tradeBridges.slice(0, 3)" :key="item.id" class="mr5 mb5">
            {{ item.name }}
          </a-tag>
          <div
            v-if="record.tradeBridges.length > 3"
            class="text-btn-style"
            @click="handleOpenModal('MoreLabel', record, 'tradeBridges')"
          >
            查看更多
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'identityVOList'">
        <div v-if="record.identityVOList?.length > 0">
          <div v-for="(item, index) in record.identityVOList.slice(0, 1)" :key="index">
            <div v-if="+item.type === 1">【企业】{{ item.unit }}</div>
            <div v-if="+item.type === 2">【机构】{{ item.unit }}</div>
            <div>【职务】{{ item.post }}</div>
          </div>
        </div>
        <div v-else>--</div>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button
          class="mr20 mb10"
          type="link"
          @click="$router.push({ name: '会员详情', params: { memberId: record.id, userId: record.wxUserId } })"
        >
          详情
        </a-button>
        <a-button
          class="mr20 mb10"
          type="link"
          @click="$router.push({ path: '/member/editor', query: { memberId: record.id } })"
        >
          修改
        </a-button>
        <a-button
          class="mr20 mb10"
          type="link"
          @click="updateMemberStatus(record)"
          :danger="record.status === 1 ? true : false"
        >
          {{ record.status === 1 ? '冻结' : '解冻' }}
        </a-button>
        <a-button
          v-if="record.memberLabelList?.length"
          class="mr20 mb10"
          type="link"
          @click="handleOpenModal('RemoveLabel', record)"
          danger
        >
          移除标签
        </a-button>
        <a-button class="mr20 mb10" type="link" @click="deleteMember(record)" danger> 移除 </a-button>
      </template>
    </template>
  </PlusTable>
  <!-- 打标签 modal -->
  <attach-label :recordData="recordData" @comfirm="handleAttachLabel" />

  <!-- 导入 modal -->
  <import-excel :recordData="recordData" />

  <!-- 移除标签 modal -->
  <remove-label :recordData="recordData" @comfirm="fetchTableData" />

  <!-- 查看更多标签 modal -->
  <more-label :recordData="recordData" :labelType="labelType" />
</template>

<script>
import { defineComponent, reactive, toRefs, createVNode, inject, ref } from 'vue'
import { useTableColumns } from './list/table/columns'
import { useTableData } from './list/table/data'

import { exportJson2Excel } from '@/utils/exportExcel'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { sendSmsBatch } from '@/api/sms/sms.js'
import { authorizeMemberAuthBatch, updateStatus } from '@/api/member/manager'
import { deleteManyMember } from '@/api/member/post'
import Labels from '@/api/labels/labels'

import AttachLabel from './list/modal/AttachLabel.vue'
import ImportExcel from './list/modal/importExcel.vue'
import RemoveLabel from './list/modal/RemoveLabel.vue'
import MoreLabel from './list/modal/MoreLabel.vue'
import { openModal } from '@/hooks/useModal'

/**
 * modal 组件显示、隐藏处理
 */
function useOpenModal(rowSelection) {
  const { openAction: openRemoveLabel } = openModal('RemoveLabel')
  const { openAction: openImportExcel } = openModal('ImportExcel')
  const { openAction: openAttachLabel } = openModal('AttachLabel')
  const { openAction: openMoreLabel } = openModal('MoreLabel')
  const recordState = reactive({ recordData: {} })
  const modalName = ref('')
  const labelType = ref('')
  const handleOpenModal = (name, record, type = '') => {
    recordState.recordData = record
    modalName.value = name
    switch (name) {
      case 'RemoveLabel':
        openRemoveLabel()
        break
      case 'ImportExcel':
        openImportExcel()
        break
      case 'AttachLabel':
        if (!rowSelection.selectedRowItems?.length) return message.warning('请至少选择一位会员')
        if (!rowSelection.selectedRowItems.some(i => i.activatedState === 1)) {
          Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '不支持给未激活的会员打标签，请至少选择一个已激活的会员。',
            cancelButtonProps: { style: { display: 'none' } },
            okText: '我知道了'
          })
          return
        }
        openAttachLabel()
        break
      case 'MoreLabel':
        labelType.value = type
        openMoreLabel()
        break
    }
  }
  const { recordData } = toRefs(recordState)
  return { handleOpenModal, recordData, labelType }
}

export default defineComponent({
  components: { AttachLabel, ImportExcel, RemoveLabel, MoreLabel },
  setup() {
    const ckey = inject('ckey')
    const { columns } = useTableColumns()
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
     * 导表
     * @param {*} rowSelection 选中行数据
     */
    const exportExcel = () => {
      if (!rowSelection.selectedRowKeys?.length) {
        message.warning('没有选择记录，操作失败')
        return
      }
      const datas = rowSelection.selectedRowItems
      const selectionDatas = []
      const selectionIds = []
      const selectionWxUserIds = []
      for (const data of datas) {
        selectionIds.push(data.id)
        selectionWxUserIds.push(data.wxUserId)
        const new_data = {
          用户名: data.uname,
          入会类型: data.type === 0 ? '个人' : '企业',
          联系信息:
            data.type === 0
              ? '【会员姓名】' + data.name + '\n' + '【会员手机号】' + data.phone
              : '【企业名称】' +
                data.companyName +
                '\n【联系人姓名】' +
                data.contactName +
                '\n【联系人手机号】' +
                data.contactPhone,
          入会时间: data.joinedTs ? data.joinedTs : '',
          会内职位: data.postName ? data.postName : '',
          部门: data.departmentName ? data.departmentName : '',
          账号状态: data.status === 1 ? '正常' : '已冻结',
          激活状态: data.activatedState === 1 ? '已激活' : '未激活',
          短信发送状态: data.activatedState === 1 ? '--' : data.sendStatus === 1 ? '已发送' : '未发送',
          商会认证状态: data.authenticate ? '已认证' : '未认证'
        }
        if (data.identityVOList.length > 0) {
          let str = ''
          data.identityVOList.forEach(element => {
            if (element.type === 1) {
              str = str + '【企业】' + element.unit
            } else {
              str = str + '【机构】' + element.unit
            }
            str = str + '【职务】' + element.post
            str = str + '\n'
          })
          new_data['身份信息'] = str
        }
        if (data.memberLabelList && data.memberLabelList.length > 0) {
          const arr = data.memberLabelList.map(item => {
            return item.tagName
          })
          const str = arr.join('、')
          new_data['会员标签'] = str
        }
        if (data.bridgeLabels && data.bridgeLabels.length > 0) {
          const arr = data.bridgeLabels.map(item => {
            return item.name
          })
          const str = arr.join('、')
          new_data['供需标签'] = str
        }
        if (data.tradeBridges && data.tradeBridges.length > 0) {
          const arr = data.tradeBridges.map(item => {
            return item.name
          })
          const str = arr.join('、')
          new_data['行业标签'] = str
        }
        selectionDatas.push(new_data)
      }
      exportJson2Excel('商会会员', selectionDatas)
    }

    const importModelList = [
      {
        name: '个人/企业',
        url: 'https://ysh-cdn.kaidicloud.com/prod/static/%E5%95%86%E4%BC%9A%E6%88%90%E5%91%98%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%20%281%29.xlsx',
        title: '个人和企业会员导入模板.xlsx'
      },
      {
        name: '社会组织',
        url: 'https://ysh-cdn.kaidicloud.com/prod/static/%E5%AF%BC%E5%85%A5%E4%BC%9A%E5%91%98%E6%A8%A1%E6%9D%BF-%E7%A4%BE%E4%BC%9A%E7%BB%84%E7%BB%87.xlsx',
        title: '社会组织会员导入模板.xlsx'
      }
    ]
    /**
     * 下载模板
     */
    const downloadModel = ({ url, title }) => {
      const a = document.createElement('a')
      a.setAttribute('download', title)
      a.setAttribute('href', url)
      a.click()
    }

    /**
     * 发送短信
     * @param {*} rowSelection 选中行数据
     */
    const sendSms = () => {
      if (!rowSelection.selectedRowKeys?.length) {
        message.warning('请至少选择一位未激活的会员')
        return
      }
      Modal.confirm({
        title: '确认发送短信?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '',
        onOk() {
          sendSmsBatch(rowSelection.selectedRowKeys)
          fetchTableData()
        }
      })
    }

    /**
     * 批量认证身份信息
     * @param {*} rowSelection 选中行数据
     */
    const authMember = async () => {
      let selectionWxUserIds = []
      if (rowSelection.selectedRowItems?.length) {
        selectionWxUserIds = rowSelection.selectedRowItems.map(i => i.wxUserId)
      }
      if (!selectionWxUserIds.length) {
        return message.warning('请选择认证数据')
      }
      Modal.confirm({
        title: '商会认证',
        icon: '',
        content: createVNode('div', {}, [
          createVNode('div', {}, '确定给该用户进行商会认证吗？'),
          createVNode('div', { style: 'color:red;' }, '商会认证主要是对该用户的个人信息、企业信息进行认证'),
          createVNode('div', { style: 'color:#ccc;' }, '1、认证后，该用户显示“商会认证”标识'),
          createVNode('div', { style: 'color:#ccc;' }, '2、认证后，可在【商协会成员-详情】页取消认证')
        ]),
        onOk() {
          authorizeMemberAuthBatch({
            ckey: ckey.value,
            wxUserIds: selectionWxUserIds
          }).then(() => {
            fetchTableData()
          })
        }
      })
    }

    /**
     * 批量移除会员
     */
    const deleteMemberBatch = async () => {
      if (!rowSelection.selectedRowItems.length) {
        return message.warning('请至少选择一位会员')
      }
      const ids = rowSelection.selectedRowItems.map(i => i.id)
      Modal.confirm({
        title: '批量移除',
        icon: '',
        content: () => (
          <div>
            <div>
              共<span style="color:red;">{ids.length}</span>位会员，是否确定移除；
            </div>
            <div>移除后可重新导入或添加；</div>
          </div>
        ),
        async onOk() {
          const { state, msg } = await deleteManyMember({
            ids: ids.join(',')
          })
          if (state !== 1) throw msg
          fetchTableData()
        }
      })
    }
    /**
     * 移除会员
     */
    const deleteMember = async record => {
      Modal.confirm({
        title: '移除',
        icon: '',
        content: () => (
          <div>
            <div>是否确定移除将该会员从本会中移除？</div>
            <div>移除后可重新导入或添加；</div>
          </div>
        ),
        async onOk() {
          const { state, msg } = await deleteManyMember({
            ids: record.id
          })
          if (state !== 1) throw msg
          fetchTableData()
        }
      })
    }

    /**
     * 冻结/解冻会员
     * @param {*} record 选中行数据
     */
    const updateMemberStatus = async record => {
      updateStatus({
        id: record.id,
        action: record.status === 0 ? 'active' : 'notactive'
      }).then(() => {
        fetchTableData()
      })
    }

    /**
     * 移除会员标签
     * @param {*} labelIds 已选会员标签
     */
    const handleAttachLabel = labelIds => {
      Labels.attachLabel({
        labelIds,
        wxUserIds: rowSelection.selectedRowItems.map(i => i.wxUserId)
      }).then(() => {
        fetchTableData()
      })
    }

    return {
      columns,
      tableData,
      tableFilter,
      pagination,
      rowSelection,
      loading,
      fetchTableData,
      handleTableChange,
      handleSearch,
      exportExcel,
      importModelList,
      downloadModel,
      sendSms,
      authMember,
      deleteMemberBatch,
      deleteMember,
      updateMemberStatus,
      handleAttachLabel,
      ...useOpenModal(rowSelection)
    }
  }
})
</script>
