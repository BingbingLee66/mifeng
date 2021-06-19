<template>
  <div class="app-container">
    <div class="block form-border">
      <el-form ref="form" label-position="left" label-width="100px">
        <el-row>
          <div class="goods-bar-info"><span>1</span>商品基本信息</div>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>商品名称：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{detailObj.name}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>供货商家：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{detailObj.supplierId}}
            </el-form-item>
          </el-col>
        </el-row>
        <hr size="1"/>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>商品轮播图：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <div v-for="(gal, index) in detailObj.gallery" :key="index">
                <div class="goods-pre">
                  <img :src="gal" class="goods-avatar">
                  <div class="goods-pre-btn" @click="openPreviewModal(gal)">预览</div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>商品列表图：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <div v-for="(des, index) in detailObj.descript" :key="index">
                <div class="goods-pre">
                  <img :src="des" class="goods-avatar">
                  <div class="goods-pre-btn" @click="openPreviewModal(des)">预览</div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>商品详情图：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <div v-for="(dtl, index) in detailObj.detail" :key="index">
                <div class="goods-pre">
                  <img :src="dtl" class="goods-avatar">
                  <div class="goods-pre-btn" @click="openPreviewModal(dtl)">预览</div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <hr size="1"/>
        <el-row><div class="goods-bar-info"><span>2</span>商品规格与库存</div></el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>商品规格：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <div v-if="detailObj.specType == 0">单品</div>
              <div v-if="detailObj.specType == 1">多规格</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="detailObj.specType == 0">
          <el-col :span="2">
            <div class="dy-form-label">
              <span>价格及库存：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <div class="sku-table-box">
                <el-row class="sku-table-th">
                  <el-col :span="8" class="sku-table-content">单买价（元）</el-col>
                  <el-col :span="8" class="sku-table-content">拼单价（元）</el-col>
                  <el-col :span="8" class="sku-table-content">库存数（件）</el-col>
                </el-row>
                <el-row class="sku-table-td" v-for="(sku, index) in detailObj.sku" :key="sku">
                  <el-col :span="8" class="sku-table-content sku-table-input">
                    {{sku.price}}
                  </el-col>
                  <el-col :span="8" class="sku-table-content sku-table-input">
                    {{sku.fightPrice}}
                  </el-col>
                  <el-col :span="8" class="sku-table-content sku-table-input">
                    {{sku.fightPrice}}
                  </el-col>
                </el-row>
                <el-row style="margin-left: -45px;">
                  <el-col :span="8">
                    <el-form-item label="商品市场价：" prop="marketingPrice" size="mini">
                      {{detailObj.sku[0].marketingPrice}}元
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商品供货价：" prop="supplyPrice" size="mini">
                      {{detailObj.sku[0].supplyPrice}}元
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="虚拟销量：" prop="salesVolume" size="mini">
                      {{detailObj.salesVolume}}元
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="detailObj.specType == 1">
          <el-col :span="2">
            <div class="dy-form-label">
              <span>价格及库存：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <div class="sku-table-box">
                <el-row class="sku-table-th">
                  <el-col :span="(detailObj.attr2 != null && detailObj.attr2.id != undefined) ? 3 : 6" class="sku-table-content">{{!!detailObj.attr1.attrName ? detailObj.attr1.attrName : '规格1'}}</el-col>
                  <el-col :span="3" class="sku-table-content" v-if="(detailObj.attr2 != null && detailObj.attr2.id != undefined)">{{!!detailObj.attr2.attrName ? detailObj.attr2.attrName : '规格2'}}</el-col>
                  <el-col :span="3" class="sku-table-content">单买价(元)</el-col>
                  <el-col :span="3" class="sku-table-content">拼单价(元)</el-col>
                  <el-col :span="3" class="sku-table-content">商品市场价(元)</el-col>
                  <el-col :span="3" class="sku-table-content">商品进货价(元)</el-col>
                  <el-col :span="3" class="sku-table-content">库存数(件)</el-col>
                  <el-col :span="3" class="sku-table-content">图片</el-col>
                </el-row>
                <el-row class="sku-table-td" v-for="(sku, index) in detailObj.sku">
                  <el-col :span="(detailObj.attr2 != null && detailObj.attr2.id != undefined) ? 3 : 6" class="sku-table-content sku-table-img">{{sku.codeName.split(',')[0]}}</el-col>
                  <el-col :span="3" class="sku-table-content sku-table-img" v-if="(detailObj.attr2 != null && detailObj.attr2.id != undefined)">{{sku.codeName.split(',')[1]}}</el-col>
                  <el-col :span="3" class="sku-table-content sku-table-img">
                    {{sku.price}}
                  </el-col>
                  <el-col :span="3" class="sku-table-content sku-table-img">
                    {{sku.fightPrice}}
                  </el-col>
                  <el-col :span="3" class="sku-table-content sku-table-img">
                    {{sku.marketingPrice}}
                  </el-col>
                  <el-col :span="3" class="sku-table-content sku-table-img">
                    {{sku.supplyPrice}}
                  </el-col>
                  <el-col :span="3" class="sku-table-content sku-table-img">
                    {{sku.stock}}
                  </el-col>
                  <el-col :span="3" class="sku-table-content sku-table-img">
                    <div class="sku-pre-1">
                      <div>
                        <img :src="sku.skuImgUrl" class="sku-avatar-1">
                        <div class="sku-pre-btn-1" @click="openPreviewModal(sku.skuImgUrl)">预览</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="2">
                    <el-form-item label="虚拟销量：">
                      {{detailObj.salesVolume}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <hr size="1"/>
        <el-row><div class="goods-bar-info"><span>3</span>购买设置</div></el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>限时购买：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{detailObj.limitTimeStart + '至' + detailObj.limitTimeEnd}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>单次限购：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{detailObj.limitAmount}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog
      title=""
      :visible.sync="previewImgVisible"
      width="50%">
      <img :src="previewUrl" style="width: 100%; padding:20px;"/>
    </el-dialog>
  </div>

</template>

<script src="./goodsDetail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.form-border {
  margin: 20px 50px;
  border: 1px solid #bfc5d0;
}
.goods-bar-info {
  margin: 20px 2px;
  padding-left: 25px;
  font-size: 20px;
  font-weight: 800;
  border-left: 3px solid black;
}
.goods-bar-info>span {
  font-size: 28px;
  margin-right: 10px;
}
.dy-form-label {
  width: 150px;
  cursor: default;
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #666;
  font-weight: 600;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.dy-form-tip {
  vertical-align: middle;
  line-height: 40px;
  color: #999;
  text-align: left;
}
.sku-box {
  width: 100%;
  background: inherit;
  background-color: rgba(242, 242, 242, 1);
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  text-align: center;
}
.sku-table-box {
  width: 100%;
  background: inherit;
  background-color: rgba(242, 242, 242, 1);
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  text-align: center;
  padding: 20px;
}
.sku-table-th {
  border: 1px solid #333;
  background-color: #b7f0ff;
  font-size: 10px;
}
.sku-table-td {
  margin-top: -21px !important;
  border: 1px solid #333;
  /*padding: 20px;*/
  /*background-color: #fff;*/
}
.sku-th {
  /*border: 1px solid #333;*/
  background-color: #b7f0ff;
}
.sku-td {
  margin-top: -20px;
  padding: 20px;
}
.sku-table-content {
  border-left: 1px solid #333;
  /*border-bottom: 1px solid #333;*/
  margin: 0 0 -1px -1px;
  padding: 0 3px;
}
.sku-table-input {
  padding-top: 5px;
  height: 40px;
}
.sku-table-img {
  height: 60px;
  line-height: 60px;
}
.sku-table-btn {
  height: 60px;
  line-height: 60px;
  width: 100%;
  margin: 0 auto;
  font-size: 18px;
}
.sku-table-btn>i {
  margin-left: 8px;
}
.sku-tip {
  margin-top: 0px;
  margin-bottom: -15px;
  text-align: left;
  color: #999;
}
.mul-set {
  margin-right: 10px;
}
.sku-table-content>img {
  height: 50px;
  width: auto;
  margin-top: 5px;
  border: 1px solid #ccc;
}

.goods-avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  float: left;
  margin-right: 10px;
}
.goods-avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.goods-avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.goods-avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.goods-pre {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  float: left;
  margin-right: 10px;
}
.goods-pre .el-icon-error {
  right: 3px;
  top: 3px;
  cursor: pointer;
  position: absolute;
  z-index: 10;
  display: none;
}
.goods-pre-btn {
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  color: #fff;
  cursor: pointer;
  position: absolute;
  text-align: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, .6);
  display: none;
}
.goods-pre:hover .goods-pre-btn {
  display: block;
}
.goods-pre:hover .el-icon-error {
  display: block;
}

