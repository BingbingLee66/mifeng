<template>
  <PlusTable
    rowKey="id"
    :columns="columns"
    :data-source="dataSource"
    :request="handlerSearch"
    :pagination="pagination"
    :loading="loading"
    header-title="专委会文章"
    :search="{ hiddenNum: 4 }"
    @change="handleTableChange"
    bordered
    :scroll="{ x: 'max-content' }"
  >
    <template #toolBar>
      <a-button type="primary" @click="addOrEdit"><plus-outlined />创建文章</a-button>
    </template>
  </PlusTable>
  <AModal v-model:visible="contentHtmlVisible" title="详情" :footer="null" width="100%" :centered="true">
    <div class="detail-body">
      <div
        v-if="
          ModelContent.auditStatus === ARTICLE_AUDITSTATYUS.noPassByChamber ||
          ModelContent.auditStatus === ARTICLE_AUDITSTATYUS.noPassedByPlatform
        "
        class="detail-remark"
      >
        不通过理由：{{ ModelContent.auditRemark }}
      </div>
      <div class="detail-title">{{ ModelContent.title }}</div>
      <div class="detail-content" v-html="ModelContent.html" />
    </div>
  </AModal>
</template>

<script setup>
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { ref, reactive, onMounted, inject, getCurrentInstance } from 'vue'
import { useAntTable } from '@/use/useAntTable/index'
import { getChamberContentList, updateStatus, getDetail, del } from '@/api/content/article'
import { getContentColumnOptionsWithCkey } from '@/api/content/columnsetup'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
import { ARTICLE_STATUS, ARTICLE_AUDITSTATYUS } from '../../../constant/content'
import { DataCollect } from '@/utils/dataCollect'
const typeOptions = ref([
  {
    label: '全部',
    value: -1
  }
])
const getOperatedTypes = async () => {
  const contentModuleId = 3
  const params = reactive({
    ckey,
    contentModuleId,
    isSpecialCommittee: 1
  })
  const {
    data: { data }
  } = await getContentColumnOptionsWithCkey(params)
  data.forEach(item => {
    typeOptions.value.push({
      label: item.label,
      value: item.value
    })
  })
}
const columns = [
  {
    title: '文章标题',
    dataIndex: 'title',
    filter: true,
    hideInTable: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请选择文章标题',
      allowClear: true
    }
  },
  {
    title: '文章ID',
    dataIndex: 'id',
    width: 150
  },
  {
    title: '文章标题',
    dataIndex: 'title',
    width: 150
  },
  {
    title: '栏目',
    dataIndex: 'contentColumn',
    filter: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: typeOptions.value
    },
    width: 150
  },
  {
    title: '浏览量',
    sorter: { compare: (a, b) => a.readCount - b.readCount, multiple: 3 },
    customRender: ({ record }) => {
      return <div>{record.readCount ? record.readCount : '--'}</div>
    },
    width: 100
  },
  {
    title: '评论量',
    width: 100,
    sorter: { compare: (a, b) => a.commentLikeNums - b.commentLikeNums, multiple: 2 },
    dataIndex: 'commentLikeNums'
  },
  {
    title: '点赞量',
    sorter: { compare: (a, b) => a.commentNums - b.commentNums, multiple: 1 },
    dataIndex: 'commentNums',
    width: 100
  },
  {
    title: '创建信息',
    width: 150,
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
    width: 150,
    customRender: ({ record }) => {
      return record.status === 4 ? (
        <div>
          <div>定时发布</div>
          <div>{record.createdTs}</div>
        </div>
      ) : (
        <div>{record.createdTs}</div>
      )
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    filter: true,
    valueType: 'select',
    initialValue: -1,
    width: 150,
    formItemProps: {
      options: [
        { label: '全部', value: -1 },
        { label: '已发布', value: 1 },
        { label: '已冻结(商会)', value: 0 },
        { label: '已冻结(平台)', value: 3 },
        { label: '定时发布', value: 4 },
        { label: '审核不通过', value: 8 }
      ]
    },
    customRender: ({ record }) => {
      if (
        record.status === ARTICLE_STATUS.normal &&
        (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
          record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
      ) {
        return (
          <div>
            <a-badge status="success" />
            已发布
          </div>
        )
      } else if (
        record.status === ARTICLE_STATUS.freezeByChamber &&
        (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
          record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
      ) {
        return (
          <div>
            <a-badge status="error" />
            已冻结(商会)
          </div>
        )
      } else if (
        record.status === ARTICLE_STATUS.freezeByPlatform &&
        (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
          record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
      ) {
        return (
          <div>
            <a-badge status="error" /> 已冻结(平台)
          </div>
        )
      } else if (
        record.status === ARTICLE_STATUS.normalSetTime &&
        (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
          record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
      ) {
        return (
          <div>
            <a-badge status="processing" />
            定时发布
          </div>
        )
      } else if (
        record.status === ARTICLE_STATUS.freezeByChamber &&
        (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
          record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
      ) {
        return (
          <div>
            <a-badge status="success" />
            已发布
          </div>
        )
      } else if (
        record.auditStatus === ARTICLE_AUDITSTATYUS.noPassByChamber ||
        record.auditStatus === ARTICLE_AUDITSTATYUS.noPassedByPlatform
      ) {
        return (
          <div>
            <a-badge status="error" />
            审核不通过
          </div>
        )
      }
    }
  },
  {
    title: '文章ID',
    dataIndex: 'articleId',
    filter: true,
    hideInTable: true,
    valueType: 'text',
    width: 150,
    formItemProps: {
      placeholder: '请选择文章标题',
      allowClear: true
    }
  },
  {
    title: '发布时间',
    dataIndex: 'publishTs',
    filter: true,
    hideInTable: true,
    valueType: 'dateTimeRange',
    formItemProps: { valueFormat: 'YYYY-MM-DD' },
    span: 12
  },
  {
    title: '操作',
    customRender: ({ record }) => {
      return (
        <div>
          <a-button
            type="link"
            onclick={() => {
              addOrEdit(record)
            }}
          >
            编辑
          </a-button>
          <div>
            {record.status === ARTICLE_STATUS.normal || record.status === ARTICLE_STATUS.normalSetTime ? (
              <a-button
                type="link"
                danger
                onclick={() => {
                  updateState(record)
                }}
              >
                冻结
              </a-button>
            ) : record.status === ARTICLE_STATUS.freezeByChamber ? (
              <a-button
                type="link"
                onclick={() => {
                  updateState(record)
                }}
              >
                解冻
              </a-button>
            ) : (
              ''
            )}
          </div>
          <AButton
            type="link"
            onclick={() => {
              openDetail(record)
            }}
          >
            详情
          </AButton>
          <div>
            <AButton
              type="link"
              danger
              onclick={() => {
                delArticle(record)
              }}
            >
              删除
            </AButton>
          </div>
        </div>
      )
    }
  }
]

const query = reactive({
  title: '',
  contentColumnId: -1,
  status: -1,
  column: '',
  orderType: 1,
  creatorId: null
})
const { proxy } = getCurrentInstance()
const dataSource = ref([])
const ckey = inject('ckey')
const activeName = ref('5')
const store = useStore()
const router = useRouter()
// 文章编辑/添加
const addOrEdit = row => {
  DataCollect.Content.create({ store })

  router.push({
    path: '/content/article-editor',
    query: {
      activeName: activeName.value,
      articleId: row.id,
      committee: true
    }
  })
}
// // 文章冻结/解冻
const updateState = async row => {
  const params = {
    id: row.id,
    action: row.status === ARTICLE_STATUS.freezeByChamber ? 'active' : 'notactive'
  }
  try {
    await updateStatus(params)
    proxy.$message.success(row.status === ARTICLE_STATUS.freezeByChamber ? '解冻成功' : '文章已冻结')
  } catch (error) {}
  await fetchTableData()
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
  ModelContent.html = dtl.contentHtml
  ModelContent.auditRemark = dtl.auditRemark
  ModelContent.auditStatus = dtl.auditStatus
  contentHtmlVisible.value = true
}
// 删除栏目
const delArticle = row => {
  const params = {
    articleIds: []
  }
  params.articleIds.push(row.id)
  Modal.confirm({
    title: '提示',
    content: '确认删除该文章吗?',
    onOk: async () => {
      await del(params)
      fetchTableData()
    },
    onCancel() {
      proxy.$message.warn('已取消删除')
    }
  })
}
onMounted(async () => {
  const { id } = store.state.user.profile
  query.creatorId = id
  await fetchTableData()
  getOperatedTypes()
})
const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    ckey,
    contentModuleId: activeName.value,
    ...query
  })
  const {
    data: { data }
  } = await getChamberContentList(conditionQuery)
  dataSource.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({ fetchFn })

const handlerSearch = value => {
  if (value.articleId) {
    value.articleId = value.articleId.replace(/[^\d]/g, '')
  }
  if (value.publishTs) {
    // eslint-disable-next-line prefer-destructuring
    value.startTs = value.publishTs[0]
    // eslint-disable-next-line prefer-destructuring
    value.endTs = value.publishTs[1]
    value.publishTs = null
  } else {
    value.startTs = null
    value.endTs = null
  }
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
