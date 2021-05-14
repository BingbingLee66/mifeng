<template>
  <textarea name="editor1"></textarea>
</template>
<script>
import CKEDITOR from 'CKEDITOR'

export default {
  name: 'Ckeditor',
  props: {},
  data() {
    return {}
  },
  created() {
  },
  components: {},
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
    // setData是异步的，如果先初始化，然后再传值进来有可能无法显示富文本内容
    init() {
      CKEDITOR.replace('editor1', {
        height: 300
      })
      CKEDITOR.instances.editor1.on('change', e => {
        this.changeHtmlFn()
      })
      CKEDITOR.instances.editor1.setData('')
      // document.getElementsByClassName('cke_button__image')[0].style.display=="none"
    },
    initHtml(obj) {
      if (CKEDITOR.instances.editor1 !== undefined) {
        // 防止刷新时出现多个editor
        CKEDITOR.instances.editor1.destroy()
      }
      // 为保证数据显示，初始化和设置数据一起
      CKEDITOR.replace('editor1', {
        height: 300
      })
      CKEDITOR.instances.editor1.on('change', e => {
        this.changeHtmlFn()
      })
      // 监听粘贴事件
      /* CKEDITOR.instances.editor1.on('paste', e => {
        console.log('粘贴进来了')
        console.log(e)
        if (e.data.type === 'html') {
          const htmlString = e.data.dataValue
          const document = this.parseToDOM(htmlString)
          const imgElement = document.getElementsByTagName('img')
          const srcArray = []
          for (let i = 0; i < imgElement.length; i++) {
            srcArray.push(imgElement[i].src)
          }
          console.log(srcArray)
        }
      }) */
      CKEDITOR.instances.editor1.setData(obj)
      // document.getElementsByClassName('cke_button__image')[0].style.display=="none"
    },
    // string字符串转为dom
    /* parseToDOM(txt) {
      const template = `<div class='child'>${txt}</div>`
      const doc = new DOMParser().parseFromString(template, 'text/html')
      const div = doc.querySelector('.child')
      return div
    }, */
    changeHtmlFn() {
      this.$emit('getHtml', CKEDITOR.instances.editor1.getData())
    }
  }
}
</script>
