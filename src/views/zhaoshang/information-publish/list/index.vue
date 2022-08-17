<template>
  <div class="app-container">
    <div class="query-form">
      <el-form
        ref="query"
        :inline="true"
        :model="query"
        label-width="100px"
        label-position="right"
        size="small"
      >
        <el-form-item label="信息来源">
          <el-select v-model="query.invesId" placeholder="请选择">
            <el-option
              v-for="item in originOpt"
              :key="item.invesKey"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="招商信息ID">
          <el-input v-model.trim="query.id" clearable placeholder="请输入招商信息ID" />
        </el-form-item>

        <el-form-item label="招商信息名称">
          <el-input v-model.trim="query.title" clearable placeholder="请输入招商信息名称" />
        </el-form-item>

        <el-form-item label="信息状态">
          <el-select clearable v-model="query.status" placeholder="请选择">
            <el-option
              v-for="item in getMapDict(publishStatusMap)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" size="small" @click.native="fetchData(true)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="招商信息名称/ID" width="140px">
        <template slot-scope="scope">
          {{ scope.row.title }} / {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="investmentInfoVO.name" label="信息来源" width="120px" />
      <el-table-column align="center" prop="tag" label="标签" >
         <template slot-scope="scope" >
          <div class="tag-info">
            <span  v-for="(item,index) in scope.row.yshInvesLabelDTOS" :key="index">
              #{{item.label}}
              <span v-if="scope.row.yshInvesLabelDTOS.length -1 != index">,</span>
            </span>
          </div>
        
        </template>
      </el-table-column>
      <el-table-column  align="center" label="公示时间" width="150px">
        <template slot-scope="scope">
            {{scope.row.publicStartTs | dateFormat }} 至 {{scope.row.publicEndTs | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="招商阶段" width="150px">
        <template slot-scope="scope">
          <div v-if="scope.row.phaseStatus == -1">暂无选择</div>
          <div v-if="scope.row.phaseStatus == 0">筹备阶段</div>
          <div v-if="scope.row.phaseStatus == 1">拟策阶段</div>
           <div v-if="scope.row.phaseStatus == 2">公开招商阶段</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地区">
        <template slot-scope="scope">
          {{ scope.row.addressDTO.province }}{{ scope.row.addressDTO.city }}{{ scope.row.addressDTO.area }}{{ scope.row.addressDTO.addressInfo	 }}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="权重" width="70px">
        <template slot-scope="scope">
          <div @click="onweight(scope.row)" style="color: #409EFF;cursor: pointer;">
              {{ scope.row.wight  }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="operatorName" label="发布人" />
      <el-table-column align="center" prop="releaseTime" label="发布时间" >
        <template slot-scope="scope">
            {{scope.row.createdTs | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="150px">
        <template slot-scope="scope">
          {{ publishStatusMap.get(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="140">
        <template slot-scope="scope">
          <el-button  type="text"  :disabled="scope.row.status != 1" @click="onOffline($event, scope.row)">下线</el-button>
          <el-button v-if="scope.row.receivedCard == 1" type="text" @click="goTo('card', scope.row)">收到的名片</el-button>
          <!-- <el-button type="text" @click="goTo('statistics', scope.row)">数据统计</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 权重弹框 -->
    <el-dialog title="权重"  width="20%" :close-on-click-modal="false" :visible.sync="issort">
      <el-form  label-width="80px">
          <el-form-item label="权重 :"  :rules="[ { required: true }]" >
              <el-col :span="18">
                  <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')"  maxlength="3"    v-model="sortNum" ></el-input>
              </el-col>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button :disabled="sortNum == ''" type="primary" @click="ongetguideUpdate" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableMixins from '@/mixins/table'
import { stageMap, getMapDict, publishStatusMap } from '@/consts'
import { getinvesInfoList,getUpdateWeight,getPublish,getInfoList } from '@/api/attract'

export default {
  name: 'InformationList',
  mixins: [TableMixins],
  data() {
    return {
      originOpt: [], // 信息来源
      publishStatusMap,
      stageMap,
      getMapDict,
      query: {
        invesId:'', // 招商办Id
        id: null, // 招商信息id
        status: null, // 	状态 0待上线 1已上线 2已下线 3已结束
        title:'', // 标题
      },
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      tableData: [],
      sortId:'', // 选中权重id
      sortNum:'', // 设置权重
      issort:false,
    }
  },
  created(){
    // 获取信息来源
    this.ongetInfoList()
    this.fetchData()
  },
  methods: {
    ongetInfoList(){
      getInfoList({status:0}).then((res)=>{
        this.originOpt = res.data || []
      })
    },
    // 获取表格数据
    fetchData(reset) {
      if (reset) this.currentPage = 1
      this.loading = true
       let {
        title,
        status,
        id,
        invesId,
      } = this.query
      let params = {
        title,
        status,
        id,
        invesId,
        invesKey:null,
        'pageSize': this.limit,
        'pageNum': this.currentPage,
      }
      getinvesInfoList(params).then(response=>{
        this.tableData = response.data.list
        this.total = response.data.totalRows
        this.loading = false
      })

    },
    // 下线
    onOffline(e,row) {
      // TODO 待完善
      const h = this.$createElement
      let self = this
      this.$msgbox({
        title: '下线',
        message: h('p', null, [
          h('div', null, '下线后信息对外不可见'),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            let params = {
              id:row.id,
              type:0  // 类型（0：下线，1：上线）
            }
            getPublish(params).then(res=>{
              if (res.state === 1) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.onCancel()
                this.fetchData()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
              }
            })
            done()
          } else {
            done()
          }
        }
      }).then(action => {
      })
    },
    // 点击跳转
    goTo(name, item) {
      switch (name) {
        case 'statistics':
          this.$router.push({
            path: `/zhaoshang/information-publish/${item.id}/statistics`,
          })
          break
        case 'card':
          this.$router.push({
            path: `/zhaoshang/information-publish/${item.id}/${item.invesKey}/${1}/card-list`,
          })
          break
      }
    },
   
    // 点击权重
    onweight(row){
      this.sortNum = row.wight
      this.sortId = row.id
      this.issort = true
    },
    onCancel(){
      this.issort = false
      this.sortNum = ''
      this.sortId = ''
    },
    // 设置权重确认
    ongetguideUpdate(){
      let params = {
        id:this.sortId,
        sort:this.sortNum
      }
      getUpdateWeight(params).then(res=>{
        if (res.state === 1) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.onCancel()
          this.fetchData()
        } else {
          this.$message({
            message: res.msg,
            type: 'success'
          })
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
.tag-info{
  width: 100%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
</style>
