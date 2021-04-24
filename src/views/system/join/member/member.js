import { getInfo, createQrcode } from '@/api/system/property'

export default {
  data() {
    return {
      property: {}
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      let params = {
        ckey: this.$store.getters.ckey
      }
      getInfo(params).then(response => {
        this.property = response.data.data
      })
    },
    createQrcode(e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      let params = {
        ckey: this.$store.getters.ckey,
        url: ''
      }
      createQrcode(params).then(response => {

      })
    },
    onCopy() {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError() {
      this.$message({
        message: '复制失败',
        type: 'error'
      })
    },
    copyQrcode(e) {
      this.$nextTick(function() { // nextTick,当前dom渲染完毕的回调
        console.log('qecodeRef', this.$refs.qecodeRef)
        if (window.getSelection) {
          // const range = document.createRange()
          // range.selectNode(this.$refs.qecodeRef) // 传入dom
          // const selection = window.getSelection()
          // selection.addRange(range)
          // console.log('range copy')
          // document.execCommand('copy') // 复制
          // selection.removeAllRanges() // 清除缓存

          // const range = document.body.createControlRange()
          // console.log(range)
          // range.addElement(this.$refs.qecodeRef)
          // range.execCommand('copy')
          // console.log('range copy')
        } else if (document.body.createTextRange) {
          var range = document.body.createTextRange()
          range.moveToElementText(this.$refs.qecodeRef)
          range.select()
          console.log('text range copy')
          document.execCommand('copy') // 复制
        }
      })
    },
    copyFunction (t, a, i) {
      var e = new ClipboardJS(a, {
        target: function() {
          return console.log(t, a),
            t
        }
      })
      e.on('success', function(t) {
        alert('文案复制成功！');
        t.clearSelection()
      })
      e.on('error', function(t) {
        console.log('复制失败');
        t.clearSelection()
      })
    },
    save () {
      var img = document.getElementById('qrcode')
      var alink = document.createElement('a')
      alink.href = img.src
      alink.click()
    }
  }
}
