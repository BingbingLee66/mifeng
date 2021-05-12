import { refreshGetInfo, getInfo, getPostUrl } from '@/api/system/property'
import html2canvas from "html2canvas"

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
      setTimeout(() => {
        const canvas = document.createElement('canvas')
        const shareContent = document.getElementById('postdiv')
        const width = shareContent.offsetWidth // 获取dom 宽度
        const height = shareContent.offsetHeight // 获取dom 高度
        const scale = 1 // 定义任意放大倍数 支持小数
        canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
        const rect = shareContent.getBoundingClientRect() // 获取元素相对于视口的
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
        html2canvas(document.getElementById('postdiv'), { // 转换为图片
          x: rect.left, // 绘制的dom元素相对于视口的位置
          y: rect.top,
          scrollX: 0, // 滚动的长度
          scrollY: -scrollTop,
          scale: scale,
          width: width, // dom 原始宽度
          height: height,
          useCORS: true // 开启跨域
        }).then(canvas => {
          const context = canvas.getContext('2d')
          context.mozImageSmoothingEnabled = false
          context.msImageSmoothingEnabled = false
          context.imageSmoothingEnabled = false
          const imgUrl = canvas.toDataURL('image/png')
          this.getPost(imgUrl)
          this.isLoading = false
          /* this.dataURL = imgUrl
          this.isLoading = false
          setTimeout(() => {
            var a = document.createElement('a')
            a.download = '商会二维码'
            a.href = this.dataURL
            a.click()
          }, 1000) */
        })
      }, 1000)
    }
  }
}
