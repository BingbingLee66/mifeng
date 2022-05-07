<template>
  <div>
    <div class="dialog-desc">提示：最多可选5个，已选 {{ checkedNumber }} 个</div>
    <el-tree
      ref="tree"
      :data="treeData"
      :props="props"
      show-checkbox
      default-expand-all
      node-key="id"
      :default-checked-keys="selectIds"
      @check="onCheckChange"
    />
  </div>

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
      treeData: [],
      checkedNumber: 0
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
          { name: 'O2O', id: 1, childs: [{ name: '电商行业', id: 2, level: 2 }] },
          { name: '外卖行业', id: 3, childs: [{ name: '外卖行业', id: 4, level: 2 }] },
          { name: '外卖行业1', id: 5, childs: [{ name: '外卖行业2', id: 6, level: 2 }] },
          { name: '外卖行业3', id: 7, childs: [{ name: '外卖行业4', id: 8, level: 2 }] },
        ]
      }, 100)
    },
    initData() {
      this.$refs.tree.setCheckedKeys(this.data.map(v => v.id))
      this.checkedNumber = this.data.length
    },
    handleConfirm() {
      const selectedData = this.$refs.tree.getCheckedNodes(true)
      if (!selectedData.length) return this.$message({ message: '请选择行业标签', type: 'warning' })
      if (selectedData.length > 3) return this.$message({ message: '最多可选3个行业标签', type: 'warning' })
      this.$emit('confirm', { type: 'IndustryLable', data: selectedData })
    },

    onCheckChange(currentNode, { checkedNodes }) {
      this.checkedNumber = checkedNodes.filter(v => v.level === 2).length
    }
  }
}
</script>

<style  scoped lang="scss">
  .dialog-desc {
    margin-bottom: 50px;
  }
</style>
