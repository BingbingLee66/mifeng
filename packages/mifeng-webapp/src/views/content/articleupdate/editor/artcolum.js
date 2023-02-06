import { defineComponent, ref, onMounted, reactive, inject } from 'vue'
import { save, getAboutChamberList, getContactUs } from '@/api/content/article'
import WangEditor from '@/components/WangEditor'
import { useRouter } from 'vue-router'
import { CHAMBER_TAB } from '../../../../constant/content'
export default defineComponent({
  name: 'Articleupdate',
  components: {
    WangEditor
  },
  setup() {
    const ckey = inject('ckey')
    const router = useRouter()
    const contentColumnOptions = ref([])
    const formRef = ref(null)
    const formObj = reactive({
      ckey: ckey.value,
      contentModuleId: null,
      columnContent: '',
      contentHtml: ''
    })
    const rules = reactive({
      columnContent: [{ required: true, message: '栏目名称不能为空', trigger: 'blur' }]
    })
    // 是否是委员会
    const committee = ref(false)
    const activeName = ref()

    const closeTab = () => {
      router.go(-1)
    }

    const toSave = async () => {
      try {
        await formRef.value.validateFields()
        const parmas = {
          ckey: ckey.value,
          contentModuleId: formObj.contentModuleId + '',
          id: formObj.articleId,
          columnContent: formObj.columnContent,
          contentHtml: formObj.contentHtml
        }
        await save(parmas)
        closeTab()
      } catch (errorInfo) {
        return false
      }
    }
    const fetchData = async pageOption => {
      const list = ref([])
      if (formObj.contentModuleId === CHAMBER_TAB.about) {
        const {
          data: { data }
        } = await getAboutChamberList(pageOption)
        list.value = data.list
      } else {
        const { data } = await getContactUs(pageOption)
        list.value = data
      }
      list.value.forEach(item => {
        if (item.id === formObj.articleId) {
          formObj.columnContent = item.contentColumn
          formObj.contentHtml = item.contentHtml
        }
      })
    }
    onMounted(async () => {
      const { query } = router.currentRoute.value
      if (query.activeName && query.articleId) {
        formObj.contentModuleId = Number(query.activeName)
        formObj.articleId = Number(query.articleId)
        formObj.page = query.page
        formObj.pageSize = query.pageSize
        fetchData(formObj)
      }
      if (query.committee) {
        committee.value = true
      }
    })
    return {
      contentColumnOptions,
      formObj,
      formRef,
      rules,
      activeName,
      committee,
      closeTab,
      fetchData,
      toSave
    }
  }
})
