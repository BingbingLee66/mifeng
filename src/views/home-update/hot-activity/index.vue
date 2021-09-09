<template>
  <div class="app-container">
    <el-tabs v-model="type" @tab-click="handleClick">
      <el-tab-pane label="全部活动" name="1"></el-tab-pane>
      <el-tab-pane label="已发布" name="2"></el-tab-pane>
      <el-tab-pane label="未发布" name="3"></el-tab-pane>
    </el-tabs>
    <div class="from-block" style="margin:20px 0">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item label="活动来源">
          <el-select v-model="query.ckey" placeholder="请选择" clearable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.value" :label="chamber.label" :value="chamber.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="活动ID">
          <el-input v-model="query.goodsName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input v-model="query.goodsName" placeholder="关键词"/>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="query.status" placeholder="请选择状态">
            <el-option label="全部状态" :value="-1"/>
            <el-option label="已发布" :value="1"/>
            <el-option label="未发布" :value="6"/>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:20px;">
      <el-button type="primary" size="small" @click="delMulExplode">移除</el-button>
      <el-button type="danger" size="small" @click="addExplodeGoods" v-if="type==='1'">添加活动</el-button>
    </div>
    <div class="block-table">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px"/>
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
            <span @click="openUpdateWeightDialog(scope.row)" style="color: #409eff;cursor: pointer"> {{ scope.row.weights }} </span>
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

    <div class="table-dialog">
      <el-dialog title="添加活动" :visible.sync="showAddDialog" width="80%">
        <el-form ref="query" label-position="left" :inline="true" :model="queryAll">
          <el-form-item label-width="100px" label="活动来源：">
            <el-select v-model="queryAll.ckey" placeholder="请选择商品来源" clearable>
              <el-option v-for="chamber in chamberOptions" :key="chamber.value" :label="chamber.label" :value="chamber.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label-width="100px" label="活动ID">
            <el-input v-model="queryAll.goodsId" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label-width="100px" label="活动名称">
            <el-input v-model="queryAll.goodsName" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label-width="100px" label="活动状态">
            <el-select v-model="queryAll.status" placeholder="请选择状态">
              <el-option label="全部状态" :value="-1"/>
              <el-option label="未发布" :value="1"/>
              <el-option label="已发布" :value="6"/>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="getAllGoodsLists">查询
            </el-button>
          </el-form-item>
        </el-form>
        <div class="table-block">
          <el-table v-loading="listLoading" :data="allList" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleAllSelectionChange">
            <el-table-column type="selection" width="55px"/>
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
          </el-table>
          <!-- <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-size="allPage.pageSize" :total="allPage.allTotal" :current-page.sync="allPage.currentpage" :style="{'padding-top': '15px'}" @size-change="handleAllSizeChange" @current-change="handleAllCurrentChange" /> -->
        </div>
        <div style="margin:20px 0;text-align:center;">
          <el-button type="primary" @click="addExplode">添加</el-button>
          <el-button @click="showAddDialog=false">取消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 修改权重 -->
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
  </div>
</template>

<script src="./hot-activity.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style lang="scss">
.from-block .el-form-item {
  margin-right: 40px;
  .el-select {
    .el-input__inner {
      width: 163px;
    }
  }
}
.goods-preview {
  width: 90px;
  height: 90px;
  cursor: pointer;
  object-fit: cover;
}

.block-table .el-button {
  margin-left: 0;
  margin-right: 10px;
}

.red-label {
  color: #ff0000;
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
