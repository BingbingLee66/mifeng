<template>
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8" @change="fetchTableData(1)">
    <a-tab-pane :key="CONTENTAUDIT_TYPE.ARTICLE" tab="文章" />
    <a-tab-pane :key="CONTENTAUDIT_TYPE.COMPANDYNAMIC" tab="企业动态" />
  </a-tabs>
  <PlusTable
    :loading="loading"
    :scroll="{ x: 'max-content' }"
    :columns="ArticleListCols"
    :data-source="tableData"
    :pagination="pagination"
    @change="handleTableChange"
    bordered
    :search="{ hiddenNum: 4 }"
    :request="handleSearch"
    :row-selection="rowSelection"
    row-key="id"
    > 
    <template #searchToolBar="{ form }">
      <a-button v-action="'查询'" type="primary" html-type="submit">查询</a-button>
      <a-button
        style="margin: 0 8px"
        @click="
          () => {
            form.resetFields()
            tableFilter.ckey = ''
          }
        "
        >重置</a-button
      >
    </template>
    <template #filterItem="{ column }">
      <template v-if="column.dataIndex === 'chamberName'">
        <a-form-item name="chamberName" label="来源商会">
          <a-select ref="select" v-model:value="tableFilter.ckey" :options="chamberOptions" :span="6"></a-select>
        </a-form-item>
        <!-- 来源商会：
        <a-select ref="select" v-model:value="tableFilter.ckey" :options="chamberOptions" :span="6"></a-select> -->
      </template>
    </template>

    <template #toolBar>
      <a-button
        v-action="'删除'"
        @click="batchDelArticle"
        type="primary"
        danger
        v-show="activeName.name === CONTENTAUDIT_TYPE.ARTICLE"
      >
        删除</a-button
      >

      <a-button
        class="ml-4"
        v-action="'冻结'"
        type="primary"
        danger
        v-show="activeName.name === CONTENTAUDIT_TYPE.ARTICLE"
        @click="batchUpdateStatus"
      >
        冻结</a-button
      >
      <a-button class="ml-4" @click="toStick" v-action="'置顶'" type="primary">置顶管理</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'readCount'"> {{ record.readCount ? record.readCount : '--' }} </template>
      <template v-if="column.dataIndex === 'commentLikeNums'">
        {{ record.commentLikeNums ? record.commentLikeNums : '--' }}
      </template>
      <template v-if="column.dataIndex === 'commentNums'">
        {{ record.commentNums ? record.commentNums : '--' }}
      </template>
      <template v-if="column.dataIndex === 'existEntry'">
        <a-button type="link" @click="editEntryHandler(record)">
          {{ record.existEntry ? '已绑定' : '未绑定' }}
        </a-button>
      </template>
      <template v-if="column.dataIndex === 'publishType'">
        <div v-if="record.publishType == 1">--</div>
        <div v-if="record.publishType == 5">{{ record.companyName }}</div>
        <div
          v-if="
            record.publishType == 3 ||
            record.publishType == 4 ||
            record.publishType == 6 ||
            record.publishType == 7 ||
            record.publishType == 2
          "
        >
          {{ record.sourceName }}
        </div>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <div v-if="record.status == 0">已冻结(商会)</div>
        <div v-if="record.status == 1">已发布</div>
        <div v-if="record.status == 3">已冻结(平台)</div>
        <div v-if="record.status == 4">定时发布</div>
        <div v-if="record.status == 5">审核不通过</div>
      </template>
      <template v-if="column.dataIndex === 'isstop'">{{ record.isstop === 1 ? '是' : '否' }} </template>
      <template v-if="column.key === 'handle'">
        <a-button type="link" :disabled="record.isChamberTop === 1" @click="showStickModal(record)">置顶</a-button>
        <a-button
          type="link"
          v-action="'编辑'"
          :disabled="record.publishType === 1 || record.publishType === 2 ? true : false"
          @click="AddOrEdit(record)"
          >编辑</a-button
        >
        <a-button type="link" v-action="'冻结'" v-if="record.status === 1" @click="updateStatus(record)" danger>
          冻结
        </a-button>
        <a-button
          type="link"
          v-action="'解冻'"
          v-if="record.status == 3 || record.status == 0"
          @click="updateStatus(record)"
          :disable="record.status == 0"
        >
          解冻
        </a-button>
        <a-button type="link" v-action="'详情'" @click="openDetail(record)">详情</a-button>
        <a-button type="link" @click="delArticle([record.id])" danger>删除</a-button>
      </template>
    </template>
  </PlusTable>
  <DetailModal v-model:visible="detailVisible" :detailObj="detailObj" ref="detailRef" />
  <EntryModal
    v-model:entryVisible="entryVisible"
    :entryInfo="entryInfo"
    :title="entryInfo.existEntry ? '编辑词条' : '添加词条'"
    @onSureHandler="sureHandler"
    @close="entryVisible = false"
  />
  <SelectionModal
    v-model:visible="selectionVisible"
    :entryInfo="entryInfo"
    @sure-handler="sureHandler"
    @add-entry="addEntryHandler"
    @close="selectionVisible = false"
  />
</template>

