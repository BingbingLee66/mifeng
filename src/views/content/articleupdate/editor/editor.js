import {getUpdateDetail, uploadCoverImg, save} from '@/api/content/article'
import {getContentColumnOptionsWithCkey} from '@/api/content/columnsetup'
import Ckeditor from '@/components/CKEditor'
import PreviewPh from '@/components/ArticlePreview'

export default {
  components: {
    Ckeditor,
    PreviewPh
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
        istop: false
      },
      articleId: '',
      coverImgs: ['', '', ''],
      uploadIndex: 0,
      activeName: '5',
      rules: {
        title: [
          {required: true, message: '文章标题不能为空', trigger: 'blur'},
          {min: 5, max: 60, message: '限输入5-60个字的标题', trigger: 'blur'}
        ],
        contentColumnId: [
          {required: true, message: '对应栏目不能为空', trigger: 'blur'}
        ],
        coverImg1: [
          {required: true, message: '封面图片必须上传', trigger: 'blur'}
        ],
        coverImg2: [
          {required: true, message: '封面图片必须上传', trigger: 'blur'}
        ],
        coverImg3: [
          {required: true, message: '封面图片必须上传', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.getContentColumnType()
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName
    }
    if (this.$route.params.articleId) {
      // console.log(this.$route.params.articleId)
      this.articleId = this.$route.params.articleId
      this.init()
    } else {
      this.$refs.ckeditor1.initHtml(this.formObj.contentHtml === null ? '' : this.formObj.contentHtml)
    }
  },
  computed: {},
  created() {
  },
  methods: {
    closeTab() {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem('articleupdate')
      let tagsViews = this.$store.state.tagsView.visitedViews
      let selectView = null
      for (let view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({path: openPath})
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
    upload(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      uploadCoverImg(formData).then(response => {
        this.formObj.coverImgs.splice(this.uploadIndex, 1, response.data.filePath)
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
      let params = {
        ckey: this.$store.getters.ckey,
        contentModuleId: contentModuleId
      }
      getContentColumnOptionsWithCkey(params).then(response => {
        this.contentColumnOptions = response.data.data
      })
    },
    fetchData() {
      return new Promise((resolve, reject) => {
        let params = {
          id: this.articleId
        }
        getUpdateDetail(params).then(response => {
          const dataObj = response.data.dtl
          const htmlObj = dataObj.contentHtml
          this.formObj = {
            'id': dataObj.id,
            'title': dataObj.title,
            'contentColumnId': dataObj.contentColumnId,
            'contentHtml': dataObj.contentHtml,
            'coverType': dataObj.coverType,
            // 'publishType': dataObj.publishType,
            'coverImgs': dataObj.coverImgUrl,
            'status': dataObj.status,
            'istop': dataObj.istop
          }
          this.$refs.ckeditor1.initHtml(htmlObj === null ? '' : htmlObj)
        }).catch(error => {
          reject(error)
        })
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.formObj.coverType === 0) {
            this.formObj.coverImgs = []
          }
          this.formObj['istop'] = false // 商会发布文章不开放置顶
          this.formObj['ckey'] = this.$store.getters.ckey
          this.formObj['contentModuleId'] = this.activeName
          save(this.formObj).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.closeTab()
          })
        } else {
          return false
        }
      })
    },
    getHtml(htmlStr) {
      /* htmlStr = htmlStr.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
        capture = capture.replace(/\s*!/g, '')
        return `<img src= "${capture}" alt=""/>`
      })
      console.log('htmlStr', htmlStr) */
      this.formObj.contentHtml = htmlStr
    }
  }
}
