<template>
  <div class="app-container">
    <div class="block">
      <div style="height:20px;margin-bottom: 10px;">
        <span style="font-weight: 600; font-size: 18px;float: left;">渠道推广数据</span>
        <span style="float: right;" class="text-btn-style" @click="showMeaning=true">数据定义</span>
      </div>
      <div class="data-card">
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.channelNums }}</div>
            <div class="card-key">累计推广渠道</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.goodsNums }}</div>
            <div class="card-key">累计推广商品数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value" style="color: #FF0000;">{{ pfStatistics.userNums }}</div>
            <div class="card-key">累计访问人数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.visitNums }}</div>
            <div class="card-key">累计访问次数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.payUserNums }}</div>
            <div class="card-key">累计支付人数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.payOrderNums }}</div>
            <div class="card-key">累计支付订单数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.successAmount }}</div>
            <div class="card-key">累计成交金额</div>
          </div>
        </div>
      </div>
    </div>
    <div class="block query-box">
      <div class="item">
        <span style="color: #bbb;margin-right: 20px;">时间</span>
        <el-radio-group style="margin-right: 12px;" v-model="query.days" size="mini" @change="initDatePicker">
          <el-radio-button :label="7">7天</el-radio-button>
          <el-radio-button :label="14">14天</el-radio-button>
          <el-radio-button :label="30">30天</el-radio-button>
        </el-radio-group>
        <el-date-picker
          style="margin-right: 15px;"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="query.date"
          type="daterange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="fetchData"
          size="mini">
        </el-date-picker>
      </div>
      <div class="item" style="margin-right: 25px;">
        <el-select v-model="query.id" placeholder="请选择" clearable size="mini">
        <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id"/>
      </el-select>
      </div>
      <div class="item flex-box">
        <el-select  v-model="query.relType" placeholder="请选择" :style="query.relType == -1?'margin-right:15px':''" size="mini">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="单个商品" :value="0"></el-option>
          <el-option label="商品列表" :value="-2"></el-option>
        </el-select>
        <el-select  v-model="query.relTypeChild" placeholder="请选择" v-if="query.relType == -2"  size="mini" :style="query.relTypeChild != 2?'margin-right:15px':''">
          <el-option label="全部商品列表" :value="-1"></el-option>
          <el-option label="首页-爆品必拼" :value="1"></el-option>
          <el-option label="商会优选" :value="2"></el-option>
        </el-select>
        <el-select  v-model="query.relCkey" placeholder="请选择" v-if="query.relType == -2 && query.relTypeChild == 2" size="mini" style="margin-right:15px">
          <el-option label="全部商会" :value="-1"></el-option>
          <el-option v-for="item in chamberOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          <!-- <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id"/> -->
        </el-select>
      </div>
      <div class="query-wrap item">
        <el-input
          style="margin-right: 15px;"
          size="mini"
          placeholder="商品ID"
          v-model="query.goodsId"
          type="number"
          @mousewheel.native.prevent
          @keyup.native="prevent($event)"
          v-if="query.relType == 0"
          ></el-input>
        <el-button size="mini" type="primary"  @click="fetchData($event)">查询</el-button>
      </div>
      <el-button type="primary" size="mini" style="position: absolute;right: 0;top:10px" @click="exportExcel">导表</el-button>
    </div>
    <div style="margin-bottom: 16px;color: #333333;" v-if="showGoodsDetail">
      <div v-if="goodsDetail.goodsId">
        <span style="font-weight: 600;margin-right: 20px;">【商品ID】{{ goodsDetail.goodsId }}</span>
        <span style="color: #ff0000;margin-right: 20px;">{{ goodsDetail.chamberName }}</span>
        <span>{{ goodsDetail.goodsName }}</span>
      </div>
      <div v-else style="color: #ff0000;margin-right: 20px;"> 没找到商品信息</div>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <el-table-column label="日期">
        <template slot-scope="scope">
          {{ scope.row.dayTimeStr }}
        </template>
      </el-table-column>
      <el-table-column label="推广渠道">
        <template slot-scope="scope">
          {{ scope.row.channelNums > 0 ? scope.row.channelNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="推广商品数">
        <template slot-scope="scope">
          {{ scope.row.goodsNums > 0 ? scope.row.goodsNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="访问人数/uv">
        <template slot-scope="scope">
          {{ scope.row.userNums > 0 ? scope.row.userNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="访问次数/pv">
        <template slot-scope="scope">
          {{ scope.row.visitNums > 0 ? scope.row.visitNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="提交订单人数">
        <template slot-scope="scope">
          {{ scope.row.orderUserNums > 0 ? scope.row.orderUserNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="支付人数">
        <template slot-scope="scope">
          {{ scope.row.payUserNums > 0 ? scope.row.payUserNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="提交订单数">
        <template slot-scope="scope">
          {{ scope.row.orderNums > 0 ? scope.row.orderNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="支付订单数">
        <template slot-scope="scope">
          {{ scope.row.payOrderNums > 0 ? scope.row.payOrderNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="成交金额">
        <template slot-scope="scope">
          {{ scope.row.successAmount > 0 ? scope.row.successAmount : '--' }}
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

    <el-dialog title="数据定义" :visible.sync="showMeaning" width="480px">
      <div class="meaning-wrap">
        <div class="meaning-item">
          <div class="tit">推广渠道</div>
          <div class="sub">在指定时间范围内，有访问量的商品对应的总渠道数 (需去重)。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">推广商品数</div>
          <div class="sub">在指定时间范围内，有访问量的总商品数 (需去重)。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">访问人数/uv</div>
          <div class="sub">在指定时间范围内，访问过推广商品的总人数<span style="color:#FF0000;">(需去重)。</span></div>
        </div>
        <div class="meaning-item">
          <div class="tit">访问次数/pv</div>
          <div class="sub">在指定时间范围内，访问过推广商品的总次数。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">提交订单人数</div>
          <div class="sub">在指定时间范围内，提交过订单的总人数 <span style="color:#FF0000;">(需去重)</span>。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">支付人数</div>
          <div class="sub">在指定时间范围内，成功支付订单的总人数<span style="color:#FF0000;">(需去重)</span>。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">提交订单数</div>
          <div class="sub">在指定时间范围内，提交的订单数之和 (包含未支付的)。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">支付订单数</div>
          <div class="sub">在指定时间范围内，成功支付的订单数之和。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">成交金额</div>
          <div class="sub">在指定时间范围内，成功支付且没退款的订单、对应的订单金额之和。</div>
        </div>
      </div>
      <div style="text-align: center;">
        <el-button type="primary" @click="showMeaning=false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./chamberJoinData.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

.data-card {
  width: 100%;
  height: 120px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.c-card-box {
  float: left;
  width: 14%;
  height: 100%;
  text-align: center;
  display: table;
}

.card-box-3 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}

.card-value {
  margin-bottom: 10px;
  color: #008000;
  font-weight: 600;
}

.h-cut-line {
  float: left;
  width: 1px;
  height: 100%;
  border-left: 1px solid #ccc;
}
.query-box{
  display: flex;
  flex-wrap: wrap;
  align-items:center;
  position: relative;
  width: 100%;
  .item{
    margin-bottom: 12px;
  }
  .flex-box{
    display: flex;
    align-items: center;
  }
}
</style>

<style lang="scss">
.query-wrap {
  display: flex;
  align-items: center;

  .el-input__inner {
    line-height: 1;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>

