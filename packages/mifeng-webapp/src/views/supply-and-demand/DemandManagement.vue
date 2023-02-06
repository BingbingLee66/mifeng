<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    :search="{ hiddenNum: 3 }"
    :request="handlerSearch"
    @change="handleTableChange"
    :pagination="pagination"
    :loading="loading"
    :resizable="true"
    rowKey="id"
    :row-selection="{
      selectedRowKeys: selectedKeys,
      onChange: handleSelectChange,
      preserveSelectedRowKeys: true
    }"
    :dataSource="tableData"
    :columns="tableCols"
    bordered
  >
    <template #toolBar>
      <a-button type="primary" @click="handleBatchAuthorize">批量认证身份信息</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'title'">
        <a-tooltip>
          <template #title>{{ record.title }}</template>
          <div class="ellipsis">{{ record.title }}</div>
        </a-tooltip>
      </template>

      <template v-if="column.dataIndex === 'sourceChamberVOList'">
        <div v-for="(item, i) in record.sourceChamberVOList" :key="`${item.id}-${i}`">{{ item.name }}</div>
      </template>
      <template v-if="column.dataIndex === 'repostNum'">
        <a-button :disabled="!+record.repostNum" type="link" size="small" @click="showRepostInfo(record)">{{
          record.repostNum
        }}</a-button>
      </template>
      <template v-if="column.dataIndex === 'status'">
        <div><a-badge :status="statusPointMap.get(+record.status)" />{{ statusMap.get(+record.status) }}</div>
        <a-button
          v-if="+record.status === STATUS.closedStop && record.closeReason"
          type="link"
          size="small"
          @click="showCloseReason(record.closeReason)"
          >查看原因</a-button
        >
      </template>

      <template v-if="column.dataIndex === 'authenticate'">
        <div>
          <a-badge :status="record.authenticate ? 'success' : 'error'" />{{ record.authenticate ? '已认证' : '未认证' }}
        </div>
        <div>
          <a-button
            :type="record.authenticate ? 'link' : 'text'"
            :danger="!record.authenticate"
            @click="goMemberDetail(record)"
            >{{ record.authenticate ? '去查看' : '去认证' }}</a-button
          >
        </div>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button
          size="small"
          :type="!(record.status !== 1 || record.chatPeopleNum > 0) ? 'link' : 'text'"
          :disabled="record.status !== 1 || record.chatPeopleNum > 0"
          @click="goToEdit(record)"
          >编辑</a-button
        >

        <a-button
          type="text"
          danger
          size="small"
          v-if="record.freezeStatus === 1"
          :disabled="record.canFreeze === 2"
          @click="handleFreeze(record, true)"
          >冻结</a-button
        >
        <a-button
          v-else
          :type="record.canUnFreeze !== 2 ? 'link' : 'text'"
          :disabled="record.canUnFreeze === 2"
          size="small"
          @click="handleFreeze(record, false)"
          >解冻
        </a-button>
        <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>
        <br />
      </template>
    </template>
  </PlusTable>
  <!-- 冻结相关弹窗 -->
  <a-modal v-model:visible="freezeAboutModal.visible" :title="freezeAboutModal.isFreeze ? '冻结' : '解冻'">
    <div style="margin-bottom: 10px">
      请选择{{ freezeAboutModal.isFreeze ? '冻结' : '解冻' }}发布商/协会
      <span style="color: red">
        （{{
          freezeAboutModal.isFreeze
            ? '可复选，冻结后，该动态不展示在已选商会中'
            : '解冻后，该动态将恢复展示在已选商会中'
        }}）
      </span>
    </div>
    <a-spin :spinning="freezeAboutModal.loading">
      <a-checkbox-group v-model:value="freezeAboutModal.checkList">
        <template v-for="(item, i) in freezeAboutModal.list">
          <div v-if="item.value" :key="`${item.id}-${i}`">
            <a-checkbox :value="item.value">
              {{ item.label }}
            </a-checkbox>
          </div>
        </template>
      </a-checkbox-group>
    </a-spin>
    <template #footer>
      <a-button @click="freezeAboutModal.visible = false">取消</a-button>
      <a-button type="primary" @click="handleFreezeSubmit">确定</a-button>
    </template>
  </a-modal>
  <a-modal
    v-model:visible="detailModal.visible"
    width="60%"
    :footer="null"
    @cancel="$refs.videoRef && $refs.videoRef.close()"
  >
    <a-spin :spinning="detailModal.loading">
      <div class="m-preview-wrap">
        <div class="m-preview-area">
          <div class="m-article-title">{{ detailModal.data.title }}</div>
          <div class="content" style="padding: 0">
            <p
              class="text"
              style="font-size: 16px; line-height: 34px; letter-spacing: 2px; white-space: pre-wrap"
              v-html="detailModal.data.content"
            />
            <div class="img-list">
              <img v-for="(v, i) in detailModal.data.imgs" :key="i" :src="v" style="width: 100%" />
            </div>
          </div>
          <AliyunVideoPlayer v-if="detailModal.data.vid" ref="videoRef" :vid="detailModal.data.vid" vHeight="530px" />
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  supplyDemandList,
  getReportList,
  freezeSupplyDemandByTopBackStage,
  unFreezeSupplyDemandByTopBackStage,
  /* deleteSupplyDemand,
  unDeleteSupplyDemand, */
  getSupplyDemandDetail,
  freezeSupplyDemandByChamber,
  unFreezeSupplyDemandByChamber
} from '@/api/home/supplyDemandManager/index'
import { authorizeMemberAuthBatch } from '@/api/member/index'
import { message, Modal } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
import { useResetFilter } from '@/use/useResetFilter'
import AliyunVideoPlayer from '@/components/aliyunVideoPlayer/index'
import { defineComponent, reactive, ref, toRefs, inject, onMounted } from 'vue'
import { getMapDict } from '@/utils'
import {
  sourceMap,
  STATUS,
  statusMap,
  freezeMap,
  reportMap,
  reportStatusMap,
  statusPointMap
} from '@/constant/supply-and-demand'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'InfoList',
  components: {
    AliyunVideoPlayer
  },
  setup() {
    const statusOpts = getMapDict(statusMap)
    const sourceOpts = getMapDict(sourceMap)
    const freezeOpts = getMapDict(freezeMap)
    const reportOpts = getMapDict(reportMap)
    const tableFilter = reactive({
      id: '',
      title: '',
      deleteStatus: -1,
      ckey: '',
      reportStatus: -1,
      status: -1,
      freezeStatus: -1,
      visibility: -1,
      readSort: 0, // 0:不排序 1:正序 -1:逆序
      collectSort: 0, // 0:不排序 1:正序 -1:逆序
      chatSort: 0, // 0:不排序 1:正序 -1:逆序
      isHot: -1,
      publishTime: -1,
      selectSource: -1, // 来源 -1-全部 1-总后台 2-商会后台 3-小程序 4-爬虫采集
      name: ''
    })
    const tableData = ref([])

    const selectedKeys = ref([])
    let selectedUserId = []
    const freezeAboutModal = ref({})
    const detailModal = ref({})
    const router = useRouter()
    const ckey = inject('ckey')
    const $filters = inject('$filters')
    const timeOpts = [
      { label: '全部', value: -1 },
      { label: '24小时内', value: 1 },
      { label: '3天内', value: 2 },
      { label: '7天内', value: 3 },
      { label: '一个月内', value: 4 }
    ]
    const filterColumn = [
      {
        title: '供需标题',
        dataIndex: 'title',
        filter: true,
        hideInTable: true,
        valueType: 'text',
        span: 8,
        formItemProps: {
          placeholder: '关键词'
        }
      },
      {
        title: '供需id',
        dataIndex: 'id',
        filter: true,
        hideInTable: true,
        valueType: 'text',
        span: 8,
        formItemProps: {
          placeholder: '关键词'
        }
      },
      {
        title: '发布者名字',
        dataIndex: 'name',
        filter: true,
        hideInTable: true,
        valueType: 'text',
        span: 8,
        formItemProps: {
          placeholder: '关键词'
        }
      },
      {
        title: '供需状态',
        dataIndex: 'status',
        filter: true,
        hideInTable: true,
        valueType: 'select',
        span: 8,
        formItemProps: {
          options: getMapDict(statusMap),
          placeholder: '请选择',
          defaultValue: -1
        }
      },
      {
        title: '冻结状态',
        dataIndex: 'freezeStatus',
        filter: true,
        hideInTable: true,
        valueType: 'select',
        span: 8,
        formItemProps: {
          options: getMapDict(freezeMap),
          placeholder: '请选择',
          defaultValue: -1
        }
      },
      {
        title: '举报状态',
        dataIndex: 'reportStatus',
        filter: true,
        hideInTable: true,
        valueType: 'select',
        span: 8,
        formItemProps: {
          options: getMapDict(reportMap),
          placeholder: '请选择',
          defaultValue: -1
        }
      },
      {
        title: '发布时间',
        dataIndex: 'publishTime',
        filter: true,
        hideInTable: true,
        valueType: 'select',
        span: 8,
        formItemProps: {
          options: timeOpts,
          placeholder: '请选择',
          defaultValue: -1
        }
      },
      {
        title: '来源',
        dataIndex: 'selectSource',
        filter: true,
        hideInTable: true,
        valueType: 'select',
        span: 8,
        formItemProps: {
          options: getMapDict(sourceMap),
          placeholder: '请选择',
          defaultValue: -1
        }
      }
    ]
    const tableCols = [
      ...filterColumn,
      {
        title: '供需ID',
        dataIndex: 'id',
        width: 120
      },
      {
        title: '供需标题',
        dataIndex: 'title',
        width: 240
      },
      {
        title: '浏览量',
        dataIndex: 'readPeopleNum',
        sorter: true,
        customRender: ({ record }) => {
          return record.readPeopleNum || 0
        },
        width: 100
      },
      {
        title: '收藏量',
        dataIndex: 'collectNum',
        sorter: true,
        /* sortOrder */
        customRender: ({ record }) => {
          return record.collectNum || 0
        },
        width: 100
      },
      {
        title: '洽谈量',
        dataIndex: 'chatPeopleNum',
        sorter: true,
        customRender: ({ record }) => {
          return record.chatPeopleNum || 0
        },
        width: 100
      },
      {
        title: '举报状态',
        dataIndex: 'reportStatus',
        customRender: ({ record: { reportStatus } }) => {
          return (
            <div>
              <a-badge status={reportStatusMap.get(+reportStatus)} />
              {reportMap.get(reportStatus)}
            </div>
          )
        }
      },
      {
        title: '举报信息',
        dataIndex: 'repostNum',
        width: 120
      },
      {
        title: '供需状态',
        dataIndex: 'status',
        width: 150
      },
      {
        title: '冻结状态',
        dataIndex: 'freezeStatus',
        width: 180,
        customRender: ({ record: { freezeStatus } }) => {
          return (
            <div>
              <a-badge status={reportStatusMap.get(+freezeStatus)} />
              {freezeMap.get(freezeStatus)}
            </div>
          )
        }
      },
      {
        title: '供需成功匹配人',
        dataIndex: 'matchInfo',
        width: 180,
        customRender: ({ record: { matchInfo } }) => {
          if (matchInfo)
            return (
              <div>
                <div>{matchInfo.userName}</div>
                <div>{matchInfo.phone}</div>
              </div>
            )
          else return <div>--</div>
        }
      },
      {
        title: '来源',
        dataIndex: 'source',
        width: 120,
        customRender: ({ record: { source } }) => {
          return sourceMap.get(source)
        }
      },
      {
        title: '发布信息',
        width: 180,
        dataIndex: 'publishInfo',
        customRender: ({ record }) => {
          return (
            <div>
              <div> {record.sourceInfo ? record.sourceInfo.userName : ''} </div>
              <div> {$filters.dateFormat(+record.createdTs)} </div>
            </div>
          )
        }
      },
      {
        title: '创建信息 (后台发布)',
        width: 180,
        dataIndex: 'createInfo',
        customRender: ({ record: { createInfo } }) => {
          if (createInfo)
            return (
              <div>
                <div> {createInfo.userName} </div>
                <div> {$filters.dateFormat(+createInfo.time)} </div>
              </div>
            )
          else return <div>--</div>
        }
      },
      {
        title: '更新信息',
        width: 180,
        dataIndex: 'updateInfo',
        customRender: ({ record: { updateInfo } }) => {
          if (updateInfo)
            return (
              <div>
                <div> {updateInfo.userName} </div>
                <div> {$filters.dateFormat(+updateInfo.time)} </div>
              </div>
            )
          else return <div>--</div>
        }
      },
      {
        title: '商/协会认证状态',
        dataIndex: 'authenticate',
        width: 150
      },
      {
        title: '操作',
        dataIndex: 'operation',
        // fixed: 'right',
        width: 80
      }
    ].filter(item => !item.hidden)

    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async (pageOption, filters, { field, order }) => {
        let sortDirection = 0
        if (order) sortDirection = order === 'ascend' ? 1 : -1
        tableFilter.chatSort = tableFilter.collectSort = tableFilter.readSort = 0
        switch (field) {
          case 'chatPeopleNum ':
            tableFilter.chatSort = sortDirection
            break
          case 'collectNum':
            tableFilter.collectSort = sortDirection
            break
          case 'readPeopleNum':
            tableFilter.readSort = sortDirection
            break
        }
        // 0:不排序 1:正序 -1:逆序
        const params = { ...tableFilter }
        params.pageSize = pageOption.pageSize
        params.pageNum = pageOption.current
        Object.entries(params).forEach(([key, value]) => {
          if (value === '') delete params[key]
        })
        const {
          data: { list, totalRows }
        } = await supplyDemandList(params)
        tableData.value = list
        // 输出总数
        return {
          total: totalRows
        }
      }
    })

    // 展示举报信息
    const showRepostInfo = async row => {
      const {
        data: { list = [] }
      } = await getReportList({ tarId: row.id, page: 1, pageSize: 100 })
      Modal.info({
        title: '举报信息',
        okText: '我知道了',
        content: () => (
          <div style="margin:-10px -15px;border-top:1px solid #eee;">
            {list.map(v => (
              <div style="padding:20px;border-bottom:1px solid #eee;">
                <div>举报人信息：{v.uname}</div>
                <div>举报人手机号：{v.phone}</div>
                <div>举报内容：{v.reason}</div>
                <div>举报时间：{$filters.dateFormat(new Date(+v.createdTs), 'yyyy-MM-dd hh:mm:ss')}</div>
              </div>
            ))}
          </div>
        )
      })
    }
    const showCloseReason = closeReason => {
      Modal.info({
        title: '关闭原因',
        okText: '我知道了',
        content: closeReason
      })
    }
    // 认证详情
    const goMemberDetail = row => {
      router.push({
        name: '会员详情',
        params: { userId: row.sourceInfo.userId, ckey: ckey.value }
      })
    }
    const handleFreeze = async (row, isFreeze) => {
      let title = '解冻'
      let content = (
        <div>
          确认解冻该供需？ <span style="color:red;">(解冻后，该供需将恢复展示在用户端)</span>
        </div>
      )
      if (isFreeze) {
        title = '冻结'
        content = (
          <div>
            您确定要冻结供需吗？ <span style="color:red;">(冻结后，该供需不会展示在商/协会主页)</span>
          </div>
        )
      }
      Modal.confirm({
        title,
        content: () => content,
        async onOk() {
          try {
            await (isFreeze ? freezeSupplyDemandByChamber : unFreezeSupplyDemandByChamber)(row.id)
            message.success(`${title}成功`)
            fetchTableData()
          } catch (error) {}
        }
      })
    }
    const handleFreezeSubmit = async () => {
      const { data, checkList, isFreeze } = freezeAboutModal.value
      if (!checkList || !checkList.length) return message.error(`请选择${isFreeze ? '冻结' : '解冻'}的商/协会`)
      const { state, msg } = await (isFreeze ? freezeSupplyDemandByTopBackStage : unFreezeSupplyDemandByTopBackStage)(
        data.id,
        { freezeTargets: checkList }
      )

      if (state === 1) {
        message.success(`${isFreeze ? '冻结成功' : '解冻成功'}`)
        freezeAboutModal.value.visible = false
        fetchTableData()
        return
      }
      message.error(msg)
    }
    const goToEdit = row => {
      router.push({ path: '/supply-and-demand/edit-supply-demand', query: { id: row.id } })
    }
    const showDetail = async row => {
      detailModal.value = { visible: true, data: {}, loading: true }
      try {
        const {
          data: { yshContentEditVO = {} }
        } = await getSupplyDemandDetail(row.id)
        detailModal.value.data = yshContentEditVO
      } catch (error) {
        /*  */
      }
      detailModal.value.loading = false
    }
    const handleBatchAuthorize = async () => {
      if (!selectedKeys.value.length) return message.warning('请选择认证数据')
      try {
        Modal.confirm({
          content: (
            <div>
              <div>确定给该用户进行商会认证吗？</div>
              <div style="color:red;">商会认证主要是对该用户的个人信息、企业信息进行认证</div>
              <div style="color:#ccc;">1、认证后，该用户显示“商会认证”标识</div>
              <div style="color:#ccc;">2、认证后，可在【商协会成员-详情】页取消认证</div>
            </div>
          ),
          title: '商会认证',
          async onOk() {
            await authorizeMemberAuthBatch({
              wxUserIds: selectedUserId,
              ckey: ckey.value
            })
            selectedKeys.value = []
            fetchTableData()
          }
        })
      } catch (error) {
        /*  */
      }
    }
    const handleSelectChange = (selectedRowKeys, selectedRowData) => {
      selectedKeys.value = selectedRowKeys
      selectedUserId = selectedRowData.map(({ sourceInfo }) => +sourceInfo.userId)
    }
    onMounted(() => {
      fetchTableData()
    })
    const handleNotSelect = value => {
      return value || -1
    }
    const handlerSearch = filterObj => {
      filterObj.freezeStatus = handleNotSelect(filterObj.freezeStatus)
      filterObj.publishTime = handleNotSelect(filterObj.publishTime)
      filterObj.reportStatus = handleNotSelect(filterObj.reportStatus)
      filterObj.status = handleNotSelect(filterObj.status)
      filterObj.selectSource = handleNotSelect(filterObj.selectSource)
      Object.assign(tableFilter, filterObj)
      fetchTableData({ current: 1 })
    }
    return {
      tableData,
      tableFilter,
      tableCols,
      showRepostInfo,
      showCloseReason,
      statusOpts,
      sourceOpts,
      freezeOpts,
      reportOpts,
      statusMap,
      STATUS,
      freezeMap,
      freezeAboutModal,
      detailModal,
      goMemberDetail,
      goToEdit,
      showDetail,
      handleFreeze,
      handleFreezeSubmit,
      handleBatchAuthorize,
      ...useResetFilter({ ...toRefs(tableFilter) }),
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      handleSelectChange,
      selectedKeys,
      handlerSearch,
      statusPointMap
    }
  }
})
</script>

<style lang="scss" scoped>
.ellipsis {
  @include ellipsis(2);
}
// .ant-btn-link {
//   color: #409eff;
// }

.ellipsis {
  @include ellipsis(2);
}

.m-preview-wrap {
  width: 100%;
  height: 80vh;
}

.m-preview-area {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  margin-top: 15px;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}

.m-article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 20px 40px 20px 40px;
}
</style>
