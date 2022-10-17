<template>
  <div class="ip-sort-wrap">
    <div class="flex-x search-wrap mb-20">
      <el-input v-model="query.searchKey" placeholder="用户名、手机号" style="width: 300px;" class="mr-20" @input="onQueryChange" />
      <el-button type="text" @click="onDownLoadSignin">导出模版</el-button>
      <el-button type="text" @click="importVisible = true">导入</el-button>
    </div>

    <KdTable v-loading="loading" class="mt5" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

    <WeightKdDialog ref="weightKdDialog" />
    <el-dialog :visible.sync="importVisible" title="导入" width="400px">
      <el-upload
        action="#"
        class="import-upload"
        drag
        :file-list="fileList"
        :before-upload="beforeUploadFile"
        :http-request="uploadFile"
        :on-remove="()=>(fileList=[])"
      >
        <div class="import-upload-content">
          <i class="el-icon-plus" />
          <div class="import-upload-text">上传批量导入表</div>
        </div>
      </el-upload>
      <div slot="footer" class="flex-x-between-center">
        <el-button type="text" @click="onDownLoadSignin"> 下载导入表 </el-button>
        <el-button type="primary" @click="onUploadSignin"> 确认导入 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script >
import { getIpCardList, uploadSignin, weightIpCardSort } from '@/api/activity/activity-verify-new'
import { downloadFile } from '@/utils'

export default {
  name: 'IPSort',
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    WeightKdDialog: () => import('@/views/activity/ip-sort/components/weightKdDialog')
  },
  data() {
    return {
      query: {
        searchKey: '',
        pageSize: 10,
        pageNum: 1,
      },
      loading: false,
      tableData: [],
      total: 0,
      columns: [
        {
          label: '用户信息',
          render: ({ row }) => (<div>
            {row.avatar ? <img style="width:50px;height:50px" src={row.avatar} alt="" /> : ''}
            <div>{row.userName}</div>
            <div>{row.phone}</div>
          </div>)
        },
        {
          label: '所属商会',
          prop: 'chamberName'
        },
        {
          label: '参与人与名片排序',
          prop: 'weight',
          render: ({ row }) => <el-button type="text" onClick={() => this.updateWeight(row)}>{row.weight}</el-button>
        }
      ],
      importVisible: false,
      fileList: [],
      timer: null

    }
  },
  computed: {
    activityId() {
      return this.$route.query.activityId || ''
    }
  },
  created() {
    this.getTableData()
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
  },
  methods: {
    onQueryChange(e) {
      this.query = { ...this.query, ...e }

      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getTableData()
      }, 500)
    },

    async getTableData() {
      this.loading = true
      try {
        const { query: { pageNum: page, pageSize, searchKey }, activityId } = this
        const { data: { totalRows, list } } = await getIpCardList(activityId, {
          page,
          pageSize,
          namephone: searchKey,
          status: 1,
        })
        this.total = totalRows
        this.tableData = list
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },

    updateWeight(row) {
      this.$refs['weightKdDialog']
        .open(row.id, row.weight, weightIpCardSort)
        .then(() => {
          this.getTableData()
        })
    },

    beforeUploadFile(file) {
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type)) {
        this.$message.error('上传文件只能是 XLSX 或 XLS 格式!')
        return false
      }
    },

    uploadFile(e) {
      this.fileList = [e.file]
    },

    onDownLoadSignin() {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const date = now.getDate()

      downloadFile({
        title: `${year}年-${month}月-${date}日参与人与名片排序.xlsx`,
        url: `${process.env.VUE_APP_BASE_API}/api/ec/singin/excel?activityId=${this.activityId}`
      })
    },

    async onUploadSignin() {
      if (!this.fileList.length) return this.$message({ message: '请选择上传文件', type: 'warning' })
      const formData = new FormData()
      formData.append('activityId', this.activityId)
      formData.append('file', this.fileList[0])
      const { state, msg } = await uploadSignin(formData)
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      if (state === 1) {
        this.importVisible = false
        this.getTableData()
      }
    },
  }
}
</script>

<style scoped lang="scss">
.ip-sort-wrap {
  padding: 20px;
}

.import-upload-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .el-icon-plus {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .import-upload-text {
    font-size: 20px;
    color: #999;
  }
}

</style>
