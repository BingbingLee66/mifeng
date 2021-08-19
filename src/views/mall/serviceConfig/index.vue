<template>
  <div class="app-container">
    <div class="table-title">
      <span>发货说明</span>
      <el-button size="small" type="primary" @click="showDeliveryConfig=true">编辑</el-button>
    </div>
    <div class="table-content">
      <table>
        <tr>
          <td class="cell-1">包邮</td>
          <td class="cell-2">{{deliveryConfig['包邮']}}</td>
        </tr>
        <tr>
          <td class="cell-1">发货时间</td>
          <td class="cell-2">{{deliveryConfig['发货时间']}}</td>
        </tr>
        <tr>
          <td class="cell-1">发货说明</td>
          <td class="cell-2">{{deliveryConfig['发货说明']}}</td>
        </tr>
      </table>
    </div>
    <div class="table-title">
      <span>服务保障</span>
      <el-button size="small" type="primary" @click="showServiceConfig=true">编辑</el-button>
    </div>
    <div class="table-content">
      <table>
        <tr>
          <td class="cell-1">商会企业供货</td>
          <td class="cell-2">{{serviceConfig['商会企业供货']}}</td>
        </tr>
        <tr>
          <td class="cell-1">品质保证</td>
          <td class="cell-2">{{serviceConfig['品质保证']}}</td>
        </tr>
        <tr>
          <td class="cell-1">坏了包赔</td>
          <td class="cell-2">{{serviceConfig['坏了包赔']}}</td>
        </tr>
      </table>
    </div>
    <el-dialog title="发货说明" :visible.sync="showDeliveryConfig" width="50%">
      <el-form label-position="right" label-width="110px" :model="deliveryConfig">
        <el-form-item :required="true" label="包邮：">
          <el-input v-model="deliveryConfig['包邮']"></el-input>
        </el-form-item>
        <el-form-item :required="true" label="发货时间：">
          <el-input v-model="deliveryConfig['发货时间']"></el-input>
        </el-form-item>
        <el-form-item :required="true" label="发货说明：">
          <el-input resize="none" type="textarea" v-model="deliveryConfig['发货说明']"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateDeliveryConfig">提交</el-button>
          <el-button @click="showDeliveryConfig=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="服务保障" :visible.sync="showServiceConfig" width="50%">
      <el-form label-position="right" label-width="120px" :model="serviceConfig">
        <el-form-item :required="true" label="商会企业供货：">
          <el-input v-model="serviceConfig['商会企业供货']"></el-input>
        </el-form-item>
        <el-form-item :required="true" label="品质保证：">
          <el-input v-model="serviceConfig['品质保证']"></el-input>
        </el-form-item>
        <el-form-item :required="true" label="坏了包赔：">
          <el-input resize="none" type="textarea" v-model="serviceConfig['坏了包赔']"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateServiceConfig">提交</el-button>
          <el-button @click="showServiceConfig=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./serviceConfig.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
.table-title {
  width: 1000px;
  display: flex;
  justify-content: space-between;
  color: #333333;
  font-family: '微软雅黑';
  font-size: 18px;
  font-weight: 700;
  margin: 20px 0 10px;
}
.table-content {
  margin-bottom: 40px;
  table {
    border-collapse: collapse;
  }
  table > tr > td {
    padding: 20px;
    border: 1px solid rgba(215, 215, 215, 1);
  }
  .cell-1 {
    width: 200px;
    background: #f2f2f2;
  }
  .cell-2 {
    width: 800px;
  }
}
</style>
