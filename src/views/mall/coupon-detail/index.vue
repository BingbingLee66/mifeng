<template>
  <div class="app-container">
    <div class="coupon-detail-container">
      <div class="coupon-detail-wrap">
        <div class="coupon-detail-title">优惠券类型</div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">优惠券类型：</div>
          <div class="coupon-detail-content">现金券</div>
        </div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">适用条件：</div>
          <div class="coupon-detail-content">全场劵 任何商品都可以使用</div>
          <div class="coupon-detail-content">
            <div>商品劵 只有指定商品，才可以使用</div>
            <div>已选50款 <span class="blue-label" @click="showCouponList">点击查看</span></div>
          </div>
        </div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable none-before">是否会放进大礼包：</div>
          <div class="coupon-detail-content">不会放进大礼包</div>
        </div>
      </div>
      <div class="coupon-detail-wrap">
        <div class="coupon-detail-title">优惠券信息</div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">优惠券名称：</div>
          <div class="coupon-detail-content">10元福利券</div>
        </div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">面值金额：</div>
          <div class="coupon-detail-content">10元</div>
        </div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">满减限额：</div>
          <div class="coupon-detail-content">无门槛使用</div>
        </div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">发行量：</div>
          <div class="coupon-detail-content">1000张</div>
        </div>
      </div>
      <div class="coupon-detail-wrap">
        <div class="coupon-detail-title">获取规则</div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable"> 每人可获得：</div>
          <div class="coupon-detail-content">最多获得1张</div>
        </div>
      </div>
      <div class="coupon-detail-wrap" style="border-bottom: none">
        <div class="coupon-detail-title">使用规则</div>
        <div class="coupon-detail-item">
          <div class="coupon-detail-lable">有效期：</div>
          <div class="coupon-detail-content">发放后立即生效，有效期3天</div>
        </div>
      </div>
    </div>

    <div class="table-dialog">
      <el-dialog title="可用劵商品" :visible.sync="showCouponListDialog" width="80%">
        <el-form ref="query" label-position="right" size="small" :inline="true" :model="query">
          <el-form-item label-width="80px" label="商品来源">
            <el-select v-model="query.ckey" placeholder="请选择商品来源" clearable>
              <el-option v-for="chamber in chamberOptions" :key="chamber.ckey" :label="chamber.name" :value="chamber.ckey"/>
            </el-select>
          </el-form-item>
          <el-form-item label-width="80px" label="商品ID">
            <el-input v-model="query.goodsId" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label-width="80px" label="商品名称">
            <el-input v-model="query.goodsName" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label-width="80px" label="商品状态">
            <el-select v-model="query.status" placeholder="请选择状态">
              <el-option label="所有" :value="-1"/>
              <el-option label="在售中" :value="1"/>
              <el-option label="已下架" :value="6"/>
              <el-option label="商会下架" :value="2"/>
              <el-option label="已售罄" :value="5"/>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="getCouponList">查询
            </el-button>
          </el-form-item>
        </el-form>
        <div class="table-block">
          <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
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
                <div>【立减优惠】{{scope.row.discount}}</div>
              </template>
            </el-table-column>
            <el-table-column label="商品库存" width="100px">
              <template slot-scope="scope">
                {{ scope.row.sumStock }}
              </template>
            </el-table-column>
            <el-table-column label="销量" width="130px">
              <template slot-scope="scope">
                <div>【真实】 {{ scope.row.salesVolume }}</div>
                <div>【虚拟】 {{ scope.row.virtualSalesVolume  }}</div>
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
<!--           <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-size="allPage.pageSize" :total="allPage.allTotal" :current-page.sync="allPage.currentpage" :style="{'padding-top': '15px'}" @size-change="handleAllSizeChange" @current-change="handleAllCurrentChange" />-->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script src="./couponDetail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

.coupon-detail-container {
  width: 800px;
  border: 1px solid rgba(215, 215, 215, 1);

  .coupon-detail-wrap {
    padding: 30px 20px 0;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
  }

  .coupon-detail-title {
    font-size: 18px;
    color: #333333;
    font-weight: bolder;
  }

  .coupon-detail-item {
    display: flex;
    align-items: center;
    margin: 30px 0;
    color: #333333;
    font-size: 14px;

    .coupon-detail-lable {
      width: 180px;
      text-align: right;
      margin-right: 10px;
    }

    .coupon-detail-lable:before {
      display: inline-block;
      content: '*';
      color: #ff3333;
      margin-right: 5px;
    }

    .none-before::before {
      display: none;
    }
  }
}
</style>
