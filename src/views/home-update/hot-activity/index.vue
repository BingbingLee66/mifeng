<template>
  <div class="app-container">
    <div class="from-block" style="margin:20px 0">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item label="活动来源">
          <el-select v-model="query.ckey" placeholder="请选择" clearable filterable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.ckey" :label="chamber.name" :value="chamber.ckey" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动ID">
          <el-input v-model="query.activityId" maxlength="9" placeholder="请输入" @input="handleInput" />
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input v-model="query.activityName" placeholder="关键词" />
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="query.isPublish" placeholder="请选择状态">
            <el-option label="全部状态" :value="-1" />
            <el-option label="已发布" :value="1" />
            <el-option label="未发布" :value="0" />
          </el-select>
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
    <div style="margin-bottom:20px;">
      <el-button type="primary" size="small" @click="delMulActivity">移除</el-button>
      <el-button type="danger" size="small" @click="showActivityList">添加活动</el-button>
    </div>
    <div class="block-table">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px" />
        <el-table-column label="活动列表图" width="115px">
          <template slot-scope="scope">
            <img class="goods-preview" :src="scope.row.listImage" @click="openPreviewModal(scope.row.listImage)">
          </template>
        </el-table-column>
        <el-table-column label="活动ID/名称" width="250px">
          <template slot-scope="scope">
            <div class="red-label">{{ scope.row.activityId }}</div>
            <div> {{ scope.row.activityName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="166px">
          <template slot-scope="scope">
            {{ scope.row.activityStartTime }} - {{ scope.row.activityEndTime }}
          </template>
        </el-table-column>
        <el-table-column label="活动地点" width="200px">
          <template slot-scope="scope">
            {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.addressInfo }}
          </template>
        </el-table-column>
        <el-table-column label="活动来源" width="100px">
          <template slot-scope="scope">
            {{ scope.row.chamberName === null ? '凯迪云商会' : scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="报名对象" width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.applyObject === 0">不限</span>
            <span v-if="scope.row.applyObject === 1 && scope.row.chamberName === null">限云商会成员</span>
            <span v-if="scope.row.applyObject === 1 && scope.row.chamberName !== null">限本商会成员</span>
          </template>
        </el-table-column>
        <el-table-column label="报名人数" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.isLimit===0">不限</span>
            <span v-if="scope.row.isLimit===1">限{{ scope.row.applyCount }}人 </span>
            <!-- {{ scope.row.applyCount === null ? '不限' : '限' + scope.row.applyCount + '人'}}  -->
          </template>
        </el-table-column>
        <el-table-column label="签到人数" width="100px">
          <template slot-scope="scope">
            {{ scope.row.signNum }}人
          </template>
        </el-table-column>
        <el-table-column label="发布状态" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.isPublish === 0">未发布</span>
            <span v-if="scope.row.isPublish === 1">已发布</span>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">--</span>
            <span v-if="scope.row.status === 1">未开始</span>
            <span v-if="scope.row.status === 2">进行中</span>
            <span v-if="scope.row.status === 3">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="95px">
          <template slot-scope="scope">
            {{ scope.row.createdTs }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" width="100px">
          <template slot-scope="scope">
            {{ scope.row.operatorName }}
          </template>
        </el-table-column>
        <el-table-column label="权重" width="100px">
          <template slot-scope="scope">
            <span class="blue-label" @click="showSort(scope.row)"> {{ scope.row.sort }} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="showdel(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <div class="table-dialog">
      <el-dialog title="添加活动" :visible.sync="showAddDialog" width="80%">
        <el-form ref="query" label-position="right" :inline="true" size="mini" :model="actquery">
          <el-form-item label-width="100px" label="活动来源">
            <el-select v-model="actquery.ckey" placeholder="请选择商品来源" clearable filterable>
              <el-option v-for="chamber in chamberOptions" :key="chamber.ckey" :label="chamber.name" :value="chamber.ckey" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="100px" label="活动ID">
            <el-input v-model="actquery.activityId" maxlength="9" placeholder="请输入" @input="handleInput2" />
          </el-form-item>
          <el-form-item label-width="100px" label="活动名称">
            <el-input v-model="actquery.activityName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label-width="100px" label="活动状态">
            <el-select v-model="actquery.activityStatus" placeholder="请选择状态">
              <el-option label="全部状态" :value="-1" />
              <el-option label="未开始" :value="1" />
              <el-option label="进行中" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="getActivityLists">查询
            </el-button>
          </el-form-item>
        </el-form>
        <div class="table-block">
          <el-table v-loading="actLoading" :data="actList" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleAllSelectionChange">
            <el-table-column type="selection" width="55px" />
            <el-table-column label="活动列表图" width="115px">
              <template slot-scope="scope">
                <img class="goods-preview" :src="scope.row.listImage" @click="openPreviewModal(scope.row.listImage)">
              </template>
            </el-table-column>
            <el-table-column label="活动ID/名称">
              <template slot-scope="scope">
                <div class="red-label">{{ scope.row.activityId }}</div>
                <div> {{ scope.row.activityName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="活动时间" width="166px">
              <template slot-scope="scope">
                {{ scope.row.activityStartTime }} - {{ scope.row.activityEndTime }}
              </template>
            </el-table-column>
            <el-table-column label="活动地点" width="250px">
              <template slot-scope="scope">
                {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.addressInfo }}
              </template>
            </el-table-column>
            <el-table-column label="活动来源" width="100px">
              <template slot-scope="scope">
                {{ scope.row.chamberName === null ? '凯迪云商会' : scope.row.chamberName }}
              </template>
            </el-table-column>
            <el-table-column label="报名对象" width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.applyObject === 0">全部</span>
                <span v-if="scope.row.applyObject === 1">商会会员</span>
              </template>
            </el-table-column>
            <el-table-column label="发布状态" width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.isPublish === 0">未发布</span>
                <span v-if="scope.row.isPublish === 1">已发布</span>
              </template>
            </el-table-column>
            <el-table-column label="活动状态" width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1">未开始</span>
                <span v-if="scope.row.status === 2">进行中</span>
                <span v-if="scope.row.status === 3">已结束</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="160px">
              <template slot-scope="scope">
                {{ scope.row.createdTs }}
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-size="allPage.pageSize" :total="allPage.allTotal" :current-page.sync="allPage.currentpage" :style="{'padding-top': '15px'}" @size-change="handleAllSizeChange" @current-change="handleAllCurrentChange" /> -->
        </div>
        <div style="margin:20px 0;text-align:center;">
          <el-button type="primary" @click="addHotAct">添加</el-button>
          <el-button @click="showAddDialog=false">取消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 修改权重 -->
    <el-dialog title="权重" :visible.sync="showSortDialog" width="30%">
      <el-form ref="sortForm" :model="sortForm" label-width="100px" :rules="sortFormRules">
        <el-form-item label="权重" prop="sort">
          <el-input v-model="sortForm.sort" placeholder="请输入" />
          <div>权重请控制在0-999，权重为0不在前台展示</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateSort('sortForm')">提交</el-button>
          <el-button @click="showSortDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./hot-activity.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';

.goods-preview {
  width: 88px;
  height: 60px;
  cursor: pointer;
  object-fit: cover;
}
</style>

<style lang="scss">
.from-block .el-form-item {
  margin-right: 40px;

  .el-select {
    .el-input__inner {
      width: 130px;
    }
  }
}

.block-table .el-button {
  margin-left: 0;
  margin-right: 10px;
}

.table-dialog {
  .el-dialog {
    margin-top: 8vh !important;
  }

  .table-block {
    width: 100%;
    height: 50vh;
    overflow-y: scroll;
    padding-bottom: 50px;
  }
}
</style>
