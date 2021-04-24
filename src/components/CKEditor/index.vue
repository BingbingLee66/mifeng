<template>
  <textarea name="editor1"></textarea>
</template>
<script>
import CKEDITOR from 'CKEDITOR'
export default {
  name: 'Ckeditor',
  props: {
  },
  data () {
    return {
    }
  },
  created() {
  },
  components: {
  },
  computed: {
  },
  mounted () {
    this.init()
  },
  methods: {
    // setData是异步的，如果先初始化，然后再传值进来有可能无法显示富文本内容
    init () {
      CKEDITOR.replace('editor1', {
        height: 300
      })
      CKEDITOR.instances.editor1.on('change', e => {
        this.changeHtmlFn()
      })
      CKEDITOR.instances.editor1.setData('')
      // document.getElementsByClassName('cke_button__image')[0].style.display=="none"
    },
    initHtml (obj) {
      if (CKEDITOR.instances.editor1 != undefined) {
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
      CKEDITOR.instances.editor1.setData(obj)
      // document.getElementsByClassName('cke_button__image')[0].style.display=="none"
    },
    changeHtmlFn () {
      this.$emit('getHtml', CKEDITOR.instances.editor1.getData())
    }
  }
}
</script>