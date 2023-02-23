<template>
  <div class="app-container">
    <ys-form :form-item="formItem" :form-config="formConfig" :form-obj="formData" @query="queryData" />
    <ys-table
      ref="tableRef"
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      :page-data="pageData"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <!-- <template v-slot:countComment="row">
        <span class="theme-color cur" @click="handleComment(row.data)">{{ row.data.countComment }}</span>
      </template>
      <template v-slot:countMessage="row">
        <span class="theme-color cur" @click="handleMessage">{{ row.data.countMessage }}</span>
      </template>
      <template v-slot:countContent="row">
        <span class="theme-color cur" @click="handleContent">{{ row.data.countContent }}</span>
      </template>
      <template v-slot:countFriend="row">
        <span class="theme-color cur" @click="handleFriend">{{ row.data.countFriend }}</span>
      </template> -->
      <template v-slot:content="row">
        <!--  -->
        <el-tooltip popper-class="tool-tip" :disabled="(row.data.content.length || 0) < 36 " class="item" effect="dark" :content="row.data.content" placement="top">
          <div class="content">{{ row.data.content }}</div>
        </el-tooltip>
      </template>
      <template v-slot:auditResult="row">
        <!--  -->
        <el-tooltip popper-class="tool-tip" :disabled="(row.data.auditResult ? row.data.auditResult.length : 0) < 30 " class="item" effect="dark" :content="row.data.auditResult" placement="top">
          <div class="content">{{ row.data.auditResult }}</div>
        </el-tooltip>
      </template>
      <template v-slot:operate="row">
        <span class="theme-color cur ml-10" @click="handleDetail(row.data.id)">详情</span>
        <span v-if="parseInt(row.data.auditStatus) === 0" class="theme-color cur ml-10" @click="handleAudit(row.data)">处理</span>
      </template>
    </ys-table>
    <el-dialog
      v-if="detailVisible"
      :visible.sync="detailVisible"
      title="投诉详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="1">
        <el-descriptions-item label="投诉描述">{{ detailObj.content }}</el-descriptions-item>
        <el-descriptions-item label="内容截图">
          <div class="img-box">
            <img
              v-for="(img, index) in detailObj.urls"
              :key="img"
              :src="img"
              style="width: 100px; height: 100px; margin: 0 20px 20px 0;"
              @click="showImage(index)"
            >
          </div>

        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!--  处理投诉-->
    <el-dialog
      v-if="auditvisible"
      :visible.sync="auditvisible"
      title="处理投诉"
      :close-on-click-modal="false"
      width="550px"
    >
      <el-form ref="auditObj" size="small" :model="auditObj" label-width="80px" inline>
        <el-form-item label="处理结果" prop="result">
          <el-input
            v-model.trim="auditObj.result"
            type="textarea"
            maxlength="500"
            show-word-limit
            rows="6"
            placeholder="请输入"
            resize="none"
            style="width: 400px"
          />
        </el-form-item>
        <!-- <el-form-item label="冻结被投诉用户" prop="addFriendOn">
          <el-switch v-model="formData.actionOn" :active-value="1" :inactive-value="0" />
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="auditvisible = false">取消</el-button>
        <el-button type="primary" :disabled="!auditObj.result" @click="handleAuditComfirm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog :visible.sync="previewVisible" title="图片预览" :modal-append-to-body="false">
      <div v-if="previewVisible" class="block">
        <el-carousel trigger="click" class="imgbox" :autoplay="false" arrow="always" indicator-position="outside">
          <el-carousel-item v-for="(item, index) in imagesPreview" :key="index">
            <img :src="item" style="width: 100%; height: 100%;object-fit: contain;">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import YsTable from '@/components/ys-table'
import YsForm from '@/components/ys-form'
import _data from './data'
import { getComplaintLst, getComplaintDetail, auditComplaint } from '@/api/user'
export default {
  components: {
    YsForm,
    YsTable
  },
  data() {
    return {
      // 筛选项
      formConfig: {
        type: 'query',
        inline: true,
        labelWidth: '120px',
        hideReset: true
      },
      formItem: _data.formItem,
      formData: _data.formData,

      // 表格
      tableConfig: {
        loading: false
      },
      tableData: [],
      tableColumn: _data.tableColumn,
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0
      },
      rowData: null,
      detailVisible: false,
      detailObj: {},

      auditvisible: false,
      auditObj: {
        result: ''
      },

      previewVisible: false,
      imagesPreview: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData(e) {
      this.tableConfig.loading = true
      this.pageData.currentpage = e === 1 ? 1 : this.pageData.currentpage
      const { currentpage, limit } = this.pageData
      const { fromUserId, fromUserName, toUserId, toUserName, date, auditStatus } = this.formData
      const params = {
        fromUserId,
        fromUserName,
        toUserId,
        toUserName,
        auditStatus,
        startTime: date ? date[0] : '',
        endTime: date ? date[1] : '',
        page: currentpage,
        pageSize: limit
      }
      try {
        const res = await getComplaintLst(params)
        this.tableData = res.data.records
        this.pageData.total = res.data.total
        this.tableConfig.loading = false
      } catch (error) {
        console.log('error ===', error)
      } finally {
        this.tableConfig.loading = false
      }
    },
    async queryData(formData) {
      this.formData = { ...formData }
      this.fetchData(1)
    },
    handleSizeChange(val) {
      this.pageData.limit = val
      this.fetchData(1)
    },
    handleCurrentChange(val) {
      this.pageData.currentpage = val
      this.fetchData()
    },
    handleAudit(rowData) {
      this.auditObj.result = ''
      this.rowData = rowData
      this.auditvisible = true
    },
    async handleAuditComfirm() {
      const { id } = this.rowData
      const { result } = this.auditObj
      const res = await auditComplaint({ id, result })
      this.$message.success(res.msg)
      this.auditvisible = false
      this.fetchData(1)
    },
    async handleDetail(id) {
      try {
        const res = await getComplaintDetail({ id })
        this.detailObj = res.data
      } catch (error) {

      } finally {
        this.detailVisible = true
      }
    },
    /** 图片预览 */
    showImage(index) {
      this.imagesPreview = []
      this.previewVisible = true
      const imgArr = this.detailObj.urls
      const before = imgArr.slice(0, index)
      const after = imgArr.slice(index)
      this.imagesPreview = after.concat(before)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content{
  width: 100%;
  text-overflow: -o-ellipsis-lastline;
	overflow: hidden;				//溢出内容隐藏
	text-overflow: ellipsis;		//文本溢出部分用省略号表示
	display: -webkit-box;			//特别显示模式
	-webkit-line-clamp: 2;			//行数
	line-clamp: 2;
	-webkit-box-orient: vertical;	//盒子中内容竖直排列
}
.img-box{
  display: flex;
  flex-wrap: wrap;
}
</style>
<style>
.tool-tip {
  max-width: 700px;
  overflow: hidden;
}
</style>
