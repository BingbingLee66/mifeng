<template>
  <el-tree
    ref="tree"
    v-loading="loading"
    :data="treeData"
    :props="props"
    show-checkbox
    node-key="code"
    :default-checked-keys="selectIds"
  />
</template>

<script>
import { getAreaTree } from '@/api/area'

export default {
  name: 'PublisherStation',
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
        children: 'children'
      },
      treeData: [],
      loading: false
    }
  },
  computed: {
    selectIds() {
      return this.data.map(v => v.id)
    }
  },
  created() {
    this.getAreaTree()
  },
  activated() {
    this.initData()
  },
  methods: {
    async getAreaTree() {
      this.loading = true
      try {
        const { data = [] } = await getAreaTree()
        data.forEach(province => {
          province.children && province.children.forEach(city => {
            city.fullName = `${province.name}-${city.name}`
            city.fullCode = `${province.code}-${city.code}`
            delete city.children
          })
        })
        this.treeData = data
      } catch (error) { /*  */ }
      this.loading = false
    },
    initData() {
      if (!this.treeData.length) return
      this.$refs.tree.setCheckedKeys(this.selectIds)
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
