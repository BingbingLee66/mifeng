<template>
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8" @change="handleTabChange">
    <a-tab-pane :key="EDITOR_TYPE.ARTICE" tab="发布文章" />
  </a-tabs>
  <PlusTable
    row-key="id"
    :loading="loading"
    :columns="edtiorColumns"
    :data-source="tableData"
    :pagination="pagination"
    :request="handleSearch"
    :search="{ hiddenNum: 4 }"
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
      <div v-if="activeName === EDITOR_TYPE.ARTICE">
        <a-button
          class="ml-3"
          type="primary"
          v-action="'添加文章'"
          danger
          @click="
            router.push({
              name: '添加或编辑文章'
            })
          "
          >创建文章</a-button
        >
        <a-button
          class="ml-3"
          type="primary"
          v-action="'文章来源管理'"
          @click="
            router.push({
              name: '文章来源管理'
            })
          "
        >
          文章来源管理
        </a-button>
      </div>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'handle'">
        <div v-if="activeName === EDITOR_TYPE.ARTICE">
          <a-button
            type="link"
            v-action="'编辑'"
            @click="
              () => {
                router.push({
                  name: '添加或编辑文章',
                  query: {
                    articleId: record.id
                  }
                })
              }
            "
          >
            编辑
          </a-button>
          <a-button
            type="link"
            v-action="'冻结'"
            v-if="[EDITOR_STATUS_TYPE.PUBLISHED, EDITOR_STATUS_TYPE.TIMEING].includes(record.status)"
            @click="updateStatus(record)"
          >
            冻结
          </a-button>
          <a-button
            type="link"
            v-action="'解冻'"
            v-if="record.status === EDITOR_STATUS_TYPE.PLAFROZEN"
            @click="updateStatus(record)"
          >
            解冻
          </a-button>
          <a-button
            type="link"
            @click="
              () => {
                router.push({
                  name: '文章详情',
                  query: {
                    articleId: record.id
                  }
                })
              }
            "
          >
            详情
          </a-button>
        </div>
      </template>
    </template>
  </PlusTable>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getGlobalContentList, updateStatusPlatform } from '@business/common/src/content/api/article'
import { getContentColumnOptions } from '@business/common/src/content/api/columnsetup'
import { useRouter } from 'vue-router'
import {
  EDITOR_TYPE,
  EDITOR_STATUS_MAP,
  EDITOR_STATUS_TYPE,
  EDITOR_STATUS_COLOR_MAP,
  StatusList
} from '../../../constant/content'
const router = useRouter()
const activeName = ref(EDITOR_TYPE.ARTICE)
const contentColumnOptions = ref([])
const getContentColumnType = async () => {
  const {
    data: { data }
  } = await getContentColumnOptions()
  contentColumnOptions.value = data
  contentColumnOptions.value.unshift({
    label: '全部',
    value: -1
  })
  contentColumnOptions.value.forEach(item => {
    if (item.label !== '全部' && item.typeUrl !== 0) {
      item.label = optionList.value[item.typeUrl - 1] + '-' + item.label
    }
    return {
      label: item.label,
      value: item.value
    }
  })
}
const optionList = ref(['标签聚合页', '商会必参', '标签聚合页/商会必参', 'tab页'])
const edtiorColumns = ref([
  {
    title: '文章ID',
    dataIndex: 'id'
  },
  {
    title: '文章标题',
    dataIndex: 'title',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入文章标题'
    },
    width: 300
  },
  {
    title: '对应栏目',
    dataIndex: 'contentColumnId',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: computed(() => {
        return contentColumnOptions.value
      })
    },
    customRender: ({ record }) => {
      return `${optionList.value[record.typeUrl - 1]}+${record.contentColumn}`
    }
  },
  {
    title: '浏览量',
    dataIndex: 'readCount',
    sorter: true,
    width: 100
  },
  {
    title: '点赞量',
    dataIndex: 'commentLikeNums',
    sorter: true,
    width: 100
  },
  {
    title: '评论量',
    dataIndex: 'commentNums',
    sorter: true,
    width: 100
  },
  {
    title: '创建信息',
    dataIndex: 'createdTs',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.operator}</div>
          <div>{record.createdTs}</div>
        </div>
      )
    }
  },
  {
    title: '发布时间',
    dataIndex: 'publishTs',
    customRender: ({ record }) => {
      return record.publishTs === 4 ? '--' : record.publishTs
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    filter: true,
    initialValue: -1,
    valueType: 'select',
    formItemProps: {
      options: StatusList
    },
    customRender: ({ record }) => {
      return (
        <div>
          <a-badge status={EDITOR_STATUS_COLOR_MAP.get(record.status)} text={EDITOR_STATUS_MAP.get(record.status)} />
          {EDITOR_STATUS_MAP.get(record.status) === '定时发布' ? <div>{record.createdTs}</div> : null}
        </div>
      )
    }
  },
  {
    title: '创建人',
    hideInTable: true,
    dataIndex: 'creator',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入创建人'
    }
  },
  {
    title: '文章ID',
    hideInTable: true,
    dataIndex: 'articleId',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入文章id'
    }
  },
  {
    title: '发布时间',
    dataIndex: 'publishTs',
    hideInTable: true,
    filter: true,
    valueType: 'dateTimeRange',
    formItemProps: { valueFormat: 'YYYY-MM-DD' }
  },
  {
    title: '操作',
    key: 'handle'
  }
])

const query = reactive({
  title: '',
  contentColumnId: -1,
  articleId: '',
  // 发布状态
  status: '-1',
  creator: '',
  column: '',
  orderType: 0,
  date: ''
})
// const { proxy } = getCurrentInstance()

const updateStatus = async record => {
  const params = {
    articleIds: [record.id],
    action: record.status === 3 ? 'active' : 'notactive'
  }
  await updateStatusPlatform(params)
  await fetchTableData()
}

const tableData = ref([])
onMounted(async () => {
  //   const activename = parseInt(window.localStorage.getItem('activename-crawler'))
  //   if (activename) {
  //     activeName.value = activename
  //   }
  await fetchTableData()
  await getContentColumnType()
})
const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    ...query,
    column: sorter.value.order ? sorter.value.field : null,
    orderType: { ascend: 1, descend: -1 }[sorter.value?.order]
  })
  const fetchApi = {
    1: getGlobalContentList,
    2: null
  }[activeName.value]
  const {
    data: { data }
  } = await fetchApi(conditionQuery)
  tableData.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, fetchTableData, loading, handleTableChange, sorter } = useAntTable({ fetchFn })

const handleTabChange = () => {
  //   window.localStorage.setItem('activename-crawler', activeName.value)
  fetchTableData()
}
const handleSearch = value => {
  const [startTs, endTs] = value?.publishTs || []
  value.startTs = startTs
  value.endTs = endTs
  value.publishTs = null
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
