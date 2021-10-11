<template>
  <vue-ueditor-wrap ref="ued" v-model="content" :config="config" @ready="ready" :destroy="true" @beforeInit="addCustomButtom"></vue-ueditor-wrap>
</template>
<script>
export default {
  data() {
    return {
      content: '',
      editor: {}, // ueditor实例
      config: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 500,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl:
          'https://tysh.9kd.com/ecservice/upload/richhtml-custom-img-upload',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/UEditor/',
        // 设置工具栏功能
        toolbars: [
          [
            'undo',
            'redo',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'justifyleft',
            'justifycenter',
            'justifyright',
            'justifyjustify',
            '|',
            'removeformat',
            'fotmatmatch',
            'pasteplain',
            '|',
            'paragraph',
            'fontfamily',
            'fontsize',
            'forecolor',
            'insertorderedlist',
            'insertunorderedlist',
            '|',
            'source',
            'rowspacingtop',
            'rowspacingbottom',
            'lineheight',
            'indent',
            '|',
            'touppercase',
            'tolowercase',
            '|',
            'link',
            // 'simpleupload',
            // 'insertimage',
          ],
        ],

      },
    }
  },
  mounted() {
  },
  methods: {
    // 自定义上传图片按钮
    addCustomButtom(editorId) {
      var that = this
      window.UE.registerUI(
        'test-button',
        function(editor, uiName) {
          // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
          editor.registerCommand(uiName, {
            execCommand: function() {
              editor.execCommand('inserthtml', ``)
            },
          })
          // 创建一个 button
          var btn = new window.UE.ui.Button({
            // 按钮的名字
            name: uiName,
            // 提示
            title: '插入文字',
            // 需要添加的额外样式，可指定 icon 图标
            cssRules: 'background-position: -380px 0px;',
            // 点击时执行的命令
            onclick: function() {
              // 此处定义点击按钮时的行为
              // 实现选择的图片上传到服务器，然后将返回的内容添加到编辑器里
              var $file = document.createElement('input')
              $file.type = 'file'
              $file.accept = 'image/*'
              $file.multiple = 'multiple'
              $file.click()
              $file.addEventListener('change', function(e) {
                var fileList = e.target.files
                if (fileList.length > 0) {
                  let formData = new FormData()
                  formData.append('upload', fileList[0])
                  let xhr = new XMLHttpRequest()
                  xhr.open(
                    'post',
                    'https://tysh.9kd.com/ecservice/upload/richhtml-custom-img-upload',
                    true
                  )
                  xhr.setRequestHeader(
                    'Authorization',
                    localStorage.getItem('token')
                  )
                  xhr.send(formData)
                  xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                      let result = xhr.responseText
                      if (typeof result == 'string') {
                        let res = JSON.parse(result)
                        if (res.state === 1) {
                          // 返回的内容添加到编辑器里
                          editor.execCommand(
                            'inserthtml',
                            '<img src="' + res.data.filePath + '"/>'
                          )
                        } else {
                          alert(res.msg)
                        }
                      }
                    }
                  }
                }
              })
            },
          })
          // 当点到编辑内容上时，按钮要做的状态反射
          editor.addListener('selectionchange', function() {
            // var state = editor.queryCommandState(uiName);
            // if (state === -1) {
            //   btn.setDisabled(true);
            //   btn.setChecked(false);
            // } else {
            //   btn.setDisabled(false);
            //   btn.setChecked(state);
            // }
          })
          return btn
        },
        12 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */,
        editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
    },
    ready(instance) {
      this.editor = instance // 保存vue-ueditor-wrap实例
      console.log('ueditor实例：', this.editor)
    },
    // 设置文本内容
    setContent(content) {
      this.content = content
    },
  },
}
</script>
