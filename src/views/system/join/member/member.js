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
        /* let imgurl = response.data.data.systemJoinQrcode
        this.imageUrlToBase64(imgurl)*/
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
      })
    },
    clickGeneratePicture() {
      this.$nextTick(() => {
        // var w = parseInt(window.getComputedStyle(_canvas).width);
        // var h = parseInt(window.getComputedStyle(_canvas).height);
        // var w = _canvas.offsetWidth;
        // var h = _canvas.offsetHeight;
        const canvas = document.createElement('canvas') // 创建一个canvas节点
        const shareContent = document.getElementById('downloadCardDiv') // 需要截图的包裹的（原生的）DOM 对象
        const width = shareContent.offsetWidth // 获取dom 宽度
        const height = shareContent.offsetHeight // 获取dom 高度
        const scale = 2 // 定义任意放大倍数 支持小数
        canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
        const rect = shareContent.getBoundingClientRect() // 获取元素相对于视口的
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
        html2canvas(document.getElementById('downloadCardDiv'), { // 转换为图片
          x: rect.left, // 绘制的dom元素相对于视口的位置
          y: rect.top,
          // scrollX: scrollTop,// 滚动的长度
          scrollY: -scrollTop,
          scale: scale, // 添加的scale 参数
          width: width, // dom 原始宽度
          height: height,
          useCORS: true, // 开启跨域
          dpi: window.devicePixelRatio * 2
        }).then(canvas => {
          const context = canvas.getContext('2d')
          // 关闭抗锯齿
          context.mozImageSmoothingEnabled = false
          context.msImageSmoothingEnabled = false
          context.imageSmoothingEnabled = false
          const imgUrl = canvas.toDataURL('image/png');
          this.dataURL = imgUrl;
          // console.log('下载图片')
          var a = document.createElement('a')
          a.download = '邀请卡'
          // 设置图片地址
          a.href = this.dataURL;
          a.click();
        })
        /* html2canvas(this.$refs.qecodeRef12).then(canvas => {
          // 转成图片，生成图片地址
          this.imgUrl = canvas.toDataURL("image/png")
          this.downloadFileByBase64(this.imgUrl, '二维码')
        }) */
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
    }
  }
}
