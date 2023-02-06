<template>
  <panel>
    <div style="height: 20px; margin-bottom: 10px">
      <span style="font-weight: 600; font-size: 18px; float: left">会员数据</span>
      <span style="float: right" class="text-btn-style" @click="showMeaning = true">数据定义</span>
    </div>
    <div class="data-card">
      <div class="d-card-box">
        <div class="card-key">本月入会人数</div>
        <div class="card-value">{{ pfStatistics.monthlyJoin }}</div>
      </div>
      <div class="d-card-box">
        <div class="card-key">累计会员数</div>
        <div class="card-value">{{ pfStatistics.totalMembers }}</div>
      </div>
      <div class="d-card-box">
        <div class="card-key">逾期未缴会费人数</div>
        <div class="card-value" style="color: #ff0000">{{ pfStatistics.unpaidMembers }}</div>
      </div>
      <div class="d-card-box">
        <div class="card-key">已缴会费人数</div>

        <div class="card-value">{{ pfStatistics.paidMembers }}</div>
      </div>
      <div class="d-card-box">
        <div class="card-key">累计授权登录人数</div>
        <div class="card-value">{{ pfStatistics.activeWxUserTotal }}</div>
      </div>
    </div>
  </panel>
  <panel>
    <div class="my-5">
      <TimerSizer @fetchTableData="getQuery"></TimerSizer>
      <a-button type="primary" style="float: right" @click="exportExcel">导表</a-button>
    </div>
    <a-table
      class="px-4"
      :loading="loading"
      :dataSource="tableData"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: 'max-content', y: '30vh' }"
      :row-selection="{ onChange, selectedRowKeys: selectedTableRow, preserveSelectedRowKeys: true }"
    >
    </a-table>
  </panel>
  <a-modal title="数据定义" v-model:visible="showMeaning" width="480px" :footer="null" @ok="showMeaning = false">
    <div class="meaning-wrap">
      <div class="meaning-item">
        <div class="tit">授权登录人数</div>
        <div class="sub">
          在指定时间范围内，在小程序端<span class="color-red">首次</span>授权登录的人数
          <span class="color-red">(需去重)</span>。
        </div>
      </div>
      <div class="meaning-item">
        <div class="tit">入会总人数</div>
        <div class="sub">在指定时间范围内，从不同渠道加入商会的总人数 <span class="color-red">(需去重)</span>。</div>
      </div>
      <div class="meaning-item">
        <div class="tit">商会邀请入会人数</div>
        <div class="sub">
          在指定时间范围内，通过商会邀请海报加入商会的人数 <span class="color-red">(需去重)</span>。
        </div>
      </div>
      <div class="meaning-item">
        <div class="tit">自己申请入会人数</div>
        <div class="sub">
          在指定时间范围内，自己通过小程序前端申请入会的人数 <span class="color-red">(需去重)</span>。
        </div>
      </div>
      <div class="meaning-item">
        <div class="tit">会员邀请入会人数</div>
        <div class="sub">在指定时间范围内，由老会员邀请入会的人数 <span class="color-red">(需去重)</span>。</div>
      </div>
      <div class="meaning-item">
        <div class="tit">商会后台添加入会人数</div>
        <div class="sub">
          在指定时间范围内，由商会管理员在后台添加入会的人数 <span class="color-red">(需去重)</span>。
        </div>
      </div>
      <div class="meaning-item">
        <div class="tit">个人会员</div>
        <div class="sub">
          在指定时间范围内，加入商会且入会类型为个人的会员 <span class="color-red">(需去重)</span>。
        </div>
      </div>
      <div class="meaning-item">
        <div class="tit">企业/团体</div>
        <div class="sub">
          在指定时间范围内，加入商会且入会类型为企业/团体的会员 <span class="color-red">(需去重)</span>。
        </div>
      </div>
    </div>
    <div name="okButton" style="text-align: center">
      <a-button type="primary" @click="showMeaning = false">我知道了</a-button>
    </div>
  </a-modal>
</template>

