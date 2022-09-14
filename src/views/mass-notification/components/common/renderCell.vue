<script>

export default {
  name: 'RenderCell',
  functional: true,
  props: {
    scope: {
      type: Object,
      default: () => {
        return {}
      }
    }, render: {
      type: Function,
      default: () => {
        return {}
      }
    }
  },
  render(h, ctx) {
    // console.log('ctx.props.scope', ctx.props.scope)
    return ctx.props.render ? ctx.props.render(h, ctx.props.scope) : ''
  }

}
</script>
