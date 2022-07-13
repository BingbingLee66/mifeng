import { refreshGetInfo, getInfo, getPostUrl } from '@/api/system/property'
import html2canvas from 'html2canvas'
// import domtoimage from 'dom-to-image'

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
      return this.$store.getters.has({
        tabName, actionName
      })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({
        tabName, actionName
      })
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      const params = {
        ckey: this.$store.getters.ckey
      }
      getInfo(params).then(response => {
        console.log('response', response)
        this.property = response.data.data
      })
    },
    refresh() {
      const params = {
        ckey: this.$store.getters.ckey
      }
      refreshGetInfo(params).then(response => {
        this.property = response.data.data
        this.$router.go(0)
      })
    },
    getPost(file) {
      const posterDTO = {
        ckey: this.$store.getters.ckey,
        file
      }
      getPostUrl(posterDTO).then(res => {
        if (res.state === 1) {
          const ImgUrl = res.data.filePath.systemPosterUrl
          var a = document.createElement('a')
          a.download = '商会二维码'
          a.href = ImgUrl
          a.click()
        }
      })
    },
    async clickGeneratePicture() {
      this.isLoading = true
      try {
        await this.$nextTick()
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
        const _canvas = await html2canvas(shareContent, { // 转换为图片
          scrollY: -scrollTop,
          scrollX: 0,
          useCORS: true // 开启跨域
        })
        const imgUrl = _canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.download = '商会二维码'
        a.href = imgUrl
        a.click()
        this.$trackClick(251)
      } catch (error) {
        // console.log(error)
      }
      this.isLoading = false
    },
    // domtoimage() {
    //   const _this = this
    //   this.isLoading = true
    //   const node = document.getElementById('postdiv')
    //   domtoimage.toPng(node)
    //     .then((dataUrl) => {
    //       var a = document.createElement('a')
    //       a.download = '入会二维码'
    //       a.href = dataUrl
    //       a.click()
    //       _this.isLoading = false
    //     })
    //     .catch(function(error) {
    //       console.error('oops, something went wrong!', error)
    //       _this.isLoading = false
    //     })
    // }
  }
}
