<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <el-dialog
      title="管理模板"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div class="containers">
        <el-row>
          <el-col :span="22">
            <el-tabs v-model="type" type="card" @tab-click="tabSwitch">
              <el-tab-pane label="短信模板" name="1"></el-tab-pane>
              <el-tab-pane label="订阅消息模板" name="2"></el-tab-pane>
              <el-tab-pane label="APP通知模板" name="3"></el-tab-pane>
            </el-tabs>
            <el-select v-model="ckey" filterable placeholder="请选择" @change="fetchData(true)">
              <el-option
                v-for="item in originOpt"
                :key="item.id"
                :label="item.name"
                :value="item.ckey"
              >
              </el-option>
            </el-select>

            <el-table
              :key="random"
              v-loading="listLoading"
              style="margin-top: 20px"
              :data="list"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
            >
              <!-- 短信通知 -->
              <template v-if="type == 1">
                <el-table-column prop="templateName" label="模板名称" align="center" />
                <el-table-column prop="templateCode" label="模板CODE" align="center" />
                <el-table-column label="内容" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.content }}
                  </template>
                </el-table-column>
                <el-table-column label="所属类型" align="center">
                  <template slot-scope="scope">
                    {{ noticeTypeId[scope.row.noticeTypeId] }}
                  </template>
                </el-table-column>
                <el-table-column prop="templateRemark" label="模板备注" align="center" />
              </template>

              <!-- 订阅消息 -->
              <template v-if="type == 2">
                <el-table-column prop="templateCode" label="模板ID" align="center" />
                <el-table-column prop="templateName" label="标题" align="center" />
                <el-table-column label="关键词" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.subscriptionNoticeTemplateVo" class="hit">
                      <div v-for="(item, index) in scope.row.subscriptionNoticeTemplateVo.variableAttributes" :key="index">
                        {{ item.value }}
                        <span v-if="index != scope.row.subscriptionNoticeTemplateVo.variableAttributes.length - 1">、</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="所属类型" align="center">
                  <template slot-scope="scope">
                    {{ noticeTypeId[scope.row.noticeTypeId] }}
                  </template>
                </el-table-column>
                <el-table-column prop="templateRemark" label="模板备注" align="center" />
              </template>

              <!-- APP通知 -->
              <template v-if="type == 3">
                <el-table-column prop="templateCode" label="ID" align="center" />
                <el-table-column prop="templateName" label="标题" align="center" />
                <el-table-column label="内容" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.content }}
                  </template>
                </el-table-column>
                <el-table-column label="所属类型" align="center">
                  <template slot-scope="scope">
                    {{ noticeTypeId[scope.row.noticeTypeId] }}
                  </template>
                </el-table-column>
                <el-table-column prop="templateRemark" label="模板备注" align="center" />
              </template>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  {{ scope.row.tddStatus == 0 ? '已禁用' : scope.row.tddStatus == 1 ? '使用中' : '已删除' }}
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.tddStatus == 1" :disabled="scope.row.status == 0 || scope.row.status == 2" type="text" @click="operation(0,scope.row)"> 禁用 </el-button>
                  <el-button v-else type="text" :disabled="scope.row.status == 0 || scope.row.status == 2" @click="operation(1,scope.row)"> 启用 </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              style="margin-top: 20px"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="pageSizes"
              :page-size="limit"
              :total="total"
              :current-page.sync="currentpage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />

          </el-col>
        </el-row>

      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  distributionChambers, distributionTemplates,
  distributionUpdateStatus
} from '@/api/mass-notification'
export default {
  data() {
    return {
      dialogVisible: false,
      ckey: '',
      name: '', // 查询名字
      type: '1', // 1短信通知、2订阅消息、3APP通知
      originOpt: [], // 商协会
      list: [], // 列表
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      listLoading: false,
      random: 1, // 动态改变table视图
      noticeTypeId: ['', '缴费通知', '活动通知', '招商活动', '邀请入会', '自定义通知']
    }
  },
  watch: {

  },

  methods: {
    async show(row) {
      this.ckey = row.ckey
      await this.query()
      this.dialogVisible = true
      await this.fetchData()
    },
    // 取消
    handleClose() {
      this.dialogVisible = false
      this.ckey = ''
      this.list = []
      this.originOpt = []
      this.currentpage = 1
      this.limit = 10
      this.total = 0
      this.type = '1'
    },
    // 查询
    async query() {
      this.originOpt = []
      const parmas = {
        name: this.name
      }
      const res = await distributionChambers(parmas)
      this.originOpt = res.data
    },
    // 点击头部
    tabSwitch() {
      this.fetchData(true)
    },
    // 列表数据
    async fetchData(reset) {
      if (reset) this.currentpage = 1
      this.listLoading = true
      const parmas = {
        ckey: this.ckey,
        pageSize: this.limit,
        page: this.currentpage,
        type: this.type
      }
      const res = await distributionTemplates(parmas)
      this.listLoading = false
      this.list = res.data.list || []
      this.total = res.data.totalRows || 0
      this.random = Math.random()
    },
    async operation(status, row) {
      // 状态 0禁用 1启用 2删除
      const parmas = {
        status,
        id: row.id
      }
      if (status === 0) {
        this.$confirm('禁用后，该商会后台不可使用该模板', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.UpdateStatus(parmas)
        }).catch(() => {

        })
      }
      if (status === 1) {
        this.$confirm('启用后，该商会后台可使用该模板', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.UpdateStatus(parmas)
        }).catch(() => {

        })
      }
    },
    // 禁用 启用
    async UpdateStatus(parmas) {
      const res = await distributionUpdateStatus(parmas)

      if (res.state === 1) {
        this.$message.success('操作成功')
        this.fetchData()
      } else {
        this.$message.error(res.msg)
      }
    },
    handleSizeChange(val) {
      this.limit = val
      this.fetchData(true)
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.fetchData()
    }
  }
}
</script>
<style scoped lang="scss">

.hit{
  display: flex;
  flex-wrap: wrap;
}
.el-select{
  width: 400px;
}

.elInput {
  width: 96%;
}
::v-deep .el-tabs--left .el-tabs__nav.is-left,
.el-tabs--left .el-tabs__nav.is-right,
.el-tabs--right .el-tabs__nav.is-left,
.el-tabs--right .el-tabs__nav.is-right {
  white-space: pre-wrap;
  text-align: right;
  /* padding: 10px 5px; */
  line-height: 20px;
  height: auto;
  width: 200px;
  /* overflow-y: scroll; */
}
::v-deep .el-tabs__item {
  height: auto;
  max-height: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
}
::v-deep .el-tabs--left .el-tabs__item.is-left,
.el-tabs--left .el-tabs__item.is-right,
.el-tabs--right .el-tabs__item.is-left,
.el-tabs--right .el-tabs__item.is-right {
  line-height: 25px;
  padding: 4px 18px;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
