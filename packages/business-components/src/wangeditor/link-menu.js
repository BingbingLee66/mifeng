// 引入 wangEditor
import E from 'wangeditor' // npm 安装
// const E = window.wangEditor // CDN 引入的方式
// 获取必要的变量，这些在下文中都会用到
const { BtnMenu } = E
// 【注意】如果版本 <= v4.0.5 需要这样写：
// const { $ } = E
// const { BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E.menuConstructors

import { parseUrl } from '@business/common/src/utils/index'
import { Modal } from 'ant-design-vue'
import linkModal from './link-modal/index.vue'
import { getCurrentInstance } from 'vue'
// 第一，菜单 class ，Button 菜单继承 BtnMenu class
class LinkMenu extends BtnMenu {
  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = E.$(
      `<div class="w-e-menu" data-title="链接跳转">
          <span role="img" aria-label="link" class="anticon anticon-link"><span data-v-6522ad22="" role="img" aria-label="share-alt" class="anticon anticon-share-alt" style="color: rgb(30, 136, 229);"><svg focusable="false" class="" data-icon="share-alt" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M752 664c-28.5 0-54.8 10-75.4 26.7L469.4 540.8a160.68 160.68 0 000-57.6l207.2-149.9C697.2 350 723.5 360 752 360c66.2 0 120-53.8 120-120s-53.8-120-120-120-120 53.8-120 120c0 11.6 1.6 22.7 4.7 33.3L439.9 415.8C410.7 377.1 364.3 352 312 352c-88.4 0-160 71.6-160 160s71.6 160 160 160c52.3 0 98.7-25.1 127.9-63.8l196.8 142.5c-3.1 10.6-4.7 21.8-4.7 33.3 0 66.2 53.8 120 120 120s120-53.8 120-120-53.8-120-120-120zm0-476c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zM312 600c-48.5 0-88-39.5-88-88s39.5-88 88-88 88 39.5 88 88-39.5 88-88 88zm440 236c-28.7 0-52-23.3-52-52s23.3-52 52-52 52 23.3 52 52-23.3 52-52 52z"></path></svg></span></span>
            </div>`
    )
    super($elem, editor)
    this.appContext = getCurrentInstance().appContext
  }
  // 菜单点击事件
  clickHandler() {
    const that = this
    function handleLink(data) {
      let url = ''
      if (data.linkType === 'miniprogram') {
        const urlParams = data.path.split('?')
        const params = urlParams[1]
        const { appid, miniProgramType = 0 } = parseUrl(params)
        url = `wechatApp?path=${encodeURIComponent(data.path)}&miniId=${appid}&miniProgramType=${miniProgramType}`
      } else if (data.linkType === 'link') {
        url = data.path
      }
      if (data.type === 1) {
        return `<a href="${url}" style="color: #266BCB"><img src="${data.src}" alt="" /></a>`
      } else {
        return `<a href="${url}" style="color: #266BCB">${data.content}</a>`
      }
    }

    const modal = Modal.confirm({
      title: '链接',
      content: (
        <linkModal
          onClick={data => {
            finishInput(data)
          }}
        ></linkModal>
      ),
      okButtonProps: { hidden: true },
      cancelButtonProps: { hidden: true },
      closable: true,
      appContext: this.appContext,
      width: '40%'
    })
    const finishInput = data => {
      const linkDom = handleLink(data)
      that.editor.cmd.do('insertHTML', linkDom)
      modal.destroy()
    }

    /* // 做任何你想做的事情
    // 可参考【常用 API】文档，来操作编辑器
    Vue.prototype.modal({
      // 弹窗内嵌套组件传递属性
      componentProps: {},
      // 弹窗内嵌套组件
      // component: Table, //同步
      component: (resolve) =>
        require(["@/components/wangEditor/link-modal/index.vue"], resolve), // 异步
      // 弹窗属性设置
      props: {
        title: "链接",
        // width: '520px',
        // fullscreen: false
      },
      // 事件回调
      methods: {
        click(data) {
          const linkDom = handleLink(data);
          that.editor.cmd.do("insertHTML", linkDom);
        },
      },
    });*/
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
