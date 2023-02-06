<template>
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8">
    <a-tab-pane key="withdrawal" tab="提现" name="withdrawal" />
    <a-tab-pane key="cardSetting" tab="提现银行卡设置" name="cardSetting" />
  </a-tabs>
  <Panel v-show="activeName === 'withdrawal'">
    <div class="stat-card">
      <div class="card-box" v-for="(item, index) in boardData" :key="index">
        <div class="card-box-3">
          <div class="card-key">{{ item.name }}（元）</div>
          <div class="card-value" :class="index === boardData.length - 1 ? 'member-lave-count' : ''">
            ¥{{ item.count }}
          </div>
        </div>
        <div class="cut-line" v-show="index !== boardData.length - 1"></div>
      </div>
      <div class="card-box">
        <div class="card-box-3">
          <a-button
            type="danger"
            :disabled="!(boardData[1].count > 0)"
            v-action="'提现-申请提现'"
            @click="applyVisible = true"
            >申请提现
          </a-button>
        </div>
      </div>
    </div>
  </Panel>
  <Panel v-show="activeName === 'cardSetting'">
    <a-form :model="cardSet" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
      <a-form-item label="商会名称">
        <a-input v-model:value="cardSet.chamberName" disabled />
      </a-form-item>
      <a-form-item label="账户名">
        <a-input v-model:value="cardSet.accountName" disabled />
      </a-form-item>
      <a-form-item label="开户行">
        <a-input v-model:value="cardSet.accountBank" disabled />
      </a-form-item>
      <a-form-item label="账号">
        <a-input v-model:value="cardSet.account" disabled />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="openVisible">修改</a-button>
      </a-form-item>
    </a-form>
  </Panel>
  <Panel v-if="activeName === 'withdrawal'">
    <a-tabs class="tabs">
      <a-tab-pane tab="提现记录" />
    </a-tabs>
    <div class="querySearch">
      <TimeFilter @change="dateChange" />
      <a-button type="primary" @click="exportExcel" v-action="'提现-导表'">导表 </a-button>
    </div>
    <a-table
      class="px-4"
      :loading="loading"
      :dataSource="tableData"
      :columns="cols"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: 'max-content', y: '30vh' }"
      :row-selection="{ selectedRowKeys, onChange, preserveSelectedRowKeys: true }"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'operate'">
          <a-button @click="showDetail(record)" v-action="'提现-详情'" type="link"> 详情</a-button>
        </template>
      </template>
    </a-table>
  </Panel>
  <a-modal
    v-model:visible="applyVisible"
    :title="'申请提现(会费可提现金额为¥' + boardData[1].count + ')'"
    @cancel="applyCancel"
    @ok="applyForMember"
    okText="保存"
  >
    <a-form :model="applyState" :wrapper-col="{ span: 18 }" ref="applyForm">
      <a-form-item
        label="申请金额"
        name="applyCount"
        :rules="[
          { validator: validateCount, trigger: 'change' },
          { pattern: /^[0]$|^(([1-9]\d*)|[0]\.\d{1,2}|([1-9]\d*)\.\d{1,2})$/, message: '最多两位小数金额' }
        ]"
      >
        <a-input v-model:value="applyState.applyCount" placeholder="请输入提现金额(100元以上)" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="visible" @cancel="cancelVisible" okText="保存" @ok="submit">
    <a-form :model="formState" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }" :rules="rules" ref="form">
      <a-form-item label="商会名称" name="chamberName">
        <a-input v-model:value="formState.chamberName" disabled />
      </a-form-item>
      <a-form-item label="账户名" name="accountName">
        <a-input v-model:value="formState.accountName" placeholder="请输入账户名" />
      </a-form-item>
      <a-form-item label="开户行" name="accountBank">
        <a-input v-model:value="formState.accountBank" placeholder="请输入开户行" />
      </a-form-item>
      <a-form-item label="账号" name="account">
        <a-input v-model:value="formState.account" placeholder="请输入账号" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="detailVisible" okText="我知道了" title="提现详情">
    <a-form :model="detailObj">
      <a-row>
        <a-col :span="12">
          <a-form-item label="申请方：">{{ detailObj.chamberName }} </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="微信手续费："> {{ detailObj.wechatPrice }} </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="提现日期：">
          {{ $filters.dateFormat(+detailObj.createTime) }}
        </a-form-item>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="提现类型：">
            {{ detailObj.status ? '会员' : '商城' }}
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="应打款金额：">
            {{ detailObj.realPrice }}
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="申请提现金额：">
          {{ detailObj.applyPrice }}
        </a-form-item>
      </a-row>
      <a-divider />
      <a-row>
        <a-form-item label="账户名：">
          {{ detailObj.accountName }}
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="开户行：">
          {{ detailObj.accountBank }}
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="账号：">
          {{ detailObj.account }}
        </a-form-item>
      </a-row>
      <a-divider />
      <a-row>
        <a-form-item label="状态：">
          {{ detailObj.status === 0 ? '审核中' : detailObj.status === 1 ? '提现成功' : '提现失败' }}
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="处理时间：">
          {{ $filters.dateFormat(+detailObj.processTime) }}
        </a-form-item>
      </a-row>
      <a-row v-if="detailObj.status == 2">
        <a-form-item label="驳回理由：">
          {{ detailObj.rejectRemark }}
        </a-form-item>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { inject, reactive, ref, getCurrentInstance } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import TimeFilter from '../components/timeFilter.vue'
