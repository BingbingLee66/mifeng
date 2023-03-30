<template>
  <div class="editor-wrap">
    <div ref="editor" class="editor" id="editor" />
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeUnmount, onMounted, watch } from 'vue'
import WangEditor from 'wangeditor'
import { ACCESS_TOKEN } from '@business/common/src/storage/constant'
import { APP_CODE } from '@business/common/src/config/index'
import LinkMenu from './link-menu'

export default defineComponent({
  name: 'WangEditor',
  props: {
    content: {
      type: String,
      default: ''
    },
    hiddenMenu: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 0
    },
    contentNumber: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: ''
    },
    /** {uploadFileName,imgUploadUrl,customInsertFunc} */
    imgUploadOption: {
      type: Object,
      required: true
    },
    needLink: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:content', 'textNumber'],

  setup(props, { emit }) {
    // 获取编辑器实例对象html
    const editor = ref()
    // 编辑器实例对象
    let editorInstance = null

    // 内容是否改变的变量，用于解决光标乱跳问题
    // 光标乱跳是因为watch监听的时候文本内容被实时更新，在文本输入的时候让监听无效即可
    const isChange = ref(false)

    onMounted(() => {
      editorInstance = new WangEditor(editor.value)
      // 设置编辑区域高度为 500px
      editorInstance.config.height = 500
      editorInstance.config.focus = false

      // 剔除上传视频菜单
      editorInstance.config.excludeMenus = ['video']
      if (props.hiddenMenu) {
        editorInstance.config.menus = []
        editorInstance.config.height = props.height ? props.height : 500
      }
      // placeholder
      editorInstance.config.placeholder = props.placeholder

      // 上传图片时，可自定义 filename
      // 即在使用 formData.append(name, file) 添加图片文件时，自定义第一个参数。
      editorInstance.config.uploadFileName = props.imgUploadOption.uploadFileName
      // 上传图片的请求地址
      editorInstance.config.uploadImgServer = props.imgUploadOption.imgUploadUrl

      // 上传图片时可自定义传递一些参数，参数会被添加到 formData 中，一起上传到服务端。
      editorInstance.config.uploadImgParams = {
        folder: 'government'
      }

      // 上传图片时添加 http 请求的 header 。
      editorInstance.config.uploadImgHeaders = {
        'Access-Token': window.localStorage.getItem(ACCESS_TOKEN),
        appcode: APP_CODE
      }

      // 一次最多上传 1 个图片
      editorInstance.config.uploadImgMaxLength = 1

      // 配置 onchange 回调函数
      editorInstance.config.onchange = html => {
        isChange.value = true
        // 自定义组件v-model:content的formState.content将会被更新
        // 注意：组件的 props 选项里声明 content 这个 prop
        // contentNumber 设置限制了次数  如果超过次数走进判断内
        if (props.hiddenMenu && editorInstance.txt.text().length > props.contentNumber) {
          editorInstance.txt.html(editorInstance.txt.text().substring(0, props.contentNumber))
          emit('textNumber', editorInstance.txt.text().length)
        } else {
          emit('update:content', html)
          emit('textNumber', editorInstance.txt.text().length)
        }
      }

      // 配置触发 onchange 的时间频率，默认为 200ms
      editorInstance.config.onchangeTimeout = 500

      editorInstance.config.onblur = html => {
        // 预防某些浏览器onchange不生效
        emit('update:content', html)
      }

      // 上传图片钩子
      editorInstance.config.uploadImgHooks = {
        // 上传图片之前
        before(xhr, editor, files) {
          console.log('before', xhr, files)
          // 可阻止图片上传
          // return { prevent: true,  msg: '需要提示给用户的错误信息'}
        },
        // 图片上传并返回了结果，图片插入已成功
        success(xhr, editor, result) {
          console.log('success', xhr, result)
        },
        // 图片上传并返回了结果，但图片插入时出错了
        fail(xhr, editor, resData) {
          console.log('fail', resData)
        },
        // 上传图片出错，一般为 http 请求的错误
        error(xhr, editor, resData) {
          console.log('error', xhr, resData)
        },
        // 上传图片超时
        timeout(xhr) {
          console.log('timeout', xhr)
        },
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert(insertImg, result) {
          // result 即服务端返回的接口
          props.imgUploadOption.customInsertFunc(insertImg, result)
        }
      }

      // 监听图片被点击
      const myImgClickEvents = function (img) {
        console.log('myImgClickEvents图片被点击拉', img)
      }
      editorInstance.txt.eventHooks.imgClickEvents.push(myImgClickEvents)

      // 总台特有
      if (props.needLink) {
        WangEditor.registerMenu('linkMenu', LinkMenu)
      }

      // 创建富文本实例
      editorInstance.create()
      watch(
        () => props.content,
        val => {
          if (!isChange.value && val) {
            editorInstance.txt.html(val)
          }
          isChange.value = false
        },
        {
          immediate: true
        }
      )
    })

    onBeforeUnmount(() => {
      // 销毁编辑器
      if (editorInstance) {
        editorInstance.destroy()
        editorInstance = null
      }
    })
    return {
      editor
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss">
.editor {
  // resize: vertical;
  // overflow-x: hidden;
  // width: 900px;
}
.w-e-text {
  width: 800px;
  overflow-x: hidden;
}
.editor img {
  max-width: 100%;
  height: auto !important;
  max-height: 100% !important;
}
.w-e-toolbar {
  z-index: 2 !important;
}
.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
</style>