.sku-avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  /*margin-left: -45px;*/
}
.sku-avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.sku-avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.sku-avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.sku-uploader-tips {
  line-height: 50px;
  margin-top: -50px;
  font-size: 12px;
  color: #8c939d;
}
.sku-pre {
  width: 100%;
  height: 100%;
  margin-top: 10px;
}
.sku-pre>div {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.sku-pre>div>img {
  width: 100%;
  height: 100%;
}
.sku-pre .el-icon-error {
  right: 3px;
  top: 3px;
  cursor: pointer;
  position: absolute;
  z-index: 10;
  display: none;
}
.sku-pre-btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  color: #fff;
  cursor: pointer;
  position: absolute;
  text-align: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, .6);
  display: none;
}
.sku-pre:hover .sku-pre-btn {
  display: block;
}
.sku-pre:hover .el-icon-error {
  display: block;
}

.sku-avatar-uploader-1 .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 5px;
  height: 50px;
}
.sku-avatar-uploader-1 .el-upload:hover {
  border-color: #409EFF;
}
.sku-avatar-uploader-icon-1 {
  font-size: 18px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.sku-avatar-1 {
  width: 50px;
  height: 50px;
  display: block;
}
.sku-pre-1 {
  width: 100%;
  height: 100%;
  margin-top: 5px;
}
.sku-pre-1>div {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.sku-pre-1>div>img {
  width: 100%;
  height: 100%;
}
.sku-pre-1 .el-icon-error {
  right: 3px;
  top: 3px;
  cursor: pointer;
  position: absolute;
  z-index: 10;
  display: none;
}
.sku-pre-btn-1 {
  width: 100%;
  height: 30px;
  line-height: 20px;
  margin-top: -20px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  position: absolute;
  text-align: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, .6);
  display: none;
}
.sku-pre-1:hover .sku-pre-btn-1 {
  display: block;
}
.sku-pre-1:hover .el-icon-error {
  display: block;
}
</style>
