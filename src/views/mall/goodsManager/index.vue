<template>
  <div class="app-container">
    <div class="goods-manger-block">
      <el-form ref="query" label-position="right" :inline="true" :model="query">
        <el-form-item label="商品名称">
          <el-input v-model="query.goodsName" placeholder="关键字"/>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="query.status" placeholder="请选择">
            <el-option label="所有" :value="-1"/>
            <el-option label="在售中" :value="1"/>
            <el-option label="已下架" :value="6"/>
            <el-option label="商会下架" :value="2"/>
            <el-option label="已售罄" :value="5"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品来源">
          <el-select v-model="query.ckey" placeholder="请选择" clearable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.value" :label="chamber.label" :value="chamber.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="query.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label=" ">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button v-if="has('', '上架')" type="primary" size="small" :actionid="getId('', '上架')" @click.native="batchUpdateStatus($event, 1)">
            上架
          </el-button>
          <el-button v-if="has('', '下架')" type="primary" size="small" :actionid="getId('', '下架')" @click.native="batchUpdateStatus($event, 2)">
            下架
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="block-table">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px"/>
        <el-table-column label="商品ID/名称" width="250px">
          <template slot-scope="scope">
            <div class="red-label">{{ scope.row.id }}</div>
            <div> {{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="110px">
          <template slot-scope="scope">
            <img class="goods-preview" :src="scope.row.descript" @click="openPreviewModal(scope.row.descript)">
          </template>
        </el-table-column>
        <el-table-column label="商品价格信息（元）" width="160px">
          <template slot-scope="scope">
            <div>【单买价】{{ scope.row.singlePriceMerge }}</div>
            <div>【拼单价】<span class="red-label">{{ scope.row.fightPriceMerge }}</span></div>
            <div>【供货价】{{ scope.row.supplyPriceMerge }}</div>
            <div>【立减优惠】{{ scope.row.discount }}</div>
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
        <el-table-column label="添加时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="来源" width="300px">
          <template slot-scope="scope">
            <!-- {{chamberName(scope.row.chamberCkey)}} -->
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock > 0">在售中</div>
            <div v-if="scope.row.isOnSale == 2 || scope.row.isOnSale == 4">商会下架</div>
            <div v-if="scope.row.isOnSale == 5">已下架</div>
            <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock == 0">已售罄</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="has('', '详情')" type="text" :actionid="getId('', '详情')" @click="detail($event, scope.row)">
              详情
            </el-button>
            <el-button v-if="has('', '上架') && scope.row.isOnSale == 2 || scope.row.isOnSale == 4" type="text" :actionid="getId('', '上架')" :disabled="scope.row.isOnSale == 2 || scope.row.isOnSale == 4" @click="updateStatus($event, scope.row.id, 1)">
              上架
            </el-button>
            <el-button v-if="has('', '上架') && scope.row.isOnSale == 5" type="text" :actionid="getId('', '上架')" @click="updateStatus($event, scope.row.id, 1)">
              上架
            </el-button>
            <el-button v-if="has('', '下架') && (scope.row.isOnSale == 1 || scope.row.isOnSale == 3)" type="text" :actionid="getId('', '下架')" @click="updateStatus($event, scope.row.id, 2)">
              下架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      :style="{'padding-top': '15px'}"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      title=""
      :visible.sync="previewImgVisible"
      width="50%"
    >
      <img :src="previewUrl" style="width: 100%; padding:20px;">
    </el-dialog>
  </div>
</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style lang="scss">
.goods-manger-block .el-form-item {
  margin-right: 40px;
  .el-select {
    .el-input__inner {
      width: 185px;
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
  color: #FF0000;
}
</style>
