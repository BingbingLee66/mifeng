<template>
  <div>
    <div class="dialog-desc">提示：最多可选5个，已选 {{ selectedData.length }} 个</div>
    <el-table
      ref="table"
      class="margin-bottom"
      :data="tableData"
      style="width:100%;"
      stripe
      border
      header-row-class-name="tableheader"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55px" />
      <el-table-column v-for="it in tableRows" :key="it.prop" :prop="it.prop" :label="it.lable" min-width="100px" />
    </el-table>
  </div>
</template>

<script>
import { getAvailableLabelList } from '@/api/lable'

export default {
  name: 'SupplyLable',
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
      tableData: [
        // { id: 137, name: '新电商' }
      ],
      tableRows: [
        { prop: 'id', lable: '标签id' },
        { prop: 'name', lable: '标签名称' }
      ],
      selectedData: []
    }
  },
  computed: {

  },
  created() {
    this.getLableList()
    this.selectedData = this.data
  },
  methods: {
    async getLableList() {
      const { data = [] } = await getAvailableLabelList()
      this.tableData = data
      await this.$nextTick()
      this.initData()
    },
    initData() {
      const selectedIds = this.data.map(v => v.id)
      this.tableData.forEach(v => {
        this.$refs.table.toggleRowSelection(v, selectedIds.includes(v.id))
      })
    },
    handleSelectionChange(e) {
      this.selectedData = e
    },
    handleConfirm() {
      const { selectedData } = this
      if (!selectedData.length) return this.$message({ message: '请选择供需标签', type: 'warning' })
      if (selectedData.length > 5) return this.$message({ message: '最多可选5个供需标签', type: 'warning' })
      this.$emit('confirm', { type: 'SupplyLable', data: [...selectedData] })
    }
  },
}
</script>

<style  scoped lang="scss">
  .dialog-desc {
    margin-bottom: 50px;
  }

</style>
