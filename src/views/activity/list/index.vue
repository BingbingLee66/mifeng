<template>
  <div class="app-container">
    <el-tabs v-model="type" @tab-click="handleClick">
      <el-tab-pane label="已发布" name="1"></el-tab-pane>
      <el-tab-pane label="未发布" name="2"></el-tab-pane>
    </el-tabs>
    <div class="from-block" style="margin:20px 0">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item style="margin-right: 30px;" label="活动来源">
          <el-select v-model="query.activitySource" placeholder="请选择" clearable>
            <el-option v-for="source in sourceOptions" :key="source.value" :label="source.label" :value="source.value"/>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 30px;" label="活动ID">
          <el-input v-model="query.activityID" placeholder="请输入"/>
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
        </el-form-item>
      </el-form>
    </div>
    <div @click="goEdit">编辑</div>

    <div class="block-table">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="活动列表图" width="115px">
          <template slot-scope="scope">
            <img class="goods-preview" :src="scope.row.descript" @click="openPreviewModal(scope.row.descript)">
          </template>
        </el-table-column>
        <el-table-column label="活动ID/名称" width="250px">
          <template slot-scope="scope">
            <div class="red-label">{{ scope.row.id }}</div>
            <div> {{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="活动地点" width="200px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="活动来源" width="100px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="报名对象" width="100px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="报名人数" width="100px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="签到人数" width="100px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="发布状态" width="100px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="活动状态" width="100px">
          <template slot-scope="scope">
            <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock > 0">在售中</div>
            <div v-if="scope.row.isOnSale == 2 || scope.row.isOnSale == 4">商会下架</div>
            <div v-if="scope.row.isOnSale == 5">已下架</div>
            <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock == 0">已售罄</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.limitTimeStart ? scope.row.limitTimeStart : scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" width="100px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="权重" width="100px">
          <template slot-scope="scope">
            <span @click="openUpdateWeightDialog(scope.row)" style="color: #409eff;cursor: pointer"> {{
                scope.row.weights
              }} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="delExplode(scope.row)">移除</el-button>
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
  </div>
</template>

<script src="./list.js"></script>

<style scoped>

</style>
