import {
  getList,
  updateStatus,
  delColumn,
  updateSpecialCommittee,
  showSpecialCommittee
} from '@/api/content/columnsetup'
import { defineComponent, ref, onMounted, inject, reactive, getCurrentInstance, watch } from 'vue'
import { useAntTable } from '@/use/useAntTable/index'
import AddColumn from '../component/addColumn'
import SetLevel from '../component/setLevel'
import { Modal } from 'ant-design-vue'
import { Column_STATUS } from '../../../constant/content'
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { STATUS_POINT_MAP } from '@/constant/member'
export default defineComponent({
  components: {
    AddColumn,
    SetLevel,
    PlusTable
  },
  setup() {
    const ArticleListCols = ref([
      { title: '序号', key: 'id', width: 120 },
      { title: '所属模块', dataIndex: 'contentModule', key: 'contentModule', width: 175 },
      { title: '栏目', dataIndex: 'columnName', key: 'columnName', width: 175 },
      { title: '权重', dataIndex: 'level', key: 'level', width: 100 },
      { title: '创建信息', key: 'createdTs', width: 150 },
      { title: '更新信息', key: 'updateTs', width: 150 },
      { title: '状态', key: 'status', width: 150 },
      // { title: '是否给专委会使用', key: 'committee', width: 170 },
      { title: '操作', key: 'handle', width: 150, fixed: 'right' }
    ])
    const { $message } = getCurrentInstance().appContext.config.globalProperties
    const checkLevel = (rule, value) => {
      if (!/^([0-9]\d*)$/.test(value) && value !== '' && value !== null) {
        return Promise.reject(new Error('权重范围：0-999'))
      } else if (value > 999) {
        return Promise.reject(new Error('权重范围：0-999'))
      } else {
        return Promise.resolve()
      }
    }
    // 权重rule
    const levelRules = {
      level: [
        { required: true, message: '权重不能为空', trigger: ['blur', 'change'] },
        {
          validator: checkLevel,
          trigger: ['blur', 'change']
        }
      ]
    }
    const ckey = inject('ckey')
    const tableData = ref([])
    const addColumnVisible = ref(false)
    const isSpecialCommitteeBolVisible = ref(false)
    const activeName = ref('3')
    //   是否展示是否给专委会使用列
    const fetchCommitteeFn = async () => {
      const { data } = await showSpecialCommittee(ckey.value)
      isSpecialCommitteeBolVisible.value = data
    }
    const committeeIndex = { title: '是否给专委会使用', key: 'committee', width: 170 }
    watch(
      () => [activeName, isSpecialCommitteeBolVisible],
      () => {
        const { length } = ArticleListCols.value
        const index = ArticleListCols.value.indexOf(committeeIndex)
        if (isSpecialCommitteeBolVisible.value && activeName.value === '3' && index === -1) {
          ArticleListCols.value.splice(length - 2, 0, committeeIndex)
        } else if (index !== -1) {
          ArticleListCols.value.splice(index, 1)
        }
      },
      {
        immediate: true,
        deep: true
      }
    )

    const fetchFn = async pageOption => {
      const conditionQuery = {
        limit: pageOption.pageSize,
        page: pageOption.current,
        ckey: ckey.value,
        contentModuleId: activeName.value
      }
      const {
        data: { data }
      } = await getList(conditionQuery)
      data.list.forEach(item => {
        item.isSpecialCommitteeBol = item.isSpecialCommittee === 1
      })
      tableData.value = data.list
      return {
        total: data.totalRows
      }
    }
    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({ fetchFn })
    // 添加栏目
    const addColumn = () => {
      editObj.isEdit = false
      editObj.ckey = ckey.value
      editObj.activeName = activeName.value
      editObj.columnName = null
      editObj.level = null
      editObj.id = null
      addColumnVisible.value = true
    }
    const editObj = reactive({})
    // 编辑栏目
    const editColumn = row => {
      editObj.isEdit = true
      editObj.id = row.id
      editObj.ckey = row.ckey
      editObj.columnName = row.columnName
      editObj.activeName = activeName.value
      editObj.level = row.level
      addColumnVisible.value = true
    }
    // 冻结解冻
    const updateState = async row => {
      const params = {
        id: row.id,
        action: row.status === Column_STATUS.freeze ? 'active' : 'notactive'
      }
      try {
        await updateStatus(params)
        $message.success(row.status === Column_STATUS.freeze ? '解冻成功' : '栏目已冻结')
      } catch (error) {}
      fetchTableData(true)
    }
    // 删除栏目
    const deleteColum = row => {
      Modal.confirm({
        title: '提示',
        content: '确认删除该栏目吗?',
        onOk: async () => {
          await delColumn(row.id)
          fetchTableData(true)
        },
        onCancel() {
          $message.warn('已取消删除')
        }
      })
    }
    const setLevelVisible = ref(false)
    const levelObj = reactive({})
    const setLevel = row => {
      levelObj.level = row.level
      levelObj.id = row.id
      setLevelVisible.value = true
    }
    const handleTabsChange = () => {
      fetchTableData(true)
    }
    // 是否给专委会使用
    const handleSpecialCommitteeChange = async (e, row) => {
      await updateSpecialCommittee({
        id: row.id,
        isSpecialCommittee: e ? 1 : 0
      })
    }
    onMounted(async () => {
      await fetchCommitteeFn()
      fetchTableData(true)
    })
    const tabMap = new Map([
      ['3', '商会文章'],
      ['4', '关于商会']
    ])
    return {
      tabMap,
      Column_STATUS,
      STATUS_POINT_MAP,
      ArticleListCols,
      ckey,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      activeName,
      tableData,
      levelRules,
      editObj,
      levelObj,
      setLevelVisible,
      addColumnVisible,
      isSpecialCommitteeBolVisible,
      handleTabsChange,
      setLevel,
      addColumn,
      fetchCommitteeFn,
      editColumn,
      deleteColum,
      updateState,
      handleSpecialCommitteeChange,
      fetchFn
    }
  }
})