import dayjs from 'dayjs'
import {
  getChamberFinanceData,
  getChamberFinanceWithdraw,
  getChamberOptions,
  getBank,
  updateBank,
  applyWithdrawalAdd
} from '@/api/finance/finance'
import { exportJson2Excel } from '@/utils/exportExcel'
import { message } from 'ant-design-vue'
export default {
  components: { TimeFilter },

  setup() {
    const activeName = ref('withdrawal')
    const { fetchStatic, applyState, applyVisible, ...staticInfo } = getStatistics()
    const { fetchTableData, ...tableInfo } = table()
    const { fetchBank, ...cardInfo } = cardSetting()
    fetchBank()
    fetchStatic()
    const { proxy } = getCurrentInstance()
    const applyForMember = async () => {
      try {
        await proxy.$refs.applyForm.validateFields()
        const params = {
          applyPrice: applyState.applyCount,
          type: 1
        }
        await applyWithdrawalAdd(params)
        message.success('提现申请提交成功')
        fetchTableData()
        fetchStatic()
        applyVisible.value = false
      } catch (error) {}
    }
    return {
      ...tableInfo,
      ...cardInfo,
      ...staticInfo,
      activeName,
      applyForMember,
      applyState,
      applyVisible
    }
  }
}
// 统计面板
function getStatistics() {
  const { proxy } = getCurrentInstance()
  const boardData = ref([
    { name: '会费累计提现金额', count: 0 },
    { name: '会费可提现金额', count: 0 }
  ])
  const fetchStatic = () => {
    getChamberFinanceData().then(response => {
      const { memberWithdraw, memberLave } = response.data.financeFullDataResp
      boardData.value[0].count = memberWithdraw
      boardData.value[1].count = memberLave
    })
  }

  const applyVisible = ref(false)
  const applyState = reactive({})
  const validateCount = async (_rule, value) => {
    if (!value) return Promise.reject(new Error('请输入金额'))
    if (parseFloat(value) > parseFloat(boardData.value[1].count)) {
      return Promise.reject(new Error('余额不足以提现'))
    } else {
      return Promise.resolve()
    }
  }
  const applyCancel = () => {
    applyVisible.value = false
    proxy.$refs.applyForm.resetFields()
  }

  return { applyCancel, applyState, boardData, applyVisible, validateCount, fetchStatic }
}
// 银行卡设置
function cardSetting() {
  const ckey = inject('ckey')
  const { proxy } = getCurrentInstance()
  const formState = reactive({
    chamberName: '',
    accountName: '',
    accountBank: '',
    account: ''
  })
  const cardSet = reactive({
    chamberName: '',
    accountName: '',
    accountBank: '',
    account: ''
  })
  const rules = reactive({
    chamberName: [{ required: true, message: '商会名称不能为空', trigger: 'blur' }],
    accountName: [{ required: true, message: '账户名不能为空', trigger: 'blur' }],
    accountBank: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
    account: [{ required: true, message: '账号不能为空', trigger: 'blur' }]
  })

  const visible = ref(false)
  const cancelVisible = () => {
    visible.value = false
    proxy.$refs.form.resetFields()
  }
  const fetchChamberOptions = async ckey => {
    const response = await getChamberOptions()
    let chamberName = ''
    for (const chamber of response.data.data) {
      if (ckey === chamber.value) {
        chamberName = chamber.label
        break
      }
    }
    return chamberName
  }

  // 拉取银行卡设置的信息数据
  const fetchBank = async () => {
    const response = await getBank()
    if (response.data.theBank === null) {
      cardSet.chamberName = await fetchChamberOptions(ckey.value)
    } else {
      const { chamberName, accountName, accountBank, account } = response.data.theBank
      cardSet.chamberName = chamberName
      cardSet.accountName = accountName
      cardSet.accountBank = accountBank
      cardSet.account = account
    }
  }
  const submit = async () => {
    try {
      await proxy.$refs.form.validateFields()
      formState.ckey = ckey.value
      await updateBank(formState)
      fetchBank()
      visible.value = false
    } catch (error) {}
  }
  const openVisible = () => {
    visible.value = true
    const { chamberName, accountName, accountBank, account } = cardSet
    formState.chamberName = chamberName
    formState.accountName = accountName
    formState.accountBank = accountBank
    formState.account = account
  }
  return { formState, submit, visible, rules, cardSet, openVisible, fetchBank, cancelVisible }
}
// 表格
function table() {
  const tableData = ref([])
  const cols = [
    {
      title: '提现日期',
      dataIndex: 'createTime',
      customRender: ({ record }) => {
        return dayjs(record.createTime).format('YYYY-MM-DD')
      }
    },
    { title: '申请方', dataIndex: 'chamberName' },
    {
      title: '提现类型',
      dataIndex: 'type',
      customRender: ({ record }) => {
        return record.status ? '会费' : '商城'
      }
    },
    { title: '申请提现金额', dataIndex: 'applyPrice' },
    { title: '微信手续费', dataIndex: 'wechatPrice' },
    { title: '打款金额', dataIndex: 'realPrice' },
    {
      title: '状态',
      dataIndex: 'status',
      customRender: ({ record }) => {
        return (
          <div>
            <a-badge status={record.status === 0 ? 'processing' : record.status === 1 ? 'success' : 'error'} />
            {record.status === 0 ? '审核中' : record.status === 1 ? '提现成功' : '提现失败'}
          </div>
        )
      }
    },
    { title: '操作', dataIndex: 'operate' }
  ]
  const date = reactive({
    time: []
  })
  const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
    fetchFn: async pageOption => {
      const condition = {
        pageSize: pageOption.pageSize,
        page: pageOption.current,
        startTime: date.time[0] || '',
        endTime: date.time[1] || ''
      }
      const {
        data: {
          data: { list, totalRows }
        }
      } = await getChamberFinanceWithdraw(condition)
      list.length &&
        list.forEach((e, index) => {
          e.key = index + pageOption.pageSize * (pageOption.current - 1)
        })
      tableData.value = list
      return {
        total: totalRows
      }
    }
  })
  // 改变时间时
  const dateChange = val => {
    date.time = val
    fetchTableData()
  }
  const detailVisible = ref(false)
  const detailObj = ref({})
  const showDetail = data => {
    detailVisible.value = true
    detailObj.value = data
  }

  const selectedRowKeys = ref([])
  let selectedData = []
  const onChange = (selected, selectedRow) => {
    selectedRowKeys.value = selected
    selectedData = selectedRow.filter(item => item !== undefined)
  }
  const { proxy } = getCurrentInstance()
  const exportExcel = () => {
    if (selectedRowKeys.value.length === 0) {
      proxy.$message.error('没有选择记录，操作失败')
      return
    }
    const list = []
    for (const data of selectedData) {
      const new_data = {
        提现日期: dayjs(data.createTime).format('YYYY-MM-DD'),
        申请方: data.chamberName,
        提现类型: data.type === 0 ? '商城' : '会费',
        '申请提现金额(元)': data.applyPrice,
        '微信手续费(元)': data.wechatPrice,
        '打款金额(元)': data.realPrice,
        状态: data.status === 0 ? '审核中' : data.status === 1 ? '提现成功' : '提现失败'
      }
      list.push(new_data)
    }
    exportJson2Excel('提现记录', list)
  }
  return {
    detailObj,
    dateChange,
    tableData,
    cols,
    pagination,
    handleTableChange,
    loading,
    fetchTableData,
    detailVisible,
    showDetail,
    onChange,
    selectedRowKeys,
    exportExcel
  }
}
</script>

<style scoped>
.stat-card {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  border: 1px solid #ccc;
  display: flex;
}

.card-box {
  /* float: left; */
  width: 22%;
  height: 100%;
  text-align: center;
  display: table;
  margin-left: 10px;
}

.card-box-3 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}

.card-value {
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}

.cut-line {
  float: left;
  margin-top: 42px;
  width: 1px;
  height: 36px;
  border-left: 1px solid #ccc;
}
.querySearch {
  display: flex;
  justify-content: space-between;
}

.member-lave-count {
  color: #ff0000;
}
:deep(.ant-tabs-nav) {
  margin: 0;
}
.tabs {
  margin: 0 0 16px;
}
</style>
