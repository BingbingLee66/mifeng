<template>
  <div class="app-container">
    <table class="table-box" border="1" cellspacing="0">
      <th class="table-b-th">
        <div style="text-align:center;">微信手续费设置</div>
      </th>
      <tr>
        <td>
          <el-row style="margin-top: 20px;">
            <el-form ref="form1" :model="formObj1" :rules="rules1" label-position="left" label-width="auto">
              <el-col :offset="4" :span="12">
                <el-form-item label="微信手续费：" prop="wechatFeeRatio">
                  <div class="discount-input">
                    <el-input-number style="width:92%" v-model="formObj1.wechatFeeRatio" :min="0" :max="1" :controls="false" :precision="2"></el-input-number>
                    <div class="input-prepend">%</div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button type="primary" v-dbClick @click="update1($event)">修改</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </td>
      </tr>
    </table>
    <table class="table-box" border="1" cellspacing="0">
      <th class="table-b-th">
        <div style="text-align:center;">平台服务费设置</div>
      </th>
      <tr>
        <td>
          <el-row style="margin-top: 20px;">
            <el-form ref="form2" :model="formObj2" :rules="rules2" label-position="left" label-width="auto">
              <el-col :offset="4" :span="12">
                <el-form-item label="商品服务费：" prop="mallFeeRatio">
                  <div class="discount-input">
                    <el-input-number style="width:92%" v-model="formObj2.mallFeeRatio" :min="0" :max="99" :controls="false" :precision="2"></el-input-number>
                    <div class="input-prepend">%</div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button type="primary" v-dbClick @click="update2($event)">修改</el-button>
                </el-form-item>
              </el-col>
            </el-form> 
          </el-row>
          <el-row style="margin-top: -20px;">
            <el-form ref="form3" :model="formObj3" :rules="rules3" label-position="left" label-width="auto">
              <el-col :offset="4" :span="12">
                <el-form-item label="会费服务费：" prop="memberFeeRatio">
                   <div class="discount-input">
                    <el-input-number style="width:92%"  v-model="formObj3.memberFeeRatio" :min="0" :max="100" :controls="false" :precision="2"></el-input-number>
                    <div class="input-prepend">%</div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item >
                  <el-button type="primary" v-dbClick @click="update3($event)">修改</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </td>
      </tr>
    </table>
  </div>
</template>

<script src="./setCharge.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
/deep/.discount-input {
  display: flex;

  .el-input__inner {
    border-radius: 4px 0 0 4px !important;
  }
}
.input-prepend {
  height: 40px;
  background-color: #F5F7FA;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding: 0 20px;
  white-space: nowrap;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0;
}
</style>
<style>
.table-box {
  width: 92%;
  margin: 20px 3%;
  border: 1px solid #ccc;
}
.table-box td {
  border: 0px;
}
.table-b-th {
  height: 60px;
  /*width: 100%;*/
  vertical-align: middle;
  background-color: #f4f4f4;
  border: 0px;
  border-bottom: 1px solid #ccc;
  /*padding-left: 30px;*/
}
</style>
