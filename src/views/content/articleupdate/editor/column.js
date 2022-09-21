import { save } from '@/api/content/article'
import Ckeditor from '@/components/CKEditor'
import PreviewPh from '@/components/ArticlePreview'
import editorElem from '@/components/wangEditor/index'
export default {
  components: {
    Ckeditor,
    PreviewPh,
    editorElem
  },
  data() {
    return {
      contentColumnOptions: [],
      formObj: {
        columnContent: '',
        contentHtml: ''
      },
      articleId: '',
      activeName: '',
      rules: {
        columnContent: [
          { required: true, message: '栏目名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName
    }
    console.log('this.$route.params.articleObj', this.$route.params.articleObj)
    if (this.$route.params.articleObj !== undefined) {
      const article = this.$route.params.articleObj
      this.formObj['id'] = article.id
      this.formObj['columnContent'] = article.contentColumn === null ? '-' : article.contentColumn
      console.log(!!article.contentHtml)
      if (this.activeName === '7') {
        this.formObj['contentHtml'] = article.contentHtml ? article.contentHtml : ''
      } else {
        this.formObj['contentHtml'] = article.contentHtml ? article.contentHtml : ''
      }
    }
    // this.init()
  },
  computed: {
  },
  created() {
  },
  methods: {
    closeTab() {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem('articleupdate')
      let tagsViews = this.$store.state.tagsView.visitedViews
      for (let view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch('tagsView/delView', view).then(() => {
            this.$router.push({ path: openPath })
          })
          break
        }
      }
    },
    // init () {
    //   this.$refs.ckeditor2.initHtml(this.formObj.contentHtml)
    // },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.formObj['ckey'] = this.$store.getters.ckey
          this.formObj['contentModuleId'] = this.activeName
          save(this.formObj).then(response => {
            if (+response.state === 0) {
              this.$message.error(response.msg)
              return
            }
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
      this.formObj.contentHtml = htmlStr
    },
    addParentHtml(html) {
      this.formObj.contentHtml = html
    },
  }
}
