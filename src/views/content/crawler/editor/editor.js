import { getDetail, save } from '@/api/content/crawler'
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
        webContent: ''
      },
      articleId: '',
      rules: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
          { min: 5, max: 60, message: '限输入5-60个字的标题', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    if (this.$route.params.articleId) {
      this.articleId = this.$route.params.articleId
      this.init()
    } else {
      this.$refs.ckeditor1.initHtml(this.formObj.contentHtml === null ? '' : this.formObj.contentHtml)
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    closeTab () {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem('crawlermanager')
      let tagsViews = this.$store.state.tagsView.visitedViews
      let selectView = null
      for (let view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({ path: openPath })
          })
          break
        }
      }
    },
    init () {
      this.fetchData()
    },
    fetchData () {
      return new Promise((resolve, reject) => {
        let params = {
          id: this.articleId
        }
        getDetail(params).then(response => {
          this.formObj = response.data.dtl
          const htmlObj = this.formObj.webContent
          this.$refs.ckeditor1.initHtml(htmlObj === null ? '' : htmlObj)
        }).catch(error => {
          reject(error)
        })
      })
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
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
    getHtml (htmlStr) {
      this.formObj.webContent = htmlStr
    }
  }
}
