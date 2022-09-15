<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <el-dialog
      title="管理模板"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <div class="containers">
        <!-- <div class="management-box"> -->
        <el-row>
          <!-- <div class="box-left"> -->
          <el-col :span="2.5">
            <div class="box-input"><el-input v-model="name" placeholder="搜索商协会" clearable @blur="query" /></div>
            <el-tabs ref="tabsa" v-model="buinessName" class="eltab" style="height: 700px;" tab-position="left">
              <el-tab-pane
                v-for="item in originOpt"
                :key="item.id"
                :label="item.name"
                :name="item.ckey"
              />
            </el-tabs>
          <!-- </div> -->
          </el-col>
          <!-- <div class="box-right"> -->
          <el-col :span="18">
            <el-tabs v-model="type" type="card" @tab-click="tabSwitch">
              <el-tab-pane label="短信模板" name="1"></el-tab-pane>
              <el-tab-pane label="订阅消息模板" name="2"></el-tab-pane>
              <el-tab-pane label="APP通知模板" name="3"></el-tab-pane>
            </el-tabs>
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
              短信通知
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

              订阅消息
              <template v-if="type == 2">
                <el-table-column prop="templateCode" label="模板ID" align="center" />
                <el-table-column prop="templateName" label="标题" align="center" />
                <el-table-column label="关键词" align="center">
                  <template slot-scope="scope">
                    <div class="hit">
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

              APP通知
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
                  {{ scope.row.tddStatus == 0 ? '已禁用' :'使用中' }}
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.tddStatus == 1" type="text" @click="operation(1,scope.row)"> 禁用 </el-button>
                  <el-button v-else type="text" @click="operation(2,scope.row)"> 启用 </el-button>
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
          <!-- </div> -->
          </el-col>
        </el-row>
        <!-- </div> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  distributionChambers, distributionTemplates
} from '@/api/mass-notification'
export default {
  data() {
    return {
      dialogVisible: false,
      buinessName: '',
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
      console.log('row', row)
      this.buinessName = 'G5cIMo'
      await this.query()
      await this.fetchData()
      this.dialogVisible = true
    },
    // 取消
    handleClose() {
      this.dialogVisible = false
      this.buinessName = ''
    },
    // 查询
    async query() {
      this.originOpt = []
      const parmas = {
        name: this.name
      }
      const res = await distributionChambers(parmas)
      this.originOpt = res.data
      this.handleClick()
    },
    // 点击头部
    tabSwitch() {
      this.fetchData(true)
    },
    // 列表数据
    async fetchData(reset) {
      if (reset) this.currentpage = 1
      this.listLoading = true
      this.list = []
      const parmas = {
        ckey: this.buinessName,
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
    // 选中左边tabs
    handleClick() {
      console.log(1111111, this.buinessName)
      this.$nextTick(() => {
        // const ele = document.getElementsByClassName('el-tabs__nav is-left')[0]
        // const distance = '-640px'
        // ele.style.transform = `translateY(${distance})`

        const index = this.originOpt.findIndex(item => { return item.ckey === this.buinessName })
        const ele = document.getElementsByClassName('el-tabs__nav is-left')[0]
        console.log('ele', ele, index)
        ele.setAttribute('style', `transform:translateY(-${index * 35}px)`)
      })
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
.management-box{
  display: flex;
  .box-left{
    width: 20%;
    .box-input{
      width: 250px;
      margin-bottom: 20px;
    }
  }
  .box-right{
    width: 80%;
  }
}

.hit{
  display: flex;
  flex-wrap: wrap;
}
// ::v-deep .eltab {
//   width: 200px;
// }
// ::v-deep .el-tabs--left .el-tabs__header.is-left {
//   width: 200px;
// }
// ::v-deep .el-tabs--left .el-tabs__item.is-left {
//   white-space: pre-wrap;
//   text-align: right;
//   padding: 10px 5px;
//   line-height: 20px;
//   height: auto;
// }

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
