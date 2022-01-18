<template>
  <div class="app-container">
    <div v-if="!chamberCkey">
      <el-tabs v-model="type" @tab-click="handleClick">
        <el-tab-pane label="凯迪云商会" name="1"></el-tab-pane>
        <el-tab-pane label="其他商协会" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div style="margin:20px 0">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item style="margin-right: 30px;" label="活动来源" v-if="!chamberCkey">
          <el-select v-if="type==1" v-model="yunCkey" disabled placeholder="请选择" clearable>
            <el-option label="凯迪云商会" value='' />
          </el-select>
          <el-select v-if="type==2" v-model="query.ckey" placeholder="请选择" clearable filterable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.ckey" :label="chamber.name" :value="chamber.ckey" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 30px;" label="活动ID">
          <el-input v-model="query.activityId" placeholder="请输入" maxlength="9" @input="handleInput" />
        </el-form-item>
        <el-form-item style="margin-right: 30px;" label="活动名称">
          <el-input v-model="query.activityName" placeholder="关键词" />
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="query.activityStatus" placeholder="请选择状态">
            <el-option label="全部状态" :value="-1" />
            <el-option label="未开始" :value="1" />
            <el-option label="进行中" :value="2" />
            <el-option label="已结束" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="活动ID/名称" width="250px">
          <template slot-scope="scope">
            <div class="red-label">{{ scope.row.activityId }}</div>
            <div> {{ scope.row.activityName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="活动创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.createdTs }}
          </template>
        </el-table-column>
        <el-table-column label="活动开始时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.activityStartTime }}
          </template>
        </el-table-column>
        <el-table-column label="活动来源" width="200px">
          <template slot-scope="scope">
            <span v-if="scope.row.chamberName === null ">凯迪云商会</span>
            <span v-if="scope.row.chamberName !== null ">{{ scope.row.chamberName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报名对象" width="110px">
          <template slot-scope="scope">
            <span v-if="scope.row.applyObject === 0">不限</span>
            <span v-if="scope.row.applyObject === 1 && scope.row.chamberName === null">限云商会成员</span>
            <span v-if="scope.row.applyObject === 1 && scope.row.chamberName !== null">限本商会成员</span>
            <span v-if="scope.row.applyObject === 2 && scope.row.chamberName === null">限商会内指定职位</span>
            <span v-if="scope.row.applyObject === 2 && scope.row.chamberName !== null">限本商内指定职位</span>
            <span v-if="scope.row.applyObject === 3 && scope.row.chamberName === null">限商会内指定部门</span>
            <span v-if="scope.row.applyObject === 3 && scope.row.chamberName !== null">限本商内指定部门</span>
          </template>
        </el-table-column>
        <el-table-column label="参加人数" width="100px">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.applyCount === null ">不限</span>
            <span v-if="scope.row.applyCount !== null ">限{{ scope.row.applyCount }}人</span> -->
            <span v-if="scope.row.isLimit===0">不限</span>
            <span v-if="scope.row.isLimit===1">限{{scope.row.applyCount}}人 </span>
          </template>
        </el-table-column>
        <el-table-column label="已报名人数" width="100px">
          <template slot-scope="scope">
            {{ scope.row.appliedNum === null ? 0 : scope.row.appliedNum }}
          </template>
        </el-table-column>
        <el-table-column label="待审核" width="100px">
          <template slot-scope="scope">
            {{ scope.row.auditNum === null ? 0 : scope.row.auditNum }}
            <div class="blue-label" v-if="type==1" @click="goVerifyDetail(scope.row,'auditStatus',0)">去审核</div>
          </template>
        </el-table-column>
        <el-table-column label="已审核" width="100px">
          <template slot-scope="scope">
            {{ scope.row.auditedNum === null ? 0 : scope.row.auditedNum }}
          </template>
        </el-table-column>
        <el-table-column label="审核通过" width="100px">
          <template slot-scope="scope">
            {{ scope.row.approvedNum === null ? 0 : scope.row.approvedNum }}
            <div class="blue-label" v-if="type==1" @click="goVerifyDetail(scope.row,'auditStatus',1)">下载签到表</div>
          </template>
        </el-table-column>
        <el-table-column label="审核驳回" width="100px">
          <template slot-scope="scope">
            {{ scope.row.rejectedNum === null ? 0 : scope.row.rejectedNum }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="blue-label" @click="goVerifyDetail(scope.row,'auditStatus',1)" v-if="type==1">录入签到情况</div>
            <div class="blue-label" @click="goVerifyDetail(scope.row,'auditStatus',-1)">查看审核详情</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script src="./activity-verify.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
