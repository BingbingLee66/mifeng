<template>
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8" @change="handleTabChange">
    <a-tab-pane :key="CRAWLER_TYPE.COLLRCTION" tab="采集结果" />
    <a-tab-pane :key="CRAWLER_TYPE.RECYCLE" tab="回收站" force-render />
  </a-tabs>
  <PlusTable
    row-key="id"
    :loading="loading"
    :columns="crawlerColumns"
    :data-source="tableData"
    :pagination="pagination"
    :request="handleSearch"
    @change="handleTableChange"
    :row-selection="{
      onChange: onSelectChange,
      selectedRowKeys: selectedTableRow,
      preserveSelectedRowKeys: true
    }"
    bordered
  >
    <template #searchToolBar="{ form }">
      <a-button
        v-action="activeName === CRAWLER_TYPE.COLLRCTION ? '采集结果-查询' : '回收站-查询'"
        type="primary"
        html-type="submit"
        >查询</a-button
      >
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
      <div v-if="activeName === CRAWLER_TYPE.COLLRCTION">
        <span>注：移入回收站的文章是不会发布出去的</span>
        <a-button class="ml-3" type="primary" @click="openPublishBatch" v-action="'采集结果-发布'">发布</a-button>
        <a-button class="ml-3" type="primary" danger @click="batchToRecycleBin" v-action="'采集结果-移入回收站'">
          移入回收站
        </a-button>
      </div>
      <div v-if="activeName === CRAWLER_TYPE.RECYCLE">
        <span>注：回收站的文章“删除”后将从数据库彻底删除</span>
        <a-button class="ml-3" type="primary" danger @click="batchDelArticle" v-action="'回收站-删除'">
          <delete-filled />删除
        </a-button>
      </div>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'handle'">
        <div v-if="activeName === CRAWLER_TYPE.COLLRCTION">
          <a-button type="link" v-action="'采集结果-预览'" @click="openDetail(record)"> 预览 </a-button>
          <a-button type="link" v-action="'采集结果-编辑'" @click="edit(record)"> 编辑 </a-button>
          <a-button type="link" v-action="'采集结果-发布'" @click="openPublish(record)"> 发布 </a-button>
          <a-button type="link" danger v-action="'采集结果-移入回收站'" @click="toRecycle(record)">
            移入回收站
          </a-button>
        </div>
        <div v-if="activeName === CRAWLER_TYPE.RECYCLE">
          <a-button type="link" v-action="'回收站-预览'" @click="openDetail(record)"> 预览 </a-button>
          <a-button type="link" v-action="'回收站-编辑'" @click="edit(record)"> 编辑 </a-button>
          <a-button type="link" v-action="'回收站-移出'" @click="toCollectionRes(record)"> 移出 </a-button>
          <a-button type="link" danger v-action="'回收站-删除'" @click="delArticle(record)"> 删除 </a-button>
        </div>
      </template>
    </template>
  </PlusTable>
  <AModal v-model:visible="contentHtmlVisible" title="详情" :footer="null" width="100%" :centered="true">
    <div class="detail-body">
      <div class="detail-title">{{ ModelContent.title }}</div>
      <div class="detail-content" v-html="ModelContent.html" />
    </div>
  </AModal>
  <Publish
    v-model:publishVisible="publishVisible"
    v-model:pubObj="formObj"
    :options="contentColumnOptions"
    @freshData="freshTableData"
  ></Publish>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import { ref, reactive, onMounted, getCurrentInstance, h } from 'vue'
import Publish from './compontents/publish.vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import {
  getWebnameOptions,
  getChannelOptions,
  getCollectList,
  getRecycleList,
  getDetail,
  toRecycleBin,
  toCollectionResult,
  del
} from '@/api/content/crawler'
import { getContentColumnOptions } from '@/api/content/columnsetup'
import cloneDeep from 'lodash/cloneDeep'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
import { CRAWLER_TYPE, CRAWLER_CLOUMN, CRAWLER_PUBLISH_STATUS } from '../../../constant/content'
const activeName = ref(CRAWLER_TYPE.COLLRCTION)
const crawlerOptions = ref([
  {
    label: '所有',
    value: -1
  }
])
const channelOptions = ref([
  {
    label: '所有',
    value: -1
  }
])
const contentColumnOptions = ref([])
const getWebNameType = async () => {
  const {
    data: { data }
  } = await getWebnameOptions()
  data.forEach(item => {
    crawlerOptions.value.push({
      label: item.label,
      value: item.value
    })
  })
}
const getChannelType = async () => {
  const {
    data: { data }
  } = await getChannelOptions()
  data.forEach(item => {
    channelOptions.value.push({
      label: item.label,
      value: item.value
    })
  })
}
const getContentColumnType = async () => {
  const {
    data: { data }
  } = await getContentColumnOptions()
  contentColumnOptions.value = data
}
const crawlerColumns = ref([
  {
    title: '文章标题',
    dataIndex: 'title'
  },
  {
    title: '发布时间',
    dataIndex: 'publishTs',
    width: 160
  },
  {
    title: '采集时间',
    dataIndex: 'createdTs',
    width: 160
  },
  {
    title: '采集网站',
    dataIndex: 'websiteName',
    width: 200
  },
  {
    title: '采集网站',
    dataIndex: 'crawlerId',
    hideInTable: true,
    filter: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: crawlerOptions.value
    }
  },
  {
    title: '采集频道',
    dataIndex: 'channel',
    filter: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: channelOptions.value
    },
    width: 130
  },
  {
    title: '回收时间',
    dataIndex: 'recycledTs',
    hideInTable: true,
    width: 160
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    hideInTable: true,
    width: 120
  },
  {
    title: '操作',
    key: 'handle'
  }
])

