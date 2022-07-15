<template>
  <div class="app-container">
    <!-- 上传视频阿里云组件 -->
    <videoUpLoad  ref="VideoUpLoad" @Succeed="onSucceed" />
    <kdDialog ref="kdDialog" dialogTitle="导入微信文章" @savePopupData="savePopupData" >
      <div slot="content" class="content">
        <el-input clearable v-model="articleUrl"  placeholder="请输入微信文章链接地址" ></el-input>
        <div class="case">支持导入微信公众号文章</div>
        <div >注意：1.如需获得正式使用权，请自行联系版权所有者
          <br/> <span v-for="item in 10" :key="item">&nbsp;</span>2.多次导入内容会进行覆盖
        </div>
      </div>
    </kdDialog>
    <el-form   ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
        <el-row>
            <el-col :span="16">
                <el-form-item  label="标题：" prop="title">
                    <el-input clearable show-word-limit   v-model="formObj.title" maxlength="60" placeholder="请输入标题" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item  label="一级菜单："  prop="menu1Id">
                    <el-select    @change="onselectMenu" v-model="formObj.menu1Id" placeholder="请选择">
                        <el-option
                        v-for="(item, index) in menu1List"
                        :key="index"
                        :label="item.menuName"
                        :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item :span="8" label="二级菜单：" prop="menu2Id">
                    <el-select v-model="formObj.menu2Id" placeholder="请选择">
                        <el-option
                        v-for="(item, index) in menu2List"
                        :key="index"
                        :label="item.menuName"
                        :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row style="margin-left:100px">
            <el-button @click="importArticle" type="primary" >导入微信文章</el-button>
        </el-row>
        <el-row>
            <el-col :span="18">
                <el-form-item label="文章内容：">
                    <editorElem :content="formObj.content" @addParentHtml="addParentHtml" ref="editorElem"></editorElem>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-form-item v-loading="loading">
                    <div class="vdo"> <span style="margin-right: 2px;color: #F56C6C;">*</span>视频</div>
                    <el-upload
                        v-if="!formObj.vid"
                        action="/"
                        list-type="picture-card"
                        :before-upload="beforeAvatarUploadVideo"
                        :http-request="function (content) {return uploadVideoFunc(content)}"
                        :show-file-list="false"
                    >
                     <i class="el-icon-plus" />
                    </el-upload>
                    <div v-else class="goods-pre">
                        <videoComponent v-if="formObj.vid" ref="videoRef" :vid="formObj.vid" height="148px" />
                        <i
                            class="el-icon-error"
                            style="font-size:20px;color:red;"
                            @click="deleteCurrentVideo(1)"
                        />
                    </div>
                    <div class="tips">建议视频时长不超过10分钟</div>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item>
                    <div class="vdo"><span style="margin-right: 2px;color: #F56C6C;">*</span>视频封面</div>
                    <el-upload
                    v-if="!formObj.vcover"
                    action="/"
                    list-type="picture-card"
                    :before-upload="function (file) { return beforeAvatarUpload(file) }"
                    :http-request="function (content) {return upload(content)}"
                    :show-file-list="false"
                    >
                        <i class="el-icon-plus" />
                    </el-upload>
                    
                    <div v-else class="goods-pre">
                        <i
                            class="el-icon-error"
                            @click="deleteCurrentVideo(2)"
                        />
                        <el-image
                            :src="formObj.vcover"
                            class="goods-avatar"
                        />
                        <div class="goods-pre-btn" @click="openPreviewModal(formObj.vcover)">
                            预览
                        </div>
                    </div>
                    <div class="tips">支持格式：jpeg、png、jpg</div>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item  label="权重：" prop="sort">
                    <el-input style=" width:50%;"  v-model="formObj.sort" maxlength="3" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" placeholder="权重值仅支持输入0-999" />
                    <div>权重请控制在0-999，权重为0不在商会后台显示；权重越大，在商会后台列表排序就越靠前</div>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="5">
                <el-form-item :rules="[ { required: true }]" label="发布时间：">
                    <el-radio-group v-model="formObj.status">
                    <el-radio :label="1">立即发布</el-radio>
                    <el-radio :label="4">定时发布</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col v-if="formObj.status == 4" :span="8">
                <el-form-item label="" prop="publishTs" label-width="0">
                    <el-date-picker
                    v-model="formObj.publishTs"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间"
                    />
                </el-form-item>
            </el-col>
        </el-row>
        <div style="margin:-15px 0 0 17px;font-size: 14px;">温馨提示：操作指引发布后，仅在商会后台展示，不会再小程序/APP等展示</div>
        <!-- 底部 -->
        <el-form-item style="padding-top:30px;">
            <el-col :span="8">
                <el-button  @click="closeTab">取消</el-button>
                <el-button v-dbClick type="primary" @click="saveFunc">发布</el-button>
            </el-col>
        </el-form-item>
    </el-form>

    <kdDialog ref="look-kdDialog" :show-footer="false" dialog-title="" dialog-width="60%">
      <div slot="content">
        <img :src="formObj.vcover" style="max-width:90%">
      </div> 
    </kdDialog>
  </div>
</template>

<script src="./operate.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
.content{
    font-family: '微软雅黑', sans-serif;
    font-weight: 400;
    font-size: 14px;
}
.case{
    margin:8px 0px 10px 0px;
    font-size: 16px;
    line-height: 20px;
}
.vdo{
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.goods-pre {
  border-radius: 6px;
  position: relative;
  width: 148px;
  height: 148px;
  overflow: hidden;
}
.goods-avatar {
  width: 148px;
  height: 148px;
}
.goods-pre:hover .goods-pre-btn {
  display: block;
}

.goods-pre:hover .el-icon-error {
  display: block;
}

.goods-pre .el-icon-error {
  right: 3px;
  top: 3px;
  cursor: pointer;
  position: absolute;
  z-index: 12;
  display: none;
}
.goods-pre-btn {
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin-top: -45px;
  color: #fff;
  cursor: pointer;
  position: absolute;
  text-align: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  display: none;
}
</style>