// 引入 wangEditor
import E from 'wangeditor' // npm 安装
// const E = window.wangEditor // CDN 引入的方式
// 获取必要的变量，这些在下文中都会用到
const { BtnMenu } = E
// 【注意】如果版本 <= v4.0.5 需要这样写：
// const { $ } = E
// const { BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E.menuConstructors
import Vue from 'vue'
import { parseUrl } from '@/utils/parseUrl'

// 第一，菜单 class ，Button 菜单继承 BtnMenu class
class LinkMenu extends BtnMenu {
  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = E.$(
      `<div class="w-e-menu" data-title="链接跳转">
                <i class="el-icon-share" />
            </div>`
    )
    super($elem, editor)
  }
  // 菜单点击事件
  clickHandler() {
    const that = this
    function handleLink(data) {
      let url = ''

      const urlParams = data.path.split('?')
      const params = urlParams[1]
      if (!params) return
      const { appid, miniProgramType = 0, id } = parseUrl(params)

      if (data.linkType === 'miniprogram') {
        url = `wechatApp?path=${encodeURIComponent(data.path)}&miniId=${appid}&miniProgramType=${miniProgramType}`
      } else if (data.linkType === 'link') {
        url = `detailArticle?path=${encodeURIComponent(data.path)}&id=${id}`
      }

      if (data.type === 1) {
        // return `<a href="${url}"><img src="https://t7.baidu.com/it/u=1819248061,230866778&fm=193&f=GIF" alt=""></a>`
        return `<a href="${url}"><img src="${data.src}" alt=""></a>`
      } else {
        return `<a href="${url}">${data.content}</a>`
      }
    }

    // 做任何你想做的事情
    // 可参考【常用 API】文档，来操作编辑器
    Vue.prototype.modal({
      // 弹窗内嵌套组件传递属性
      componentProps: {},
      // 弹窗内嵌套组件
      // component: Table, //同步
      component: resolve => require(['@/components/wangEditor/link-modal/index.vue'], resolve), // 异步
      // 弹窗属性设置
      props: {
        title: '链接'
        // width: '520px',
        // fullscreen: false
      },
      // 事件回调
      methods: {
        click(data) {
          console.log('data', data)
          const linkDom = handleLink(data)

          that.editor.cmd.do('insertHTML', linkDom)
        }
      }
    })
  }

  // 菜单是否被激活（如果不需要，这个函数可以空着）
  // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
  // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
  tryChangeActive() {
    // 激活菜单
    // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
    // 2. this.this.isActive === true
    this.active()
    // // 取消激活菜单
    // // 1. 菜单 DOM 节点会删掉 .w-e-active
    // // 2. this.this.isActive === false
    // this.unActive()
  }
}

export default LinkMenu