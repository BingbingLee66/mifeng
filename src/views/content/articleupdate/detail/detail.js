import { getDetail} from '@/api/content/article'

export default {
  components: {
  },
  data() {
    return {
      contentColumnOptions: [],
      detailObj: {},
      articleId: '',
      rules: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
          { min: 5, max: 60, message: '限输入5-60个字的标题', trigger: 'blur' }
        ],
        contentColumnId: [
          { required: true, message: '对应栏目不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    if (this.$route.params.articleId) {
      this.articleId = this.$route.params.articleId
      window.localStorage.setItem('detail-articleId', this.articleId)
    } else {
      this.articleId = window.localStorage.getItem('detail-articleId')
    }
    this.init()
  },
  computed: {
  },
  created () {
  },
  methods: {
    init () {
      this.fetchData()
    },
    fetchData () {
      let params = {
        id: this.articleId
      }
      getDetail(params).then(response => {
        this.detailObj = response.data.dtl
      }).catch(error => {
        reject(error)
      })
    }
  }
}
