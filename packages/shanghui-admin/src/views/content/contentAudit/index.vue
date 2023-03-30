<template>
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8" @change="handleTabChange">
    <a-tab-pane :key="CONTENTAUDIT_TYPE.ARTICLE" tab="文章" />
    <a-tab-pane :key="CONTENTAUDIT_TYPE.SHARE" tab="会员分享" />
    <a-tab-pane :key="CONTENTAUDIT_TYPE.COMPANDYNAMIC" tab="企业动态" />
    <a-tab-pane :key="CONTENTAUDIT_TYPE.COMPANWEBSITE" tab="企业官网" />
    <a-tab-pane :key="CONTENTAUDIT_TYPE.COMMENT" tab="评论" force-render />
  </a-tabs>
  <PlusTable
    row-key="id"
    :search="{
      hiddenNum: 4
    }"
    :loading="loading"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :request="handleSearch"
    @change="handleTableChange"
    bordered
  >
    <template #searchToolBar="{ form }">
      <a-button v-action="'查询'" type="primary" html-type="submit">查询</a-button>
      <a-button
        style="margin: 0 8px"
        @click="
          () => {
            form.resetFields()
          }
        "
        >重置</a-button
      >
    </template>
    <template #toolBar>
      <span class="tips">待审核指通过了微信内容安全审核，待审核的内容前端可见，人工审核不通过之后，前端不可见。</span>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'contentHtml'">
        <div class="myspan" v-html="record.contentHtml"></div>
      </template>
      <template v-if="column.key === 'handle'">
        <a-button type="link" @click="detail(record)"> 详情 </a-button>
        <span v-if="activeName !== CONTENTAUDIT_TYPE.COMMENT">
          <a-button type="link" :disabled="record.auditStatus !== PASS_STATE_TYPE.NOHASREAD" @click="rowPass(record)">
            通过
          </a-button>
          <a-button
            type="link"
            danger
            :disabled="record.auditStatus !== PASS_STATE_TYPE.NOHASREAD"
            @click="showRejectModel(record)"
            >不通过
          </a-button>
        </span>
        <span v-else>
          <a-button type="link" style="color: #cccccc" v-if="record.status === 0" @click="rowON(record)">
            上架
          </a-button>
          <a-button type="link" v-if="record.status === 1" @click="rowOff(record)">下架 </a-button>
          <a-button type="link" danger @click="rowDel(record)">删除 </a-button>
        </span>
      </template>
    </template>
  </PlusTable>
  <AModal
    v-model:visible="detailVisible"
    title="详情"
    :footer="null"
    width="100%"
    :centered="true"
    @cancel="handleVideoClose"
  >
    <div class="detail-body">
      <div class="detail-title">{{ detailObj.title }}</div>
      <div v-if="isHasVideo">
        <VideoUpLoad v-if="videoValue[0].videoCoverURL" class="detail-video" v-model:value="videoValue" />
        <AliyunVideoPlayer v-else :vid="videoValue[0].vid" vheight="500px" />
      </div>
      <div
        class="detail-content"
        v-html="activeName === CONTENTAUDIT_TYPE.COMPANWEBSITE ? detailObj.content : detailObj.contentHtml"
      />
    </div>
    <div class="detail-pass" v-if="detailObj.auditStatus === PASS_STATE_TYPE.NOHASREAD">
      <a-button type="primary" v-action="'通过'" @click="rowPass(detailRecord)"> 通过 </a-button>
      <a-button type="primary" danger v-action="'不通过'" @click="showRejectModel(detailRecord)"> 不通过 </a-button>
    </div>
    <div v-else>
      <div v-if="activeName !== CONTENTAUDIT_TYPE.COMMENT">
        <p>状态：{{ COLUMND_AUDIT_STATUS_MAP.get(detailObj.auditStatus) }}</p>
        <p v-if="detailObj.auditStatus === PASS_STATE_TYPE.NOPASS">
          不通过原因：{{ isHasChamberFilter ? detailObj.auditRemark : detailObj.rejectRemark }}
        </p>
        <p>操作人：{{ isHasChamberFilter ? detailObj.operator : detailObj.auditor }}</p>
        <p>操作时间：{{ detailObj.updatedTs }}</p>
      </div>
      <div class="flex-x-center-center">
        <a-button class="mt-2" type="primary" @click="detailVisible = false"> 我知道了</a-button>
      </div>
    </div>
  </AModal>
  <AModal v-model:visible="rejectVisible" title="不通过原因" width="100%" :centered="true" @ok="reject">
    <a-radio-group v-model:value="rejectData.remark">
      <a-radio :value="REJECT_RADIO_TYPE.CONTENTERROR">1、{{ REJECT_RADIO_TYPE.CONTENTERROR }}</a-radio>
      <a-radio :value="REJECT_RADIO_TYPE.ADS">2、{{ REJECT_RADIO_TYPE.ADS }}</a-radio>
      <a-radio :value="REJECT_RADIO_TYPE.OTHER">3、{{ REJECT_RADIO_TYPE.OTHER }}</a-radio>
    </a-radio-group>
  </AModal>
  <AModal v-model:visible="reposVisible" title="举报信息" width="100%" :centered="true" :footer="null">
    <div v-for="(item, index) in repostInfoList" :key="index">
      <div>举报人信息：{{ item.uname }}</div>
      <div>举报人手机号：{{ item.phone }}</div>
      <div>举报内容：{{ item.reason }}</div>
      <div>举报时间：{{ dayjs(Number(createdTs)).format('YYYY-MM-DD HH:mm:ss') }}</div>
    </div>
    <div class="flex-x-center-center">
      <a-button class="mt-2" type="primary" @click="reposVisible = false"> 我知道了</a-button>
    </div>
  </AModal>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import VideoUpLoad from '@business/components/src/upload/video-uploader'
