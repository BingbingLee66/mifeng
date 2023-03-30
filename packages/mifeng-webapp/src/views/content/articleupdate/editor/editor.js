import { defineComponent, ref, onMounted, reactive, inject, getCurrentInstance, watch } from 'vue'
import {
  officialAccountUrl,
  officialAccountAuthStatus,
  officialAccountArticleList,
  getArticleQRCode
} from '@/api/content/officialAccount'
import { queryRelatedEntryList, queryMemberEntryEnable } from '@/api/bossin/index'
import { getUpdateDetail, save, uploadCoverImg, updateWeChatCover } from '@/api/content/article'
import { getContentColumnOptionsWithCkey } from '@/api/content/columnsetup'
import WangEditor from '@/components/WangEditor'
import ImageUpLoad from '@/components/upload/image-uploader'
import CropperUpLoad from '@/components/upload/cropper-uploader'
import VideoUpLoad from '@/components/upload/video-uploader'
import AddColumn from '../../component/addColumn.vue'
import Preview from '../../component/preview'
import ArtLink from '../../component/artLink'
import EntryModel from '../../component/entryModel.vue'
import RelatedRecommend from '../../component/relatedRecommend.vue'
import SelectArticle from '../../component/select-article'
// import cropperDialog from './components/cropperDialog.vue'
import cropperDialog from './components/cropperDialog.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FormItemRest } from 'ant-design-vue/es/form'
import AliyunVideoPlayer from '@/components/aliyunVideoPlayer'
import { Modal, message } from 'ant-design-vue'
import { YSH_COVERIMG_NUM } from '../../../../constant/content'
import { DataCollect } from '@/utils/data-collect'
export default defineComponent({
  name: 'Articleupdate',
  components: {
    FormItemRest,
    WangEditor,
    ImageUpLoad,
    VideoUpLoad,
    AliyunVideoPlayer,
    AddColumn,
    ArtLink,
    Preview,
    EntryModel,
    RelatedRecommend,
    SelectArticle,
    CropperUpLoad,
    cropperDialog
  },
  setup() {
    const ckey = inject('ckey')
    const router = useRouter()
    const store = useStore()
    const { $message } = getCurrentInstance().appContext.config.globalProperties
    const { roles } = store.state.user
    const contentColumnOptions = ref([])
    const formRef = ref(null)
    const saveLoading = ref(false)
    const imgUrl = 'https://ysh-cdn.kaidicloud.com/prod/png/defauil_Accounts.png'
    const formObj = reactive({
      ckey: ckey.value,
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
      videoCoverURL: '', // 视频封面

      type: 2, // 1：云商会  2:公众号

      wechatCover: '', // 公众号封面
      wechatAbstract: '', // 内容摘要
      articleLink: '', // 原文链接
      publishSet: 1, // 1.立即发布  2.暂不发布
      pushOfficialAccount: 1, // 是否发布到微信公众号
      wechatArticles: [], // 文章数组

      encyclopediaIds: [] // bossin推荐
    })
    const videoValue = ref([])
    const rules = reactive({
      title: [
        {
          required: true,
          message: '文章标题不能为空',
          trigger: 'blur'
        },
        {
          min: 5,
          max: 60,
          message: '限输入5-60个字的标题',
          trigger: 'blur'
        }
      ],
      contentColumnId: [
        {
          required: true,
          message: '对应栏目不能为空',
          trigger: 'blur'
        }
      ]
    })

    const committee = ref(false) // 是否是委员会
    const articleId = ref(null)
    const activeName = ref('5')
    const link = ref(null) // 外部公众号跳转链接
    const isImpower = ref(false) // 查询商会是否授权公众
    const entryList = ref([])
    const entryInfo = reactive({})
    // 文章分享二维码
    const qrCodeUrl = ref(null)
    const hasEntry = ref(false)

    const addColumnVisible = ref(false)
    const previewVisible = ref(false)
    const articleVisible = ref(false)
    const entryVisible = ref(false)
    const qrCodeVisible = ref(false)
    const cropperDialogRef = ref()
    const addColumnFunc = () => {
      addColumnVisible.value = true
    }
    const showPreview = () => {
      previewVisible.value = true
    }
    const importArticle = () => {
      articleVisible.value = true
    }
    const removeHandler = index => {
      entryList.value.splice(index, 1)
    }
    const addEntry = () => {
      entryInfo.ckey = ckey.value
      entryInfo.selectionData = entryList.value
      entryVisible.value = true
    }
    const sureHandler = originData => {
      entryList.value = originData
      entryVisible.value = false
    }
    // 是否是当前本地未提交的文章
    const current = ref(false)
    const getContentColumnType = async () => {
      const contentModuleId = ref(3)
      if (activeName.value === '6') {
        contentModuleId.value = 4
      }
      const params = reactive({
        ckey,
        contentModuleId,
        isSpecialCommittee: committee.value === true ? 1 : ''
      })
      const {
        data: { data }
      } = await getContentColumnOptionsWithCkey(params)
      contentColumnOptions.value = data
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
        if (formObj.type === 2 && isImpower.value && formObj.pushOfficialAccount === 1 && !formObj.wechatCover)
          return $message.error('请上传公众号文章封面图')

        if (!isImpower.value) {
          formObj.pushOfficialAccount = 0
        }
        if (!isImpower.value && !committee.value) {
          // 非专委会，公众号未授权
          emsCnpl()
        } else {
          // 公众号以授权直接调接口
          submit()
        }
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
        formObj.contentModuleId = activeName.value
        // 判断是否为商委会的
        formObj.articleType = committee.value ? 1 : 0

        // 判断是否输入全为空格  解决搜狗浏览器兼容问题
        const isAllEmpty = formObj.contentHtml
          .replace(/<[^<>]+>/g, '')
          .replace(/&nbsp;/gi, '')
          .split('')
          .every(item => item === ' ')
        if (isAllEmpty) return $message.error('不能提交全为空格的内容！')
        const arr = []
        formObj.contentHtml.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
          arr.push(capture)
        })
        formObj.textImages = arr
        // const isAllEmpty = formObj.contentHtml
        //   .slice(3, formObj.contentHtml.length - 4)
        //   .replaceAll('&nbsp;', '')
        //   .split('')
        //   .every(item => item === ' ')
        // if (isAllEmpty) return $message.error('不能提交全为空格的内容！')

        // bossIn推荐
        formObj.encyclopediaIds = entryList.value.map(item => item.encyclopediaId)

        // 如果授权了公众号  并且选中了文章
        if (formObj.wechatArticles.length) {
          // 编辑的时候传ids   新增的时候传id
          if (articleId.value) formObj.articleIds = formObj.wechatArticles.map(v => v.ids)
          else formObj.articleIds = formObj.wechatArticles.map(v => v.id)
        } else formObj.articleIds = []

        // 如果未授权状态
        if (!isImpower.value) formObj.publishSet = 0
        saveLoading.value = true
        setTimeout(() => {
          saveLoading.value = false
        }, 2000)
        const {
          data: { id }
        } = await save(formObj)
        saveLoading.value = false

        // 编辑状态不计入内容发布
        if (!articleId.value)
          DataCollect.Content.publish({
            store,
            content: {
              id,
              title: formObj.title
            }
          })

        if (committee.value) {
          closeTab() // 专委会回退
          return
        }
        if (!isImpower.value || parseInt(formObj.publishSet) === 2) {
          getShareCode(id)
          return
        }
        router.push({
          name: '公众号',
          query: {
            articleId: id
          }
        })
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
        data: { dtl, wechatArticles }
      } = await getUpdateDetail(params)
      if (wechatArticles.length) {
        formObj.wechatArticles = wechatArticles.map(item => {
          if (item.title === dtl.title) {
            formObj.wechatCover = item.cover || ''
            formObj.wechatAbstract = item.digest || ''
            formObj.articleLink = item.originalArticleUrl || ''
            formObj.publishSet = item.releaseStatus === 4 ? 2 : 1
            return {
              img: item.cover,
              title: item.title,
              id: 0, // 作为自己创建的标识
              ids: item.articleId
            }
          } else {
            return {
              img: item.cover,
              title: item.title,
              id: item.articleId,
              ids: item.articleId
            }
          }
        })
      } else {
        wechatArticles.push({
          title: dtl.title,
          id: 0,
          img: dtl.wechatCover || '',
          ids: 0
        })
      }
      if (dtl.status === 4) {
        formObj.publishTs = dtl.publishTs
      }
      formObj.id = dtl.id
      formObj.title = dtl.title
      formObj.contentColumnId = dtl.contentColumnId
      formObj.contentHtml = dtl.contentHtml
      formObj.coverType = dtl.coverType
      formObj.publishTs = dtl.publishTs
      formObj.coverImgs = dtl.coverImgUrl
      formObj.status = dtl.status
      formObj.istop = dtl.istop
      formObj.vid = dtl.vid
      formObj.videoCoverURL = dtl.videoCoverURL
      formObj.articleExtendDTO.shareFriendPicture = dtl.articleExtendDTO
        ? dtl.articleExtendDTO.shareFriendPicture
        : null
      formObj.articleExtendDTO.sharePoster = dtl.articleExtendDTO ? dtl.articleExtendDTO.sharePoster : null
      formObj.articleExtendDTO.id = dtl.articleExtendDTO ? dtl.articleExtendDTO.id : null
      formObj.articleExtendDTO.shareTitle = dtl.articleExtendDTO ? dtl.articleExtendDTO.shareTitle : null
      formObj.pushOfficialAccount = dtl.pushOfficialAccount
      if (dtl.vid) {
        videoValue.value = [
          {
            vid: dtl.vid,
            videoCoverURL: dtl.videoCoverURL
          }
        ]
      }
      if (dtl.contentType) {
        queryEntryList(dtl.contentType)
      }
    }

    // 没公众号授权弹起
    const emsCnpl = () => {
      Modal.confirm({
        title: '提示',
        content: '您未授权公众号，本次将只发布到云商会',
        okText: '去授权',
        cancelText: '只发布到云商会',
        onOk() {
          goHref()
        },
        onCancel() {
          submit()
        }
      })
    }
    // 手动添加mate标签
    const addMeta = (name, content) => {
      const meta = document.createElement('meta')
      meta.content = content
      meta.name = name
      document.getElementsByTagName('head')[0].appendChild(meta)
    }
    // 跳转公众号授权
    const goHref = () => {
      addMeta('referrer', 'origin-when-cross-origin')
      window.localStorage.setItem('editor-article', JSON.stringify(formObj))
      window.location.href = link.value
    }
    // 拿取最新的文章
    const onNewest = async pageSize => {
      const parmas = reactive({
        pageSize,
        page: 1,
        title: '',
        articleId: articleId.value
      })
      const {
        data: { list }
      } = await officialAccountArticleList(parmas)
      if (list.length === 0) {
        return this.$message('没有符合条件的文章')
      } else {
        const Array = []
        list.forEach(v => {
          v.ids = v.id
        })
        if (articleId.value) {
          formObj.wechatArticles.forEach(v => {
            if (v.title === formObj.title) {
              Array.push({
                title: v.title,
                id: 0, // 作为自己创建的标识
                img: v.img,
                ids: v.ids
              })
            }
          })
        } else {
          Array.push({
            title: formObj.title,
            id: 0,
            img: formObj.wechatCover
          })
        }

        formObj.wechatArticles = Array.concat(list)
      }
    }
    // 修改文章最新封面
    const updateCover = img => {
      // 判断是否是当前本地未发布的文章
      if (current.value) {
        formObj.wechatCover = img
      } else {
        // 通过id去修改文章最新的封面
        const index = formObj.wechatArticles.findIndex(i => i.id === currentArticleId.value)
        if (index < 0) return
        formObj.wechatArticles[index].img = img
      }
    }
    // 点击选择文章
    const selectArticle = ref(null)
    const onSelectArticle = () => {
      selectArticle.value.open(formObj.wechatArticles)
    }
    // 选择文章确定
    const onConfirm = e => {
      formObj.wechatArticles = e
    }
    // 删除
    const del = index => {
      formObj.wechatArticles.splice(index, 1)
    }
    // 上移
    const up = index => {
      if (index !== 0) {
        const data = formObj.wechatArticles[index]
        formObj.wechatArticles[index] = formObj.wechatArticles[index - 1]
        formObj.wechatArticles[index - 1] = data
      }
    }
    // 下移
    const down = index => {
      if (index !== 0) {
        const data = formObj.wechatArticles[index]
        formObj.wechatArticles[index] = formObj.wechatArticles[index + 1]
        formObj.wechatArticles[index + 1] = data
      }
    }
    // 公众号外部链接
    const externalLinks = async () => {
      const parmas = {
        deviceType: 0, // 设备类型：0-PC, 1-H5
        platformType: 0 // 平台类型： 0-微信公众号
      }
      const { data } = await officialAccountUrl(parmas)
      link.value = data
    }

    // 查询商会是否授权公众号
    const onImpower = async () => {
      const { data } = await officialAccountAuthStatus()
      isImpower.value = data
    }

    // 获取bossIn列表
    const queryEntryList = async contentType => {
      const params = {
        contentId: articleId.value,
        contentType,
        page: 1,
        limit: 100
      }
      const { data } = await queryRelatedEntryList(params)
      entryList.value = data.records.map(item => {
        return {
          ...item,
          check: true
        }
      })
    }
    // 获取相关推荐显示或隐藏
    const getEntryEnable = async () => {
      const { data } = await queryMemberEntryEnable()
      hasEntry.value = data
    }
    // 获取分享码
    const getShareCode = async articleId => {
      const params = {
        ckey: ckey.value,
        articleId
      }
      const { data } = await getArticleQRCode(params)
      qrCodeUrl.value = data.qrCodeUrl
      qrCodeVisible.value = true
    }
    // 关闭分享弹框
    const handleClose = () => {
      qrCodeVisible.value = false
      router.push({
        name: '文章管理'
      })
    }
    onMounted(async () => {
      if (router.currentRoute.value.query.activeName) {
        activeName.value = router.currentRoute.value.query.activeName
      }
      if (router.currentRoute.value.query.committee || roles.value === '专业委员会') {
        committee.value = true
      }
      if (router.currentRoute.value.query.articleId) {
        articleId.value = router.currentRoute.value.query.articleId
        fetchData()
        window.localStorage.removeItem('editor-article')
      } else {
        formObj.wechatArticles.push({
          title: '',
          id: 0,
          img: ''
        })
        // 如果有缓存则拿取缓存数据
        const LocalFormObj = JSON.parse(window.localStorage.getItem('editor-article'))
        if (LocalFormObj) {
          formObj.value = LocalFormObj
          window.localStorage.removeItem('editor-article')
        }
      }
      externalLinks()
      // 查询商会是否授权公众号
      onImpower()
      getContentColumnType()
      getEntryEnable()
    })
    watch(
      () => [formObj.title, formObj.wechatCover],
      ([newTitle, newWeChatCover]) => {
        if (newTitle) {
          formObj.wechatArticles.forEach(v => {
            if (v.id === 0) v.title = newTitle
          })
        }
        if (newWeChatCover) {
          formObj.wechatArticles.forEach(v => {
            if (v.id === 0) v.img = newWeChatCover
          })
        }
      }
    )
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

          // 更换已发布文章封面
          if (type === 'updatePublishCover') {
            formObj.wechatArticles[index].img = response.data.filePath
            updateWeChat(formObj.wechatArticles[index].id, response.data.filePath)
          }
        } else formObj.coverImgs.splice(0, 1, response.data.filePath)
      })
    }
    // 更新文章封面
    const updateWeChat = async (currentArticleId = null, filePath) => {
      const params = {
        articleId: currentArticleId,
        filePath
      }
      await updateWeChatCover(params)
    }

    const goToCarousel = () => {
      router.push({
        path: '/content/carousel-update'
      })
    }

    const leftHandler = index => {
      const [current] = entryList.value.splice(index, 1)
      entryList.value.splice(index - 1, 0, current)
    }
    const rightHandler = index => {
      const [current] = entryList.value.splice(index, 1)
      entryList.value.splice(index + 1, 0, current)
    }
    const showCropperDialog = ref()
    const currentArticleId = ref()
    // 点击从正文选择图片 type:1 本地正文  type2接口拿取
    const selectImg = (type = 2, articleId) => {
      if (type === 2) {
        showCropperDialog.value = true
        currentArticleId.value = articleId
        current.value = false
      } else if (type === 1) {
        showCropperDialog.value = true
        current.value = true
        // 给子组件传正文内容
      }
      ifReCropperImg.value = false
      cropperDialogRef.value.setStep(0)
    }
    // 是否重新裁剪
    const ifReCropperImg = ref(false)
    // 点击重新裁剪
    const reCropper = (item, flag = false) => {
      // 是否是当前未发布文章
      current.value = flag
      ifReCropperImg.value = true
      showCropperDialog.value = true
      cropperDialogRef.value.reCropperImg(item.img)
      currentArticleId.value = item.id
    }
    /**
     * 文件上传前
     * @param file 上传的文件
     */
    const handleBeforeUpload = file => {
      const pattern = /\.(?:png|jpg|jpeg|gif|bmp)$/i
      // 导入文件类型不合法
      if (!pattern.test(file.name) || !file.size) {
        message.error('请上传jpg、jpeg、png、bmp格式的图片')
        return false
      }
      if (file.size > 1024 * 1024 * 10) {
        message.error('上传图片大小不能超过 10MB!')
        return false
      }
      return true
    }

    return {
      ifReCropperImg,
      reCropper,
      current,
      cropperDialogRef,
      handleBeforeUpload,
      updateCover,
      currentArticleId,
      contentColumnOptions,
      formObj,
      formRef,
      videoValue,
      rules,
      articleId,
      activeName,
      committee,
      addColumnVisible,
      previewVisible,
      articleVisible,
      entryVisible,
      qrCodeVisible,
      qrCodeUrl,
      hasEntry,
      entryList,
      imgUrl,
      link,
      isImpower,
      saveLoading,
      entryInfo,
      YSH_COVERIMG_NUM,
      selectArticle,
      resetCoverImgs,
      getContentColumnType,
      addColumnFunc,
      uploadVideoSucceed,
      onSelectArticle,
      ToSave,
      del,
      up,
      down,
      onNewest,
      emsCnpl,
      closeTab,
      fetchData,
      showPreview,
      externalLinks,
      importArticle,
      onImpower,
      goHref,
      removeHandler,
      addEntry,
      sureHandler,
      onConfirm,
      getShareCode,
      handleClose,
      getEntryEnable,
      uploadImage,
      goToCarousel,
      leftHandler,
      rightHandler,
      selectImg,
      showCropperDialog
      // containersStyle,
      // optionCropper
    }
  }
})
