import Vue from 'vue'
import { Dialog } from 'element-ui'

let instance

const Modal = function ({ component, methods, props, componentProps }) {
  const dom = document.createElement('div')
  document.body.appendChild(dom)
  instance = new Vue({
    el: dom,
    components: {
      Dialog,
      Plugin: component
    },
    data() {
      return {
        showModal: true
      }
    },
    methods: {
      close() {
        this.showModal = false
        document.body.removeChild(this.$el)
        this.$destroy()
      }
    },
    render(createElement) {
      const plugin = this.showModal ? () => createElement('Plugin', {
        props: {
          ...componentProps
        },
        on: {
          close: e => this.close(e),
          ...methods
        }
      }) : null
      return createElement(
        'Dialog', {
          props: {
            visible: this.showModal,
            ...props
          },
          on: {
            close: e => this.close(e)
          },
          scopedSlots: {
            default: plugin
          }
        })
    }
  })
  return instance
}

export default Modal