const query = reactive({
  crawlerId: -1,
  channel: -1
})
const formObj = reactive({
  contentColumnId: '',
  status: CRAWLER_PUBLISH_STATUS.IMMEDIATE,
  publishTs: ''
})
const { proxy } = getCurrentInstance()
const tableData = ref([])
const chooseTableData = ref([]) // 选中数组
const selectedTableRow = ref([])
const router = useRouter()
// 编辑栏目
const edit = row => {
  router.push({
    name: '编辑采文',
    query: {
      articleId: row.id
    }
  })
}
// 文章详情
const contentHtmlVisible = ref(false)
const ModelContent = reactive({
  title: null,
  html: null
})
const openDetail = async row => {
  const params = {
    id: row.id
  }
  const {
    data: { dtl }
  } = await getDetail(params)
  ModelContent.title = dtl.title
  ModelContent.html = dtl.webContent
  contentHtmlVisible.value = true
}
// 单文章发布
const publishVisible = ref(false)
const openPublish = row => {
  formObj.id = row.id
  formObj.contentColumnId = ''
  formObj.count = 1
  formObj.status = CRAWLER_PUBLISH_STATUS.IMMEDIATE
  formObj.publishTs = ''
  publishVisible.value = true
}
// 多文章发布
const openPublishBatch = () => {
  if (chooseTableData.value.length === 0) {
    proxy.$message.error('没有选择记录，操作失败')
    return
  }
  formObj.contentColumnId = ''
  formObj.selectionDatas = chooseTableData.value
  formObj.count = chooseTableData.value.length
  formObj.status = CRAWLER_PUBLISH_STATUS.IMMEDIATE
  formObj.publishTs = ''
  publishVisible.value = true
}
// 单文章回收
const toRecycle = async row => {
  const params = {
    articleIds: [row.id]
  }
  await toRecycleBin(params)
  freshTableData()
  proxy.$message.success('移入回收站成功')
}
// 多文章回收
const batchToRecycleBin = async () => {
  if (chooseTableData.value.length === 0) {
    proxy.$message.error('没有选择记录，操作失败')
    return
  }
  const params = {
    articleIds: chooseTableData.value.map(item => item.id)
  }
  await toRecycleBin(params)
  freshTableData()
  proxy.$message.success('移入回收站成功')
}
// 单文章移出回收
const toCollectionRes = async row => {
  const params = {
    id: row.id
  }
  await toCollectionResult(params)
  freshTableData()
  proxy.$message.success('移出回收站成功')
}
// 单文章删除
const delArticle = row => {
  const params = {
    articleIds: []
  }
  params.articleIds.push(row.id)
  useDelModel(params)
}
// 多文章删除
const batchDelArticle = () => {
  if (chooseTableData.value.length === 0) {
    proxy.$message.error('没有选择记录，操作失败')
    return
  }
  const params = {
    articleIds: chooseTableData.value.map(item => item.id)
  }
  useDelModel(params)
}
const useDelModel = params => {
  Modal.confirm({
    title: '确定删除文章？',
    content: h('p', null, [h('p', null, '此删除会把文章直接从数据库删除'), h('p', null, '不可恢复，请谨慎操作')]),
    onOk: async () => {
      await del(params)
      freshTableData()
      proxy.$message.success('删除成功')
    },
    onCancel() {
      proxy.$message.warn('已取消删除')
    }
  })
}
onMounted(async () => {
  const activename = parseInt(window.localStorage.getItem('activename-crawler'))
  if (activename) {
    activeName.value = activename
  }
  await fetchTableData()
  await getWebNameType()
  await getChannelType()
  await getContentColumnType()
})
const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    ...query
  })
  const fetchApi = {
    1: getCollectList,
    2: getRecycleList
  }[activeName.value]
  const {
    data: { data }
  } = await fetchApi(conditionQuery)
  tableData.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, fetchTableData, loading, handleTableChange } = useAntTable({ fetchFn })

// 选中表格
const onSelectChange = (index, row) => {
  selectedTableRow.value = index
  chooseTableData.value = cloneDeep(row).filter(item => item !== undefined)
}
const freshTableData = () => {
  selectedTableRow.value = []
  chooseTableData.value = []
  fetchTableData()
}

const handleTabChange = () => {
  window.localStorage.setItem('activename-crawler', activeName.value)
  freshTableData()
  if (activeName.value === CRAWLER_TYPE.RECYCLE) {
    crawlerColumns.value.forEach(item => {
      if (CRAWLER_CLOUMN.includes(item.title)) {
        item.hideInTable = false
      }
    })
  } else {
    crawlerColumns.value.forEach(item => {
      if (CRAWLER_CLOUMN.includes(item.title)) {
        item.hideInTable = true
      }
    })
  }
}

const handleSearch = value => {
  Object.assign(query, value)
  fetchTableData({ current: 1 })
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.detail-body {
  height: 80vh;
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
    margin: 40px 40px 20px 40px;
  }
  .detail-content {
    margin: 10px;
  }
}
</style>
