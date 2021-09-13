<template>
  <div class="app-container">
    <div v-if="!ckey">
      <el-tabs v-model="type" @tab-click="handleClick">
        <el-tab-pane label="凯迪云商会" name="1"></el-tab-pane>
        <el-tab-pane label="其他商协会" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div style="margin:20px 0">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item style="margin-right: 30px;" label="活动来源" v-if="!ckey">
          <el-select v-model="query.source" placeholder="请选择" clearable>
            <el-option v-for="source in sourceOptions" :key="source.value" :label="source.label" :value="source.value"/>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 30px;" label="活动ID">
          <el-input v-model="query.activityId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item style="margin-right: 30px;" label="活动名称">
          <el-input v-model="query.activityName" placeholder="关键词"/>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="query.activityStatus" placeholder="请选择状态">
            <el-option label="全部状态" :value="-1"/>
            <el-option label="已发布" :value="1"/>
            <el-option label="未发布" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
          <el-button @click="goVerifyDetail">审核详情
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
        <el-table-column label="活动创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.createdTs }}
          </template>
        </el-table-column>
        <el-table-column label="活动开始时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.activityStartTime }}
          </template>
        </el-table-column>
        <el-table-column label="活动来源" width="100px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="报名对象" width="100px">
          <template slot-scope="scope">
            {{ scope.row.applyObject === 0 ? '全部' : '限本商会会员' }}
          </template>
        </el-table-column>
        <el-table-column label="参加人数" width="100px">
          <template slot-scope="scope">
            限{{ scope.row.applyCount }}人
          </template>
        </el-table-column>
        <el-table-column label="已报名人数" width="100px">
          <template slot-scope="scope">
            {{ scope.row.appliedNum }}
          </template>
        </el-table-column>
        <el-table-column label="待审核" width="100px">
          <template slot-scope="scope">
            {{ scope.row.auditNum }}
            <div class="blue-label" @click="goVerifyDetail(scope.row)">去审核</div>
          </template>
        </el-table-column>
        <el-table-column label="已审核" width="100px">
          <template slot-scope="scope">
            {{ scope.row.auditedNum }}
          </template>
        </el-table-column>
        <el-table-column label="审核通过" width="100px">
          <template slot-scope="scope">
            {{ scope.row.approvedNum }}
            <div class="blue-label" @click="goVerifyDetail(scope.row)">下载签到表</div>
          </template>
        </el-table-column>
        <el-table-column label="审核驳回" width="100px">
          <template slot-scope="scope">
            {{ scope.row.rejectedNum }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="goVerifyDetail(scope.row)">录入签到情况</el-button>
            <el-button type="text" @click="goVerifyDetail(scope.row)">查看审核详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 修改权重弹窗 -->
    <el-dialog title="权重" :visible.sync="showWeightDialog" width="30%">
      <el-form :model="weightsForm" ref="weightsForm" label-width="100px" :rules="weightsFormRules">
        <el-form-item label="权重" prop="weights">
          <el-input v-model="weightsForm.weights" placeholder="请输入"></el-input>
          <div>权重请控制在0-999，权重为0不在前台展示</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateWeight('weightsForm')">提交</el-button>
          <el-button @click="showWeightDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 取消发布弹窗 -->
    <el-dialog title="提示" :visible.sync="showDelDialog" width="400px">
      <div>确认取消发布吗？</div>
      <div slot="footer" style="text-align: center;">
        <el-button @click="showDelDialog = false">取 消</el-button>
        <el-button type="primary" @click="showDelDialog = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="预览" :visible.sync="previewImgVisible" width="50%">
      <img :src="previewUrl" style="width: 100%; padding:20px;" v-if="previewUrl.indexOf('.jpeg') != -1 || previewUrl.indexOf('.jpg') != -1 || previewUrl.indexOf('.png') != -1"/>
      <video :src="previewUrl" v-else style="width: 100%; padding:20px;" controls>
        您的浏览器不支持 video 标签。
      </video>
    </el-dialog>
  </div>
</template>

<script src="./activity-verify.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
