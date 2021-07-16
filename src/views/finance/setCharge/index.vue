<template>
  <div class="app-container">
    <table class="table-box" border="1" cellspacing="0">
      <th class="table-b-th">
        <div style="text-align:center;">微信手续费设置</div>
      </th>
      <tr>
        <td align="center">
          <el-row style="margin-top: 20px;">
            <el-form ref="form1" :model="formObj1" :rules="rules1" label-position="left" label-width="auto">
              <el-col :offset="4" :span="12">
                <el-form-item label="微信手续费：" prop="wechatFeeRatio">
                  <el-input v-model="formObj1.wechatFeeRatio" maxlength="60" placeholder="请输入微信手续费">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="">
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
                <el-form-item label="商城服务费：" prop="mallFeeRatio">
                  <el-input v-model="formObj2.mallFeeRatio" maxlength="60" placeholder="请输入商城服务费">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="">
                  <el-button type="primary" v-dbClick @click="update2($event)">修改</el-button>
                </el-form-item>
              </el-col>
            </el-form> 
          </el-row>
          <el-row style="margin-top: -20px;">
            <el-form ref="form3" :model="formObj3" :rules="rules3" label-position="left" label-width="auto">
              <el-col :offset="4" :span="12">
                <el-form-item label="会费服务费：" prop="memberFeeRatio">
                  <el-input v-model="formObj3.memberFeeRatio" maxlength="60" placeholder="请输入会费服务费">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="">
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
