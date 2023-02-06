import { reactive, inject } from 'vue'
import { getMemberOptions, getDepartmentList } from '@/api/member/index'
import { getAvailableLabelList, getTradeLabelList } from '@/api/lable'
import Labels from '@/api/labels/labels'
import { STATUS_POINT_MAP } from '@/constant/member'

export function useTableColumns() {
  const memberPostOptions = reactive([]) // 会内职位 options
  const departmentOptions = reactive([]) // 部门 options
  const tradeOptions = reactive([]) // 行业 options
  const demandOptions = reactive([]) // 供需 options
  const platLabelsOptions = reactive([])
  const memberLabelsOptions = reactive([])
  const ckey = inject('ckey')

  /** 获取各筛选条件选项 */
  const fetchOptionsData = async () => {
    const params = { ckey: ckey.value }
    // 会内职位筛选项
    const {
      data: { data: postOptions }
    } = await getMemberOptions(params)
    memberPostOptions.push(...postOptions)
    memberPostOptions.unshift({ label: '全部', value: -1 })

    // 部门筛选项
    const {
      data: { data: departmentData }
    } = await getDepartmentList({ ...params, parentId: 0 })
    departmentOptions.push(...departmentData[0].departmentRespList)
    departmentOptions.unshift({ departmentName: '全部', id: -1, departmentRespList: [] })

    // 行业筛选项
    const { data: tradeData } = await getTradeLabelList(params)
    if (tradeData?.length) {
      tradeData.forEach(i => {
        i.value = i.id
        i.label = i.typeName
        i.children = i.subList.map(j => {
          return {
            value: j.id,
            label: j.typeName
          }
        })
      })
    }
    tradeOptions.push(...tradeData)

    // 供需筛选项
    const { data: demandData } = await getAvailableLabelList(params)
    if (demandData?.length) {
      demandData.forEach(i => {
        i.value = i.id
        i.label = i.name
      })
    }
    demandOptions.push(...demandData)

    // 获取本会创建的标签
    const {
      data: { list: memberLabelData }
    } = await Labels.getLabelGroupLst({ sourceCkeyList: ckey.value, noPaging: true, freeze: 0 })
    if (memberLabelData?.length) {
      memberLabelData.forEach(i => {
        i.value = i.id
        i.label = i.name
        i.children = i.memberLabelVOList.map(j => {
          return {
            value: j.id,
            label: j.name
          }
        })
      })
      memberLabelsOptions.push(...memberLabelData)
    }

    // 获取平台创建的标签
    const {
      data: { list: platLabelData }
    } = await Labels.getLabelGroupLst({ noPaging: true, freeze: 0, dataSource: 0 })
    if (platLabelData?.length) {
      platLabelData.forEach(i => {
        i.value = i.id
        i.label = i.name
        i.children = i.memberLabelVOList.map(j => {
          return {
            value: j.id,
            label: j.name
          }
        })
      })
    }
    platLabelsOptions.push(...platLabelData)
  }

  fetchOptionsData()

  const formColumns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      initialValue: '',
      filter: true,
      hideInTable: true,
      valueType: 'text',
      formItemProps: {
        placeholder: '关键词'
      }
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      initialValue: '',
      filter: true,
      hideInTable: true,
      valueType: 'text',
      formItemProps: {
        placeholder: '关键词'
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      initialValue: '',
      filter: true,
      hideInTable: true,
      valueType: 'text',
      formItemProps: {
        placeholder: ''
      }
    },
    {
      title: '会内职位',
      dataIndex: 'memberPostType',
      initialValue: -1,
      filter: true,
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        options: memberPostOptions
      }
    },
    {
      title: '部门',
      dataIndex: 'department',
      initialValue: -1,
      filter: true,
      hideInTable: true,
      valueType: 'cascader',
      formItemProps: {
        allowClear: false,
        expandTrigger: 'hover',
        placeholder: '请选择部门',
        changeOnSelect: true,
        fieldNames: { value: 'id', label: 'departmentName', children: 'departmentRespList' },
        options: departmentOptions,
        showCheckedStrategy: 'SHOW_CHILD'
      }
    },
    {
      title: '入会类型',
      dataIndex: 'type',
      initialValue: -1,
      filter: true,
      hideInTable: true,
      valueType: 'select',
      width: 150,
      formItemProps: {
        options: [
          { label: '全部', value: -1 },
          { label: '个人', value: 0 },
          { label: '企业', value: 1 },
          { label: '社会组织', value: 2 }
        ]
      }
    },
    {
      title: '用户名',
      dataIndex: 'uname',
      initialValue: '',
      filter: true,
      width: 100,
      hideInTable: true,
      valueType: 'text',
      formItemProps: {
        placeholder: ''
      }
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      initialValue: 1,
      filter: true,
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        options: [
          { label: '全部', value: -1 },
          { label: '正常', value: 1 },
          { label: '已冻结', value: 0 }
        ]
      }
    },
    {
      title: '激活状态',
      dataIndex: 'activatedState',
      initialValue: 0,
      filter: true,
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        options: [
          { label: '全部', value: 0 },
          { label: '已激活', value: 1 },
          { label: '未激活', value: -1 }
        ]
      }
    },
    {
      title: '短信发送状态',
      dataIndex: 'sendStatus',
      initialValue: -1,
      filter: true,
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        options: [
          { label: '全部', value: -1 },
          { label: '未发送', value: 0 },
          { label: '已发送', value: 1 }
        ]
      }
    },
    {
      title: '会员标签(本会创建)',
      dataIndex: 'chamberLabelIds',
      initialValue: [],
      filter: true,
      hideInTable: true,
      valueType: 'cascader',
      formItemProps: {
        options: memberLabelsOptions,
        multiple: true,
        maxTagCount: 'responsive',
        placeholder: '请选择',
        showCheckedStrategy: 'SHOW_CHILD'
      }
    },
    {
      title: '会员标签(平台推荐)',
      dataIndex: 'platLabelIds',
      initialValue: [],
      filter: true,
      hideInTable: true,
      width: 300,
      valueType: 'cascader',
      formItemProps: {
        options: platLabelsOptions,
        multiple: true,
        maxTagCount: 'responsive',
        placeholder: '请选择',
        showCheckedStrategy: 'SHOW_CHILD'
      }
    },
    {
      title: '供需标签',
      dataIndex: 'demandLabelIds',
      initialValue: [],
      filter: true,
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        options: demandOptions,
        mode: 'multiple'
      }
    },
    {
      title: '行业标签',
      dataIndex: 'tradeLabelIds',
      initialValue: [],
      filter: true,
      hideInTable: true,
      valueType: 'cascader',
      formItemProps: {
        options: tradeOptions,
        multiple: true,
        maxTagCount: 'responsive',
        placeholder: '请选择',
        showCheckedStrategy: 'SHOW_CHILD'
      }
    },
    {
      title: '入会时间',
      dataIndex: 'date',
      filter: true,
      hideInTable: true,
      valueType: 'dateTimeRange',
      formItemProps: { valueFormat: 'YYYY-MM-DD' }
    }
  ]

  const tableColumns = [
    {
      title: '用户头像',
      dataIndex: 'uavatar',
      customRender: ({ record }) => (
        <img
          style="width: 70px; height: 70px; border-radius:50%; object-fit: cover"
          src={record.uavatar || 'https://ysh-cdn.kaidicloud.com/prod/bee/commons/nologo.png'}
        />
      )
    },
    {
      title: '用户名',
      dataIndex: 'uname',
      width: 100
    },
    {
      title: '入会类型',
      dataIndex: 'type',
      customRender: ({ record }) => <div style="width:100px">{['个人', '企业', '社会组织'][record.type]}</div>
    },
    {
      title: '联系信息',
      dataIndex: 'contactInfo',
      width: 300,
      // ellipsis: true,
      customRender: ({ record }) => {
        if (+record.type === 0) {
          return (
            <div>
              <div>【会员姓名】{record.name}</div>
              <div>【会员手机号】{record.phone}</div>
            </div>
          )
        } else if (+record.type === 1) {
          return (
            <div>
              <div>【企业名称】{record.companyName}</div>
              <div>【联系人姓名】{record.contactName}</div>
              <div>【联系人手机号】{record.contactPhone}</div>
            </div>
          )
        } else if (+record.type === 2) {
          return (
            <div>
              {record.socialOrganizationLogo ? (
                <div class="flex-x-start-center">
                  【社会组织logo】
                  <img class="w-16 h-16 rounded-full" src={record.socialOrganizationLogo} />
                </div>
              ) : (
                ''
              )}

              <div>【社会组织名称】{record.companyName}</div>
              <div>【联系人姓名】{record.contactName}</div>
              <div>【联系人手机号】{record.contactPhone}</div>
            </div>
          )
        }
      }
    },
    {
      title: '入会时间/会内职位/部门',
      width: 300,
      customRender: ({ record }) => (
        <div>
          <div>【入会时间】{record.joinedTs}</div>
          <div>【会内职位】{record.postName}</div>
          <div>【部门】{record.departmentName}</div>
        </div>
      )
    },
    {
      title: '会员标签',
      dataIndex: 'memberLabelList',
      width: 300
    },
    {
      title: '供需标签',
      dataIndex: 'bridgeLabels',
      width: 300
    },
    {
      title: '行业标签',
      dataIndex: 'tradeBridges',
      width: 300
    },
    {
      title: '身份信息',
      dataIndex: 'identityVOList',
      width: 300
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ record }) => {
        const STATUS_MAP = new Map([
          [0, '已冻结'],
          [1, '正常'],
          [3, '待邀请']
        ])
        return (
          <div>
            <a-badge status={STATUS_POINT_MAP.get(record.status)} />
            {STATUS_MAP.get(+record.status)}
          </div>
        )
      }
    },
    {
      title: '激活状态',
      dataIndex: 'activatedState',
      width: 100,
      customRender: ({ record }) => {
        const STATE_MAP = new Map([
          [1, '已激活'],
          [-1, '未激活']
        ])
        return (
          <div>
            <a-badge status={STATUS_POINT_MAP.get(record.activatedState)} />
            {STATE_MAP.get(+record.activatedState)}
          </div>
        )
      }
    },
    {
      title: '短信发送状态',
      dataIndex: 'sendStatus',
      width: 120,
      customRender: ({ record }) => {
        const SEND_STATUS_MAP = new Map([
          [1, '已发送'],
          [0, '未发送']
        ])
        return (
          <div>
            <a-badge status={STATUS_POINT_MAP.get(record.sendStatus)} v-show={record.activatedState !== 1} />
            {record.activatedState !== 1 ? SEND_STATUS_MAP.get(+record.sendStatus) : '--'}
          </div>
        )
      }
    },
    {
      title: '商会认证状态',
      dataIndex: 'authenticate',
      width: 120,
      customRender: ({ record }) => {
        const AUTHENTICATE_MAP = new Map([
          [1, '已认证'],
          [0, '未认证']
        ])
        return (
          <div>
            <a-badge status={STATUS_POINT_MAP.get(+record.authenticate)} />
            {AUTHENTICATE_MAP.get(+record.authenticate)}
          </div>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
      fixed: 'right'
    }
  ]

  const columns = [...formColumns, ...tableColumns]

  return {
    columns,
    tradeOptions
  }
}
