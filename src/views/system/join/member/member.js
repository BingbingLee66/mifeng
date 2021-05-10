import { refreshGetInfo, getInfo, createQrcode } from '@/api/system/property'
import html2canvas from "html2canvas"

export default {
  data() {
    return {
      property: {},
      imgUrl: ''
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({tabName, actionName})
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({tabName, actionName})
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
        let imgurl = response.data.data.systemJoinQrcode
        this.imageUrlToBase64(imgurl)
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
      this.$nextTick(function () { // nextTick,当前dom渲染完毕的回调
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
    copyFunction(t, a, i) {
      var e = new ClipboardJS(a, {
        target: function () {
          return console.log(t, a),
            t
        }
      })
      e.on('success', function (t) {
        alert('文案复制成功！');
        t.clearSelection()
      })
      e.on('error', function (t) {
        console.log('复制失败');
        t.clearSelection()
      })
    },
    save() {
      var img = document.getElementById('qrcode')
      var alink = document.createElement('a')
      alink.href = img.src
      alink.click()
    },
    refresh() {
      let params = {
        ckey: this.$store.getters.ckey
      }
      refreshGetInfo(params).then(response => {
        this.property = response.data.data
        let imgurl = response.data.data.systemJoinQrcode
        this.imageUrlToBase64(imgurl)
      })
    },
    /**
     * 将页面指定节点内容转为图片
     * 1.拿到想要转换为图片的内容节点DOM；
     * 2.转换，拿到转换后的canvas
     * 3.转换为图片
     */
    clickGeneratePicture() {
      html2canvas(this.$refs.qecodeRef).then(canvas => {
        // 转成图片，生成图片地址
        this.imgUrl = canvas.toDataURL("image/png")
        console.log('imgUrl' ,this.imgUrl)
        this.downloadFileByBase64(this.imgUrl, '二维码')
      })
    },
    dataURLtoBlob(dataurl) {
      let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    downloadFile(url, name){
      let a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', name)
      a.setAttribute('target', '_blank');
      let clickEvent = document.createEvent('MouseEvents')
      clickEvent.initEvent('click', true, true)
      a.dispatchEvent(clickEvent);
    },
    downloadFileByBase64(base64, name) {
      let myBlob = this.dataURLtoBlob(base64)
      let myUrl = URL.createObjectURL(myBlob)
      this.downloadFile(myUrl, name)
    },
    imageUrlToBase64(imageUrl) {
      // 一定要设置为let，不然图片不显示
      let image = new Image()
      // 解决跨域问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = imageUrl
      // image.onload为异步加载
      image.onload = () => {
        let canvas = document.createElement("canvas")
        canvas.width = image.width
        canvas.height = image.height
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        let quality = 0.8
        // 这里的dataurl就是base64类型
        // 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
        let dataURL = canvas.toDataURL("image/jpeg", quality)
        console.log('dataURL',dataURL)
      }
    }
  }
}
