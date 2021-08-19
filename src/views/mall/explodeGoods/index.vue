<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部商品" name="first"></el-tab-pane>
      <el-tab-pane label="正在抢购" name="second"></el-tab-pane>
      <el-tab-pane label="即将开售" name="third"></el-tab-pane>
    </el-tabs>
    <div class="from-block" style="margin:20px 0">
      <el-form ref="query" label-position="left" :inline="true" :model="query">
        <el-form-item label-width="100px" label="商品名称：">
          <el-input v-model="query.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label-width="100px" label="商品状态：">
          <el-select v-model="query.status" placeholder="请选择状态">
            <el-option label="所有" :value="-1" />
            <el-option label="在售中" :value="1" />
            <el-option label="已下架" :value="6" />
            <el-option label="商会下架" :value="2" />
            <el-option label="已售罄" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="商品来源：">
          <el-select v-model="query.ckey" placeholder="请选择商品来源" clearable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.value" :label="chamber.label" :value="chamber.value" />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="创建时间：">
          <el-date-picker v-model="query.date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:20px;">
      <el-button type="primary" size="small">移除</el-button>
      <el-button type="danger" size="small" @click="showAddDialog=true">添加爆品</el-button>
    </div>
    <div class="block-table">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px" />
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
            <div>【立减优惠】50</div>
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
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="开售时间" width="200px">
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
            <el-button type="text" @click="detail($event, scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog title="" :visible.sync="showAddDialog" width="80%">
      <el-form ref="query" label-position="left" :inline="true" :model="query">
        <el-form-item label-width="100px" label="商品来源：">
          <el-select v-model="query.ckey" placeholder="请选择商品来源" clearable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.value" :label="chamber.label" :value="chamber.value" />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="商品ID：">
          <el-input v-model="query.goodsName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label-width="100px" label="商品名称：">
          <el-input v-model="query.goodsName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label-width="100px" label="商品状态：">
          <el-select v-model="query.status" placeholder="请选择状态">
            <el-option label="所有" :value="-1" />
            <el-option label="在售中" :value="1" />
            <el-option label="已下架" :value="6" />
            <el-option label="商会下架" :value="2" />
            <el-option label="已售罄" :value="5" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px" />
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
            <div>【立减优惠】50</div>
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
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="开售时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="来源" width="200px">
          <template slot-scope="scope">
            <!-- {{chamberName(scope.row.chamberCkey)}} -->
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock > 0">在售中</div>
            <div v-if="scope.row.isOnSale == 2 || scope.row.isOnSale == 4">商会下架</div>
            <div v-if="scope.row.isOnSale == 5">已下架</div>
            <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock == 0">已售罄</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      <div style="margin:20px 0;text-align:center;">
        <el-button type="primary">添加</el-button>
        <el-button @click="showAddDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="权重" :visible.sync="showWeightDialog" width="30%">
      <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="权重"
          prop="weight"
          :rules="[
            { required: true, message: '权重请控制在0-999，权重为0不在前台展示'},
            { type: 'number', message: '权重请控制在0-999，权重为0不在前台展示'}
          ]">
          <el-input type="age" v-model.number="numberValidateForm.weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
          <el-button @click="showWeightDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./explodeGoods.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style lang="scss">
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
</style>
