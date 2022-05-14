<template>
  <div>
    <div class="dialog-desc">提示：最多可选3个，已选 {{ checkedNumber }} 个</div>
    <el-tree
      ref="tree"
      v-loading="loading"
      :data="treeData"
      :props="props"
      show-checkbox
      node-key="id"
      :default-checked-keys="selectIds"
      @check="onCheckChange"
    />
  </div>

</template>

<script>
import { getTradeLabelList } from '@/api/lable'

export default {
  name: 'IndustryLable',
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
        label: 'typeName',
        children: 'subList'
      },
      treeData: [],
      checkedNumber: 0,
      loading: false
    }
  },
  computed: {
    selectIds() {
      return this.data.map(v => v.id)
    }
  },
  watch: {
    data: {
      handler(arr) {
        this.checkedNumber = arr.length
      },
      immediate: true
    }
  },
  created() {
    this.getLableList()
  },
  activated() {
    this.initData()
  },
  methods: {
    async getLableList() {
      this.loading = true
      try {
        const { data = [] } = await getTradeLabelList()
        this.treeData = data
      } catch (error) { /*  */ }
      this.loading = false
    },
    initData() {
      if (!this.treeData.length) return
      this.$refs.tree.setCheckedKeys(this.data.map(v => v.id))
    },
    handleConfirm() {
      const selectedData = this.$refs.tree.getCheckedNodes(true)
      console.log(selectedData)
      if (!selectedData.length) return this.$message({ message: '请选择行业标签', type: 'warning' })
      if (selectedData.length > 3) return this.$message({ message: '最多可选3个行业标签', type: 'warning' })
      this.$emit('confirm', { type: 'IndustryLable', data: selectedData })
    },

    onCheckChange(currentNode, { checkedNodes }) {
      this.checkedNumber = checkedNodes.filter(v => v.parentId).length
    }
  }
}
</script>

<style  scoped lang="scss">
  .dialog-desc {
    margin-bottom: 50px;
  }
</style>