import AliyunVideoPlayer from '@business/components/src/aliyunVideoPlayer'
import { ref, reactive, onMounted, computed, h } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import {
  getAuditList,
  getDetail,
  getCompanyDetail,
  updateAudit,
  updateCompanyAudit,
  getCompanyAuditList,
  getArticleCommentList,
  updateCommentStatus
} from '@business/common/src/content/api/article'
import { getReportList } from '@/api/home/supplyDemandManger'
import { getChamberOptions } from '@/api/finance/finance'
import {
  CONTENTAUDIT_TYPE,
  COLUMND_TITLE_TYPE_MAP,
  COLUMND_DYNAMIC_TYPE_MAP,
  COLUMND_AUDIT_STATUS_MAP,
  REJECT_RADIO_TYPE,
  PASS_STATE_TYPE
} from '../../../constant/content'
import { Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
const activeName = ref(CONTENTAUDIT_TYPE.ARTICLE)
const rejectVisible = ref(false)
const chamberOptions = ref([])
const rejectData = reactive({
  remark: REJECT_RADIO_TYPE.CONTENTERROR,
  rejectId: null
})
const videoValue = ref([])
const tableColumns = ref([
  {
    title: '标题',
    key: 'title',
    hideInTable: true,
    customRender: ({ record }) => {
      return [CONTENTAUDIT_TYPE.ARTICLE, CONTENTAUDIT_TYPE.SHARE, CONTENTAUDIT_TYPE.COMPANDYNAMIC].includes(
        activeName.value
      )
        ? record.title
          ? record.title
          : record.contentColumn
          ? record.contentColumn
          : '[ 无标题 ]'
        : COLUMND_TITLE_TYPE_MAP.get(record.contentType)
    }
  },
  {
    title: '内容',
    key: 'contentHtml',
    hideInTable: true
  },
  {
    title: '动态类型',
    hideInTable: true,
    customRender: ({ record }) => {
      return COLUMND_DYNAMIC_TYPE_MAP.has(record.contentType)
        ? COLUMND_DYNAMIC_TYPE_MAP.get(record.contentType)
        : '其他'
    }
  },
  {
    title: '来源商会',
    hideInTable: true,
    customRender: ({ record }) => {
      return isHasChamberFilter.value
        ? record.chamberName
          ? record.chamberName
          : '--'
        : record.uname
        ? record.uname
        : '--'
    }
  },
  {
    title: '来源',
    hideInTable: true,
    customRender: ({ record }) => {
      return record.sourceName ? record.sourceName : '--'
    }
  },
  {
    title: '发布时间',
    hideInTable: true,
    customRender: ({ record }) => {
      return activeName.value === CONTENTAUDIT_TYPE.ARTICLE
        ? record.publishTs
        : activeName.value === CONTENTAUDIT_TYPE.COMMENT
        ? record.createdTs
        : record.updatedTs
    }
  },
  {
    title: '审核状态',
    hideInTable: true,
    dataIndex: 'auditStatus',
    customRender: ({ record }) => {
      return (
        <a-badge
          status={{ 0: 'processing', 1: 'success', 2: 'error' }[record.auditStatus]}
          text={COLUMND_AUDIT_STATUS_MAP.get(record.auditStatus)}
        />
      )
    }
  },
  {
    title: '举报信息',
    hideInTable: true,
    customRender: ({ record }) => {
      return !+record.repostNum ? (
        <a-button disabled type="link">
          {record.repostNum}
        </a-button>
      ) : (
        <a-button
          type="link"
          onclick={() => {
            showRepostInfo()
          }}
        >
          {record.repostNum}
        </a-button>
      )
    }
  },
  {
    title: '评论内容',
    hideInTable: true,
    customRender: ({ record }) => {
      return record.commentContent
    }
  },
  {
    title: '发布者',
    hideInTable: true,
    dataIndex: 'uname'
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInTable: true,
    customRender: ({ record }) => {
      return (
        <a-badge
          status={{ 0: 'error', 1: 'success' }[record.status]}
          text={{ 0: '已下架', 1: '已发布' }[record.status]}
        />
      )
    }
  },
  {
    title: '操作',
    key: 'handle'
  }
])

const filterColums = ref([
  {
    title: '来源商会',
    hideInTable: true,
    dataIndex: 'ckey',
    filter: computed(() => {
      return isHasChamberFilter.value
    }),
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: computed(() => {
        return chamberOptions.value
      })
    }
  },
  {
    title: '动态类型',
    hideInTable: true,
    dataIndex: 'dynamicType',
    filter: computed(() => {
      return [CONTENTAUDIT_TYPE.SHARE, CONTENTAUDIT_TYPE.COMPANDYNAMIC].includes(activeName.value)
    }),
    valueType: 'select',
    initialValue: '0',
    formItemProps: {
      options: [
        { label: '全部', value: '0' },
        { label: '图文动态', value: '1' },
        { label: '视频动态', value: '2' }
      ]
    }
  },
  {
    title: '审核状态',
    hideInTable: true,
    dataIndex: 'auditStatus',
    filter: computed(() => {
      return activeName.value !== CONTENTAUDIT_TYPE.COMMENT
    }),
    valueType: 'select',
    initialValue: 0,
    formItemProps: {
      options: [
        { label: '所有', value: -1 },
        { label: '待审核', value: 0 },
        { label: '审核通过', value: 1 },
        { label: '审核不通过', value: 2 }
      ]
    }
  },
  {
    title: '评论内容',
    hideInTable: true,
    dataIndex: 'commentKey',
    filter: computed(() => {
      return activeName.value === CONTENTAUDIT_TYPE.COMMENT
    }),
    valueType: 'text'
  },
  {
    title: '发布者',
    hideInTable: true,
    dataIndex: 'uname',
    filter: computed(() => {
      return activeName.value === CONTENTAUDIT_TYPE.COMMENT
    }),
    valueType: 'text'
  },
  {
    title: '状态',
    dataIndex: 'status',
    hideInTable: true,
    filter: computed(() => {
      return activeName.value === CONTENTAUDIT_TYPE.COMMENT
    }),
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: [
        { label: '所有', value: -1 },
        { label: '已下架', value: 0 },
        { label: '已发布', value: 1 }
      ]
    }
  },
  {
    title: '发布时间',
    hideInTable: true,
    dataIndex: computed(() => {
      return activeName.value !== CONTENTAUDIT_TYPE.COMMENT ? 'publishTimeType' : 'queryDate'
    }),
    filter: true,
    initialValue: computed(() => {
      return activeName.value !== CONTENTAUDIT_TYPE.COMMENT ? 4 : null
    }),
    valueType: computed(() => {
      return activeName.value !== CONTENTAUDIT_TYPE.COMMENT ? 'select' : 'dateTimeRange'
    }),
    formItemProps: computed(() => {
      return activeName.value !== CONTENTAUDIT_TYPE.COMMENT
        ? {
            options: [
              { label: '全部', value: 0 },
              { label: '24h内', value: 1 },
              { label: '3天内', value: 2 },
              { label: '7天内', value: 3 },
              { label: '一个月内', value: 4 }
            ]
          }
        : { valueFormat: 'YYYY-MM-DD' }
    })
  }
])
const columns = ref([...tableColumns.value, ...filterColums.value])
const tableData = ref([])
const query = reactive({
  publishType: 1,
  ckey: '',
  publishTimeType: 4,
  auditStatus: 0,
  dynamicType: '0'
})
const queryComment = reactive({
  commentKey: '', // 评论关键字
  uname: '', // 发布者
  status: -1
})
const detailObj = reactive({
  title: '',
  contentHtml: '',
  vid: ''
})
const detailVisible = ref(false)

