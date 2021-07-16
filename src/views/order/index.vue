<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" size="mini" label-position="right" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item label-width="110px" label="订单号：">
              <el-input v-model.trim="query.orderSn" placeholder="请输入订单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-left: 10px;">
            <el-form-item label-width="110px" label="供货商家：">
              <!-- <el-select v-model="query.supplierId" placeholder="请选择供货商家" clearable>
                <el-option v-for="(item, index) in supplierOptions" :label="item.supplierName" :value="item.id" :key="index"></el-option>
              </el-select> -->
              <el-input v-model="query.supplierName" placeholder="请输入供货商家"/>
            </el-form-item>
          </el-col>
<!--           <el-col :span="4" style="margin-left:10px;">
            <el-form-item label="商品ID：">
              <el-input v-model="query.goodId" type="number" placeholder="请输入商品ID"/>
            </el-form-item>
          </el-col> -->
          <el-col :span="5">
            <el-form-item label-width="110px" label="商品名称：">
              <el-input v-model.trim="query.goodName" placeholder="请输入商品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="110px" label="订单状态：">
              <el-select v-model="query.status" placeholder="请选择状态">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="待发货" :value="2"></el-option>
                <el-option label="已发货" :value="5"></el-option>
                <el-option label="已完成" :value="6"></el-option>
                <el-option label="待成团" :value="4"></el-option>
                <el-option label="待支付" :value="1"></el-option>
                <el-option label="取消订单" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label-width="110px" label="收货人姓名：">
              <el-input v-model.trim="query.consignee" placeholder="请输入收货人姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-left: 10px;">
            <el-form-item label-width="110px" label="收货人手机号：">
              <el-input v-model.trim="query.consigneeMobile" placeholder="请输入收货人手机号"/>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label-width="110px" label="下单时间：" style="float: left;">
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
            <el-form-item label=" " style="float: left;margin-left: 10px;">
              <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询</el-button>
              <el-button type="primary" @click="reset($event)">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" :actionid="getId('', '发货')" v-if="has('', '发货')" @click.native="batchSendOut($event)">发货</el-button>
          <el-button type="primary" size="small" :actionid="getId('', '导表')" v-if="has('', '导表')" @click.native="exportExcel($event)">导表</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table size="mini" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="订单号" width="70px">
        <template slot-scope="scope">
          {{scope.row.orderSn}}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="90px">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="商品规格" width="80px">
        <template slot-scope="scope">
          {{!scope.row.codeName ? '无' : scope.row.codeName}}
        </template>
      </el-table-column>
      <el-table-column label="单价(元)" width="80px">
        <template slot-scope="scope">
          {{scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column label="下单数" width="80px">
        <template slot-scope="scope">
          {{scope.row.count}}
        </template>
      </el-table-column>
      <el-table-column label="实付金额(元)" width="100px">
        <template slot-scope="scope">
          {{scope.row.realPrice}}
        </template>
      </el-table-column>
      <el-table-column label="收件人" width="80px">
        <template slot-scope="scope">
          {{scope.row.consignee}}
        </template>
      </el-table-column>
      <el-table-column label="收件人手机号" width="100px">
        <template slot-scope="scope">
          {{scope.row.mobile}}
        </template>
      </el-table-column>
      <el-table-column label="收货地址">
        <template slot-scope="scope">
          {{scope.row.consigneeAddress}}
        </template>
      </el-table-column>
      <el-table-column label="供货商家">
        <template slot-scope="scope">
          {{scope.row.supplierName}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 2">待发货</div>
          <div v-if="scope.row.status == 5">已发货</div>
          <div v-if="scope.row.status == 6">已完成</div>
          <div v-if="scope.row.status == 4">待成团</div>
          <div v-if="scope.row.status == 1">待支付</div>
          <div v-if="scope.row.status == 0">取消订单</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">详情</el-button>
           <el-button type="text" @click="sendOut($event, scope.row)" :actionid="getId('', '发货')" v-if="has('', '发货')" :disabled="scope.row.status != 2">发货</el-button>
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
  </div>
</template>

<script src="./order.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
