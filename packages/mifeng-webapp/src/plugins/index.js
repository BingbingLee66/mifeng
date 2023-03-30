/* 全局按需载入ant-design-vue组件 */
import {
  message,
  Button,
  Tabs,
  Input,
  Checkbox,
  Spin,
  Form,
  Dropdown,
  Menu,
  Table,
  Modal,
  Pagination,
  Select,
  Radio,
  DatePicker,
  Row,
  Col,
  Tree,
  Card,
  Cascader,
  Upload,
  TreeSelect,
  Switch,
  Tooltip,
  Image,
  Progress,
  Space,
  List,
  Avatar,
  Badge,
  Empty,
  Tag,
  Alert,
  Steps,
  Popover
} from 'ant-design-vue'
import Icons from './icons'
import { actionDirective } from './directives'
import provides from './provides'
import global from './global'
import dbClick from './dbClick'
import lazyLoad from './lazyLoad'
import VueGridLayout from 'vue-grid-layout'
import drag from '@/plugins/drag'
import VueClipboard from 'vue-clipboard2'
export default {
  install(app) {
    // 注册全局组件
    message.config({ duration: 2 })
    app.config.globalProperties.$message = message
    app
      .use(Button)
      .use(Icons)
      .use(Tabs)
      .use(Input)
      .use(Checkbox)
      .use(Form)
      .use(Dropdown)
      .use(Menu)
      .use(Table)
      .use(Modal)
      .use(Pagination)
      .use(Select)
      .use(Radio)
      .use(DatePicker)
      .use(Row)
      .use(Col)
      .use(Tree)
      .use(Card)
      .use(Cascader)
      .use(Upload)
      .use(TreeSelect)
      .use(Spin)
      .use(Switch)
      .use(Tooltip)
      .use(Image)
      .use(Progress)
      .use(Space)
      .use(List)
      .use(Avatar)
      .use(Badge)
      .use(Empty)
      .use(Tag)
      .use(Alert)
      .use(Steps)
      .use(Popover)
    // 注册全局指令
    app.use(actionDirective)
    app.use(dbClick)
    app.use(drag)
    app.use(lazyLoad)

    app.use(VueGridLayout)

    // 挂载剪切板插件
    app.use(VueClipboard)

    // 注入全局参数
    app.use(provides)

    // 注入全局方法
    app.use(global)
  }
}
