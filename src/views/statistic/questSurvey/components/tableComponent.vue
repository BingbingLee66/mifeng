<template>
  <div><el-form ref="form" :model="form" label-width="80px">
         <el-form-item label="活动区域">
           <el-select v-model="form.region" style="width:150px" placeholder="请选择">
             <el-option label="区域一" value="shanghai" />
             <el-option label="区域二" value="beijing" />
           </el-select>
         </el-form-item>
       </el-form>

    <KdTable :columns="tableColumns" :rows="tableData" @selection-change="onSelectionChange" />

    <!--  <KdPagination style="padding-bottom:20px;" :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" /> -->

  </div>
</template>

<script>
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    // KdPagination: () => import('@/components/common/KdPagination'),
  },
  data() {
    return {
      form: { region: '' },
      tableData: []
    }
  },
  computed: {
    tableColumns() {
      return [
        { label: '商协会', prop: 'date' },
        { label: '问卷发布数', prop: 'date' },
        { label: '短信发送人数', prop: 'date' },
        { label: '短信送达数', prop: 'date' },
        { label: '短信送达率', prop: 'date' },
        { label: '问卷浏览次数', prop: 'date' },
        { label: '问卷浏览人数', prop: 'date' },
        { label: '答卷回收数', prop: 'date' },
        { label: '答卷回收率', prop: 'date' },
      ]
    }
  },
  methods: {
    onSelectionChange() {}
  }
}
</script>

<style>

</style>
