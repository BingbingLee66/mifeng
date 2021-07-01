<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query">
        <el-row>
          <el-col :span="4">
            <el-form-item label="商品名称：">
              <el-input v-model="query.goodsName" placeholder="请输入商品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left:10px;">
            <el-form-item :span="12" label="商品状态：">
              <el-select v-model="query.status" placeholder="请选择状态">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="在售中" :value="1"></el-option>
                <el-option label="已下架" :value="6"></el-option>
                <el-option label="商会下架" :value="2"></el-option>
                <el-option label="已售罄" :value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left:10px;">
            <el-form-item :span="12" label="商品来源：">
              <el-select v-model="query.ckey" placeholder="请选择商品来源" clearable>
                <el-option v-for="chamber in chamberOptions" :label="chamber.label" :value="chamber.value" :key="chamber.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:10px;">
            <el-form-item label="添加时间：">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="query.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" :actionid="getId('', '上架')" v-if="has('', '上架')" @click.native="batchUpdateStatus($event, 1)">上架</el-button>
          <el-button type="primary" size="small" :actionid="getId('', '下架')" v-if="has('', '下架')" @click.native="batchUpdateStatus($event, 2)">下架</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="商品ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="商品图片" width="120px">
        <template slot-scope="scope">
          <img class="goods-preview" :src="scope.row.descript" @click="openPreviewModal(scope.row.descript)">
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="150px">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="单买价(元)" width="100px">
        <template slot-scope="scope">
          {{scope.row.singlePriceMerge}}
        </template>
      </el-table-column>
      <el-table-column label="拼单价(元)" width="100px">
        <template slot-scope="scope">
          {{scope.row.fightPriceMerge}}
        </template>
      </el-table-column>
      <el-table-column label="供货价(元)" width="100px">
        <template slot-scope="scope">
          {{scope.row.supplyPriceMerge}}
        </template>
      </el-table-column>
      <el-table-column label="库存" width="60px">
        <template slot-scope="scope">
          {{scope.row.sumStock}}
        </template>
      </el-table-column>
      <el-table-column label="累计销量" width="80px">
        <template slot-scope="scope">
          {{scope.row.salesVolume}}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="100px">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="来源">
        <template slot-scope="scope">
          <!-- {{chamberName(scope.row.chamberCkey)}} -->
          {{scope.row.chamberName}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px">
        <template slot-scope="scope">
          <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock > 0">在售中</div>
          <div v-if="scope.row.isOnSale == 2 || scope.row.isOnSale == 4">商会下架</div>
          <div v-if="scope.row.isOnSale == 5">已下架</div>
          <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock == 0">已售罄</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">详情</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row.id, 1)" :actionid="getId('', '上架')" v-if="has('', '上架') && scope.row.isOnSale == 2 || scope.row.isOnSale == 4" :disabled="scope.row.isOnSale == 2 || scope.row.isOnSale == 4">上架</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row.id, 1)" :actionid="getId('', '上架')" v-if="has('', '上架') && scope.row.isOnSale == 5">上架</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row.id, 2)" :actionid="getId('', '下架')" v-if="has('', '下架') && (scope.row.isOnSale == 1 || scope.row.isOnSale == 3)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :style="{'padding-top': '15px'}">
    </el-pagination>
    <el-dialog
      title=""
      :visible.sync="previewImgVisible"
      width="50%">
      <img :src="previewUrl" style="width: 100%; padding:20px;"/>
    </el-dialog>
  </div>
</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.goods-preview {
  width: 100%;
  height: auto;
  border: 1px solid #999;
  cursor: pointer;
}
</style>
