<template>
  <el-tree
    ref="tree"
    :data="treeData"
    :props="props"
    show-checkbox
    default-expand-all
    node-key="id"
    :default-checked-keys="selectIds"
  />
</template>

<script>

export default {
  name: 'IndustryLableDialog',
  components: {},
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      props: {
        label: 'name',
        children: 'childs'
      },
      treeData: []
    }
  },
  computed: {
    selectIds() {
      return this.data.map(v => v.id)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      setTimeout(() => {
        this.treeData = [
          { name: '广州省', id: 1, childs: [{ name: '广州市', id: 2, level: 2 }, { name: '广州市11', id: 9, level: 2 }] },
          { name: '广州省1', id: 3, childs: [{ name: '广州市2', id: 4, level: 2 }] },
          { name: '广州省2', id: 5, childs: [{ name: '广州市3', id: 6, level: 2 }] },
          { name: '广州省3', id: 7, childs: [{ name: '广州市4', id: 8, level: 2 }] },
        ]
      }, 100)
    },
    initData() {
      this.$refs.tree.setCheckedKeys(this.data.map(v => v.id))
    },
    handleConfirm() {
      const selectedData = this.$refs.tree.getCheckedNodes(true)
      if (!selectedData.length) return this.$message({ message: '请选择发布者常驻地', type: 'warning' })
      if (selectedData.length > 1) return this.$message({ message: '最多可选1个常驻地', type: 'warning' })
      this.$emit('confirm', { type: 'PublisherStation', data: [...selectedData] })
    },
  }
}
</script>

<style  scoped lang="scss">
  .dialog-desc {
    margin-bottom: 50px;
  }
</style>
