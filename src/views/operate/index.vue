<template>
  <div class="app-container">
    <div>
      <el-button type="text"  style="float: left;margin-bottom: 10px;color: #161515;">
        邀请有礼
      </el-button>
      <el-button type="primary" @click="openDialog()" style="float: right;margin-bottom: 10px;">
        新增邀请有礼
      </el-button>
    </div>
    <div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="ID" width="100px">
          <template slot-scope="scope" >
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <div> {{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="有效期" >
          <template slot-scope="scope">
            <div>{{ scope.row.validDateStart | dateFormat2 }} 至 {{ scope.row.validDateEnd	 | dateFormat2 }}</div>
          </template>
        </el-table-column>
        <el-table-column label="兑奖池/剩余">
          <template slot-scope="scope">
            <div>【总】{{ scope.row.totalAmount }}</div>
            <div>【剩】{{ scope.row.remainAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="激活人数">
          <template slot-scope="scope">
            {{ scope.row.activeNum }}
          </template>
        </el-table-column>
        <el-table-column label="激活成本单价" >
          <template slot-scope="scope">
            {{ scope.row.activePrice }}
          </template>
        </el-table-column>
        <el-table-column label="创建信息" >
          <template slot-scope="scope">
            <div>{{ scope.row.creator }}</div>
            <div>{{ scope.row.createdTs | dateFormat}}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0">未开始</div>
            <div v-if="scope.row.status === 1">进行中</div>
            <div v-if="scope.row.status === 2">已结束</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="detail($event, scope.row)">
                查看邀请记录
              </el-button>
            </div>
            <div>
              <el-button type="text" @click="edit($event, scope.row)" v-if="scope.row.status === 0">
                编辑
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <!--  打开新增邀请活动弹窗  -->
    <el-dialog :title="query.id ? '编辑邀请有礼' : '新增邀请有礼'" :visible.sync="visible" width="600px">
      <el-form ref="query"  :model="query" label-width="100px">
        <el-form-item label="活动名称" >
          <el-input v-model="query.name" placeholder="请输入活动名称" type="text" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="有效期" class="query_form_item_t">
          <el-date-picker
            v-model="query.queryDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="总奖池金额">
          <el-input v-model="query.totalPrice" placeholder=请输入奖池总金额 onkeyup="value=value.replace(/[^\d]/g,'')" type="text" min=“0” max="99999" maxlength="5" show-word-limit/>
        </el-form-item>
        <el-form-item label="">
          <div if="query.errMsg">{{query.errMsg}}</div>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./operate.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

</style>

