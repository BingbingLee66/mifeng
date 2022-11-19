<template>
  <div>
    <!-- 筛选表单 -->
    <ysh-form
      :form-config="formConfig"
      :form-item="formItem"
      :form-obj="formObj"
      @query="queryData"
      @reset="resetData"
    />

    <!-- 操作栏 -->
    <el-row>
      <el-button
        icon="el-icon-folder-add"
        type="primary"
        size="medium"
        @click="handleEvent('add')"
      >添加金刚区</el-button>
    </el-row>

    <!-- 表格数据 -->
    <ysh-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      :page-data="pageData"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      @handleLevelCallback="handleWeight"
    >
      <template v-slot:operate="row">
        <span
          class="text-blue cur ml-10"
          @click="handleEvent('edit', row.data)"
        >编辑</span>
        <span
          class="text-blue cur ml-10"
          @click="handleEvent('delete', row.data)"
        >移除</span>
      </template>
    </ysh-table>

    <!-- 新增/编辑金刚区弹窗 -->
    <Dialog ref="dialogRef" @refresh="fetchData" />
  </div>
</template>

<script>
import TableMixins from '@/mixins/yshTable'
import Dialog from './Dialog'
import _data from './data'
import Kingkong from '@/api/home-config/KingKong'

export default {
  components: { Dialog },
  // 查询，重置，分页，多选等操作（混入方式实现）
  mixins: [TableMixins],
  data() {
    return {
      /** 筛选表单 */
      formConfig: {
        type: 'query',
        inline: true,
        labelWidth: '85px',
        size: 'medium'
      },
      formItem: _data.formItem,
      formObj: _data.formObj,

      /** 表格数据 */
      tableConfig: {
        loading: false,
        maxHeight: window.innerHeight - 380 + 'px'
      },
      tableColumn: _data.tableColumn,
      tableData: []
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    /** 获取app金刚区列表数据 */
    async fetchData(e) {
      this.tableConfig.loading = true
      const { name, creatorName, createdTime } = this.formObj
      const { currentpage, limit } = this.pageData
      const params = {
        clientType: 1,
        name,
        creatorName,
        createdTsBegin: createdTime ? createdTime[0] : '',
        createdTsEnd: createdTime ? createdTime[1] : '',
        pageNum: e === 1 ? 1 : currentpage,
        pageSize: limit
      }
      if (createdTime) {
        params.createdTsBegin = Date.parse(new Date(params.createdTsBegin))
        params.createdTsEnd = Date.parse(new Date(params.createdTsEnd)) + 24 * 60 * 60 * 1000 - 1
      }
      const res = await Kingkong.getKingkongList(params)
      if (res.state !== 1) return
      this.tableData = res.data.list
      this.pageData.total = res.data.totalRows
      this.tableConfig.loading = false
    },

    /** 金刚区新增|编辑|删除 */
    handleEvent(event, data) {
      switch (event) {
        case 'add':
          this.$refs.dialogRef.$emit(event, data)
          break
        case 'edit':
          this.$refs.dialogRef.$emit(event, data)
          break
        case 'delete':
          this.handleDelete(data)
          break
        default:
          break
      }
    },

    /** 修改金刚区权重 */
    async handleWeight(data) {
      const res = await Kingkong.updateKingkongWeight({
        id: data.id,
        value: data.level
      })
      if (res.state === 1) {
        this.$message.success(res.msg)
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    },

    /** 移除金刚区 */
    handleDelete(data) {
      if (!data.id) return
      this.$confirm('确认移除该金刚区吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await Kingkong.deleteKingkong([data.id])
          if (res.state === 1) {
            this.$message.success(res.msg)
            this.fetchData(1)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.info('已取消移除')
        })
    }
  }
}
</script>
