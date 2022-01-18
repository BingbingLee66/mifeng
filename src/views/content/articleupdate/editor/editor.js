import { getUpdateDetail, uploadCoverImg, save ,getWechatContent} from '@/api/content/article'
import { getContentColumnOptionsWithCkey } from '@/api/content/columnsetup'
import Ckeditor from '@/components/CKEditor'
import UEditor from '@/components/UEditor'
import PreviewPh from '@/components/ArticlePreview'
import addColumn from '../editor/component/addColumn'
import preview from './component/preview'
import kdDialog from '@/components/common/kdDialog'
export default {
  components: {
    Ckeditor,
    PreviewPh,
    addColumn,
    UEditor,
    preview,
    kdDialog
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
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
          { min: 5, max: 60, message: '限输入5-60个字的标题', trigger: 'blur' }
        ],
        contentColumnId: [
          { required: true, message: '对应栏目不能为空', trigger: 'blur' }
        ],
        coverImg1: [
          { required: true, message: '封面图片必须上传', trigger: 'blur' }
        ],
        coverImg2: [
          { required: true, message: '封面图片必须上传', trigger: 'blur' }
        ],
        coverImg3: [
          { required: true, message: '封面图片必须上传', trigger: 'blur' }
        ]
      },
      articleUrl:''
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
      // this.$refs.ueditor.setContent(this.formObj.contentHtml === null ? '' : this.formObj.contentHtml)
      this.$refs.ckeditor1.init()
      setTimeout(() => {
        this.$refs.ckeditor1.initHtml(this.formObj.contentHtml === null ? '' : this.formObj.contentHtml)
      }, 500)
    }
  },
  computed: {},
  created() {
  },
  methods: {
    addColumnFunc() {
      let contentModuleId = 3
      if (this.activeName === '5') {
        contentModuleId = 3
      } else if (this.activeName === '6') {
        contentModuleId = 4
      }
      this.$refs['addColumnRef'].open(contentModuleId).then(res => {
        console.log('添加成功')
        this.getContentColumnType()
      })
    },
    closeTab() {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem('articleupdate')
      let tagsViews = this.$store.state.tagsView.visitedViews
      // let selectView = null
      for (let view of tagsViews) {
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
            'publishTs': dataObj.publishTs,
            'coverImgs': dataObj.coverImgUrl,
            'status': dataObj.status,
            'istop': dataObj.istop
          }
          // this.$refs.ueditor.setContent(htmlObj === null ? '' : htmlObj)
          this.$refs.ckeditor1.init()
          setTimeout(() => {
            this.$refs.ckeditor1.initHtml(htmlObj === null ? '' : htmlObj)
          }, 500)
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
          // this.formObj['contentHtml'] = this.$refs.ueditor.content
          this.formObj['istop'] = false // 商会发布文章不开放置顶
          this.formObj['ckey'] = this.$store.getters.ckey
          this.formObj['contentModuleId'] = this.activeName
          save(this.formObj).then(response => {
            if(response.state===1){
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.closeTab()
            }else{
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
            
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
    },
    showPreview(){
      this.$refs['preview'].open(this.formObj.title,this.formObj.contentHtml)

    },
    //导入微信文章按钮行为
    importArticle(){
      this.$refs['kdDialog'].show()
    },
    //点击保存导入微信文章行为
    savePopupData(){
      this.getWechatContentFunc()

    },
    //抓取微信文章
    getWechatContentFunc(){
      getWechatContent(this.articleUrl).then(res=>{
        console.log('res',res)
        if(res.state===1){
          this.$refs.ckeditor1.init()
          setTimeout(() => {
            this.$refs.ckeditor1.initHtml(res.data.text === null ? '' : res.data.text);
            this.formObj.contentHtml = res.data.text;
            this.articleUrl=null
          }, 500)
          this.$refs['kdDialog'].hide()
        }

      })
    }
  }
}
