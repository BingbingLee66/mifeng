<template>
  <PlusTable
    ref="plusTable"
    row-key="id"
    :loading="loading"
    :columns="colums"
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
            query.startTime = null
            query.endTime = null
          }
        "
        >重置</a-button
      >
    </template>
    <template #toolBar>
      <a-button class="ml-3" type="primary" v-action="'导表'" @click="exportExcel">导表</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'handle'">
        <a-button type="link" v-action="'详情'" @click="detail(record.orderSn)"> 详情 </a-button>
      </template>
    </template>
  </PlusTable>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import { ref, reactive, onMounted, computed, toRaw, getCurrentInstance } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getChamberOptions } from '@business/common/src/finance/api'
import { getAllList, getChannelList } from '@/api/order/index'
import { exportJson2Excel } from '@business/common/src/utils/exportExcel'
import { jumpOldYSH } from '@/utils/jumpOldYSH'
import { ORDER_STATE_MAP, ORDER_STATE } from '@/constant/order'
import { useRouter } from 'vue-router'
const router = useRouter()
const plusTable = ref()
const chamberOptions = ref([{ value: -1, label: '全部' }])
const getChamberOption = async () => {
  const {
    data: { data }
  } = await getChamberOptions()
  chamberOptions.value = [...chamberOptions.value, ...data]
}
// 查询推广渠道
const channelOptions = ref([{ value: -1, label: '全部' }])
const getChannelOptions = async () => {
  const { data } = await getChannelList()
  data.forEach(item => {
    channelOptions.value.push({
      value: item.id,
      label: item.channelName
    })
  })
}
const tableColumns = ref([
  {
    title: '订单号',
    dataIndex: 'orderSn'
  },
  {
    title: '微信订单号',
    dataIndex: 'wechatOrderNum',
    customRender: ({ record }) => {
      return record.wechatOrderNum || '--'
    }
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    customRender: ({ record }) => {
      return record.createTime | record.dateFormat
    }
  },
  {
    title: '商品名称',
    dataIndex: 'name'
  },
  {
    title: '商品规格',
    dataIndex: 'codeName',
    customRender: ({ record }) => {
      return record.codeName || '无'
    }
  },
  {
    title: '单价(元)',
    dataIndex: 'price'
  },
  {
    title: '下单数',
    dataIndex: 'count'
  },
  {
    title: '实付金额(元)',
    dataIndex: 'realPrice'
  },
  {
    title: '推广渠道',
    dataIndex: 'channelName',
    customRender: ({ record }) => {
      return record.channelName || '--'
    }
  },
  {
    title: '用户属性',
    dataIndex: 'isFirst',
    customRender: ({ record }) => {
      return record.isFirst === 1 ? '首单用户' : record.isFirst === 2 ? '复购用户' : '--'
    }
  },
  {
    title: '大礼包',
    customRender: ({ record }) => {
      return (
        <div>
          <div>
            <a-button
              type="link"
              onclick={() => {
                goSpreeDetail(record.giftId)
              }}
            >
              {record.giftId}
            </a-button>
          </div>
          <div>{record.giftName}</div>
        </div>
      )
    }
  },
  {
    title: '优惠券',
    customRender: ({ record }) => {
      return (
        <div>
          <div>
            <a-button
              type="link"
              onclick={() => {
                goCouponDetail(record.templateId)
              }}
            >
              {record.templateId}
            </a-button>
          </div>
          <div>{record.couponName}</div>
        </div>
      )
    }
  },
  {
    title: '收货信息',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.consignee} </div>
          <div>{record.mobile}</div>
          <div>{record.consigneeAddress}</div>
        </div>
      )
    }
  },
  {
    title: '订单所属商会',
    customRender: ({ record }) => {
      const chamberItem = computed(() => {
        return chamberOptions.value.filter(item => record.ckey === item.value)
      })
      if (chamberItem.value.length > 0) {
        return toRaw(chamberItem.value[0]).label
      }
      return ''
    }
  },
  {
    title: '供货商家',
    customRender: ({ record }) => {
      return record.supplierName
    }
  },
  {
    title: '状态',
    customRender: ({ record }) => {
      return ORDER_STATE_MAP.get(record.status)
    }
  },
  {
    title: '操作',
    key: 'handle',
    fixed: 'right'
  }
])
const filterColums = ref([
  {
    title: '订单号',
    hideInTable: true,
    dataIndex: 'orderSn',
    filter: true,
    valueType: 'text'
  },
  {
    title: '微信订单号',
    hideInTable: true,
    dataIndex: 'wechatOrderNum',
    filter: true,
    valueType: 'text'
  },
  {
    title: '订单所属商会',
    hideInTable: true,
    dataIndex: 'ckey',
    filter: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: computed(() => {
        return chamberOptions.value
      })
    }
  },
  {
    title: '供货商家',
    hideInTable: true,
    dataIndex: 'supplierName',
    filter: true,
    valueType: 'text'
  },
  {
    title: '商品名称',
    hideInTable: true,
    dataIndex: 'goodName',
    filter: true,
    valueType: 'text'
  },
  {
    title: '推广渠道',
    hideInTable: true,
    dataIndex: 'channelId',
    filter: true,
    initialValue: -1,
    valueType: 'select',
    formItemProps: {
      options: computed(() => {
        return channelOptions.value
      })
    }
  },
  {
    title: '用户属性',
    hideInTable: true,
    dataIndex: 'isFirst',
    filter: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: [
        { value: -1, label: '所有' },
        { value: 1, label: '首单用户' },
        { value: 2, label: '复购用户' }
      ]
    }
  },
  {
    title: '订单状态',
    hideInTable: true,
    dataIndex: 'status',
    filter: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: [
        { value: -1, label: '所有' },
        { value: ORDER_STATE.TOSHIPPED, label: '待发货' },
        { value: ORDER_STATE.HASPAID, label: '已发货' },
        { value: ORDER_STATE.HSASHIPPED, label: '已完成' },
        { value: ORDER_STATE.WAITGROUP, label: '待成团' },
        { value: ORDER_STATE.TOPAID, label: '待支付' },
        { value: ORDER_STATE.CANCELORDER, label: '取消订单' }
      ]
    },
    formItemMethods: {
      select: value => {
        if (![ORDER_STATE.HASPAID, ORDER_STATE.HSASHIPPED].includes(value)) {
          query.settled = null
          query.settlementStatus = null
        }
        // 订单状态初始值重新赋值
        if (filterColums.value[7].dataIndex === 'status') {
          filterColums.value[7].initialValue = value
        } else {
          const index = filterColums.value.indexOf(item => item.dataIndex === 'status')
          filterColums.value[index].initialValue = value
        }
        query.status = value
      }
    }
  },
  {
    title: '收货人姓名',
    hideInTable: true,
    dataIndex: 'consignee',
    filter: true,
    valueType: 'text'
  },
  {
    title: '收货人手机号',
    hideInTable: true,
    dataIndex: 'consigneeMobile',
    filter: true,
    valueType: 'text'
  },
  {
    title: '生成结算单',
    hideInTable: true,
    dataIndex: 'settled',
    filter: computed(() => {
      return [ORDER_STATE.HASPAID, ORDER_STATE.HSASHIPPED].includes(query.status)
    }),
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: [
        { value: -1, label: '所有' },
        { value: 1, label: '是' },
        { value: 0, label: '否' }
      ]
    },
    formItemMethods: {
      change: value => {
        if (value !== 1) {
          query.settlementStatus = null
        }
        // 订单状态初始值重新赋值
        if (filterColums.value[10].dataIndex === 'settled') {
          filterColums.value[10].initialValue = value
        } else {
          const index = filterColums.value.indexOf(item => item.dataIndex === 'settled')
          filterColums.value[index].initialValue = value
        }
        query.settled = value
      }
    }
  },
  {
    title: '商品结算状态',
    hideInTable: true,
    dataIndex: 'settlementStatus',
    filter: computed(() => {
      return query.settled === 1 && [ORDER_STATE.HASPAID, ORDER_STATE.HSASHIPPED].includes(query.status)
    }),
    valueType: 'select',
    formItemProps: {
      options: [
        { value: -1, label: '所有' },
        { value: 0, label: '待商务确认' },
        { value: 1, label: '待财务付款' },
        { value: 2, label: '财务已付款' }
      ]
    }
  },
  {
    title: '下单时间',
    hideInTable: true,
    dataIndex: 'date',
    filter: true,
    valueType: 'dateTimeRange',
    formItemProps: {
      valueFormat: 'YYYY-MM-DD'
    },
    formItemMethods: {
      change: value => {
        if (value) {
          const [startTime, endTime] = value
          query.startTime = startTime
          query.endTime = endTime
        }
      }
    }
  },
  {
    title: '大礼包ID',
    hideInTable: true,
    dataIndex: 'giftId',
    filter: true,
    valueType: 'text'
  },
  {
    title: '大礼包名称',
    hideInTable: true,
    dataIndex: 'giftName',
    filter: true,
    valueType: 'text'
  },
  {
    title: '优惠券ID',
    hideInTable: true,
    dataIndex: 'templateId',
    filter: true,
    valueType: 'text'
  }
])
const colums = ref([...tableColumns.value, ...filterColums.value])
const query = reactive({
  orderSn: '',
  ckey: '',
  wechatOrderNum: '',
  supplierName: '',
  goodName: '',
  status: -1,
  consignee: '',
  consigneeMobile: '',
  settled: null,
  settlementStatus: null,
  channelId: null, // 推广渠道
  isFirst: null // 用户属性
})

