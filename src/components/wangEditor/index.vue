
<template>
  <div>
    <div id="div1">
      <div></div>
    </div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  name: "editorElem",
  data() {
    return {
      editor: null,
      editorContent: "",
      isChange: false, //是否改变内容的变量
    };
  },
  //hiddenMenu 隐藏菜单栏
  props: ["content", "hiddenMenu","height"], // 接收父组件的内容
  watch: {
    content(newVal, oldVal) {
      // console.log('newVal',newVal),
      // console.log('oldVal',oldVal)
      // 重新设置编辑器内容
      // console.log('content',this.content);
      if (!this.isChange) {
        this.editor.txt.html(this.content);
      }

      this.isChange = false;
    },
    hiddenMenu() {
      console.log("this.hiddenMenu", this.hiddenMenu);
      if (this.hiddenMenu) {
        this.editor.config.menus = [];
      }
    },
  },
  mounted() {
    const editor = new E("#div1");
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    //上传图片的请求地址
    editor.config.uploadImgServer =
      process.env.VUE_APP_BASE_API + "/upload/richhtml-custom-img-upload";
    //上传图片的参数名称
    editor.config.uploadFileName = "upload";
    //剔除少数菜单
    editor.config.excludeMenus = ["video"];
    if (this.hiddenMenu) {
      editor.config.menus = [];
      editor.config.height = this.height ? this.height : 500;
    }
    // editor.config.menuTooltipPosition = "down";
    // 创建富文本实例
    editor.create();
    this.editor = editor;
    //配置
    this.editorConfigImg(editor);
    //事件
    this.addEvent();
  },
  methods: {
    //给editor添加事件
    addEvent() {
      let editor = this.editor;
      //给富文本添加内容监听事件
      this.addEditorChange(editor);
      //图片被点击触发的事件
      this.imgClickFunc(editor);
    },
    //监听内容的改变
    addEditorChange(editor) {
      editor.config.onchange = (html) => {
        this.isChange = true;
        this.$emit("addParentHtml", html);
        this.$emit('textNumber',this.editor.txt.text())
        this.getText()
        // console.log("html", html);
        // this.editorContent = html
        // this.catchData(this.editorContent)  // 把这个html通过catchData的方法传入父组件
      };
    },
    //监听图片被点击
    imgClickFunc(editor) {
      var myImgClickEvents = function (img) {
        console.log("myImgClickEvents图片被点击拉", img);
      };
      editor.txt.eventHooks.imgClickEvents.push(myImgClickEvents);
    },
    //配置editor
    editorConfigImg(editor) {
      //配置图片上传
      editor.config.uploadImgHooks = {
        before: function (xhr, editor, files) {
          console.log("xhr", xhr);
          console.log("editor", editor);
          console.log("files", files);
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          this.imgUrl = Object.values(result.data).toString();
          console.log('result',result)
          console.log('Object.values(result.data).toString()',Object.values(result.data).toString())
          console.log('this.imgUrl',this.imgUrl)
        },
        fail: function (xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
          console.log("xhr", xhr);
          console.log("editor", editor);
          console.log("files", files);
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function (xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          let url = Object.values(result.data); // result.data就是服务器返回的图片名字和链接
          JSON.stringify(url); // 在这里转成JSON格式
          insertImg(url);
          // result 必须是一个 JSON 格式字符串！！！否则报错
        },
      };
    },
    //获取富文本区域html内容
    getText() {
      let h = this.editor.txt.html();
    },
  },
};
</script>18
<style lang="scss" rel="stylesheet/scss">
#div1 {
  // resize: vertical;
  // overflow-x: hidden;
  width: 1000px;
}
.w-e-text {
  width: 800px;
  overflow-x: hidden;
}
#div1 img {
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