import { getUpdateDetail, uploadCoverImg, save, getWechatContent, queryVideo } from '@/api/content/article'
import { officialAccountUrl, officialAccountAuthStatus, officialAccountArticleList } from '@/api/content/officialAccount'
import { getContentColumnOptionsWithCkey } from '@/api/content/columnsetup'
import Ckeditor from '@/components/CKEditor'
import UEditor from '@/components/UEditor'
import PreviewPh from '@/components/ArticlePreview'
import addColumn from '../editor/component/addColumn'
import editorElem from '@/components/wangEditor/index'
import preview from '../editor/component/preview'
import selectArticle from './component/select-article'
import kdDialog from '@/components/common/kdDialog'
import videoComponent from '@/components/video/index'
import videoUpLoad from '@/components/video/upLoad'
export default {
  components: {
    Ckeditor,
    PreviewPh,
    addColumn,
    UEditor,
    editorElem,
    preview,
    kdDialog, videoComponent,
    videoUpLoad,
    selectArticle
  },
  data() {
    return {
      contentColumnOptions: [],
      formObj: {
        title: '',
        contentColumnId: '',
        contentHtml: '',
        coverType: 0,
        // publishType: 0,
        coverImgs: [],
        status: 1,
        istop: false,
        articleExtendDTO: {
          id: null,
          shareTitle: '', // 分享标题
          shareFriendPicture: '', // 分享微信好友圈图片
          sharePoster: '', // 分享海报图片
        },
        vid: '', // 上传视频Id
        videoCoverURL: '', // 视频封面

        type: 1, // 1：云商会  2:公众号

        wechatCover: '', // 公众号封面
        wechatAbstract: '', // 内容摘要
        articleLink: '', // 原文链接
        publishSet: 1, // 1.立即发布  2.暂不发布

        wechatArticles: [] // 文章数组
      },
      articleId: '',
      coverImgs: ['', '', ''],
      uploadIndex: 0,
      activeName: '5',
      loading: false,
      btnLoading: false, // 点击发送加载
      // 当前预览的图片
      currentImg: '',
      // 轮询定时器
      timer: null,
      rules: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
          { min: 5, max: 60, message: '限输入5-60个字的标题', trigger: 'change' }
        ],
        contentColumnId: [{ required: true, message: '对应栏目不能为空', trigger: 'change' }],
        coverImg1: [{ required: true, message: '封面图片必须上传', trigger: 'blur' }],
        coverImg2: [{ required: true, message: '封面图片必须上传', trigger: 'blur' }],
        coverImg3: [{ required: true, message: '封面图片必须上传', trigger: 'blur' }]
      },
      articleUrl: '',
      committee: false,
      imgUrl: 'https://ysh-cdn.kaidicloud.com/prod/png/defauil_Accounts.png',
      link: '', // 外部公众号跳转链接
      isImpower: false, // 查询商会是否授权公众号
    }
  },
  mounted() {
    this.getContentColumnType()
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    if (this.$route.query.committee) {
      this.committee = true
    }

    if (this.$route.query.articleId) {
      this.articleId = this.$route.query.articleId
      this.init()
      window.localStorage.removeItem('editor-article')
    } else {
      this.formObj.wechatArticles.push({
        title: '',
        id: 0,
        img: ''
      })
      // 如果有缓存则拿取缓存数据
      const formObj = JSON.parse(window.localStorage.getItem('editor-article'))
      if (formObj) {
        this.formObj = formObj
        window.localStorage.removeItem('editor-article')
      }
    }
  },
  computed: {},
  created() {
    const { roleName } = this.$store.getters.profile
    if (roleName === '专业委员会') this.committee = true
    this.externalLinks()
    // 查询商会是否授权公众号
    this.onImpower()
  },
  watch: {
    // 文章标题
    'formObj.title': {
      handler(newValue) {
        if (newValue) {
          this.formObj.wechatArticles.forEach(v => {
            if (v.id === 0) v.title = newValue
          })
        }
      },
    },
    // 公众号文章封面
    'formObj.wechatCover': {
      handler(newValue) {
        if (newValue) {
          this.formObj.wechatArticles.forEach(v => {
            if (v.id === 0) v.img = newValue
          })
        }
      },
    },
  },
  methods: {
    addColumnFunc() {
      let contentModuleId = 3
      if (this.activeName === '5') {
        contentModuleId = 3
      } else if (this.activeName === '6') {
        contentModuleId = 4
      }
      this.$refs['addColumnRef'].open(contentModuleId).then(() => {
        this.getContentColumnType()
      })
    },
    closeTab() {
      // 退出当前tab, 打开指定tab
      const openPath = window.localStorage.getItem('articleupdate')
      const tagsViews = this.$store.state.tagsView.visitedViews
      // let selectView = null
      for (const view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({ path: openPath })
          })
          break
        }
      }
    },
    init() {
      this.fetchData()
    },
    beforeAvatarUpload(file, index) {
      this.uploadIndex = index
      if (file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
    },
    upload(content, type) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadCoverImg(formData).then(response => {
        if (type) {
          //  视频封面
          if (type === 'videoCoverURL') this.formObj.videoCoverURL = response.data.filePath
          // 分享微信好友
          if (type === 'shareFriendPicture') this.formObj.articleExtendDTO.shareFriendPicture = response.data.filePath
          // 分享海报图
          if (type === 'sharePoster') this.formObj.articleExtendDTO.sharePoster = response.data.filePath
          // 公众号封面
          if (type === 'wechatCover') this.formObj.wechatCover = response.data.filePath
        } else {
          this.formObj.coverImgs.splice(this.uploadIndex, 1, response.data.filePath)
        }
      })
    },
    resetCoverImgs(type) {
      if (type === 1) {
        this.formObj.coverImgs = ['']
      } else if (type === 2) {
        this.formObj.coverImgs = ['', '', '']
      }
    },
    getContentColumnType() {
      let contentModuleId = 3
      if (this.activeName === '5') {
        contentModuleId = 3
      } else if (this.activeName === '6') {
        contentModuleId = 4
      }
      const params = {
        ckey: this.$store.getters.ckey,
        contentModuleId,
        isSpecialCommittee: this.committee === true ? 1 : ''
      }
      getContentColumnOptionsWithCkey(params).then(response => {
        this.contentColumnOptions = response.data.data
      })
    },
    fetchData() {
      return new Promise((resolve, reject) => {
        const params = {
          id: this.articleId
        }
        getUpdateDetail(params).then(response => {
          const dataObj = response.data.dtl
          let wechatArticles = []
          let wechatAbstract = '' // 内容摘要
          let wechatCover = '' // 公众号封面
          let articleLink = '' // 原文链接
          let publishSet = 1 // 1.立即发布  2.暂不发布
          if (response.data.wechatArticles.length) {
            wechatArticles = response.data.wechatArticles.map(v => {
              if (v.title === dataObj.title) {
                wechatCover = v.cover || ''
                wechatAbstract = v.digest || ''
                articleLink = v.originalArticleUrl || ''
                publishSet = v.releaseStatus === 4 ? 2 : 1
                return {
                  img: v.cover,
                  title: v.title,
                  id: 0, // 作为自己创建的标识
                  ids: v.articleId
                }
              } else {
                return {
                  img: v.cover,
                  title: v.title,
                  id: v.articleId,
                  ids: v.articleId
                }
              }
            })
          } else {
            wechatArticles.push({
              title: dataObj.title,
              id: 0,
              img: dataObj.wechatCover || ''
            })
          }
          // const htmlObj = dataObj.contentHtml

          this.formObj = {
            type: 1,
            id: dataObj.id, // 文章id
            title: dataObj.title,
            contentColumnId: dataObj.contentColumnId,
            contentHtml: dataObj.contentHtml,
            coverType: dataObj.coverType,
            // 'publishType': dataObj.publishType,
            publishTs: dataObj.publishTs,
            coverImgs: dataObj.coverImgUrl,
            status: dataObj.status,
            istop: dataObj.istop,
            vid: dataObj.vid,
            videoCoverURL: dataObj.videoCoverURL,
            articleExtendDTO: {
              id: dataObj.articleExtendDTO ? dataObj.articleExtendDTO.id : null,
              shareFriendPicture: dataObj.articleExtendDTO ? dataObj.articleExtendDTO.shareFriendPicture : '',
              sharePoster: dataObj.articleExtendDTO ? dataObj.articleExtendDTO.sharePoster : '',
              shareTitle: dataObj.articleExtendDTO ? dataObj.articleExtendDTO.shareTitle : '',
            },
            wechatArticles,
            wechatAbstract,
            wechatCover,
            articleLink,
            publishSet
          }

          if (dataObj.vid) {
            this.$nextTick(() => {
              this.$refs['videoRef'].show(dataObj.vid)
            })
          }
          // this.$refs.ueditor.setContent(htmlObj === null ? '' : htmlObj)
          // this.$refs.ckeditor1.init()
          // setTimeout(() => {
          //   this.$refs.ckeditor1.initHtml(htmlObj === null ? '' : htmlObj)
          // }, 500)
        }).catch(error => {
          reject(error)
        })
      })
    },
    addParentHtml(html) {
      this.formObj.contentHtml = html
    },
    // 发送
    save() {
      // 如果 编辑的情况下 有视频 但是没视频封面 提示
      if (this.articleId && this.formObj.vid && !this.formObj.videoCoverURL) return this.$message.error('请上传视频封面')
      // 如果上传了视频封面没上传视频 提示
      if (this.formObj.videoCoverURL && !this.formObj.vid) return this.$message.error('请上传视频')

      // return;
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.isImpower && !this.formObj.wechatCover) return this.$message.error('请上传公众号文章封面图')
          this.btnLoading = true
          if (!this.isImpower) {
            this.emsCnpl()
          } else {
            // 公众号以授权直接调接口
            this.submit()
          }
          //
        } else {
          return false
        }
      })
    },

    // 接口参数提交
    submit() {
      // 判断是否输入全为空格
      const isAllEmpty = this.formObj.contentHtml.slice(3, this.formObj.contentHtml.length - 4).replaceAll('&nbsp;', '').split('').every(item => item === ' ')
      if (isAllEmpty) return this.$message.error('不能提交全为空格的内容！')

      if (this.formObj.coverType === 0) {
        this.formObj.coverImgs = []
      }
      // this.formObj['contentHtml'] = this.$refs.ueditor.content
      this.formObj['istop'] = false // 商会发布文章不开放置顶
      this.formObj['ckey'] = this.$store.getters.ckey
      this.formObj['contentModuleId'] = this.activeName
      // 判断是否为商委会的
      this.formObj['articleType'] = this.committee === true ? 1 : 0

      // 如果授权了公众号  并且选中了文章
      if (this.formObj.wechatArticles.length) {
        // 编辑的时候传ids   新增的时候传id
        if (this.articleId) this.formObj['articleIds'] = this.formObj.wechatArticles.map(v => v.ids)
        else this.formObj['articleIds'] = this.formObj.wechatArticles.map(v => v.id)
      } else this.formObj['articleIds'] = []

      // 如果未授权状态
      if (!this.isImpower) this.formObj.publishSet = 0

      save(this.formObj).then(response => {
        if (response.state === 1) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          // 退出当前tab, 打开指定tab
          const tagsViews = this.$store.state.tagsView.visitedViews
          // let selectView = null
          for (const view of tagsViews) {
            if (view.path === this.$route.path) {
              this.$store.dispatch('tagsView/delView', view).then(() => {
                this.$router.push({
                  name: '公众号',
                  query: {
                    articleId: response.data.id
                  }
                })
              })
              break
            }
          }
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          })
        }
        this.btnLoading = false
      })
    },
    // 没公众号授权弹起
    emsCnpl() {
      this.$confirm('您未授权公众号，本次将只发布到云商会', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '去授权',
        cancelButtonText: '只发布到云商会',
      }).then(() => {
        this.goHref()
      }).catch(action => {
        if (action === 'cancel') this.submit()
        this.btnLoading = false
      })
    },
    // 跳转公众号授权
    goHref() {
      window.localStorage.setItem('editor-article', JSON.stringify(this.formObj))
      window.location.href = this.link
      this.btnLoading = false
    },

    getHtml(htmlStr) {
      /* htmlStr = htmlStr.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
        capture = capture.replace(/\s*!/g, '')
        return `<img src= "${capture}" alt=""/>`
      })
      console.log('htmlStr', htmlStr) */
      this.formObj.contentHtml = htmlStr
    },
    showPreview() {
      this.$refs['preview'].open(this.formObj.id, this.formObj.title, this.formObj.contentHtml, this.formObj.vid, this.formObj.videoCoverURL)
    },
    // 导入微信文章按钮行为
    importArticle() {
      this.$refs['kdDialog'].show()
    },
    // 点击保存导入微信文章行为
    savePopupData() {
      this.getWechatContentFunc()
    },
    // 抓取微信文章
    getWechatContentFunc() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255,.5)'
      })
      getWechatContent(this.articleUrl).then(res => {
        if (res.state === 1) {
          setTimeout(() => {
            this.formObj.contentHtml = res.data.text
            this.articleUrl = null
          }, 500)
          this.$refs['kdDialog'].hide()
        } else {
          this.$message.error(res.msg)
          // 请输入微信公众号文章链接
        }
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loading.close()
        })
      })
    },
    // 判断是否上传视频
    beforeAvatarUploadVideo(file) {
      if (file.type.indexOf('video/') !== -1) { // 视频
        if (file.type !== 'video/mp4') {
          this.$message.error('上传视频只能是 MP4 格式!')
          return false
        }
        // if (file.size > 1024 * 1024 * 30) {
        //   this.$message.error('上传视频大小不能超过 30MB!')
        //   return false
        // }
      } else {
        this.$message.error('不支持的文件格式!')
        return false
      }
    },
    // 上传视频
    uploadVideoFunc(content) {
      // 前端上传视频阿里云组件
      this.loading = true
      this.$refs.VideoUpLoad.setUploadInfo(content.file)

      // 旧版 通过后端接口上传视频
      // let formData = new FormData()
      // formData.append('file', content.file)
      // formData.append('type', 1)
      // // this.articleId === '' ? 0 : this.articleId
      // uploadVideo(formData, 0).then(res => {
      //   if (res.code === 200) {
      //     this.formObj.vid = res.data.videoId
      //     this.timer = setInterval(this.queryVideoFunc, 1000)
      //   }
      // })
    },
    // 上传成功 回调
    onSucceed(vid) {
      this.formObj.vid = vid
      // 上传成功轮询接口 查看是否转码成功
      this.timer = setInterval(this.queryVideoFunc, 1000)
    },
    // 删除当前视频
    deleteCurrentVideo() {
      this.formObj.vid = ''
    },
    // 查视频动态
    queryVideoFunc() {
      queryVideo(this.formObj.vid).then(res => {
        if (res.state === 1) {
          clearInterval(this.timer)
          this.$nextTick(() => {
            this.$refs['videoRef'].show(this.formObj.vid)
            this.loading = false
          })
        }
      })
    },
    // 删除当前上传图片
    deleteCurrentImg(folder) {
      if (folder === 'shareFriendPicture') this.formObj.articleExtendDTO.shareFriendPicture = ''
      if (folder === 'sharePoster') this.formObj.articleExtendDTO.sharePoster = ''
      if (folder === 'videoCoverURL') this.formObj.videoCoverURL = ''
    },
    // 预览
    openPreviewModal(val) {
      this.$refs['look-kdDialog'].show()
      this.currentImg = val
    },
    // 点击选择文章
    onSelectArticle() {
      this.$refs['selectArticle'].open(this.formObj.wechatArticles)
    },
    // 选择文章确定
    onConfirm(e) {
      this.formObj.wechatArticles = JSON.parse(JSON.stringify(e))
    },
    // 删除
    del(index) {
      this.formObj.wechatArticles.splice(index, 1)
    },
    // 上移
    up(index) {
      if (index === 0) {
        return
      } else {
        const data = this.formObj.wechatArticles[index]
        this.formObj.wechatArticles[index] = this.formObj.wechatArticles[index - 1]
        this.formObj.wechatArticles[index - 1] = data
        this.$forceUpdate()
      }
    },
    // 下移
    down(index) {
      if (index === this.formObj.wechatArticles.length - 1) {
        return
      } else {
        const data = this.formObj.wechatArticles[index]
        this.formObj.wechatArticles[index] = this.formObj.wechatArticles[index + 1]
        this.formObj.wechatArticles[index + 1] = data
        this.$forceUpdate()
      }
    },
    // 拿取最新的文章
    async onNewest(pageSize) {
      const parmas = {
        pageSize,
        page: 1,
        title: ''
      }
      const res = await officialAccountArticleList(parmas)
      if (res.data.list.length === 0) {
        return this.$message('没有符合条件的文章')
      } else {
        const Array = []
        Array.push({
          title: this.formObj.title,
          id: 0,
          img: this.formObj.wechatCover
        })
        this.formObj.wechatArticles = Array.concat(res.data.list)
      }
    },
    // 公众号外部链接
    async externalLinks() {
      const parmas = {
        deviceType: 0, // 设备类型：0-PC, 1-H5
        platformType: 0, // 平台类型： 0-微信公众号
      }

      const res = await officialAccountUrl(parmas)
      this.link = res.data
    },

    // 查询商会是否授权公众号
    async onImpower() {
      const res = await officialAccountAuthStatus()
      if (res.state === 1) {
        this.isImpower = res.data || false
      }
    }
  }
}
