<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商品列表" name="8"></el-tab-pane>
      <el-tab-pane label="置顶商品管理" name="9" :actionid="getId('商品列表', '置顶商品管理')" v-if="has('商品列表', '置顶商品管理')"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == '8'">
      <div class="froma-block ">
        <el-form ref="query" :inline="true" label-position="right" :model="query">
          <el-form-item label="商品ID">
            <el-input v-model="query.id" type="number" placeholder="请输入商品ID"/>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input placeholder="请输入商品名称"/>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="query.status" placeholder="请选择状态">
              <el-option label="所有" :value="-1"></el-option>
              <el-option label="在售中" :value="1"></el-option>
              <el-option label="已下架" :value="2"></el-option>
              <el-option label="平台下架" :value="6"></el-option>
              <el-option label="已售罄" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加时间：">
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="query.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" :actionid="getId('商品列表', '查询')" v-if="has('商品列表', '查询')" @click="fetchData($event)">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="block">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="small" :actionid="getId('商品列表', '上架')" v-if="has('商品列表', '上架')" @click.native="batchUpdateStatus($event, 1)">
              上架
            </el-button>
            <el-button type="primary" size="small" :actionid="getId('商品列表', '下架')" v-if="has('商品列表', '下架')" @click.native="batchUpdateStatus($event, 2)">
              下架
            </el-button>
            <el-button type="primary" size="small" :actionid="getId('商品列表', '删除')" v-if="has('商品列表', '删除')" @click.native="batchDel($event)">
              删除
            </el-button>
            <el-button type="danger" size="small" :actionid="getId('商品列表', '发布新商品')" v-if="has('商品列表', '发布新商品')" @click.native="addGoods($event)">
              发布新商品
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="block-table">
        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55px" key="activeName8">
          </el-table-column>
          <el-table-column label="商品ID/名称" width="250px">
            <template slot-scope="scope">
              <div class="red-label">{{ scope.row.id }}</div>
              <div> {{ scope.row.name }}</div>
              <el-button type="text" style="margin-left:0px;" @click="setTop($event, scope.row)" :actionid="getId('商品列表', '置顶')" v-if="has('商品列表', '置顶') && scope.row.isOnSale != 5">
                置顶
              </el-button>
              <el-button type="text" style="margin-left:0px;" @click="createCode($event, scope.row)">生成二维码</el-button>
            </template>
          </el-table-column>
          <el-table-column label="商品图片" width="115px">
            <template slot-scope="scope">
              <img class="m-goods-preview" :src="scope.row.descript" @click="openPreviewModal(scope.row.descript)">
            </template>
          </el-table-column>
          <el-table-column label="商品价格信息（元）" width="160px">
            <template slot-scope="scope">
              <div>【单买价】{{ scope.row.singlePriceMerge == null ? '-' : scope.row.singlePriceMerge }}</div>
              <div>
                【拼单价】<span class="red-label">{{
                  scope.row.fightPriceMerge == null ? '-' : scope.row.fightPriceMerge
                }}</span>
              </div>
              <div>【供货价】{{ scope.row.supplyPriceMerge == null ? '-' : scope.row.supplyPriceMerge }}</div>
              <div>【立减优惠】{{ scope.row.discount }}</div>
            </template>
          </el-table-column>
          <el-table-column label="商品库存" width="100px">
            <template slot-scope="scope">
              {{ scope.row.sumStock }}
            </template>
          </el-table-column>
          <el-table-column label="累计销量" width="100px">
            <template slot-scope="scope">
              {{ scope.row.salesVolume }}
            </template>
          </el-table-column>
          <el-table-column label="预约人数" width="120px">
            <template slot-scope="scope">
              <div> {{ scope.row.bookingNums }}</div>
              <el-button type="text" style="margin-left:0px;" @click="goBookingList($event, scope.row)">查看预约列表
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="供货商家" width="200px">
            <template slot-scope="scope">
              {{ scope.row.supplierName }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="200px">
            <template slot-scope="scope">
              {{ scope.row.createTime | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100px">
            <template slot-scope="scope">
              <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock > 0">在售中</div>
              <div v-if="scope.row.isOnSale == 2 || scope.row.isOnSale == 4">已下架</div>
              <div v-if="scope.row.isOnSale == 5">平台下架</div>
              <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock == 0">已售罄</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" style="margin-left:0px;" @click="edit($event, scope.row)" :actionid="getId('商品列表', '编辑')" v-if="has('商品列表', '编辑')">
                编辑
              </el-button>
              <el-button type="text" style="margin-left:0px;" @click="updateStatus($event, scope.row.id, 1)" :actionid="getId('商品列表', '上架')" v-if="has('商品列表', '上架') && (scope.row.isOnSale == 2 || scope.row.isOnSale == 4)">
                上架
              </el-button>
              <el-button type="text" style="margin-left:0px;" @click="updateStatus($event, scope.row.id, 2)" :actionid="getId('商品列表', '下架')" v-if="has('商品列表', '下架') && (scope.row.isOnSale == 1 || scope.row.isOnSale == 3)">
                下架
              </el-button>
              <el-button type="text" style="margin-left:0px;" @click="del($event, scope.row)" :actionid="getId('商品列表', '删除')" v-if="has('商品列表', '删除')">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" @size-change="handleSizeChange" @current-change="handleCurrentChange" :style="{'padding-top': '15px'}">
      </el-pagination>
    </div>

    <div v-if="activeName == '9'">
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="商品ID" width="100px" key="activeName9">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="120px">
          <template slot-scope="scope">
            <img class="m-goods-preview" :src="scope.row.descript" @click="openPreviewModal(scope.row.descript)">
          </template>
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100px">
          <template slot-scope="scope">
            {{ scope.row.sumStock }}
          </template>
        </el-table-column>
        <el-table-column label="累计销量" width="100px">
          <template slot-scope="scope">
            {{ scope.row.salesVolume }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150px">
          <template slot-scope="scope">
            <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock > 0">在售中</div>
            <div v-if="scope.row.isOnSale == 2 || scope.row.isOnSale == 4">已下架</div>
            <div v-if="scope.row.isOnSale == 5">平台下架</div>
            <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock == 0">已售罄</div>
          </template>
        </el-table-column>
        <el-table-column label="置顶时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.topTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="80px">
          <template slot-scope="scope">
            {{ scope.row.topLevel }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="cancelSetTop($event, scope.row)" :actionid="getId('置顶商品管理', '取消置顶')" v-if="has('置顶商品管理', '取消置顶')">
              取消置顶
            </el-button>
            <el-button type="text" @click="editSetTop($event, scope.row)" :actionid="getId('置顶商品管理', '编辑')" v-if="has('置顶商品管理', '编辑')">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="" :visible.sync="previewImgVisible" width="50%">
      <img :src="previewUrl" style="width: 100%; padding:20px;"/>
    </el-dialog>

  </div>

</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';

.m-goods-preview {
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
  color: #FF0000;
}
</style>

<style rel="stylesheet/scss" lang="scss">
.froma-block .el-form-item {
  margin-right: 40px;
  margin-top: 20px;
  .el-select {
    .el-input__inner {
      width: 185px;
    }
  }
}
</style>
