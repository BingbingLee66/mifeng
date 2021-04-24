import { getList, upload, updateLogo } from '@/api/system/property'

export default {
  data () {
    return {
      visible: false,
      list: [],
      formObj: {
        'systemLogo': ''
      },
      listLoading: false,
      rules: {
        systemLogo: [
          { required: true, message: '商会Logo必须上传', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {},
  created () {
    this.init()
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
    beforeAvatarUpload (file) {
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
    upload (content) {
      let formData = new FormData()
      formData.append('file', content.file)
      upload(formData).then(response => {
        this.formObj.systemLogo = response.data.filePath
      })
    },
    fetchData () {
      this.listLoading = true
      let params = {
        'ckey': this.$store.getters.ckey
      }
      getList(params).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    edit (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.visible = true
      this.formObj['systemLogo'] = row.systemLogo
    },
    save (row) {
      let params = {
        'ckey': this.$store.getters.ckey,
        'logoUrl': this.formObj.systemLogo
      }
      updateLogo(params).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.visible = false
        this.fetchData()
      })
    }
  }
}