const isHasChamberFilter = computed(() => {
  return [CONTENTAUDIT_TYPE.ARTICLE, CONTENTAUDIT_TYPE.SHARE, CONTENTAUDIT_TYPE.COMPANDYNAMIC].includes(
    activeName.value
  )
})
const isHasVideo = computed(() => {
  return (
    [CONTENTAUDIT_TYPE.ARTICLE, CONTENTAUDIT_TYPE.SHARE, CONTENTAUDIT_TYPE.COMPANDYNAMIC].includes(activeName.value) &&
    detailObj.vid
  )
})

// 商会列表
const chamberList = async () => {
  const {
    data: { data }
  } = await getChamberOptions()
  chamberOptions.value = data
  chamberOptions.value.unshift(
    {
      label: '全部',
      value: ''
    },
    {
      label: '凯迪云商会',
      value: 'kaidiyun'
    }
  )
  query.ckey = chamberOptions.value[0].value
}

const detailRecord = ref({})
const detail = async record => {
  detailRecord.value = record
  const params = {
    id: record.id
  }
  if (activeName.value === CONTENTAUDIT_TYPE.COMMENT) {
    detailObj.title = '评论详情'
    detailObj.contentHtml = record.commentContent
    detailObj.auditStatus = null
  } else if (isHasChamberFilter.value) {
    const {
      data: { dtl }
    } = await getDetail(params)
    Object.assign(detailObj, dtl)
    if (dtl.vid) {
      videoValue.value = [{ vid: dtl.vid, videoCoverURL: dtl.videoCoverURL }]
    }
  } else {
    const {
      data: { companyAudit }
    } = await getCompanyDetail(params)
    Object.assign(detailObj, companyAudit)
  }
  detailVisible.value = true
}

