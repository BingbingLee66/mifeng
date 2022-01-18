import { getUpdateDetail, save, uploadCoverImg ,getWechatContent} from '@/api/content/article'
import { getContentColumnOptions, getContentColumnOptionsWithCkey } from '@/api/content/columnsetup'
import { getOptions } from '@/api/content/articleSource'
import Ckeditor from '@/components/CKEditor'
import PreviewPh from '@/components/ArticlePreview'
import preview from '../articleupdate/editor/component/preview'
import kdDialog from '@/components/common/kdDialog'
import { Loading } from 'element-ui';
export default {
  components: {
    Ckeditor,
    PreviewPh,
    preview,
    kdDialog
  },
  data() {
    return {
      contentColumnOptions: [],
      articleSourceOptions: [],
      formObj: {
        title: '',
        contentColumnId: '',
        contentHtml: '',
        coverType: 0,
        // publishType: 0,
        coverImgs: [],
        status: 1,
        istop: false,
        sourceId: null
      },
      articleId: '',
      uploadIndex: 0,
      optionList: [
        '标签聚合页',
        '商会必参',
        '标签聚合页/商会必参'
      ],
      rules: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
          { min: 6, max: 50, message: '限输入6-50个字的标题', trigger: 'blur' }
        ],
        sourceId: [
          { required: true, message: '文章来源不能为空', trigger: 'blur' }
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
      articleUrl:'',
    }
  },
  mounted() {
    this.getArticleSourceType()
    if (this.$route.params.articleId) {
      this.articleId = this.$route.params.articleId
      this.init()
    } else {
      this.getContentColumnType()
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
    closeTab() {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem('articleeditor')
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
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
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
      if (!!this.formObj.ckey) {
        let contentModuleId = 7
        if (this.formObj.contentModuleId === 5) {
          contentModuleId = 3
        } else if (this.formObj.contentModuleId === 6) {
          contentModuleId = 4
        }
        const params = {
          ckey: this.formObj.ckey,
          contentModuleId: contentModuleId
        }
        getContentColumnOptionsWithCkey(params).then(response => {
          this.contentColumnOptions = response.data.data
        })
      } else {
        getContentColumnOptions().then(response => {
          this.contentColumnOptions = response.data.data
        })
      }
    },
    getArticleSourceType() {
      getOptions().then(response => {
        this.articleSourceOptions = response.data.data
      })
    },
    fetchData() {
      return new Promise((resolve, reject) => {
        const params = {
          id: this.articleId
        }
        getUpdateDetail(params).then(response => {
          console.log('文章详情：', response)
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
            'istop': dataObj.istop,
            'sourceId': dataObj.sourceId
          }
          if (dataObj.status === 4) {
            // this.formObj['publishTs'] = dataObj.publishTs
            this.$set(this.formObj, 'publishTs', dataObj.publishTs)
          }
          this.getContentColumnType()
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
      if(this.articleUrl){
        this.getWechatContentFunc()
      }else{
        this.$message.error('请填写导入微信文章路径');

      }

    },
    //抓取微信文章
    getWechatContentFunc(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255,.5)'
      });
      getWechatContent(this.articleUrl).then(res=>{
        console.log('res',res)
        if(res.state===1){
          this.$refs.ckeditor1.init()
          setTimeout(() => {
            this.$refs.ckeditor1.initHtml(res.data.text === null ? '' : res.data.text);
            this.formObj.contentHtml = res.data.text;
            this.articleUrl=null
          }, 500)
          this.$refs['kdDialog'].hide();
          
        }else{
          this.$message.error(res.msg);
          // 请输入微信公众号文章链接
        }
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loading.close();
        });
      })
    }
  }
}
