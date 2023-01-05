<template>
  <div>
    <el-dialog :visible.sync="detailVisible" width="30%" :before-close="close">
      <div slot="title"><span class="dot">*</span>6. 您所在的城市或地区</div>
      <div>
        <KdTable :columns="columns" :rows="tableData" />
        <KdPagination
          :page-size="query.pageSize"
          :current-page="query.pageNum"
          :total="total"
          @change="onQueryChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button>暂时不用</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { answersOtherDetailByMiF, answersOtherDetail } from '@/api/quest-survey/index'
import { formatDateTime } from '@/utils/date'
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
    questionId: {
      type: String,
      default: ''
    },
    ckey: {
      type: String,
      default: ''
    }
  },
  data() {
    return { columns: [
      { label: '答卷', prop: 'answersCount' },
      { label: '创建时间', render: ({ row }) => formatDateTime(+row.createdTs, 'yyyy-MM-dd hh:mm:ss') },
    ],
    pageNum: 1,
    pageSize: 10
    }
  },
  methods: {
    // 问卷发布
    async updateState() {
      const { ckey, questionId, pageNum, pageSize } = this
      let API = answersOtherDetail
      if (ckey) { API = answersOtherDetailByMiF }
      await API({ questionId, pageNum, pageSize })
    }
  }
}
</script>
<style lang="scss" scoped>
.dot {
  color: #d9001b;
  margin-right: 5px;
}
</style>