const handleVideoClose = () => {
  videoValue.value = [{ vid: null, videoCoverURL: null }]
}

const rowPass = async record => {
  const auditParams = {
    articleIds: [record.id],
    auditStatus: 1
  }
  const companyParams = {
    ids: [record.id],
    auditStatus: 1
  }
  const fetchApi = {
    1: updateAudit,
    2: updateCompanyAudit
  }[isHasChamberFilter.value ? 1 : 2]
  await fetchApi(isHasChamberFilter.value ? auditParams : companyParams)
  detailVisible.value = false
  fetchTableData()
}

const showRejectModel = async record => {
  rejectData.rejectId = [record.id]
  rejectVisible.value = true
}

const reject = async () => {
  const auditParams = {
    articleIds: rejectData.rejectId,
    remark: rejectData.remark,
    auditStatus: 2
  }
  const companyParams = {
    ids: rejectData.rejectId,
    remark: rejectData.remark,
    auditStatus: 2
  }
  const fetchApi = {
    1: updateAudit,
    2: updateCompanyAudit
  }[isHasChamberFilter.value ? 1 : 2]
  await fetchApi(isHasChamberFilter.value ? auditParams : companyParams)
  fetchTableData()
  detailVisible.value = false
  rejectVisible.value = false
}

const rowOff = record => {
  Modal.confirm({
    title: '提示',
    content: '该评论下架后，对应的回复也将不再显示',
    async onOk() {
      const params = {
        id: record.id,
        status: 0
      }
      await updateCommentStatus(params)
      fetchTableData()
    }
  })
}
const rowON = async record => {
  const params = {
    id: record.id,
    status: 1
  }
  await updateCommentStatus(params)
  fetchTableData()
}

const rowDel = record => {
  Modal.confirm({
    title: '提示',
    content: h('p', null, [h('p', null, '删除为不可回复操作，评论被删除后，'), h('p', null, '对应的回复也将一并删除')]),
    async onOk() {
      const params = {
        id: record.id,
        status: 2
      }
      await updateCommentStatus(params)
      fetchTableData()
    }
  })
}

const reposVisible = ref(false)
const repostInfoList = ref([])
const showRepostInfo = async record => {
  const {
    data: { list }
  } = await getReportList({ tarId: record.id, type: 1, page: 1, pageSize: 100 })
  reposVisible.value = true
  repostInfoList.value = list
}

