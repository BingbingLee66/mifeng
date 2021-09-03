<template>
  <div class="app-container">
    <div class="block form-border">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="150px">
        <el-row>
          <div class="goods-bar-info"><span>1</span>商品基本信息</div>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="商品名称：" prop="name">
              <el-input maxlength="40" :show-word-limit=true v-model.trim="formObj.name" placeholder="请填写商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="供货商家：" prop="supplierId">
              <el-select v-model="formObj.supplierId" placeholder="请选择商品的供货商家" @visible-change="addSupplier">
                <el-option v-for="sp in supplierOptions" :label="sp.label" :value="sp.value" :key="sp.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <hr size="1"/>
        <el-row>
          <el-col :span="22">
            <div class="dy-form-label">
              <span style="color: #F56C6C;padding: 5px;">*</span><span>商品轮播图：</span>
            </div>
            <span class="dy-form-tip">支持图片/视频。图片大小不能超过2M，建议尺寸750X750，支持JPG、PNG。视频大小不能超过200M，只支持MP4</span>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="">
            <draggable v-model="formObj.gallery" ghost-class="ghost" group="gallery" animation="500" @start="galleryStart" @end="galleryEnd">
              <transition-group>
                <div v-for="(gal, index) in formObj.gallery" :key="index" style="float:left;">
                  <el-upload class="goods-avatar-uploader" action="/" :show-file-list="false" :before-upload="beforeAvatarUploadGallery" :http-request="function (content) { return uploadGallery(content, index) }" v-if="!gal">
                    <i class="el-icon-plus goods-avatar-uploader-icon"></i>
                  </el-upload>
                  <div class="goods-pre" v-if="gal">
                    <i class="el-icon-error" @click="clearGalleryImg(index)"></i>
                    <img :src="gal" class="goods-avatar" v-if="gal.indexOf('.jpeg') != -1
                      || gal.indexOf('.jpg') != -1
                      || gal.indexOf('.png') != -1"/>
                    <img :src="videoPreview" class="goods-avatar" v-else/>
                    <div class="goods-pre-btn" @click="openPreviewModal(gal)">预览</div>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </el-form-item>
          <div style="margin-left: 150px;">
            已上传<span style="color: #F56C6C;">（{{ effectiveLength(formObj.gallery) }}/{{ galleryLimit }}）</span></div>
          <div style="margin: 5px 0 0 150px;" v-show="!galleryValid"><span style="color: #F56C6C; font-size: 13px;">至少上传1张图片</span>
          </div>
        </el-row>
        <el-row>
          <el-col :span="20">
            <div class="dy-form-label">
              <span style="color: #F56C6C;padding: 5px;">*</span><span>商品列表图：</span>
            </div>
            <span class="dy-form-tip">图片大小不能超过2M，建议尺寸300X300，支持JPG、PNG</span>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="">
            <div style="float:left;">
              <el-upload class="goods-avatar-uploader" action="/" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="function (content) { return uploadDescript(content) }" v-if="!formObj.descript">
                <i class="el-icon-plus goods-avatar-uploader-icon"></i>
              </el-upload>
              <div class="goods-pre" v-if="formObj.descript">
                <i class="el-icon-error" @click="clearDescriptImg"></i>
                <img :src="formObj.descript" class="goods-avatar">
                <div class="goods-pre-btn" @click="openPreviewModal(formObj.descript)">预览</div>
              </div>
            </div>
          </el-form-item>
          <div style="margin-left: 150px;">
            已上传<span style="color: #F56C6C;">（{{ formObj.descript == '' ? 0 : 1 }}/{{ descriptLimit }}）</span></div>
          <div style="margin: 5px 0 0 150px;" v-show="!descriptValid"><span style="color: #F56C6C; font-size: 13px;">至少上传1张图片</span>
          </div>
        </el-row>
        <el-row>
          <el-col :span="20">
            <div class="dy-form-label">
              <span style="color: #F56C6C;padding: 5px;">*</span><span>商品详情图：</span>
            </div>
            <span class="dy-form-tip">图片大小不能超过2M，图片宽度要求处于480~1200px之间，高度处于0-1500px之间</span>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="">
            <draggable :list="formObj.detail" forceFallback="true" group="detail" animation="1000" @start="detailStart" @end="detailEnd">
              <transition-group>
                <div v-for="(dtl, index) in formObj.detail" :key="index" style="float:left;">
                  <el-upload class="goods-avatar-uploader" action="/" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="function (content) { return uploadDetail(content, index) }" v-if="!dtl">
                    <i class="el-icon-plus goods-avatar-uploader-icon"></i>
                  </el-upload>
                  <div class="goods-pre" v-if="dtl">
                    <i class="el-icon-error" @click="clearDetailImg(index)"></i>
                    <img :src="dtl" class="goods-avatar">
                    <div class="goods-pre-btn" @click="openPreviewModal(dtl)">预览</div>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </el-form-item>
          <div style="margin-left: 150px;">
            已上传<span style="color: #F56C6C;">（{{ effectiveLength(formObj.detail) }}/{{ detailLimit }}）</span></div>
          <div style="margin: 5px 0 0 150px;" v-show="!detailValid"><span style="color: #F56C6C; font-size: 13px;">至少上传1张图片</span>
          </div>
        </el-row>

        <hr size="1"/>
        <el-row>
          <div class="goods-bar-info"><span>2</span>商品规格与库存</div>
        </el-row>
        <el-row>
          <el-form-item label="商品规格：" prop="specType">
            <el-radio-group v-model="formObj.specType" @change="setSku">
              <el-radio :label="0">单品</el-radio>
              <el-radio :label="1">多规格</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="formObj.specType == 0">
          <el-col :span="22">
            <div class="dy-form-label">
              <span style="color: #F56C6C;padding: 5px;">*</span><span>价格及库存：</span>
            </div>
            <div class="sku-table-box">
              <el-row class="sku-table-th">
                <el-col :span="8" class="sku-table-content"><span style="color: #F56C6C;padding: 5px;">*</span>单买价（元）
                </el-col>
                <el-col :span="8" class="sku-table-content"><span style="color: #F56C6C;padding: 5px;">*</span>拼单价（元）
                </el-col>
                <el-col :span="8" class="sku-table-content"><span style="color: #F56C6C;padding: 5px;">*</span>库存数（件）
                </el-col>
              </el-row>
              <el-row class="sku-table-td">
                <el-col :span="8" class="sku-table-content sku-table-img">
                  <el-form-item label-width="0" size="mini" :prop="'singleSku[0].price'" :rules="rules.price" style="margin-top: 15px;">
                    <el-input v-model="formObj.singleSku[0].price" placeholder="单买价" maxLength="10">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="sku-table-content sku-table-img">
                  <el-form-item label-width="0" size="mini" :prop="'singleSku[0].fightPrice'" :rules="rules.fightPrice" style="margin-top: 15px;">
                    <el-input v-model="formObj.singleSku[0].fightPrice" placeholder="拼单价" maxLength="10">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="sku-table-content sku-table-img">
                  <el-form-item label-width="0" size="mini" :prop="'singleSku[0].stock'" :rules="rules.stock" style="margin-top: 15px;">
                    <el-input v-model="formObj.singleSku[0].stock" placeholder="库存数" maxLength="10">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-left: -45px;">
                <el-col :span="8">
                  <el-form-item label="商品市场价：" size="mini" :prop="'singleSku[0].marketingPrice'" :rules="rules.marketingPrice">
                    <el-input v-model="formObj.singleSku[0].marketingPrice" maxLength="10">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商品供货价：" size="mini" :prop="'singleSku[0].supplyPrice'" :rules="rules.supplyPrice">
                    <el-input v-model="formObj.singleSku[0].supplyPrice" maxLength="10">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="虚拟销量：" size="mini">
                    <el-input v-model="formObj.virtualSalesVolume" maxLength="10" :disabled="type==='edit'">
                      <template slot="append">件</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <hr size="1" style="margin: 0 -20px;"/>
              <el-row>
                <div class="sku-tip">
                  <span style="color: #F56C6C;padding: 5px;">*</span><span :style="{ color: computedColor }">价格设定规则：供货价＜=拼单价＜单买价＜市场价</span>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row v-if="formObj.specType == 1">
          <div class="dy-form-tip" style="margin-left: 150px;">最多添加两个商品规格，第一个商品规格可添加规格图片</div>
          <el-col :span="22">
            <el-form-item label="">
              <div class="sku-box">
                <el-row class="sku-th">
                  <div style="float: left; margin-left: -60px;">
                    <el-form-item label="规格1：" :prop="'attr1.attrName'" :rules="rules.attrName">
                      <el-select v-model="formObj.attr1.attrName" size="mini" placeholder="请选择规格" :disabled="formObj.attr1.id == '' ? false : true">
                        <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div style="float: right; margin-right: 20px;">
                    <el-button type="text" @click="delAttr1">删除规格</el-button>
                  </div>
                </el-row>
                <el-row class="sku-td">
                  <el-radio-group v-model="attrRatio1" style="width: 100%;">
                    <el-col :offset="index % 3 != 0 ? 2 : 0" :span="6" v-for="(attr, index) in formObj.attr1.value" :key="index" style="margin-bottom: 10px;">
                      <el-radio :label="index" :disabled="!attr.attrVal" style="width: 100%;">
                        <el-input v-model.trim="attr.attrVal" placeholder="请输入规格名称" size="mini" @blur="addAttrSku1(attr.attrVal, index)" onKeypress="return (/[^,]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8" maxLength="18"></el-input>
                        <i class="el-icon-close" style="color: red;" @click="delAttrVal1(index)" v-if="index != formObj.attr1.value.length - 1"></i>
                        <el-upload class="sku-avatar-uploader" action="/" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="function (content) { return uploadAttr1(content, index) }" v-if="!attr.imgUrl">
                          <i class="el-icon-plus sku-avatar-uploader-icon"></i>
                          <div class="sku-uploader-tips">上传图片</div>
                        </el-upload>
                        <div class="sku-pre" v-if="attr.imgUrl">
                          <div>
                            <i class="el-icon-error" style="color: #333;" @click="clearSkuImg(index)"></i>
                            <img :src="attr.imgUrl" class="sku-avatar">
                            <div class="sku-pre-btn" @click="openPreviewModal(attr.imgUrl)">预览</div>
                          </div>
                        </div>
                      </el-radio>
                    </el-col>
                  </el-radio-group>
                </el-row>
              </div>
              <el-button type="primary" style="margin-top: 20px;" v-if="formObj.attr2 == null" @click="addAttr2">添加规格
              </el-button>
              <div class="sku-box" style="margin-top: 20px;" v-else>
                <el-row class="sku-th">
                  <div style="float: left; margin-left: -60px;">
                    <el-form-item label="规格2：" :prop="'attr2.attrName'" :rules="rules.attrName">
                      <el-select v-model="formObj.attr2.attrName" size="mini" placeholder="请选择规格" :disabled="formObj.attr2.id == '' ? false : true">
                        <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div style="float: right; margin-right: 20px;">
                    <el-button type="text" @click="delAttr2">删除规格</el-button>
                  </div>
                </el-row>
                <el-row class="sku-td">
                  <el-radio-group v-model="attrRatio2" style="width: 100%;">
                    <el-col :offset="index % 3 != 0 ? 2 : 0" :span="6" v-for="(attr, index) in formObj.attr2.value" :key="index" style="margin-bottom: 10px;">
                      <el-radio :label="index" :disabled="!attr.attrVal" style="width: 100%;">
                        <el-input v-model.trim="attr.attrVal" placeholder="请输入规格名称" size="mini" @blur="addAttrSku2(attr.attrVal, index)" onKeypress="return (/[^,]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8" maxLength="18"></el-input>
                        <i class="el-icon-close" style="color: red;" @click="delAttrVal2(index)" v-if="index != formObj.attr2.value.length - 1"></i>
                      </el-radio>
                    </el-col>
                  </el-radio-group>
                </el-row>
              </div>
              <!-- <el-button type="danger" style="margin-top: 20px;" v-if="attrRatio1 != -1 && (formObj.attr2 == null ? true : attrRatio2 != -1)" @click="addGoodsSku">添加</el-button> -->
              <el-button type="danger" style="margin-top: 20px;" v-if="attrRatio1 != -1" @click="addGoodsSku">添加
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="formObj.specType == 1">
          <el-col :span="22">
            <div class="dy-form-label">
              <span style="color: #F56C6C;padding: 5px;">*</span><span>价格及库存：</span>
            </div>
            <div class="sku-table-box">
              <div class="dy-form-tip">批量设置在下方栏中选择内容进行批量填充，记得点确定哦</div>
              <el-row>
                <el-col :span="4" class="mul-set">
                  <el-input v-model="uniSetting.price" size="mini" placeholder="单买价" maxLength="10">
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="4" class="mul-set">
                  <el-input v-model="uniSetting.fightPrice" size="mini" placeholder="拼单价" maxLength="10">
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="4" class="mul-set">
                  <el-input v-model="uniSetting.marketingPrice" size="mini" placeholder="商品市场价" maxLength="10">
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="4" class="mul-set">
                  <el-input v-model="uniSetting.supplyPrice" size="mini" placeholder="商品供货价" maxLength="10">
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="4" class="mul-set">
                  <el-input v-model="uniSetting.stock" size="mini" placeholder="库存数" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8" maxLength="10">
                    <template slot="append">件</template>
                  </el-input>
                </el-col>
                <el-col :span="2">
                  <el-button type="danger" size="mini" @click="mulUpdate">确定</el-button>
                </el-col>
              </el-row>
              <el-row class="sku-table-th">
                <el-col :span="formObj.attr2 != undefined ? 3 : 6" class="sku-table-content">
                  {{ !!formObj.attr1.attrName ? formObj.attr1.attrName : '规格1' }}
                </el-col>
                <el-col :span="3" class="sku-table-content" v-if="formObj.attr2 != undefined">
                  {{ !!formObj.attr2.attrName ? formObj.attr2.attrName : '规格2' }}
                </el-col>
                <el-col :span="3" class="sku-table-content"><span style="color: #F56C6C;padding: 5px;">*</span>单买价(元)
                </el-col>
                <el-col :span="3" class="sku-table-content"><span style="color: #F56C6C;padding: 5px;">*</span>拼单价(元)
                </el-col>
                <el-col :span="3" class="sku-table-content"><span style="color: #F56C6C;padding: 5px;">*</span>商品市场价(元)
                </el-col>
                <el-col :span="3" class="sku-table-content"><span style="color: #F56C6C;padding: 5px;">*</span>商品供货价(元)
                </el-col>
                <el-col :span="3" class="sku-table-content"><span style="color: #F56C6C;padding: 5px;">*</span>库存数(件)
                </el-col>
                <!-- <el-col :span="2" class="sku-table-content">图片</el-col> -->
                <el-col :span="3" class="sku-table-content">删除</el-col>
              </el-row>
              <el-row class="sku-table-td" v-for="(sku, index) in formObj.multiSku">
                <el-col :span="formObj.attr2 != undefined ? 3 : 6" class="sku-table-content sku-table-img">
                  {{ sku.codeName.split(',')[0] }}
                </el-col>
                <el-col :span="3" class="sku-table-content sku-table-img" v-if="formObj.attr2 != undefined">
                  {{ sku.codeName.split(',')[1] }}
                </el-col>
                <el-col :span="3" class="sku-table-content sku-table-img">
                  <el-form-item label-width="0" size="mini" :prop="'multiSku[' + index + '].price'" :rules="rules.price" style="margin-top: 15px;">
                    <el-input v-model="sku.price" size="mini" placeholder="单买价" maxLength="10">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" class="sku-table-content sku-table-img">
                  <el-form-item label-width="0" size="mini" :prop="'multiSku[' + index + '].fightPrice'" :rules="rules.fightPrice" style="margin-top: 15px;">
                    <el-input v-model="sku.fightPrice" size="mini" placeholder="拼单价" maxLength="10">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" class="sku-table-content sku-table-img">
                  <el-form-item label-width="0" size="mini" :prop="'multiSku[' + index + '].marketingPrice'" :rules="rules.marketingPrice" style="margin-top: 15px;">
                    <el-input v-model="sku.marketingPrice" size="mini" placeholder="商品市场价" maxLength="10">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" class="sku-table-content sku-table-img">
                  <el-form-item label-width="0" size="mini" :prop="'multiSku[' + index + '].supplyPrice'" :rules="rules.supplyPrice" style="margin-top: 15px;">
                    <el-input v-model="sku.supplyPrice" size="mini" placeholder="商品供货价" maxLength="10">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" class="sku-table-content sku-table-img">
                  <el-form-item label-width="0" size="mini" :prop="'multiSku[' + index + '].stock'" :rules="rules.stock" style="margin-top: 15px;">
                    <el-input v-model="sku.stock" size="mini" placeholder="库存数" maxLength="10">
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="2" class="sku-table-content sku-table-img">
                  <el-upload
                    class="sku-avatar-uploader-1"
                    action="/"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :http-request="function (content) { return uploadSku(content, index) }"
                    v-if="!sku.skuImgUrl">
                    <i class="el-icon-plus sku-avatar-uploader-icon-1"></i>
                  </el-upload>
                  <div class="sku-pre-1" v-if="sku.skuImgUrl">
                    <div>
                      <i class="el-icon-error" @click="clearSkuImg1(index)"></i>
                      <img :src="sku.skuImgUrl" class="sku-avatar-1">
                      <div class="sku-pre-btn-1" @click="openPreviewModal(sku.skuImgUrl)">预览</div>
                    </div>
                  </div>
                </el-col> -->
                <el-col :span="3" class="sku-table-content">
                  <div class="sku-table-btn">
                    <i class="el-icon-delete" style="color:red; text-align: center;cursor: pointer;" @click="delSku(index)"></i>
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-left: -45px;">
                <el-col :span="8">
                  <el-form-item label="虚拟销量：" size="mini">
                    <el-input v-model="formObj.virtualSalesVolume" maxLength="10" :disabled="type==='edit'">
                      <template slot="append">件</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <hr size="1" style="margin: 0 -20px;"/>
              <el-row>
                <div class="sku-tip">
                  <span style="color: #F56C6C;padding: 5px;">*</span><span :style="{ color: computedColor }">价格设定规则：供货价＜=拼单价＜单买价＜市场价</span>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <hr size="1"/>
        <el-row>
          <div class="goods-bar-info"><span>3</span>购买设置</div>
        </el-row>
        <el-form-item label="限时购买：">
          <el-date-picker @change="handleSelectTime" v-model="formObj.limitTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
          <div>设置完限时购买的开始时间和结束时间后，可以设置商品是否开启预约期</div>
        </el-form-item>
        <el-row v-if="showBooking">
          <el-form-item label="预约期：">
            <el-date-picker @change="handleSelectTimeB" style="width: 200px;" v-model="formObj.bookingTimeStart" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
            -
            <el-date-picker style="width: 200px;" :disabled="true" v-model="startDate" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单人限购：" prop="limitAmount">
              <el-input v-model="formObj.limitAmount" maxLength="10">
                <template slot="append">件</template>
              </el-input>
              <!-- 注：0为不限购 -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="立减优惠：" prop="discount">
              <div class="discount-input">
                <el-input-number v-model="formObj.discount" :min="0" :controls="false" :precision="2"></el-input-number>
                <div class="input-prepend">元/件</div>
              </div>
              <!-- <div>支持输入大于0的数字，最多支持输入两位小数</div> -->
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 发货说明 -->
        <hr size="1"/>
        <el-row>
          <div class="goods-bar-info"><span>4</span>发货说明</div>
        </el-row>
        <el-form-item label="包邮：" prop="deliveryConfig1">
          <el-col :span="10">
            <el-input v-model="formObj.deliveryConfig1"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="发货时间：" prop="deliveryConfig2">
          <el-col :span="10">
            <el-input v-model="formObj.deliveryConfig2"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="发货说明：" prop="deliveryConfig3">
          <el-col :span="10">
            <el-input resize="none" type="textarea" v-model="formObj.deliveryConfig3"></el-input>
          </el-col>
        </el-form-item>
        <!-- 服务保障 -->
        <hr size="1"/>
        <el-row>
          <div class="goods-bar-info"><span>5</span>服务保障</div>
        </el-row>
        <el-form-item label="商会企业供货：" prop="serviceConfig1">
          <el-col :span="10">
            <el-input v-model="formObj.serviceConfig1"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="品质保证：" prop="serviceConfig2">
          <el-col :span="10">
            <el-input v-model="formObj.serviceConfig2"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="坏了包赔：" prop="serviceConfig3">
          <el-col :span="10">
            <el-input resize="none" type="textarea" v-model="formObj.serviceConfig3"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :offset="8" :span="8">
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
            <el-button @click="closeTab">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="预览" :visible.sync="previewImgVisible" width="50%">
      <img :src="previewUrl" style="width: 100%; padding:20px;" v-if="previewUrl.indexOf('.jpeg') != -1 || previewUrl.indexOf('.jpg') != -1 || previewUrl.indexOf('.png') != -1"/>
      <video :src="previewUrl" v-else style="width: 100%; padding:20px;" controls>
        您的浏览器不支持 video 标签。
      </video>
    </el-dialog>
  </div>

