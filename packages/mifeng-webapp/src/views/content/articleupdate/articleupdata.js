import { defineComponent, getCurrentInstance, ref, onMounted, reactive, toRefs, inject } from 'vue'

import {
  getChamberContentList,
  getAboutChamberList,
  getContactUs,
  updateStatus,
  getDetail,
  updateChamberTop,
  del
} from '@/api/content/article'
import { getContentColumnOptionsWithCkey } from '@/api/content/columnsetup'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import TableFilter from '@/components/TableFilter/index.vue'
import { useResetFilter } from '@/use/useResetFilter'
import { ArticleListCols, AboutListCols, HonorListCols } from './tableCols'
import AddColumn from '../component/addColumn'
import SetLevel from '../component/setLevel'
import { Modal } from 'ant-design-vue'
import { CHAMBER_TAB, DISABLE_Edit_ARTICLE, ARTICLE_STATUS, ARTICLE_AUDITSTATYUS } from '../../../constant/content'
import dayjs from 'dayjs'
import { DataCollect } from '@/utils/data-collect'
export default defineComponent({
  name: 'Articleupdate',
  components: {
    AddColumn,
    SetLevel
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const { proxy } = getCurrentInstance()
    const ckey = inject('ckey')
    const contentColumnOptions = ref([])
    const searchColumn = [
      {
        title: '文章标题',
        dataIndex: 'title',
        filter: true,
        valueType: 'text',
        hideInTable: true,
        formItemProps: {
          placeholder: '请输入'
        },
        span: 8
      },
      {
        title: '栏目',
        dataIndex: 'contentColumnId',
        filter: true,
        hideInTable: true,
        valueType: 'select',
        formItemProps: {
          options: contentColumnOptions,
          placeholder: '请选择'
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        filter: true,
        hideInTable: true,
        valueType: 'select',
        span: 8,
        formItemProps: {
          options: [
            { label: '全部', value: -1 },
            { label: '已发布', value: 1 },
            { label: '已冻结(商会)', value: 0 },
            { label: '已冻结(平台)', value: 3 },
            { label: '定时发布', value: 4 },
            { label: '审核不通过', value: 8 }
          ],
          placeholder: '请选择',
          defaultValue: -1
        }
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        filter: true,
        valueType: 'text',
        hideInTable: true,
        formItemProps: {
          placeholder: '请输入'
        },
        span: 8
      },
      {
        title: '文章id',
        dataIndex: 'articleId',
        filter: true,
        valueType: 'text',
        hideInTable: true,
        formItemProps: {
          placeholder: '请输入'
        },
        span: 8
      },
      {
        title: '发布时间',
        dataIndex: 'date',
        filter: true,
        hideInTable: true,
        valueType: 'dateTimeRange',
        formItemProps: { valueFormat: 'YYYY-MM-DD' },
        span: 12
      }
    ]
    const column = reactive([...searchColumn, ...ArticleListCols])
    const tableFilter = reactive({
      contentModuleId: 5,
      title: '',
      contentColumnId: -1,
      status: -1,
      date: [],
      column: '',
      orderType: 1,
      creator: '',
      articleId: '',
      startTs: '',
      endTs: ''
    })
    const handleSearch = value => {
      if (value.date) {
        const [startTs, endTs] = value.date
        tableFilter.startTs = startTs
        tableFilter.endTs = endTs
      } else {
        tableFilter.startTs = null
        tableFilter.endTs = null
      }
      tableFilter.contentColumnId = value.contentColumnId === undefined ? -1 : value.contentColumnId
      tableFilter.status = value.status === undefined ? -1 : value.status
      tableFilter.title = value.title
      tableFilter.creator = value.creator
      tableFilter.articleId = value.articleId ? value.articleId.replace(/[^\d]/g, '') : value.articleId
      pageOption.page = 1
      fetchData({ ...tableFilter, ...pageOption })
    }
    const loading = ref(true)
    const tableData = ref([])

    const pageOption = reactive({
      ckey,
      page: 1,
      pageSize: 10
    })
    const orgPageOption = reactive({
      page: pageOption.page,
      pageSize: pageOption.pageSize,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      showTotal: total => `共 ${total} 项`,
      showSizeChanger: true,
      showQuickJumper: true
    })
    const handleTableChange = pag => {
      pageOption.page = pag.current
      pageOption.pageSize = pag.pageSize
      fetchData({ ...tableFilter, ...pageOption })
    }
    const handleTabsChange = () => {
      window.localStorage.setItem('ACTIVENAME', tableFilter.contentModuleId)
      pageOption.page = 1
      pageOption.pageSize = 10
      fetchData({ ...tableFilter, ...pageOption })
    }
    const fetchData = async pageOption => {
      loading.value = true
      if (tableFilter.contentModuleId === CHAMBER_TAB.article) {
        const {
          data: { data }
        } = await getChamberContentList(pageOption)
        loading.value = false
        tableData.value = data.list
        orgPageOption.pageSize = data.pageSize
        orgPageOption.total = data.totalRows
      } else if (tableFilter.contentModuleId === CHAMBER_TAB.about) {
        const {
          data: { data }
        } = await getAboutChamberList({ ...pageOption, contentModuleId: tableFilter.contentModuleId })
        loading.value = false
        tableData.value = data.list
        orgPageOption.pageSize = data.pageSize
        orgPageOption.total = data.totalRows
      } else if (tableFilter.contentModuleId === CHAMBER_TAB.honor) {
        const { data } = await getContactUs(pageOption)
        loading.value = false
        tableData.value = data
        orgPageOption.total = data.length
      }
    }
    const queryFetchData = () => {
      tableFilter.endTs = tableFilter.date[1] || ''
      tableFilter.startTs = tableFilter.date[0] || ''
      fetchData({ ...tableFilter, ...pageOption })
    }

    // 请求栏目标签
    const contentModuleId = ref(3)
    const getContentColumnType = async () => {
      if (tableFilter.contentModuleId === CHAMBER_TAB.article) {
        contentModuleId.value = 3
      } else if (tableFilter.contentModuleId === CHAMBER_TAB.about) {
        contentModuleId.value = 4
      }
      const params = reactive({
        ckey,
        contentModuleId
      })
      const {
        data: { data }
      } = await getContentColumnOptionsWithCkey(params)
      contentColumnOptions.value = data
    }

    // 去置顶管理页面
    const toStick = () => {
      router.push({
        path: '/content/settop-manager'
      })
    }
    // 文章编辑/添加
    const AddOrEdit = row => {
      // 编辑状态不计入内容创建
      if (!row.id) DataCollect.Content.create({ store })

      router.push({
        path: '/content/article-editor',
        query: {
          activeName: tableFilter.contentModuleId,
          articleId: row.id
        }
      })
    }
    const initStickTime = () => {
      const start = dayjs()
      const end = dayjs().add(1, 'month')
      return [start, end]
    }
    // 设置置顶
    const stickShow = ref(false)
    const formState = reactive({ stickTime: initStickTime(), articleId: null, ckey: '', type: 1 })
    const showStickModal = row => {
      formState.articleId = row.id
      formState.ckey = row.ckey
      formState.stickTime = initStickTime()
      stickShow.value = true
    }
    const stickForm = ref()
    // 文章置顶
    const updateTop = async () => {
      await stickForm.value.validateFields()
      const { articleId, ckey } = formState
      const params = {
        articleId,
        ckey,
        startTs: new Date(formState.stickTime[0]).getTime(),
        endTs: new Date(formState.stickTime[1]).getTime(),
        type: 1
      }
      await updateChamberTop(params)
      stickShow.value = false
      await fetchData({ ...tableFilter, ...pageOption })
    }
    const cancelTop = () => {
      // 清空表单校验
      stickForm.value.resetFields()
      stickShow.value = false
    }
    // 添加栏目
    const addColumnVisible = ref(false)
    const editObj = reactive({})
    const addColumn = () => {
      addColumnVisible.value = true
      editObj.isEdit = false
      editObj.ckey = ckey.value
      editObj.activeName = tableFilter.contentModuleId - 2
    }
    // 编辑栏目
    const editColumn = row => {
      router.push({
        name: '修改栏目内容',
        query: {
          activeName: tableFilter.contentModuleId,
          articleId: row.id,
          page: pageOption.page,
          pageSize: pageOption.pageSize
        }
      })
    }
    // 文章冻结/解冻
    const updateState = async row => {
      const params = {
        id: row.id,
        action: row.status === ARTICLE_STATUS.freezeByChamber ? 'active' : 'notactive'
      }
      try {
        await updateStatus(params)
        proxy.$message.success(row.status === ARTICLE_STATUS.freezeByChamber ? '解冻成功' : '文章已冻结')
      } catch (error) {}
      await fetchData({ ...tableFilter, ...pageOption })
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
          fetchData({ ...tableFilter, ...pageOption })
        },
        onCancel() {
          proxy.$message.warn('已取消删除')
        }
      })
    }
    // 设置权重
    const setLevelVisible = ref(false)
    const levelObj = reactive({})
    const setLevel = row => {
      levelObj.level = row.sort
      levelObj.id = row.contentColumnId
      setLevelVisible.value = true
    }

    onMounted(async () => {
      const ACTIVENAME = window.localStorage.getItem('ACTIVENAME')
      if (ACTIVENAME) tableFilter.contentModuleId = Number(ACTIVENAME)
      await getContentColumnType()
      await fetchData({ ...tableFilter, ...pageOption })
    })
    return {
      formState,
      stickShow,
      stickForm,
      CHAMBER_TAB,
      DISABLE_Edit_ARTICLE,
      ARTICLE_STATUS,
      ARTICLE_AUDITSTATYUS,
      editObj,
      contentModuleId,
      loading,
      tableData,
      contentColumnOptions,
      tableFilter,
      pageOption,
      orgPageOption,
      // search,
      TableFilter,
      column,
      AboutListCols,
      HonorListCols,
      addColumnVisible,
      setLevelVisible,
      contentHtmlVisible,
      ModelContent,
      levelObj,
      handleSearch,
      ...useResetFilter({ ...toRefs(tableFilter) }),
      updateTop,
      showStickModal,
      cancelTop,
      editColumn,
      addColumn,
      toStick,
      AddOrEdit,
      updateState,
      delArticle,
      setLevel,
      queryFetchData,
      getContentColumnType,
      handleTabsChange,
      handleTableChange,
      fetchData,
      openDetail
    }
  }
})
