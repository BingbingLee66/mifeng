<template>
  <Panel>
    <a-tabs v-model:activeKey="activeKey" @change="handlerSearch">
      <a-tab-pane v-for="item in statusCount" :key="item.key" :tab="`${item.name} (${item.count})`" />
    </a-tabs>
    <PlusTable
      :columns="columns"
      :data-source="list"
      :scroll="{ x: 'max-content' }"
      :search="{ hiddenNum: 4 }"
      :request="handlerSearch"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #searchToolBar>
        <a-button type="primary" html-type="submit">查询</a-button>
      </template>
      <template #toolBar>
        <a-button type="link" @click="applyVisible = true" v-show="activeKey === 'participants'">批量报名</a-button>
        <a-button type="link" @click="importVisible = true" v-show="activeKey === 'participants'"
          >批量导入座位号</a-button
        >
        <a-button type="link" @click="goIpSort" v-show="activeKey === 'participants'">参与人与名片排序设置</a-button>
        <a-button type="primary" :loading="exportLoading" @click="exportExcel()" v-show="activeKey !== 'reject'"
          >导表</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'createdTs'">
          {{ $filters.dateFormat(record.createdTs) }}
        </template>
        <template v-if="column.dataIndex === 'seats' && record.seats">
          <div
            v-for="(item, index) in record.seats"
            :key="index"
            :style="item.status === 1 ? 'color:#409eff;' : item.status === 2 ? 'color:red;' : ''"
          >
            {{ item.seatName }}
          </div>
        </template>
        <template v-if="column.dataIndex === 'understudy'">
          <div>
            <div>{{ record.subUserName }}</div>
            <div>{{ record.subUserPhone }}</div>
            <a-button type="link" @click="initSubDialog(record)">
              {{ record.subUserPhone ? '修改替补人员' : '设置替补人员' }}
            </a-button>
          </div>
        </template>
        <template v-if="column.dataIndex === 'subAttr' && record.subAttr">
          <div
            v-for="(item, index) in record.subAttr"
            :key="index"
            @click="downloadFileAttach(item, record)"
            class="attachment"
          >
            {{ item.filename }}
          </div>
        </template>
        <template v-if="column.dataIndex === 'signTs'">
          {{ $filters.dateFormat(record.signTs) }}
        </template>
        <template v-if="column.dataIndex === 'signoutTs'">
          {{ $filters.dateFormat(record.signoutTs) }}
        </template>
        <template v-if="column.dataIndex === 'rejectDate'">
          {{ $filters.dateFormat(record.rejectDate) }}
        </template>
        <template v-if="column.dataIndex === 'remark'">
          <div>{{ record.remark }}</div>
          <a-button type="link" @click="showRemarkDialog(record)"> 备注 </a-button>
        </template>
      </template>
    </PlusTable>
  </Panel>

  <!-- 设置座位号弹窗 -->
  <a-modal v-model:visible="seatDialogShow" title="设置座位号" width="500px" @ok="saveSeatsSettings">
    <a-row v-for="(v, i) of seats" :key="i" justify="space-around">
      <a-col :span="3">座位{{ i + 1 }}</a-col>
      <template v-if="v.status === 1">
        <a-col :span="4">{{ v.seatName }}</a-col>
        <a-col :span="3" style="color: #999">已就坐</a-col>
      </template>
      <template v-else-if="v.status === 2">
        <a-col :span="4">{{ v.seatName }}</a-col>
        <a-col :span="3" style="color: red">空座</a-col>
        <a-col :span="10" style="color: #999">已安排其他会员上坐，设置为</a-col>
        <a-col :span="4" style="color: #999"><a-button type="link" @click="setSeated(v)">已坐</a-button></a-col>
      </template>
      <template v-else>
        <a-col :span="16"><a-input v-model:value="v.seatName" placeholder="限10字内" maxlength="10" clearable /></a-col>
        <a-col :span="4"><a-button type="link" danger @click="seats.splice(i, 1)">删除</a-button></a-col>
      </template>
    </a-row>
    <a-button
      v-if="!seats[0] || (![1, 2].includes(seats[0].status) && seats.length < maxNum)"
      type="link"
      @click="seats.push({ seatName: '' })"
      >+新增</a-button
    >
  </a-modal>
  <!-- 备注弹窗 -->
  <a-modal v-model:visible="remarkShow" title="备注" width="500px" @ok="remarkSave">
    <a-textarea v-model:value="remarkValue" placeholder="限100字内" :rows="5" />
  </a-modal>
  <!-- 替补人员弹框 -->
  <a-modal v-model:visible="subShow" :title="subTitle" width="500px" @ok="saveSubUser">
    <a-row>
      <a-col :span="16"> <a-input v-model:value="subPhone" placeholder="手机号" /></a-col>
      <a-col :span="4">
        <a-button type="primary" @click="querySubDetail" style="margin-left: 20px">识别</a-button></a-col
      >
    </a-row>
    <template v-if="subInfo">
      <div v-if="subInfo.uavatar">
        <img width="50" height="50" :src="subInfo.uavatar" />
      </div>
      <div v-if="subInfo.userName">{{ subInfo.userName }}</div>
      <div v-if="subInfo.chamberName">{{ subInfo.chamberName }}</div>
    </template>
    <div v-else style="color: red">不存在该用户信息</div>
  </a-modal>
  <!-- 名片详情弹框 -->
  <a-modal v-model:visible="ipCardVisible" title="名片信息" width="560px">
    <div class="ip-card-wrap">
      <div class="avator" :style="{ backgroundImage: `url(${cardInfo.avatar})` }" />
      <div class="content">
        <div class="name">{{ cardInfo.userName || '-' }}</div>
        <div class="post">{{ cardInfo.cardIdentityPost }}</div>
        <div class="company">{{ cardInfo.cardIdentityUnit }}</div>
        <div class="phone">{{ cardInfo.cardPhone }}</div>
        <div class="email">{{ cardInfo.cardEmail }}</div>
        <div class="address">{{ cardInfo.cardAddress }}</div>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="ipCardVisible = false">我知道了</a-button>
    </template>
  </a-modal>
  <a-modal v-model:visible="imgDialog" title="图片预览" width="600px">
    <div class="flex-y-center-center">
      <a-image class="file-img" :src="currentImg" :preview="false" />
    </div>
    <template #footer>
      <a-button type="primary" @click="imgDialog = false">确定</a-button>
    </template>
  </a-modal>
  <!-- 驳回弹框 -->
  <a-modal v-model:visible="rejectShow" title="驳回理由" width="500px" @ok="onRejectApply">
    <a-input v-model:value="rejectValue" placeholder="请输入驳回理由" />
  </a-modal>
  <!-- 签到弹框 -->
  <a-modal v-model:visible="signShow" title="到场人数" width="500px" @ok="onSignin({ status: 1 })">
    <div class="flex-x-center-center" style="padding-bottom: 20px; color: #999">报名 {{ siginMaxnum }} 人</div>
    <div class="flex-x-center-center">
      <a-button :disabled="siginNum <= 1" type="text" style="font-size: 24px; padding: 0 20px" @click="siginNum--"
        >-</a-button
      >
      共到场
      <span style="font-size: 24px; padding: 0 5px">{{ siginNum }}</span>
      人
      <a-button
        :disabled="siginNum >= siginMaxnum"
        type="text"
        style="font-size: 24px; padding: 0 20px"
        @click="siginNum++"
        >+</a-button
      >
    </div>
  </a-modal>
  <a-modal v-model:visible="importVisible" title="导入" width="400px" :footer="null">
    <a-upload
      class="import-upload"
      :file-list="fileList"
      :beforeUpload="beforeUploadFile"
      @change="uploadFile"
      @remove="() => (fileList = [])"
      :maxCount="1"
    >
      <div class="import-upload-content">
        <plus-outlined class="a-icon-plus"></plus-outlined>
        <div class="import-upload-text">上传批量导入表</div>
      </div>
    </a-upload>
    <div class="flex-x-between-center mt-20">
      <a-button type="link" :loading="exportLoading" @click="onDownLoadSignin"> 下载导入表 </a-button>
      <a-button type="primary" @click="onUploadSignin"> 确认导入 </a-button>
    </div>
  </a-modal>
  <!-- 附件详情弹框 -->
  <AttachmentDetail ref="attachmentCom" :attachmentVisible="showAttachment" @update="showAttachment = false" />
  <!-- 批量报名弹窗 -->
  <ImportApplyDialog v-model:visible="applyVisible" :activity-id="activity.id" @fetchData="fetchTableData" />
  <!-- 上传附件弹窗 -->
  <UploadAttachmentDialog
    v-model:visible="uploadVisible"
    :activity-id="activity.id"
    :apply-id="applyId"
    @fetchData="fetchTableData"
  />