</template>

<script src="./goodsSku.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style lang="scss">
.discount-input {
  display: flex;

  .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
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

.from-line {
  text-align: center;
}

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
  margin-left: 150px;
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
  line-height: 30px;
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
  display: flex;
  align-items: center;
  height: 60px;
  justify-content: center;
  /*line-height: 60px;*/
}

.sku-table-btn {
  height: 60px;
  line-height: 60px;
  width: 100%;
  margin: 0 auto;
  font-size: 18px;
}

.sku-table-btn > i {
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

.sku-table-content > img {
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
  /*float: left;*/
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
  border-color: #409eff;
}

.sku-avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 80px;
  text-align: center;
}

.sku-avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.sku-uploader-tips {
  line-height: 50px;
  margin-top: -54px;
  font-size: 12px;
  color: #8c939d;
}

.sku-pre {
  width: 100%;
  height: 100%;
  margin-top: 10px;
}

.sku-pre > div {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.sku-pre > div > img {
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
  background-color: rgba(0, 0, 0, 0.6);
  display: none;
}

.sku-pre:hover .sku-pre-btn {
  display: block;
}

.sku-pre:hover .el-icon-error {
  display: block;
}

.sku-avatar-uploader-1 {
  height: 60px;
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
  border-color: #409eff;
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

.sku-pre-1 > div {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.sku-pre-1 > div > img {
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
  background-color: rgba(0, 0, 0, 0.6);
  display: none;
}

.sku-pre-1:hover .sku-pre-btn-1 {
  display: block;
}

.sku-pre-1:hover .el-icon-error {
  display: block;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