const tableData = ref([])
onMounted(async () => {
  await fetchTableData()
  await getChamberOption()
  await getChannelOptions()
})

const detail = orderSn => {
  router.push({ name: '订单详情', query: { orderSn } })
}

const goSpreeDetail = giftId => {
  jumpOldYSH(`/mall/spreeDetail?giftId=${giftId}`)
}

const goCouponDetail = couponId => {
  jumpOldYSH(`/mall/spreeDetail?couponId=${couponId}`)
}
// 上传文件校验
const { proxy } = getCurrentInstance()

const isExcel = ref(false)
const exportExcel = async () => {
  if (!query.startTime && !query.endTime) {
    proxy.$message.error('请选择下单起止时间')
    return
  }
  isExcel.value = true
  await fetchTableData()
}

const handleSelectionChange = value => {
  const selectionDatas = []
  const BeLong = ckey => {
    const chamberItem = computed(() => {
      return chamberOptions.value.filter(item => ckey === item.value)
    })
    if (chamberItem.value.length > 0) {
      return toRaw(chamberItem.value[0]).label
    }
    return ' '
  }
  value.forEach(data => {
    const new_data = {
      订单号: data.orderSn,
      下单时间: data.createTime,
      微信订单号: data.wechatOrderNum ? data.wechatOrderNum : '--',
      状态: ORDER_STATE_MAP.get(data.status),
      推广渠道: data.channelName || '--',
      用户属性: data.isFirst === 1 ? '首单用户' : data.isFirst === 2 ? '复购用户' : '--',
      供货商家: data.supplierName,
      大礼包ID: data.giftId,
      大礼包名称: data.giftName,
      优惠券ID: data.templateId,
      优惠券名称: data.couponName,
      订单所属商会: BeLong(data.ckey),
      商品名称: data.name,
      商品规格: data.codeName || '无',
      '单价(元)': data.price,
      下单数: data.count,
      '立减优惠(元)': data.totalDiscount,
      '优惠券优惠(元)': data.couponPrice / 100,
      '实付金额(元)': data.realPrice,
      收件人: data.consignee,
      收件人手机号: data.mobile,
      收货地址: data.consigneeAddress
    }
    selectionDatas.push(new_data)
  })
  return selectionDatas
}

const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    ...query,
    pageSize: pageOption.pageSize,
    page: pageOption.current
  })
  const {
    data: { data }
  } = await getAllList(isExcel.value ? query : conditionQuery)
  if (isExcel.value) {
    isExcel.value = false
    if (data.totalRows === 0) {
      proxy.$message.warning('无记录')
      return {
        total: data.totalRows
      }
    } else if (data.totalRows > 4999) {
      proxy.$message.warning('请选择记录小于5000条')
      return {
        total: data.totalRows
      }
    }
    const selectionDatas = handleSelectionChange(data.list)
    exportJson2Excel('订单列表', selectionDatas)
    return {
      total: data.totalRows
    }
  }
  tableData.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, fetchTableData, loading, handleTableChange } = useAntTable({ fetchFn })

const handleSearch = value => {
  const [startTime, endTime] = value?.date || []
  value.startTime = startTime
  value.endTime = endTime
  value.date = null
  if (value.ckey === -1) value.ckey = null
  if (value.isFirst === -1) value.isFirst = null
  if (value.settled === -1) value.settled = null
  if (value.channelId === -1) value.channelId = null
  if (value.settlementStatus === -1) value.settlementStatus = null
  Object.assign(query, value)
  fetchTableData({ current: 1 })
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
