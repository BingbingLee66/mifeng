<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" size="mini" label-position="right" :model="query" label-width="110px">
        <el-row style="margin:0">
          <el-col :span="4">
            <el-form-item label-width="110px" label="订单号">
              <el-input v-model.trim="query.orderSn" placeholder="请输入订单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left:10px;">
            <el-form-item label-width="110px" label="微信订单号">
              <el-input v-model.trim="query.wechatOrderNum" placeholder="请输入微信订单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left:10px;">
            <el-form-item label-width="110px" label="订单所属商会">
              <el-select v-model="query.ckey" placeholder="请选择商会" clearable>
                <el-option v-for="(item, index) in chamberOptions" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left:10px;">
            <el-form-item label-width="110px" label="供货商家">
              <el-input v-model.trim="query.supplierName" placeholder="请输入供货商家"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left:10px;">
            <el-form-item label-width="110px" label="商品名称">
              <el-input v-model.trim="query.goodName" placeholder="请输入商品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="110px" label="推广渠道">
              <el-select v-model="query.channelId" placeholder="请选择状态">
                <el-option v-for="item in channelOptions" :key="item.id" :label="item.channelName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="110px" label="用户属性">
              <el-select v-model="query.isFirst" placeholder="请选择状态">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="首单用户" :value="1"></el-option>
                <el-option label="复购用户" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-right:10px;">
            <el-form-item label-width="110px" label="订单状态">
              <el-select v-model="query.status" placeholder="请选择状态" @change="statusSelectChange">
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
          <el-col :span="4" style="margin-right:10px;">
            <el-form-item label="生成结算单" v-if="query.status == 5 || query.status == 6">
              <el-select v-model="query.settled" placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
           </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-right:10px;">
            <el-form-item label="商品结算状态" v-if="query.settled == 1 && (query.status == 5 || query.status == 6)">
              <el-select v-model="query.settlementStatus" placeholder="请选择">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="待商务确认" :value="0"></el-option>
                <el-option label="待财务打款" :value="1"></el-option>
                <el-option label="财务已付款" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label-width="110px" label="收货人姓名">
              <el-input v-model.trim="query.consignee" placeholder="请输入收货人姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left:10px;margin-right:10px;">
            <el-form-item label-width="110px" label="收货人手机号">
              <el-input v-model.trim="query.consigneeMobile" placeholder="请输入收货人手机号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="110px" label="下单时间" style="float: left;">
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
        </el-row>
          <el-col :span="20">
            <el-form-item label=" " >
              <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询
              </el-button>
              <el-button type="primary" @click="reset($event)">重置</el-button>
            </el-form-item>
          </el-col>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <!-- <el-button type="primary" size="small" :actionid="getId('', '发货')" v-if="has('', '发货')" @click.native="batchSendOut($event)">发货</el-button>
          <el-button type="primary" size="small" :actionid="getId('', '确认收货')" v-if="has('', '确认收货')" @click.native="confirm($event)">确认收货</el-button> -->
          <el-button type="primary" size="small" :actionid="getId('', '导表')" v-if="has('', '导表')" @click.native="exportExcel($event)">
            导表
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table size="mini" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="订单号" width="100px">
        <template slot-scope="scope">
          {{ scope.row.orderSn }}
        </template>
      </el-table-column>
      <el-table-column label="微信订单号" width="100px">
        <template slot-scope="scope">
          {{ scope.row.wechatOrderNum ? scope.row.wechatOrderNum : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="90px">
        <template slot-scope="scope">
          {{ scope.row.createTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="150px">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="商品规格" width="80px">
        <template slot-scope="scope">
          {{ !scope.row.codeName ? '无' : scope.row.codeName }}
        </template>
      </el-table-column>
      <el-table-column label="单价(元)" width="80px">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="下单数" width="80px">
        <template slot-scope="scope">
          {{ scope.row.count }}
        </template>
      </el-table-column>
      <el-table-column label="实付金额(元)" width="100px">
        <template slot-scope="scope">
          {{ scope.row.realPrice }}
        </template>
      </el-table-column>
      <el-table-column label="推广渠道" width="100">
        <template slot-scope='scope'>{{scope.row.channelName || '--'}}</template>
      </el-table-column>
      <el-table-column label="用户属性" width="100">
       <template slot-scope='scope'>
        <div v-if="scope.row.isFirst == 1">首单用户</div>
        <div v-else-if="scope.row.isFirst == 2">复购用户</div>
        <div v-else>--</div>
       </template>
      </el-table-column>
      <el-table-column label="收货信息" width="250px">
        <template slot-scope="scope">
          <div>{{ scope.row.consignee }}</div>
          <div>{{ scope.row.mobile }}</div>
          <div>{{ scope.row.consigneeAddress }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单所属商会" width="200px">
        <template slot-scope="scope">
          {{ chamberName(scope.row.ckey) }}
        </template>
      </el-table-column>
      <el-table-column label="供货商家" width="150px">
        <template slot-scope="scope">
          {{ scope.row.supplierName }}
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
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">
            详情
          </el-button>
          <!-- <el-button type="text" @click="sendOut($event, scope.row)" :actionid="getId('', '发货')" v-if="has('', '发货')">发货</el-button>
          <el-button type="text" @click="confirm($event, scope.row)" :actionid="getId('', '确认收货')" v-if="has('', '确认收货')">确认收货</el-button> -->
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

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

