import { getList, getDetail, updateStatus, save } from '@/api/system/text'
import Ckeditor from '@/components/CKEditor'

export default {
  components: {
    Ckeditor
  },
  data () {
    var checkTitle = (rule, value, callback) => {
      if (!/^\S{1,50}$/.test(value)) {
        return callback(new Error('标题长度为1-50个字！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var checkContent = (rule, value, callback) => {
      if (!/^[\s\S]{1,1500}$/.test(value)) {
        return callback(new Error('内容详情长度为1-15000个字！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      visible: false,
      list: [],
      formObj: {
        'content': ''
      },
      listLoading: false,
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          { validator: checkTitle, trigger: 'change' }
        ],
        content: [
          { required: true, message: '内容详情不能为空', trigger: 'blur' },
          { validator: checkContent, trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  mounted () {
    this.init()
  },
  created () {
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init () {
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    add (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.formObj = {
        'title': '',
        'content': '',
        'status': 1
      }
      this.visible = true
      this.$refs.ckeditor1.initHtml(this.formObj.content === null ? '' : this.formObj.content)
    },
    edit (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'id': row.id
      }
      getDetail(params).then(response => {
        this.formObj = response.data.dtl
        this.visible = true
        this.$refs.ckeditor1.initHtml(this.formObj.content === null ? '' : this.formObj.content)
      })
    },
    save (row) {
      save(this.formObj).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.visible = false
        this.fetchData()
      })
    },
    updateStatus (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        'id': row.id,
        'action': row.status === 0 ? 'active' : 'notactive'
      }
      updateStatus(params).then(response => {
        if (row.status === 0) {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    getHtml (htmlStr) {
      this.formObj.content = htmlStr
    }
  }
}
