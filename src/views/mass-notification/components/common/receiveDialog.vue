<template>
  <div>
    <kdDialog
      ref="kdDialog"
      dialog-width="40%"
      :custom-footer="true"
      :center="true"
      :dialog-title="dialogTitle"
      @hide="hide"
    >
      <div slot="content">
        <!-- 表单选型 -->
        <slot name="form" />

        <!-- 表格 -->
        <div class="table">
          <kdTable ref="tableRef" v-bind="$attrs" @tableSelect="tableSelect" />
          <!-- <kdTable v-bind="$attrs" @tableSelect="tableSelect" ref="tableRef" /> -->
        </div>

        <!-- 分页  -->
        <!-- <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="change" ></KdPagination>   -->
        <KdPagination v-bind="$attrs" v-on="$listeners" @change="change" />
      </div>
      <div slot="customFooter">
        <slot name="receive" />
      </div>
    </kdDialog>
  </div>
</template>
<script>
import kdDialog from '@/components/common/kdDialog'
import kdTable from './kdTable'
import KdPagination from '@/components/common/KdPagination/index'
export default {
  name: 'ReceiveDialog',
  components: { kdDialog, kdTable, KdPagination },
  props: {
    // selection: {
    //   type: Boolean,
    //   default: false
    // },
    // commitType: {
    //   type: Number,
    //   default: 1
    // },
    // pageSize: {
    //   type: Number,
    //   default: 1
    // }
  },
  data() {
    return {
      dialogTitle: '接收人',
      placeholder: '姓名',

      name: '',
      // 已选表格数据
      selectData: []
    }
  },
  created() {},
  methods: {
    handleSelectionChange() {},
    hide() {
      this.$emit('hide')
    },
    // save() {
    //   // 去选择
    //   if (this.commitType === 2){
    //     this.$emit('')

    //   } else if (this.commitType === 1){

    //   }
    //   this.$refs['kdDialog'].hide()
    // },
    /** 与子组件的交互 */
    tableSelect(val) {
      this.selectData = val
      this.$emit('tableSelect', val)
    },
    handleSizeChange(val) {
      this.$emit('change', { pageSize: val, pageNum: 1 })
    },
    change(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px;
}
.el-input {
  width: 200px;
}
.table {
  overflow-y: scroll;
  height: 500px;
}
</style>
