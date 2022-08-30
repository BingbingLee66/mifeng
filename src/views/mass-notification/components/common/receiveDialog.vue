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
        <div slot="form"></div>      
        <!-- 表格 -->
         <kdTable @tableSelect="tableSelect"/>  
        <!-- <kdTable :table-data="tableData" :column-config="columnConfig"/>    -->
        <!-- 分页  -->
        <KdPagination></KdPagination>  
      </div>
      <div slot="customFooter">
        <slot name="receive"></slot>     
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
    selection: {
      type: Boolean,
      default: false
    },
    commitType: {
      type: Number,
      default: 1
    }
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
  created() {

  },
  methods: {

    handleSelectionChange() {},
    hide(){
      this.$emit("hide")
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
    tableSelect(val){
      this.selectData = val
      this.$emit('tableSelect', val)
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
</style>
