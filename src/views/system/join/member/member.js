import { refreshGetInfo, getInfo, getPostUrl } from '@/api/system/property'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'

export default {
  data() {
    return {
      property: {},
      imgUrl: '',
      dataURL: '',
      isLoading: false
    }
  },

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
      })
    },
    refresh() {
      let params = {
        ckey: this.$store.getters.ckey
      }
      refreshGetInfo(params).then(response => {
        this.property = response.data.data
      })
    },
    getPost(file) {
      let posterDTO = {
        ckey: this.$store.getters.ckey,
        file
      }
      getPostUrl(posterDTO).then(res => {
        if (res.state === 1) {
          let ImgUrl = res.data.filePath.systemPosterUrl
          var a = document.createElement('a')
          a.download = '商会二维码'
          a.href = ImgUrl
          a.click()
        }
      })
    },
    clickGeneratePicture() {
      this.isLoading = true
      this.$nextTick(() => {
        const canvas = document.createElement('canvas')
        const shareContent = document.getElementById('postdiv')
        const width = shareContent.offsetWidth // 获取dom 宽度
        const height = shareContent.offsetHeight // 获取dom 高度
        canvas.width = width * 2
        canvas.height = height * 2
        canvas.style.width = width * 2 + 'px'
        canvas.style.height = width * 2 + 'px'
        const scale = 1 // 定义任意放大倍数 支持小数
        const context = canvas.getContext('2d')
        context.scale(scale, scale)
        const rect = shareContent.getBoundingClientRect() // 获取元素相对于视口的
        context.translate(-rect.left, -rect.top)
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
        html2canvas(shareContent, { // 转换为图片
          scrollY: -scrollTop,
          scrollX: 0,
          useCORS: true // 开启跨域
        }).then(canvas => {
          const imgUrl = canvas.toDataURL('image/png')
          this.dataURL = imgUrl
          console.log('000000:', this.dataURL)
          setTimeout(() => {
            var a = document.createElement('a')
            a.download = '商会二维码'
            console.log('1111111:', this.dataURL)
            console.log('imgUrl:', imgUrl === this.dataURL)
            a.href = this.dataURL
            a.click()
            this.isLoading = false
          }, 2000)
          // this.getPost(imgUrl)
        })
      })
    },
    domtoimage() {
      let _this = this
      this.isLoading = true
      const node = document.getElementById('postdiv')
      domtoimage.toPng(node)
        .then((dataUrl) => {
          var a = document.createElement('a')
          a.download = '入会二维码'
          a.href = dataUrl
          a.click()
          _this.isLoading = false
        })
        .catch(function(error) {
          console.error('oops, something went wrong!', error)
          _this.isLoading = false
        })
    }
  }
}
