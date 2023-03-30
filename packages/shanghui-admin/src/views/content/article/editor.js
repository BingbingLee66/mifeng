import { defineComponent, ref, onMounted, reactive, getCurrentInstance } from 'vue'
import { getUpdateDetail, save, uploadCoverImg } from '@business/common/src/content/api/article'
import { getContentColumnOptions } from '@business/common/src/content/api/columnsetup'
import { getOptions } from '@business/common/src/content/api/articleSource'
import WangEditor from '@business/components/src/wangeditor'
import CropperUpLoad from '@business/components/src/upload/cropper-uploader'
import VideoUpLoad from '@business/components/src/upload/video-uploader'
import Preview from '@business/components/src/content/preview.vue'
import ArtLink from '@business/components/src/content/artLink.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FormItemRest } from 'ant-design-vue/es/form'
import { YSH_COVERIMG_NUM } from '../../../constant/content'
import { DataCollect } from '@business/logics/src/dataCollect/index'
export default defineComponent({
  name: 'Articleupdate',
  components: {
    FormItemRest,
    WangEditor,
    VideoUpLoad,
    ArtLink,
    Preview,
    CropperUpLoad
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const { $message } = getCurrentInstance().appContext.config.globalProperties
    const contentColumnOptions = ref([])
    const articleSourceOptions = ref([])
    const formRef = ref(null)
    const saveLoading = ref(false)
    const formObj = reactive({
      title: '',
      contentColumnId: '',
      contentHtml: '',
      coverType: 0, // 封面图片选择，0为无，1为1张，2为3张
      coverImgs: ['', '', ''],
      status: 1,
      istop: false,
      articleExtendDTO: {
        id: null,
        shareTitle: '', // 分享标题
        shareFriendPicture: '', // 分享微信好友圈图片
        sharePoster: '' // 分享海报图片
      },
      vid: '', // 上传视频Id
      videoCoverURL: '' // 视频封面
    })
    const videoValue = ref([])
    const optionList = ref(['标签聚合页', '商会必参', '标签聚合页/商会必参', 'tab页'])
    const rules = reactive({
      title: [
        { required: true, message: '文章标题不能为空', trigger: 'blur' },
        { min: 5, max: 60, message: '限输入5-60个字的标题', trigger: 'blur' }
      ],
      sourceId: [{ required: true, message: '文章来源不能为空', trigger: 'blur' }],
      contentColumnId: [{ required: true, message: '对应栏目不能为空', trigger: 'blur' }]
    })

    const articleId = ref(null)

    const previewVisible = ref(false)
    const articleVisible = ref(false)

    const showPreview = () => {
      previewVisible.value = true
    }
    const importArticle = () => {
      articleVisible.value = true
    }
    const getContentColumnType = async () => {
      const {
        data: { data }
      } = await getContentColumnOptions()
      contentColumnOptions.value = data
      contentColumnOptions.value.forEach(item => {
        if (item.typeUrl !== 0) {
          item.label = optionList.value[item.typeUrl - 1] + '-' + item.label
        }
        return {
          label: item.label,
          value: item.value
        }
      })
    }

    const getArticleSourceType = async () => {
      const {
        data: { data }
      } = await getOptions()
      articleSourceOptions.value = data
    }

    const resetCoverImgs = type => {
      if (type === YSH_COVERIMG_NUM.one || type === YSH_COVERIMG_NUM.three) {
        formObj.coverImgs = []
      }
    }
    const uploadVideoSucceed = vid => {
      formObj.vid = vid
    }
    const ToSave = async () => {
      try {
        // 如果 编辑的情况下 有视频 但是没视频封面 提示
        if (articleId.value && formObj.vid && !formObj.videoCoverURL) return $message.error('请上传视频封面')
        // 如果上传了视频封面没上传视频 提示
        if (formObj.videoCoverURL && !formObj.vid) return $message.error('请上传视频')
        await formRef.value.validateFields()
        submit()
      } catch (errorInfo) {
        return false
      }
    }
    const submit = async () => {
      if (
        // 封面图片选择，0为无，1为必须上传1张，2为必须上传3张。上传不全提示警告
        (formObj.coverType === YSH_COVERIMG_NUM.one && formObj.coverImgs.length === 1) ||
        formObj.coverType === YSH_COVERIMG_NUM.none ||
        (formObj.coverType === YSH_COVERIMG_NUM.three && formObj.coverImgs.length === 3)
      ) {
        if (formObj.coverType === YSH_COVERIMG_NUM.none) {
          formObj.coverImgs = []
        }

        // 判断是否输入全为空格  解决搜狗浏览器兼容问题
        const isAllEmpty = formObj.contentHtml
          .replace(/<[^<>]+>/g, '')
          .replace(/&nbsp;/gi, '')
          .split('')
          .every(item => item === ' ')
        if (isAllEmpty) return $message.error('不能提交全为空格的内容！')

        saveLoading.value = true
        const {
          data: { id }
        } = await save(formObj)
        saveLoading.value = false
        closeTab()

        // 编辑状态不计入内容发布
        if (!articleId.value) DataCollect.Content.publish({ store, content: { id, title: formObj.title } })
      } else {
        $message.warn('封面图片必须上传')
      }
    }
    const closeTab = () => {
      router.go(-1)
    }
    const fetchData = async () => {
      const params = reactive({
        id: articleId
      })
      const {
        data: { dtl }
      } = await getUpdateDetail(params)
      if (dtl.status === 4) {
        formObj.publishTs = dtl.publishTs
      }
      dtl.coverImgs = dtl.coverImgUrl
      dtl.coverImgUrl = null
      Object.assign(formObj, dtl)
      if (dtl.vid) {
        videoValue.value = [{ vid: dtl.vid, videoCoverURL: dtl.videoCoverURL }]
      }
    }
    onMounted(async () => {
      getArticleSourceType()
      const { query } = router.currentRoute.value
      if (query.articleId) {
        articleId.value = query.articleId
        fetchData()
        window.localStorage.removeItem('editor-article')
      } else {
        getContentColumnType()
        // 如果有缓存则拿取缓存数据
        const LocalFormObj = JSON.parse(window.localStorage.getItem('editor-article'))
        if (LocalFormObj) {
          formObj.value = LocalFormObj
          window.localStorage.removeItem('editor-article')
        }
      }
    })
    const uploadImage = (content, type, index) => {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadCoverImg(formData).then(response => {
        if (type) {
          //  视频封面
          if (type === 'videoCoverURL') formObj.videoCoverURL = response.data.filePath
          // 分享微信好友
          if (type === 'shareFriendPicture') formObj.articleExtendDTO.shareFriendPicture = response.data.filePath
          // 分享海报图
          if (type === 'sharePoster') formObj.articleExtendDTO.sharePoster = response.data.filePath
          if (type === 'wechatCover') formObj.wechatCover = response.data.filePath
          if (type === 'coverImgs') {
            formObj.coverImgs.splice(index, 1, response.data.filePath)
          }
        } else formObj.coverImgs.splice(0, 1, response.data.filePath)
      })
    }
    return {
      contentColumnOptions,
      articleSourceOptions,
      formObj,
      formRef,
      videoValue,
      rules,
      articleId,
      previewVisible,
      articleVisible,
      saveLoading,
      YSH_COVERIMG_NUM,
      resetCoverImgs,
      getContentColumnType,
      uploadVideoSucceed,
      ToSave,
      closeTab,
      fetchData,
      showPreview,
      importArticle,
      uploadImage
    }
  }
})