<script>
import { reactive, ref, inject, defineAsyncComponent } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { getStatistics, getDailyStatistics } from '@/api/statistic/memberStatistics'
import { exportJson2Excel } from '@/utils/exportExcel'
import { message } from 'ant-design-vue'
export default {
  components: {
    TimerSizer: defineAsyncComponent(() => import('../../../components/statistic/TimeSizer/index.vue'))
  },
  setup() {
    const columns = [
      { title: '日期', dataIndex: 'date' },
      { title: '授权登录人数', dataIndex: 'activeWxUserTotal' },
      { title: '入会总人数', dataIndex: 'joinedTotal' },
      { title: '商会邀请入会人数', dataIndex: 'chamberInvitationTotal' },
      { title: '自己申请入会人数', dataIndex: 'myselfApplyTotal' },
      { title: '会员邀请入会人数', dataIndex: 'memberInvitationTotal' },
      { title: '商会后台添加入会人数', dataIndex: 'chamberBackstageAddTotal' },
      { title: '个人会员', dataIndex: 'personMemberTotal' },
      { title: '企业/团体', dataIndex: 'companyMemberTotal' }
    ]
    const showMeaning = ref(false)

    const { selectedTableRow, onChange, exportExcel } = exportXLSX()

    const {
      tableData,
      pfStatistics,
      getStatisticsDetail,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      getQuery
    } = getStatisticsData()

    getStatisticsDetail()

    return {
      columns,
      pfStatistics,
      showMeaning,
      getStatistics,
      pagination,
      fetchTableData,
      handleTableChange,
      loading,
      tableData,
      selectedTableRow,
      onChange,
      exportExcel,
      getQuery
    }
  }
}

function getStatisticsData() {
  const tableData = ref([])
  const pfStatistics = reactive({
    monthlyJoin: 0,
    totalMembers: 0,
    unpaidMembers: 0,
    paidMembers: 0,
    activeWxUserTotal: 0
  })
  const ckey = inject('ckey')
  const query = reactive({
    days: '',
    date: '',
    type: ''
  })

  const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
    fetchFn: async pageOption => {
      const condition = {
        pageSize: pageOption.pageSize,
        page: pageOption.current,
        startTime: query.date[0] || '',
        endTime: query.date[1] || '',
        type: query.type,
        ckey: ckey.value
      }
      const {
        data: { list, totalRows }
      } = await getDailyStatistics(condition)

      if (list) {
        list.forEach((e, index) => {
          e.key = index + pageOption.pageSize * (pageOption.current - 1)
        })
      }
      tableData.value = list
      return {
        total: totalRows
      }
    }
  })
  const getQuery = q => {
    query.days = q.days
    query.date = q.date
    query.type = q.type
    fetchTableData()
  }
  const getStatisticsDetail = async () => {
    await getStatistics({}).then(response => {
      pfStatistics.totalMembers = response.data.totalMembers
      pfStatistics.unpaidMembers = response.data.unpaidMembers
      pfStatistics.paidMembers = response.data.paidMembers
      pfStatistics.activeWxUserTotal = response.data.activeWxUserTotal
    })
  }

  return {
    tableData,
    pfStatistics,
    // query,
    ckey,
    getStatisticsDetail,
    pagination,
    handleTableChange,
    fetchTableData,
    loading,
    getQuery
  }
}

// 导出表格
function exportXLSX() {
  const selectedTableRow = ref([])
  const tempSelectDatas = ref([])
  const onChange = (index, row) => {
    selectedTableRow.value = index
    tempSelectDatas.value = row.filter(item => item !== undefined)
  }
  const exportExcel = () => {
    const selectionDatas = handleData(tempSelectDatas.value)
    exportJson2Excel('会员数据', selectionDatas)
  }
  const handleData = list => {
    if (list.length < 1) {
      message.warn('请选择导出记录')
      return
    }
    const newList = list.map(item => ({
      日期: item.date,
      授权登录人数: item.activeWxUserTotal,
      入会总人数: item.joinedTotal,
      商会邀请入会人数: item.chamberInvitationTotal,
      自己申请入会人数: item.myselfApplyTotal,
      会员邀请入会人数: item.memberInvitationTotal,
      商会后台添加入会人数: item.chamberBackstageAddTotal,
      个人会员: item.personMemberTotal,
      // eslint-disable-next-line no-dupe-keys
      '企业/团体': item.companyMemberTotal
    }))
    return newList
  }
  return { selectedTableRow, onChange, exportExcel }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.data-card {
  width: 100%;
  height: 120px;
  border-radius: 2px;
  border: 1px solid #ccc;
  display: flex;
  border-right: none;
}

.d-card-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #ccc;
}

.card-value {
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}

.color-red {
  color: red;
}
</style>