<script>
import { ref, reactive, computed, defineAsyncComponent } from 'vue'
import { CONTENTAUDIT_TYPE } from '@/constant/content'
import { ArticleListCols } from './tableCol'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getManagerList, updateStatusPlatform, getDetail, del } from '@business/common/src/content/api/article'
import { useRowSelection } from '@business/logics/src/useRowSelection'
import { getChamberOptions } from '@business/common/src/finance/api'
import { bindContentWithEntry } from '@business/common/src/content/api/bossin'
import { Modal, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
export default {
  components: {
    DetailModal: defineAsyncComponent(() => import('./components/detail-modal.vue')),
    EntryModal: defineAsyncComponent(() => import('@business/components/src/content/entryModal.vue')),
    SelectionModal: defineAsyncComponent(() => import('./components/selection-modal.vue'))
  },
  setup() {
    const activeName = ref(1)
    const tableData = ref([])
    const tableFilter = reactive({
      title: '',
      ckey: '',
      contentColumn: '',
      status: 1,
      contentModuleId: computed(() => activeName.value),
      dynamicType: '',
      backgroundRelease: '',
      existEntry: '',
      publishTimeType: 0
    })
    const sortFlag = ref('')
    const { pagination, handleTableChange, fetchTableData, loading, sorter } = useAntTable({
      fetchFn: async pageOption => {
        const field = computed(() => {
          return {
            readCount: 'read_count',
            commentLikeNums: 'like_nums',
            commentNums: 'comment_nums'
          }[sorter.value?.field]
        })
        const {
          data: {
            data: { list, totalRows }
          }
        } = await getManagerList({
          order: { ascend: field.value, descend: `${field.value} desc` }[sorter.value?.order] || '',
          pageSize: pageOption.pageSize,
          page: pageOption.current,
          title: tableFilter.title,
          ...tableFilter,
          existEntry: activeName.value === CONTENTAUDIT_TYPE.ARTICLE ? tableFilter.existEntry : ''
        })
        tableData.value = list
        return {
          total: totalRows
        }
      }
    })
    fetchTableData()
    // 浏览量排序
    const handleSortChange = (prop, order) => {
      sortFlag.value = order ? prop + ' desc' : prop
      fetchTableData(1)
    }
    const entryVisible = ref(false)
    const selectionVisible = ref(false)
    const entryInfo = reactive({})
    const editEntryHandler = row => {
      Object.assign(entryInfo, { ...row, selectionData: [] })
      if (entryInfo.existEntry) {
        selectionVisible.value = true
      } else {
        entryVisible.value = true
      }
    }
    const addEntryHandler = data => {
      entryInfo.selectionData = data
      entryVisible.value = true
    }
    const handleSearch = value => {
      console.log(value)
      tableFilter.status = value.status === undefined ? -1 : value.status
      tableFilter.title = value.title || ''
      tableFilter.publishTimeType = value.publishTs || 0
      tableFilter.existEntry = value.existEntry || ''
      fetchTableData(1)
    }
    // // 商会列表
    const chamberOptions = ref([])
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
      tableFilter.ckey = chamberOptions.value[0].value
    }
    chamberList()
    const delArticle = articleIds => {
      Modal.confirm({
        title: '确定删除文章？',
        content: '此删除会把文章直接从数据库删除不可恢复，请谨慎操作。',
        onOk: async () => {
          await del({ articleIds })
          fetchTableData()
        }
      })
    }
    const updateStatus = async row => {
      const params = {
        articleIds: [row.id],
        action: row.status === 3 ? 'active' : 'notactive'
      }
      await updateStatusPlatform(params)
      message.success(row.status === 3 ? '解冻成功' : '冻结成功')
      fetchTableData()
    }
    const rowSelection = useRowSelection()
    const batchDelArticle = () => {
      const { selectedRowKeys } = rowSelection
      if (!selectedRowKeys.length) return message.error('没有选择记录，操作失败')
      delArticle(selectedRowKeys)
    }
    const batchUpdateStatus = async () => {
      const { selectedRowKeys } = rowSelection
      if (!selectedRowKeys.length) return message.error('没有选择记录，操作失败')
      const params = {
        articleIds: selectedRowKeys,
        action: 'notactive'
      }
      await updateStatusPlatform(params)
      message.success('冻结成功')
      fetchTableData()
    }

    const detailVisible = ref(false)
    const detailObj = reactive({})
    const detailRef = ref()
    const openDetail = async ({ id }) => {
      const {
        data: { dtl }
      } = await getDetail({ id })
      Object.assign(detailObj, dtl)
      detailVisible.value = true
      // 视频是否存在 渲染操作
      if (
        detailObj.contentType === 2 ||
        detailObj.contentType === 3 ||
        (detailObj.contentType === 1 && (detailObj.publishType === 3 || detailObj.publishType === 1) && detailObj.vid)
      ) {
        detailRef.value.showVideo()
      }
    }
    const sureHandler = async encyclopediaIds => {
      try {
        await bindContentWithEntry({
          ckey: entryInfo.ckey,
          contentId: entryInfo.id,
          contentType: entryInfo.contentType,
          encyclopediaIds
        })

        fetchTableData()
        entryVisible.value = false
        selectionVisible.value = false
      } catch (error) {
        message.error('操作失败')
      }
    }
    const router = useRouter()
    const toStick = () => {
      router.push({
        path: '/content/article-stick'
      })
    }
    return {
      CONTENTAUDIT_TYPE,
      activeName,
      ArticleListCols,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      tableData,
      handleSortChange,
      sortFlag,
      editEntryHandler,
      handleSearch,
      chamberOptions,
      tableFilter,
      delArticle,
      updateStatus,
      rowSelection,
      batchDelArticle,
      batchUpdateStatus,
      openDetail,
      detailVisible,
      detailObj,
      detailRef,
      entryVisible,
      addEntryHandler,
      entryInfo,
      selectionVisible,
      sureHandler,
      toStick
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
:deep(.ant-table-cell-fix-right) {
  z-index: 2 !important;
}
.icon-active {
  color: map-get($map: $color, $key: base);
}
</style>
