<template>
  <div>
    <el-dialog :visible.sync="detailVisible" width="30%" :before-close="close">
      <div slot="title"><span class="dot">*</span>{{ currentIndex+1 }}.{{ currentItem.title }}</div>
      <div v-if="!showOther">
        <KdTable :columns="columns" :rows="tableData" />
        <KdPagination
          :page-size="pageSize"
          :current-page="pageNum"
          :total="tableData.length"
          @change="onQueryChange"
        />
      </div>
      <div v-else class="flex-y">
        <span>答题人补充的其他选项 ：</span>
        <span v-for="(item,index) in currentItem.optionStatistics" :key="item.problemId" class="optionName">
          {{ item.optionName }}<span v-if="index!==currentItem.optionStatistics.length-1">、</span> </span>
      </div>
      <span slot="footer" class="dialog-footer flex-x-center">
        <el-button type="primary" @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { answersOtherDetailByMiF, answersOtherDetail } from '@/api/quest-survey/answer'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination')
  },
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    ckey: {
      type: String,
      default: ''
    },
    currentItem: {
      type: Object,
      default() { return { title: '' } }
    },
    currentIndex: {
      type: Number,
      default: 1
    },
    showOther: {
      type: Boolean
    }
  },
  data() {
    return { columns: [
      { label: '提交答卷时间', prop: 'createdTs' },
      { label: '答案文本', prop: 'val', width: 240 },
      { label: '操作', render: ({ row }) => <el-link type="primary" onClick={() => this.answerDetail(row)}>查看答卷</el-link> },
    ],
    pageNum: 1,
    pageSize: 10,
    tableData: []
    }
  },
  methods: {
    // 其他答卷数据
    async getDetail(questionId) {
      const { ckey, pageNum, pageSize } = this
      let API = answersOtherDetail
      if (ckey) { API = answersOtherDetailByMiF }
      const { data: { list } } = await API({ questionId, pageNum, pageSize })
      this.tableData = list
    },
    // 打开对应的答卷
    answerDetail() {},
    onQueryChange(val) { const { pageSize, pageNum } = val; this.pageNum = pageNum; this.pageSize = pageSize; console.log('val', val); this.getDetail() },
    close() {
      this.$emit('update:detailVisible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.dot {
  color: #d9001b;
  margin-right: 5px;
}
.optionName{
  margin-top: 30px;
  text-align: center;
}
</style>
