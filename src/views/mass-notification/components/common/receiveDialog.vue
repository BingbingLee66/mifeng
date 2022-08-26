<template>
  <div>
    <kdDialog
      ref="kdDialog"
      dialog-width="40%"
      :custom-footer="true"
      :center="true"
      :dialog-visible="true"
      :dialog-title="dialogTitle"
    >
      <div slot="content">
        <!-- 表单选型 -->
        <el-form-item label="搜索">
          <el-input v-model="name" :placeholder="placeholder"></el-input>
        </el-form-item>
        <!-- 表格 -->
        
        <kdTable :table-data="tableData" :column-config="columnConfig"/>   
        <!-- 分页  -->
        <KdPagination></KdPagination>  
      </div>
      <div slot="customFooter">
        <el-button type="primary" @click="save">我知道了</el-button>
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
    }
  },
  data() {
    return {
      dialogTitle: '接收人',
      placeholder: '姓名',
      columnConfig: [
        { type: 'select' },
        {
          prop: 'name',
          label: '名称',
          width: 180,
          formatter: row => {
            return 'formatter之后的名称' + row.name
          }
        },
        { prop: 'address', label: '地址', width: 180 }
      ],
      name: '',
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎22',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎333',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  created() {
    // console.log('组件receiveList', this.receiveList)
  },
  methods: {
    formatter(row, clolum) {
      console.log('row', row)
      console.log('clolum', clolum)
    },
    handleSelectionChange() {},
    save() {}
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
