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
          <td class="cell-2">{{ deliveryConfigs['包邮'] }}</td>
        </tr>
        <tr>
          <td class="cell-1">发货时间</td>
          <td class="cell-2">{{ deliveryConfigs['发货时间'] }}</td>
        </tr>
        <tr>
          <td class="cell-1">发货说明</td>
          <td class="cell-2">{{ deliveryConfigs['发货说明'] }}</td>
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
          <td class="cell-2">{{ serviceConfigs['商会企业供货'] }}</td>
        </tr>
        <tr>
          <td class="cell-1">品质保证</td>
          <td class="cell-2">{{ serviceConfigs['品质保证'] }}</td>
        </tr>
        <tr>
          <td class="cell-1">坏了包赔</td>
          <td class="cell-2">{{ serviceConfigs['坏了包赔'] }}</td>
        </tr>
      </table>
    </div>
    <el-dialog title="发货说明" :visible.sync="showDeliveryConfig" width="50%">
      <el-form label-position="right" label-width="110px" :model="deliveryConfig" ref="form1" :rules="rules1">
        <el-form-item label="包邮：" prop="deliveryConfig1">
          <el-input v-model="deliveryConfig.deliveryConfig1"></el-input>
        </el-form-item>
        <el-form-item label="发货时间：" prop="deliveryConfig2">
          <el-input v-model="deliveryConfig.deliveryConfig2"></el-input>
        </el-form-item>
        <el-form-item label="发货说明：" prop="deliveryConfig3">
          <el-input resize="none" type="textarea" v-model="deliveryConfig.deliveryConfig3"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateDeliveryConfig('form1')">提交</el-button>
          <el-button @click="showDeliveryConfig=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="服务保障" :visible.sync="showServiceConfig" width="50%">
      <el-form label-position="right" label-width="120px" ref="form2" :rules="rules2" :model="serviceConfig">
        <el-form-item label="商会企业供货：" prop="serviceConfig1">
          <el-input v-model="serviceConfig.serviceConfig1"></el-input>
        </el-form-item>
        <el-form-item label="品质保证：" prop="serviceConfig2">
          <el-input v-model="serviceConfig.serviceConfig2"></el-input>
        </el-form-item>
        <el-form-item label="坏了包赔：" prop="serviceConfig3">
          <el-input resize="none" type="textarea" v-model="serviceConfig.serviceConfig3"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateServiceConfig('form2')">提交</el-button>
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
