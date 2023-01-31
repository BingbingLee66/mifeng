<template>
  <div><el-form ref="form" :model="form">
         <el-form-item label="商协会">
           <el-select v-model="form.ckey" filterable style="width:150px" placeholder="请选择">
             <el-option v-for="item in chamberList" :key="item.id" :label="item.name" :value="item.ckey" />
           </el-select>
         </el-form-item>
       </el-form>

    <KdTable :columns="tableColumns" :rows="tableData" @selection-change="onSelectionChange" />

    <KdPagination style="padding-bottom:20px;" :page-size="form.pageSize" :current-page="form.pageNum" :total="total" @change="onQueryChange" />

  </div>
</template>

<script>
import { chamberSearchList } from '@/api/chamber/manager'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  data() {
    return {
      form: { ckey: '', pageSize: 10, pageNum: 1 },
      tableData: [],
      total: 0, chamberList: []
    }
  },
  computed: {
    tableColumns() {
      return [
        { label: '商协会', prop: 'chamberName' },
        { label: '问卷发布数', prop: 'questionnaireSum' },
        { label: '短信发送人数', prop: 'smsSendPeopleNumberSum' },
        { label: '短信送达数', prop: 'smsDeliveryNumberSum' },
        { label: '短信送达率', prop: 'smsDeliveryNumberRate' },
        { label: '问卷浏览次数', prop: 'questionnaireBrowseNumberSum' },
        { label: '问卷浏览人数', prop: 'questionnaireBrowsePeopleNumberSum' },
        { label: '答卷回收数', prop: 'questionnaireRecycleAnswerSum' },
        { label: '答卷回收率', prop: 'questionnaireRecycleRate' },
      ]
    }
  },
  created() {
    // 拉取问卷列表
    this.getChamberList()
  },
  methods: {
    async getChamberList() {
      const { data } = await chamberSearchList()
      this.chamberList = data || []
    },
    onSelectionChange() {},
    // 查询条件变更
    onQueryChange(e = {}) {
      console.log('e', e)
      // this.query = { ...this.query, ...e }
      this.getTableData()
    },
  }
}
</script>

<style>

</style>
