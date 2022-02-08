<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="100px" size="mini" :inline="true" label-position="right" :model="query">
        <el-form-item label="下单时间">
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
        <br />
        <el-form-item label="订单号">
          <el-input v-model.trim="query.orderSn" placeholder="请输入订单号"/>
        </el-form-item>
        <el-form-item label="微信订单号">
          <el-input v-model="query.wechatOrderNum" placeholder="请输入微信订单号"/>
        </el-form-item>
        <el-form-item label="供货商家">
          <!-- <el-select v-model="query.supplierId" placeholder="请选择供货商家" clearable>
            <el-option v-for="(item, index) in supplierOptions" :label="item.supplierName" :value="item.id" :key="index"></el-option>
          </el-select> -->
          <el-input v-model="query.supplierName" placeholder="请输入供货商家"/>
        </el-form-item>
        <!--           <el-col :span="4" style="margin-left:10px;">
                    <el-form-item label="商品ID：">
                      <el-input v-model="query.goodId" type="number" placeholder="请输入商品ID"/>
                    </el-form-item>
                  </el-col> -->
        <el-form-item label="商品名称">
          <el-input v-model.trim="query.goodName" placeholder="请输入商品名称"/>
        </el-form-item>
        <br/>
        <el-form-item label="收货人姓名">
          <el-input v-model.trim="query.consignee" placeholder="请输入收货人姓名"/>
        </el-form-item>
        <el-form-item label="收货人手机号">
          <el-input v-model.trim="query.consigneeMobile" placeholder="请输入收货人手机号"/>
        </el-form-item>
        <el-form-item label="订单状态">
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
        <el-form-item label="生成结算单" v-if="query.status == 5 || query.status == 6">
          <el-select v-model="query.settled" placeholder="请选择">
            <el-option label="所有" :value="-1"></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品结算状态" v-if="query.settled == 1 && (query.status == 5 || query.status == 6)">
          <el-select v-model="query.settlementStatus" placeholder="请选择">
            <el-option label="所有" :value="-1"></el-option>
            <el-option label="待商务确认" :value="0"></el-option>
            <el-option label="待财务付款" :value="1"></el-option>
            <el-option label="财务已付款" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <div style="margin-left:100px">
            <el-form-item label="">
            <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询
            </el-button>
            <el-button type="primary" @click="reset($event)">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <!--  <el-button type="primary" size="small" :actionid="getId('', '发货')" v-if="has('', '发货')" @click.native="batchSendOut($event)">发货</el-button>  -->
          <el-button type="primary" size="small" :actionid="getId('', '导表')" v-if="has('', '导表')" @click.native="exportExcel($event)">
            导表
          </el-button>
          <el-button type="danger" size="small" @click="openMulDialog"> 批量发货</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table size="mini" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="50px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
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
      <el-table-column label="商品名称" width="250px">
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
      <el-table-column label="收货信息" width="250px">
        <template slot-scope="scope">
          <div>{{ scope.row.consignee }}</div>
          <div>{{ scope.row.mobile }}</div>
          <div>{{ scope.row.consigneeAddress }}</div>
        </template>
      </el-table-column>
      <el-table-column label="供货商家" width="250px">
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
      <el-table-column label="操作"  fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">
            详情
          </el-button>
          <el-button type="text" @click="openSendOutDialog($event, scope.row)" :actionid="getId('', '发货')" v-if="has('', '发货')" :disabled="scope.row.status != 2">
            发货
          </el-button>
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

    <el-dialog title="发货" :visible.sync="showSendOutDialog" width="25%">
      <el-form ref="shipping" label-position="right" :model="shipping" :rules="shippingRules">
        <el-form-item label-width="110px" label="物流公司：" prop="shippingCompany">
          <el-col :span="20">
            <el-select v-model="shipping.shippingCompany" placeholder="请选择">
              <el-option label="顺丰速运" :value="'顺丰速运'"></el-option>
              <el-option label="京东快递" :value="'京东快递'"></el-option>
              <el-option label="EMS" :value="'EMS'"></el-option>
              <el-option label="申通快递" :value="'申通快递'"></el-option>
              <el-option label="圆通速递" :value="'圆通速递'"></el-option>
              <el-option label="中通快递" :value="'中通快递'"></el-option>
              <el-option label="韵达速递" :value="'韵达速递'"></el-option>
              <el-option label="天天快递" :value="'天天快递'"></el-option>
              <el-option label="百世快递" :value="'百世快递'"></el-option>
              <el-option label="宅急送" :value="'宅急送'"></el-option>
              <el-option label="其他" :value="'其他'"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label-width="110px" label="物流单号：" prop="shippingSn">
          <el-col :span="20">
            <el-input v-model.trim="shipping.shippingSn" placeholder="请输入"/>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :offset="6" :span="20">
            <el-button type="primary" @click="sendOut('shipping')">发布</el-button>
            <el-button @click="showSendOutDialog = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="批量发货" :visible.sync="mulDialog" width="450px">
      <div>第1步：下载批量发货模板 <span class="text-btn-style" @click="downloadExcel">点击下载</span></div>
      <div style="margin-top: 20px;display: flex;">
        <div style="height: 32px;line-height: 32px"> 第2步：</div>
        <el-upload
          class="upload-demo"
          action="/"
          :show-file-list="true"
          :before-upload="beforeExcelUpload"
          :http-request="uploadExcel"
          :multiple="false"
          :file-list="fileList"
          :on-change="handleChangeUpload">
          <el-button size="small" type="success">{{ fileList.length === 1 ? '重新上传' : '上传发货订单' }}</el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="mulDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitUploadExcel" :loading="submitLoading">{{
            submitLoading ? '上传中' : '确 定'
          }}</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="tipDialog" width="450px">
      <p>发货信息已上传！</p>
      <p>成功 {{ successRows }} 条，失败 <span style="color: #ff0000;"> {{ totalRows - successRows }} </span> 条</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handletipDialog">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./order.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style lang="scss">
.upload-demo {
  display: flex;
  align-items: center;

  .el-upload-list__item:first-child {
    margin-top: 0;
    margin-left: 10px;
  }

  .el-upload-list--text {
    height: 25px;
    overflow: hidden;
  }

  .el-upload-list__item {
    pointer-events: none;
    transition: none;
    -webkit-transition: none;
  }
}
</style>