</template>
<script>
import { reactive, ref, computed, toRefs, watch } from 'vue'
import { statusList, seatList, SOURCE_TYPE_MAP, MEMBER_TYPE_MAP } from '@business/common/src/activity/constant'
import { useAntTable } from '@business/logics/src/useAntTable'
import { Modal, Upload, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { downloadFile, perviewFile } from '@business/common/src/utils'
import AttachmentDetail from './AttachmentDetail.vue'
import ImportApplyDialog from './ImportApplyDialog'
import UploadAttachmentDialog from './UploadAttachmentDialog'
import {
  getActivitySigninList,
  uploadSigninData,
  modifySigninStatus,
  saveRemark,
  handleSignin,
  querySubInfo,
  setSubUser,
  handleSignOut,
  getSigninStatusCount,
  resetSigninSeat,
  modifySeatStatus,
  getActivityExcel,
  getActivityWaitingExcel,
  getCardDetail
} from '@business/common/src/activity/api/activity-verify'
export default {
  components: { AttachmentDetail, ImportApplyDialog, UploadAttachmentDialog },
  props: {
    activity: {
      type: Object,
      required: true
    },
    initStatus: {
      type: String,
      default: undefined
    }
  },
  setup(props) {
    const countInfo = useCount(props)
    const tableInfo = useTable(props.activity, countInfo)
    const uploadInfo = useUpload(props.activity, tableInfo.fetchTableData)
    const importInfo = useImport()
    const remarkInfo = useRemark(tableInfo.list)
    const subPersonInfo = useSubperson(tableInfo.fetchTableData)
    watch(
      () => props.activity,
      newVal => {
        if (newVal.activityName) {
          tableInfo.activeNameVal.value = newVal.activityName
        }
        if (newVal.activityStartTime) {
          tableInfo.start.value = newVal.activityStartTime
        }
        if (newVal.activityEndTime) {
          tableInfo.end.value = newVal.activityEndTime
        }
      },
      { deep: true }
    )
    return {
      ...tableInfo,
      ...countInfo,
      ...uploadInfo,
      ...remarkInfo,
      ...subPersonInfo,
      ...importInfo
    }
  }
}
function useCount({ activity: { id }, initStatus }) {
  const statusCount = reactive([
    {
      count: 0,
      name: '待审核',
      key: 'waitVerify',
      id: '0'
    },
    {
      count: 0,
      name: '参与人员',
      key: 'participants',
      id: '1'
    },
    {
      count: 0,
      name: '已驳回',
      key: 'reject',
      id: '2'
    }
  ])
  const activeKey = ref('waitVerify')
  const getStatusCount = async () => {
    const { data } = await getSigninStatusCount(id)
    statusCount.forEach(item => {
      item.count = data[item.id]
    })
  }
  const setKey = () => {
    statusCount.forEach(item => {
      if (item.id === initStatus) {
        activeKey.value = item.key
      }
    })
  }
  getStatusCount()
  setKey()
  return { statusCount, activeKey, getStatusCount }
}
function useTable({ id: activityId, activityStartTime, activityEndTime, activityName }, { activeKey, getStatusCount }) {
  const activeNameVal = ref(activityName)
  const start = ref(activityStartTime)
  const end = ref(activityEndTime)
  const activeStatusMap = new Map([
    ['waitVerify', 0],
    ['participants', 1],
    ['reject', 2]
  ])
  const tableColumns = reactive([
    {
      title: '报名人',
      dataIndex: 'userInfo',
      width: 180,
      customRender: ({ record }) => {
        return (
          <div>
            {record.uavatar ? <img style="width:50px;height:50px" src={record.uavatar} /> : ''}
            <div>{record.applicantName}</div>
            <div>{record.applicantPhone}</div>
          </div>
        )
      }
    },
    {
      title: '报名信息',
      dataIndex: 'signs',
      customRender: ({ record }) => {
        const signs = record.signs || []
        const dom = signs.map(v => (
          <div>
            {v.key}：{v.value}
          </div>
        ))
        const cardItemIndex = signs.findIndex(v => v.key === 'card')

        if (cardItemIndex > -1) {
          dom.splice(cardItemIndex, 1)
          dom.push(
            <a-button type="link" onclick={() => getIPCardDetail(signs[cardItemIndex].value)}>
              IP名片详情
            </a-button>
          )
        }

        return <div>{signs && signs.length ? dom : '-'}</div>
      }
    },
    {
      title: '所属商会',
      dataIndex: 'chamberName',
      width: 180
    },
    {
      title: '入会类型',
      dataIndex: 'memberType',
      customRender: ({ record: { memberType } }) => {
        return MEMBER_TYPE_MAP.get(memberType)
      }
    },
    {
      title: '附件',
      dataIndex: 'subAttr',
      width: 240,
      customRender: ({ record }) => {
        try {
          let arr = []
          record.attachment &&
            record.attachment.forEach(element => {
              element.signValue &&
                element.signValue.forEach(e => {
                  arr.push({ filename: e.filename, url: e.url, type: e.type })
                })
            })
          if (arr.length > 3) {
            arr = arr.slice(0, 2)
            arr.push({ filename: '查看更多', type: 'text' })
          }

          if (record.attachmentCommitPermission) {
            return (
              <a-button type="link" onClick={() => onClickUpload(record)}>
                上传
              </a-button>
            )
          } else {
            return arr.map(m => {
              return (
                <div onClick={() => downloadFileAttach(m, record)} class="attachment">
                  {m.filename}
                </div>
              )
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    // {
    //   title: '报名信息',
    //   dataIndex: 'signs',
    //   customRender: ({ record }) => {
    //     const signs = record.signs || []
    //     const dom = signs.map(v => (
    //       <div>
    //         {v.key}：{v.value}
    //       </div>
    //     ))
    //     const cardItemIndex = signs.findIndex(v => v.key === 'card')

    //     if (cardItemIndex > -1) {
    //       dom.splice(cardItemIndex, 1)
    //       dom.push(
    //         <a-button type="link" onclick={() => getIPCardDetail(signs[cardItemIndex].value)}>
    //           IP名片详情
    //         </a-button>
    //       )
    //     }

    //     return <div>{signs && signs.length ? dom : '-'}</div>
    //   }
    // },
    {
      title: '替补',
      dataIndex: 'understudy',
      hideInTable: computed(() => activeKey.value !== 'participants')
    },
    {
      title: '到场人数',
      dataIndex: 'subscribeTotal',
      hideInTable: computed(() => activeKey.value !== 'participants'),
      customRender: ({ record }) => (
        <div>
          <div>预计到场：{record.subscribeTotal}</div>
          <div>
            到场人数：
            <span style={record.realTotal > 0 && record.realTotal < record.subscribeTotal ? 'color:red;' : ''}>
              {record.realTotal ? record.realTotal : '-'}
            </span>
          </div>
        </div>
      )
    },
    {
      title: '座位号',
      dataIndex: 'seats',
      hideInTable: computed(() => activeKey.value !== 'participants'),
      width: 100
    },

    {
      title: '签到',
      dataIndex: 'signStatus',
      hideInTable: computed(() => activeKey.value !== 'participants'),
      customRender: ({ record }) => {
        return record.signStatus === 1 ? '是' : '-'
      },
      width: 80
    },
    {
      title: '签到时间',
      dataIndex: 'signTs',
      hideInTable: computed(() => activeKey.value !== 'participants'),
      width: 180
    },
    {
      title: '签退',
      dataIndex: 'signOutStatus',
      hideInTable: computed(() => activeKey.value !== 'participants'),
      customRender: ({ record }) => {
        return record.signOutStatus === 1 ? '是' : '-'
      },
      width: 80
    },
    {
      title: '签退时间',
      dataIndex: 'signoutTs',
      hideInTable: computed(() => activeKey.value !== 'participants'),
      width: 180
    },
    { title: '报名时间', dataIndex: 'createdTs', width: 180 },
    {
      title: '驳回时间',
      dataIndex: 'rejectDate',
      hideInTable: computed(() => activeKey.value !== 'reject')
    },
    {
      title: '驳回理由',
      dataIndex: 'rejectReason',
      hideInTable: computed(() => activeKey.value !== 'reject')
    },

    {
      title: '来源',
      dataIndex: 'sourceType',
      hideInTable: computed(() => activeKey.value !== 'participants'),
      customRender: ({ record }) => {
        return SOURCE_TYPE_MAP.get(record.sourceType)
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInTable: computed(() => activeKey.value !== 'participants'),
      width: 180
    },
    {
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      customRender: ({ record }) => {
        if (activeKey.value === 'waitVerify') {
          return (
            <div>
              <a-button type="link" onclick={() => modifyStatus({ id: record.id, status: 1 })}>
                通过
              </a-button>
              <br />
              <a-button type="link" onclick={() => showReject({ id: record.id })} danger>
                驳回
              </a-button>
              <br />
              <a-button type="link" onclick={() => showAttachDetail(record)}>
                附件详情
              </a-button>
            </div>
          )
        } else if (activeKey.value === 'participants') {
          return (
            <div>
              <div>
                <a-button type="link" onclick={() => initSeatDialog(record)}>
                  设置座位号
                </a-button>
              </div>
              <div> {generateSigninButton(record)} </div>
              <div> {generateSignOutButton(record)} </div>
              <div>
                <a-button type="link" onclick={() => onDelSignin(record)} danger>
                  移除
                </a-button>
                <br />
                <a-button type="link" onclick={() => showAttachDetail(record)}>
                  附件详情
                </a-button>
              </div>
            </div>
          )
        } else {
          return (
            <a-button type="link" onclick={() => modifyStatus({ id: record.id, status: 4 })}>
              重新审核并通过
            </a-button>
          )
        }
      }
    }
  ])
  const generateSigninButton = row => {
    const now = Date.now()
    // 活动开始前1小时，才可以【签到】，直到已结束，其他时段不显示。
    if (now - start.value >= -1000 * 60 * 60 && now - end.value <= 0) {
      if (row.signStatus === 1) {
        return (
          <a-button type="link" onclick={() => onSignin({ signoutId: row.id, status: 2 })}>
            取消签到
          </a-button>
        )
      } else {
        return (
          <a-button
            type="link"
            onclick={() =>
              signModalShow({
                maxNum: row.subscribeTotal,
                num: row.subscribeTotal,
                siginId: row.id
              })
            }
          >
            签到
          </a-button>
        )
      }
    }
  }
  const generateSignOutButton = row => {
    const now = Date.now()
    // 活动开始后和结束后一小时，才可以【签退】，其他时间不显示；
    if (now - start.value >= 0 && now - end.value <= 1000 * 60 * 60) {
      return row.signOutStatus === 1 ? (
        <a-button type="link" onClick={() => onSignOut({ id: row.id, status: 2 })}>
          取消签退
        </a-button>
      ) : (
        <a-button type="link" onclick={() => onSignOut({ id: row.id, status: 1 })}>
          签退
        </a-button>
      )
    }
  }
  const columns = reactive([
    {
      title: '',
      dataIndex: 'namephone',
      filter: true,
      hideInTable: true,
      valueType: 'text',
      formItemProps: {
        placeholder: '用户名、手机号',
        allowClear: true
      }
    },
    {
      title: '签到状态',
      dataIndex: 'signStatus',
      filter: computed(() => activeKey.value === 'participants'),
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        options: statusList,
        fieldNames: { label: 'name', value: 'id' },
        defaultValue: -1
      }
    },
    {
      title: '空置座位',
      dataIndex: 'seatStatus',
      filter: computed(() => activeKey.value === 'participants'),
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        options: seatList,
        fieldNames: { label: 'name', value: 'id' },
        defaultValue: -1
      }
    },
    ...tableColumns
  ])
  const list = ref([])
  let total
  const tableFilter = reactive({
    namephone: '',
    signStatus: -1,
    seatStatus: -1
  })
  const handlerSearch = (value = {}) => {
    tableFilter.namephone = value.namephone || ''
    tableFilter.signStatus = value.signStatus || -1
    tableFilter.seatStatus = value.seatStatus || -1
    fetchTableData({ current: 1 })
  }
  const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
    async fetchFn({ current: page, pageSize }) {
      const params = {
        page,
        pageSize,
        ...tableFilter,
        status: activeStatusMap.get(activeKey.value)
      }
      const { data } = await getActivitySigninList(activityId, params)
      list.value = handleAttachment(data.list)
      total = data.totalRows || 0
      return { total }
    }
  })
  fetchTableData()
  const handleAttachment = list => {
    if (list.length === 0) return []
    list.forEach(e => {
      e.subAttr = []
      e.attachment &&
        e.attachment.forEach(item => {
          item.signValue &&
            item.signValue.forEach(atta => {
              e.subAttr.push({
                filename: atta.filename,
                url: atta.url,
                type: atta.type
              })
            })
        })
      if (e.subAttr.length > 3) {
        e.subAttr = e.subAttr.slice(0, 2)
        e.subAttr.push({ filename: '查看更多', type: 'text' })
      }
    })
    return list
  }
  const ipCardModal = reactive({ ipCardVisible: false, cardInfo: {} })
  const getIPCardDetail = async cardId => {
    try {
      const { data } = await getCardDetail(cardId)
      ipCardModal.cardInfo = data
      ipCardModal.ipCardVisible = true
    } catch (error) {}
  }
  const seatDialog = reactive({
    seatDialogShow: false,
    seats: [],
    maxNum: 0,
    seatId: ''
  })
  const importModal = reactive({ uploadVisible: false, applyId: '' })
  const onClickUpload = row => {
    importModal.uploadVisible = true
    importModal.applyId = row.id || ''
  }
  const initSeatDialog = row => {
    const value = {
      seatDialogShow: true,
      seats: JSON.parse(JSON.stringify(row.seats || [])),
      maxNum: row.subscribeTotal,
      seatId: row.id
    }
    Object.assign(seatDialog, value)
  }
  const setSeated = async item => {
    const { seatId } = seatDialog
    try {
      await modifySeatStatus(seatId, [item.seatId])
      item.status = 1
      const row = list.value.find(v => v.id === seatId)
      row.seats.find(v => v.seatId === item.seatId).status = 1
    } catch (error) {}
  }
  // const { proxy } = getCurrentInstance()
  const saveSeatsSettings = async () => {
    const { seats, seatId } = seatDialog
    if (!seats.length || seats.some(v => !v.seatName)) {
      return message.warn('座位号不能为空')
    }
    if ([1, 2].includes(seats[0].status)) {
      seatDialog.seatDialogShow = false
      return
    }
    try {
      await resetSigninSeat(seatId, seats)
      fetchTableData()
      seatDialog.seatDialogShow = false
    } catch (error) {}
  }
  const router = useRouter()
  const goIpSort = () => {
    router.push({
      path: '/activity/ipSort',
      query: { activityId }
    })
  }
  const onDelSignin = async row => {
    Modal.confirm({
      title: '是否移除该参与人员？',
      content: '移除后可在已驳回列表找到该用户',
      onOk() {
        modifyStatus({ id: row.id, status: 3 })
      },
      okText: '确认移除'
    })
  }
  const modifyStatus = async ({ id, status, ...data }) => {
    try {
      await modifySigninStatus({ id, status, activityId }, data)
      fetchTableData()
      getStatusCount()
    } catch (error) {}
  }

  const attachModal = reactive({
    currentImg: '',
    imgDialog: false,
    showAttachment: false,
    currentRow: {}
  })
  const downloadFileAttach = async (item, row) => {
    if (item.type === 'text') {
      showAttachDetail(row)
    } else {
      // 改成预览
      if (item.type === 'file') {
        perviewFile(item)
      } else {
        attachModal.currentImg = item.url
        attachModal.imgDialog = true
      }
    }
  }
  const attachmentCom = ref()
  const showAttachDetail = row => {
    attachModal.currentRow = row
    attachModal.showAttachment = true
    attachmentCom.value.formData(row)
  }
  const rejectModal = reactive({
    rejectShow: false,
    rejectValue: '',
    rejectId: ''
  })
  const showReject = ({ id }) => {
    rejectModal.rejectShow = true
    rejectModal.rejectId = id
  }
  const onRejectApply = async () => {
    const { rejectValue: reason, rejectId: id } = rejectModal
    if (!reason) return message.warn('请输入驳回理由')
    try {
      await modifyStatus({ id, status: 2, reason })
      rejectModal.rejectShow = false
    } catch (err) {}
  }
  const siginModal = reactive({
    siginId: '',
    siginMaxnum: 0,
    siginNum: 0,
    signShow: false
  })
  const signModalShow = ({ siginId, maxNum, num }) => {
    siginModal.siginId = siginId
    siginModal.siginMaxnum = maxNum
    siginModal.siginNum = num
    siginModal.signShow = true
  }
  const onSignin = async ({ status, signoutId }) => {
    let { siginId: id, siginNum: num } = siginModal
    if (status === 2) {
      id = signoutId
      num = 0
    }
    try {
      await handleSignin({ id, num, status })
      fetchTableData()
      siginModal.signShow = false
    } catch (error) {}
  }
  const onSignOut = async ({ id, status }) => {
    await handleSignOut({ id, status })
    fetchTableData()
  }
  const exportLoading = ref(false)
  const exportExcel = async (page = 1) => {
    let blob
    let title
    exportLoading.value = true
    try {
      if (activeKey.value === 'waitVerify') {
        blob = await getActivityWaitingExcel(activityId, {
          status: 0,
          page: 1,
          pageSize: 5000,
          type: 2
        })
        title = `【待审核】${activeNameVal.value}.xlsx`
      } else {
        blob = await getActivityExcel(activityId, {
          ...tableFilter,
          status: 1,
          page: 1,
          pageSize: 1,
          type: 2
        })
        title = `【参与人员】${activeNameVal.value}${page}.xlsx`
      }
      downloadFile({
        title,
        url: window.URL.createObjectURL(blob)
      })
    } finally {
      if (total > page * 5000 && activeKey.value === 'waitVerify') {
        exportExcel(page + 1)
      }
    }
    exportLoading.value = false
  }
  return {
    activeKey,
    activeNameVal,
    start,
    end,
    list,
    columns,
    exportLoading,
    handlerSearch,
    fetchTableData,
    pagination,
    handleTableChange,
    loading,
    initSeatDialog,
    ...toRefs(seatDialog),
    setSeated,
    saveSeatsSettings,

    goIpSort,
    onDelSignin,
    ...toRefs(ipCardModal),
    ...toRefs(attachModal),
    ...toRefs(importModal),
    downloadFileAttach,
    onRejectApply,
    ...toRefs(rejectModal),
    ...toRefs(siginModal),
    onSignin,
    exportExcel,
    attachmentCom
  }
}
function useSubperson(fetchTableData) {
  // const { proxy } = getCurrentInstance()
  const subModal = reactive({
    subShow: false,
    subTitle: '',
    subPhone: '',
    subId: '',
    subInfo: {}
  })
  const initSubDialog = row => {
    subModal.subShow = true
    subModal.subTitle = row.subUserPhone ? '修改替补人员' : '设置替补人员'
    subModal.subPhone = row.subUserPhone
    subModal.subId = row.id
    subModal.subInfo = {}
  }
  const querySubDetail = async () => {
    if (!subModal.subPhone) {
      return message.warn('手机号不能为空')
    }
    const { data } = await querySubInfo(subModal.subPhone)
    subModal.subInfo = data
  }
  const saveSubUser = async () => {
    const { subPhone: phone, subId: id } = subModal
    if (!phone) return message.warn('请输入替补人员手机号')
    if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(phone)) {
      return message.warn('手机号格式错误')
    }
    try {
      await setSubUser({ phone, id })
      fetchTableData()
      subModal.subShow = false
    } catch (error) {}
  }
  return { ...toRefs(subModal), initSubDialog, querySubDetail, saveSubUser }
}
function useRemark(list) {
  const remarkModal = reactive({
    remarkShow: false,
    remarkValue: '',
    remarkId: ''
  })
  const showRemarkDialog = row => {
    remarkModal.remarkShow = true
    remarkModal.remarkId = row.id
    remarkModal.remarkValue = row.remark || ''
  }
  const remarkSave = async () => {
    const { remarkValue: remark, remarkId } = remarkModal
    try {
      await saveRemark(remarkId, { remark })
      const item = list.value.find(v => v.id === remarkId)
      item.remark = remark
      remarkModal.remarkShow = false
    } catch (error) {}
  }
  return { showRemarkDialog, ...toRefs(remarkModal), remarkSave }
}
function useUpload({ id: activityId }, fetchTableData) {
  // const { proxy } = getCurrentInstance()
  const importVisible = ref(false)
  const beforeUploadFile = file => {
    if (
      !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(
        file.type
      )
    ) {
      message.error('上传文件只能是 XLSX 或 XLS 格式!')
      return Upload.LIST_IGNORE
    }
  }
  const fileList = ref([])
  const uploadFile = e => {
    fileList.value = [e.file.originFileObj]
  }
  const onUploadSignin = async () => {
    if (!fileList.value.length) return message.warn('请选择上传文件')
    const formData = new FormData()
    formData.append('activityId', activityId)
    formData.append('file', fileList.value[0])
    try {
      await uploadSigninData(formData)
      importVisible.value = false
      fetchTableData()
    } catch (error) {}
  }
  const onDownLoadSignin = async () => {
    downloadFile({
      title: '报名信息模板表.xlsx',
      url: `${process.env.VUE_APP_BASE_API}/api/ec/singin/download/dynamicTemplate/${activityId}`
    })
  }
  return {
    importVisible,
    beforeUploadFile,
    uploadFile,
    fileList,
    onUploadSignin,
    onDownLoadSignin
  }
}
function useImport() {
  const applyVisible = ref(false)

  return { applyVisible }
}
</script>
<style lang="scss" scoped>
.attachment {
  color: #1890ff;
  cursor: pointer;
}
.ip-card-wrap {
  display: flex;
  border: 1px solid #858585;
  border-radius: 10px;
  overflow: hidden;
  .avator {
    position: relative;
    width: 180px;
    height: 180px;
    background-color: #ccc;
    flex-shrink: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    overflow: hidden;
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      right: -50px;
      height: 100%;
      border: 50px solid transparent;
      border-bottom: 180px solid white;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 20px 0 10px;
  }
  .name {
    font-size: 20px;
    font-weight: bold;
  }
  .post,
  .company,
  .phone,
  .emial {
    line-height: 26px;
  }
  .phone {
    margin-top: 10px;
  }
  .address {
    margin-top: 6px;
  }
}
.import-upload-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 350px;
  height: 200px;
  border: 1px dashed #e3e3e3;
  border-radius: 10px;
  .a-icon-plus {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .import-upload-text {
    font-size: 20px;
    color: #999;
  }
}
</style>
