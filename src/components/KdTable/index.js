/*

  组件属性除list外 可穿透作用于 el-table

  list 用于布局 元素除 children | render | component | hidden 外 其他属性均可穿透作用于 el-table-column
  -- children 可用于递归生成嵌套的 el-table-column

  -- render (function | object) 用于插槽渲染
    -- function 参数为 插槽作用域 scoped 由于脚手架自动注入了const h = this.$createElement 使用jsx时必须使用箭头函数
      -- render:function 实际上转化为 render:{default:function} 当需要使用header插槽时可使用对象配置
      -- ep: { label: '表头', render: ({row}) => <div>row.name</div> }
    -- object 插槽对象 el-table-column插槽包含默认和header
      -- ep: { render: { default: ({row}) =><div>row.name</div>, header: ({column}) => <div>表头插槽</div> } }

  -- componet (Component | object) 当插槽逻辑含复杂操作时 可用封装成组件直接使用 组件内部props:{row,column}
    -- Component ep: import 表行组件 from '路劲' { component: 表行组件 }
      -- component:Component 实际上转化为 component:{default:Component}
    -- object 可用于配置表头组件 ep: import 表头组件 from '路劲' { componet:{default: 表行组件, header: 表头组件} }

  -- hidden 隐藏当前配置项 内部进行过滤

  穿透事件 select | select-all | selection-change

*/
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    // 生成 el-table-column
    generateTableColumn({ children, render, component, hide, ...item }, i) {
      return <el-table-column
        key={(item.label || '') + i}
        {...{ attrs: item }} // 属性穿透
        scopedSlots={this.generateSlot(render, component)}>
        {
          children && children.map((v, i) => this.generateTableColumn(v, i))
        }
      </el-table-column>
    },
    // 生成插槽对象
    generateSlot(render, component) {
      if (!render && !component) return null
      if (!render) render = {}
      if (!component) component = {}
      if (typeof render === 'function') render = { default: render }
      if (typeof component === 'function' || component.__file) component = { default: component }
      const keys = [...new Set([...Object.keys(render), ...Object.keys(component)])]
      return keys.reduce((slots, key) => {
        if (render[key]) {
          slots[key] = render[key]
        } else {
          const InnerComponent = component[key]
          slots[key] = ({ $index, ...e }) => <InnerComponent {...{ attrs: e }} />
        }
        return slots
      }, {})
    }
  },
  render(h) {
    const { $listeners, $attrs, list } = this
    // console.log($attrs)
    return (
      <el-table
        ref='table'
        style='width:100%;'
        border
        header-row-class-name='tableheader'
        highlight-current-row
        empty-text='暂无数据'
        onSelect={$listeners['select'] || (() => {})}
        onSelect-all={$listeners['select-all'] || (() => {})}
        onSelection-change={$listeners['selection-change'] || (() => {})}
        {...{ attrs: $attrs }} // 属性穿透
      >
        {
          list.filter(({ hidden }) => !hidden).map((v, i) => this.generateTableColumn(v, i))
        }
      </el-table>
    )
  }
}
