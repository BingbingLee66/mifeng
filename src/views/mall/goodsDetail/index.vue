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
              {{ detailObj.name }}
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
              {{ supplier(detailObj.supplierId) }}
            </el-form-item>
          </el-col>
        </el-row>
        <hr size="1" />
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>商品轮播图：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <div v-for="(gal, index) in detailObj.galleryArr" :key="index">
                <div class="goods-pre">
                  <!--                  <img :src="gal" class="goods-avatar">-->
                  <!-- https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/video-pre.jpg -->
                  <img :src="gal" class="goods-avatar" v-if="gal.indexOf('.jpeg') != -1 || gal.indexOf('.jpg') != -1 || gal.indexOf('.png') != -1" />
                  <img src="https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/video-pre.jpg" class="goods-avatar" v-else />
                  <div class="goods-pre-btn" @click="openPreviewModal(gal)">预览</div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>商品海报图：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <div v-if="detailObj.poster" class="goods-pre">
                <img :src="detailObj.poster" class="goods-avatar">
                <div class="goods-pre-btn" @click="openPreviewModal(detailObj.poster)">预览</div>
              </div>
              <div v-else>无</div>
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
              <div class="goods-pre">
                <img :src="detailObj.descript" class="goods-avatar">
                <div class="goods-pre-btn" @click="openPreviewModal(detailObj.descript)">预览</div>
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
              <div v-for="(dtl, index) in detailObj.detailArr" :key="index">
                <div class="goods-pre">
                  <img :src="dtl" class="goods-avatar">
                  <div class="goods-pre-btn" @click="openPreviewModal(dtl)">预览</div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <hr size="1" />
        <el-row>
          <div class="goods-bar-info"><span>2</span>商品规格与库存</div>
        </el-row>
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
              <div class="g-dtl-sku-table-box">
                <el-row class="dtl-sku-table-th">
                  <el-col style="width: 20%;" class="dtl-sku-table-content">单买价(元)</el-col>
                  <el-col style="width: 20%;" class="dtl-sku-table-content">拼单价(元)</el-col>
                  <el-col style="width: 20%;" class="dtl-sku-table-content">商品市场价(元)</el-col>
                  <el-col style="width: 20%;" class="dtl-sku-table-content">商品供货价(元)</el-col>
                  <el-col style="width: 20%;" class="dtl-sku-table-content">库存数(件)</el-col>
                </el-row>
                <el-row class="dtl-sku-table-td">
                  <el-col style="width: 20%;" class="dtl-sku-table-content dtl-sku-table-input">
                    {{ detailObj.singleSku[0].price }}
                  </el-col>
                  <el-col style="width: 20%;" class="dtl-sku-table-content dtl-sku-table-input">
                    {{ detailObj.singleSku[0].fightPrice }}
                  </el-col>
                  <el-col style="width: 20%;" class="dtl-sku-table-content dtl-sku-table-input">
                    {{ detailObj.singleSku[0].marketingPrice }}
                  </el-col>
                  <el-col style="width: 20%;" class="dtl-sku-table-content dtl-sku-table-input">
                    {{ detailObj.singleSku[0].supplyPrice }}
                  </el-col>
                  <el-col style="width: 20%;" class="dtl-sku-table-content dtl-sku-table-input">
                    {{ detailObj.singleSku[0].stock }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    虚拟销量：{{ detailObj.virtualSalesVolume }}件
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
              <div class="g-dtl-sku-table-box">
                <el-row class="dtl-sku-table-th">
                  <el-col :span="(detailObj.attr2 != null && detailObj.attr2.id != undefined) ? 3 : 6" class="dtl-sku-table-content">
                    {{ !!detailObj.attr1.attrName ? detailObj.attr1.attrName : '规格1' }}
                  </el-col>
                  <el-col :span="3" class="dtl-sku-table-content" v-if="(detailObj.attr2 != null && detailObj.attr2.id != undefined)">
                    {{ !!detailObj.attr2.attrName ? detailObj.attr2.attrName : '规格2' }}
                  </el-col>
                  <el-col :span="3" class="dtl-sku-table-content">单买价(元)</el-col>
                  <el-col :span="3" class="dtl-sku-table-content">拼单价(元)</el-col>
                  <el-col :span="3" class="dtl-sku-table-content">商品市场价(元)</el-col>
                  <el-col :span="3" class="dtl-sku-table-content">商品供货价(元)</el-col>
                  <el-col :span="3" class="dtl-sku-table-content">库存数(件)</el-col>
                  <el-col :span="3" class="dtl-sku-table-content">图片</el-col>
                </el-row>
                <el-row class="dtl-sku-table-td" v-for="(sku, index) in detailObj.multiSku">
                  <el-col :span="(detailObj.attr2 != null && detailObj.attr2.id != undefined) ? 3 : 6" class="dtl-sku-table-content dtl-sku-table-img">
                    {{ sku.codeName.split(',')[0] }}
                  </el-col>
                  <el-col :span="3" class="dtl-sku-table-content dtl-sku-table-img" v-if="(detailObj.attr2 != null && detailObj.attr2.id != undefined)">
                    {{ sku.codeName.split(',')[1] }}
                  </el-col>
                  <el-col :span="3" class="dtl-sku-table-content dtl-sku-table-img">
                    {{ sku.price }}
                  </el-col>
                  <el-col :span="3" class="dtl-sku-table-content dtl-sku-table-img">
                    {{ sku.fightPrice }}
                  </el-col>
                  <el-col :span="3" class="dtl-sku-table-content dtl-sku-table-img">
                    {{ sku.marketingPrice }}
                  </el-col>
                  <el-col :span="3" class="dtl-sku-table-content dtl-sku-table-img">
                    {{ sku.supplyPrice }}
                  </el-col>
                  <el-col :span="3" class="dtl-sku-table-content dtl-sku-table-img">
                    {{ sku.stock }}
                  </el-col>
                  <el-col :span="3" class="dtl-sku-table-content dtl-sku-table-img">
                    <div class="dtl-sku-pre-1">
                      <div>
                        <img :src="sku.skuImgUrl" class="dtl-sku-avatar-1">
                        <div class="dtl-sku-pre-btn-1" @click="openPreviewModal(sku.skuImgUrl)">预览</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="2">
                    <el-form-item label="虚拟销量：">
                      {{ detailObj.salesVolume }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <hr size="1" />
        <el-row>
          <div class="goods-bar-info"><span>3</span>购买设置</div>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>限时购买：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="" v-if="detailObj.limitTimeStart == null && detailObj.limitTimeEnd == null ">无
            </el-form-item>
            <el-form-item label="" v-if="detailObj.limitTimeStart != null && detailObj.limitTimeEnd != null ">
              {{ detailObj.limitTimeStart | dateFormat }}至{{ detailObj.limitTimeEnd | dateFormat }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>预约期：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="" v-if="detailObj.limitTimeStart == null && detailObj.bookingTimeStart == null ">无
            </el-form-item>
            <el-form-item label="" v-if="detailObj.limitTimeStart != null && detailObj.bookingTimeStart != null ">
              {{ detailObj.bookingTimeStart | dateFormat }}至{{ detailObj.limitTimeStart | dateFormat }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>单人限购：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{ detailObj.limitAmount == 0 ? '不限购' : detailObj.limitAmount }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>立减优惠：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{ detailObj.discount == 0 ? '无' : detailObj.discount }}
            </el-form-item>
          </el-col>
        </el-row>

        <hr size="1" />
        <el-row>
          <div class="goods-bar-info"><span>4</span>发货说明</div>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>包邮：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{ deliveryConfig['包邮'] }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>发货时间：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{ deliveryConfig['发货时间'] }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>发货说明：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{ deliveryConfig['发货说明'] }}
            </el-form-item>
          </el-col>
        </el-row>

        <hr size="1" />
        <el-row>
          <div class="goods-bar-info"><span>5</span>服务保障</div>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>商会企业供货：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{ serviceConfig['商会企业供货'] }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>品质保证：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{ serviceConfig['品质保证'] }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="dy-form-label">
              <span>坏了包赔：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              {{ serviceConfig['坏了包赔'] }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog title="" :visible.sync="previewImgVisible" width="50%">
      <img :src="previewUrl" style="width: 100%; padding:20px;" v-if="previewUrl.indexOf('.jpeg') != -1 || previewUrl.indexOf('.jpg') != -1 || previewUrl.indexOf('.png') != -1" />
      <video :src="previewUrl" v-else style="width: 100%; padding:20px;" controls>
        您的浏览器不支持 video 标签。
      </video>
      <!--      <img :src="previewUrl" style="width: 100%; padding:20px;"/>-->
    </el-dialog>
  </div>

</template>

<script src="./goodsDetail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
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

.goods-bar-info > span {
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

.g-dtl-sku-table-box {
  width: 100%;
  background: inherit;
  background-color: rgba(242, 242, 242, 1);
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  text-align: center;
  padding: 20px;
}

.dtl-sku-table-th {
  border: 1px solid #333;
  background-color: #b7f0ff;
  font-size: 10px;
}

.dtl-sku-table-td {
  margin-top: -21px !important;
  border: 1px solid #333;
  /*padding: 20px;*/
  /*background-color: #fff;*/
}

.dtl-sku-th {
  /*border: 1px solid #333;*/
  background-color: #b7f0ff;
}

.dtl-sku-td {
  margin-top: -20px;
  padding: 20px;
}

.dtl-sku-table-content {
  border-left: 1px solid #333;
  /*border-bottom: 1px solid #333;*/
  margin: 0 0 -1px -1px;
  padding: 0 3px;
}

.dtl-sku-table-input {
  padding-top: 5px;
  height: 40px;
}

.dtl-sku-table-img {
  display: flex;
  align-items: center;
  height: 60px;
  justify-content: center;
  line-height: 20px;
}

.dtl-sku-table-btn {
  height: 60px;
  line-height: 60px;
  width: 100%;
  margin: 0 auto;
  font-size: 18px;
}

.dtl-sku-table-btn > i {
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

.dtl-sku-table-content > img {
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
  border-color: #409eff;
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
  background-color: rgba(0, 0, 0, 0.6);
  display: none;
}

.goods-pre:hover .goods-pre-btn {
  display: block;
}

.goods-pre:hover .el-icon-error {
  display: block;
}

.dtl-sku-avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  /*margin-left: -45px;*/
}

.dtl-sku-avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.dtl-sku-avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.dtl-sku-avatar {
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

.dtl-sku-pre {
  width: 100%;
  height: 100%;
  margin-top: 10px;
}

.dtl-sku-pre > div {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.dtl-sku-pre > div > img {
  width: 100%;
  height: 100%;
}

.dtl-sku-pre .el-icon-error {
  right: 3px;
  top: 3px;
  cursor: pointer;
  position: absolute;
  z-index: 10;
  display: none;
}

.dtl-sku-pre-btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  color: #fff;
  cursor: pointer;
  position: absolute;
  text-align: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  display: none;
}

.dtl-sku-pre:hover .dtl-sku-pre-btn {
  display: block;
}

.dtl-sku-pre:hover .el-icon-error {
  display: block;
}

.dtl-sku-avatar-uploader-1 .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 5px;
  height: 50px;
}

.dtl-sku-avatar-uploader-1 .el-upload:hover {
  border-color: #409eff;
}

.dtl-sku-avatar-uploader-icon-1 {
  font-size: 18px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

.dtl-sku-avatar-1 {
  width: 50px;
  height: 50px;
  display: block;
}

.dtl-sku-pre-1 {
  width: 100%;
  height: 100%;
  margin-top: 5px;
}

.dtl-sku-pre-1 > div {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.dtl-sku-pre-1 > div > img {
  width: 100%;
  height: 100%;
}

.dtl-sku-pre-1 .el-icon-error {
  right: 3px;
  top: 3px;
  cursor: pointer;
  position: absolute;
  z-index: 10;
  display: none;
}

.dtl-sku-pre-btn-1 {
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
  background-color: rgba(0, 0, 0, 0.6);
  display: none;
}

.dtl-sku-pre-1:hover .dtl-sku-pre-btn-1 {
  display: block;
}

.dtl-sku-pre-1:hover .el-icon-error {
  display: block;
}
</style>