const orgQuery = reactive({})
const orgQueryComment = reactive({})
const orgDetailObj = reactive({})
onMounted(async () => {
  const activename = parseInt(window.localStorage.getItem('activename-audit'))
  if (activename) {
    activeName.value = activename
  }
  Object.assign(orgQuery, query)
  Object.assign(orgQueryComment, queryComment)
  Object.assign(orgDetailObj, detailObj)
  await chamberList()
  await handleTabChange()
})
const fetchFn = async pageOption => {
  const pageParams = {
    pageSize: pageOption.pageSize,
    page: pageOption.current
  }
  if (isHasChamberFilter.value) {
    const params = {
      ...pageParams,
      ckey: query.ckey,
      publishType: activeName.value,
      publishTimeType: query.publishTimeType,
      auditStatus: query.auditStatus,
      dynamicType: query.dynamicType
    }
    const {
      data: { data }
    } = await getAuditList(params)
    tableData.value = data.list
    return {
      total: data.totalRows
    }
  } else if (activeName.value === CONTENTAUDIT_TYPE.COMPANWEBSITE) {
    const params = {
      ...pageParams,
      publishType: activeName.value,
      publishTimeType: query.publishTimeType,
      auditStatus: query.auditStatus
    }
    const {
      data: { page }
    } = await getCompanyAuditList(params)
    tableData.value = page.list
    return {
      total: page.totalRows
    }
  } else if (activeName.value === CONTENTAUDIT_TYPE.COMMENT) {
    const params = reactive({
      ...pageParams,
      ...queryComment
    })
    const { data } = await getArticleCommentList(params)
    tableData.value = data.list
    return {
      total: data.totalRows
    }
  }
}
const { pagination, fetchTableData, loading, handleTableChange } = useAntTable({ fetchFn })

const handleTabChange = async () => {
  window.localStorage.setItem('activename-audit', activeName.value)
  Object.assign(query, orgQuery)
  Object.assign(detailObj, orgDetailObj)
  switch (activeName.value) {
    case CONTENTAUDIT_TYPE.ARTICLE:
      showColumns(['标题', '来源商会', '发布时间', '审核状态', '举报信息', '操作'])
      break
    case CONTENTAUDIT_TYPE.SHARE:
      showColumns(['内容', '动态类型', '来源', '来源商会', '发布时间', '审核状态', '操作'])
      break
    case CONTENTAUDIT_TYPE.COMPANDYNAMIC:
      showColumns(['标题', '动态类型', '来源', '来源商会', '发布时间', '审核状态', '操作'])
      break
    case CONTENTAUDIT_TYPE.COMPANWEBSITE:
      showColumns(['标题', '来源商会', '发布时间', '审核状态', '操作'])
      break
    case CONTENTAUDIT_TYPE.COMMENT:
      Object.assign(queryComment, orgQueryComment)
      showColumns(['评论内容', '发布者', '发布时间', '状态', '操作'])
      break
  }
  fetchTableData()
}
const showColumns = array => {
  tableColumns.value.forEach(item => {
    array.includes(item.title) ? (item.hideInTable = false) : (item.hideInTable = true)
  })
}

const handleSearch = value => {
  if (activeName.value === CONTENTAUDIT_TYPE.COMMENT) {
    const [startTs, endTs] = value.queryDate ? value.queryDate : []
    value.startTs = startTs
    value.endTs = endTs
    value.queryDate = null
    Object.assign(queryComment, value)
  } else {
    Object.assign(query, value)
  }
  fetchTableData({ current: 1 })
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.myspan {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.myspan img {
  width: 20%;
  height: 20%;
}
.tips {
  color: #ccc;
}
.detail-body {
  height: 60vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgb(192, 192, 192);
  }
  border: 1px solid #d9dde2;

  .detail-remark {
    font-size: 19px;
    font-weight: 500;
    margin: 0px 20px;
  }
  .detail-title {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    margin: 20px 40px;
  }
  .detail-content {
    margin: 10px;
  }
  .detail-video {
    margin: auto;
  }
  :deep(.Video-box) {
    margin: auto;
    text-align: center;
    width: 300px;
    height: 300px;
  }
  :deep(.Video-box .Video-box-image) {
    width: 280px !important;
    height: 280px !important;
  }
  :deep(.ant-upload-list-picture-card-container) {
    margin: auto;
    text-align: center;
    width: 300px;
    height: 300px;
  }
  :deep(.ant-upload-list) {
    display: flex;
    justify-content: center;
  }
  :deep(.Video-box-del) {
    display: none;
  }
}
.detail-pass {
  width: 100%;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
