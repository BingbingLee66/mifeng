<template>
  <div class="app-container">
    <div class="hd">动态信息</div>
    <div class="promulgator">
      <div>
        <span style="color: #ff0101">*</span>
        <span class="handle">选择发布者</span>
        <el-button
          :type="mode==='add'? 'primary' :'info'"
          size="small"
          @click="showOfficialComponent($event)"
          >去选择
        </el-button>
        <span class="text-tips"
          >仅可选择一位发布者，重选后，新选择的发布者将会替换已选发布者</span
        >
      </div>

      <div class="table" v-if="tableData.length > 0">
        <el-table
          class="table"
          :data="tableData"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column prop="wxUserId" label="用户ID" width="180">
          </el-table-column>
          <el-table-column prop="uname" label="用户名" width="180">
          </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="chamberName" label="所属商会" width="180">
          </el-table-column>
          <el-table-column prop="name" label="操作" width="180">
            <template>
              <el-button type="text" @click="deleteUser" v-if="mode==='add'"> 移除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="dynamic">
        <div class="handle dynamic-text">动态内容</div>
        <editorElem
          :hiddenMenu="true"
          :height="200"
          @addParentHtml="addParentHtml"
          :content="contentHtml"
        ></editorElem>
      </div>
      <el-form  label-position="top" label-width="80px" v-if="type===2">
        
          <el-form-item label="动态视频"  v-loading="loading">
            <el-upload
           
              v-if="!vid"
              action="/"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :http-request="function (content) {return uploadVideoFunc(content);}"
              :show-file-list="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <div class="goods-pre" v-else>
              <videoComponent  ref="videoRef" v-if="vid" :vid="vid" height="148px"></videoComponent>
              <i
                class="el-icon-error"
                style="font-size:20px;color:red;"
                @click="deleteCurrentVideo"
              ></i>
              <!-- <i
                class="el-icon-error"
                @click="deleteCurrentVideo"
              ></i>
              <el-image
                :src="dynamicExtendDTO.shareFriendPicture"
                class="goods-avatar"
              />
              <div class="goods-pre-btn" @click="openPreviewModal(dynamicExtendDTO.shareFriendPicture)">
                预览
              </div> -->
            </div>
          </el-form-item>
          
        <!-- <el-form-item label="动态视频">
            <el-upload
              v-if="!vid"
              action="/"
              :before-upload="beforeAvatarUpload"
              :http-request="function (content) {return uploadVideoFunc(content);}"
              :show-file-list="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <div class="goods-pre" v-else>
               <videoComponent  ref="videoRef" v-if="vid" :vid="vid" height="148px"></videoComponent>
              <i
                class="el-icon-error"
                style="font-size:20px;color:red;"
                @click="deleteCurrentVideo"
              ></i>

            </div>
          </el-form-item> -->
 <el-form-item label="视频封面">
            <el-upload
              v-if="!videoDetail"
              action="/"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :http-request="function (content) {return clickUpload(content, 1, 'video-cover');}"
              :show-file-list="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <div class="goods-pre" v-else>
              <i
                class="el-icon-error"
                @click="deleteCurrentImg(1, 'video-cover', 1)"
              ></i>
              <el-image
                :src="videoDetail"
                class="goods-avatar"
              />
              <div class="goods-pre-btn" @click="openPreviewModal(videoDetail)">
                预览
              </div>
            </div>
          </el-form-item>
          <div class="share-tips">
            支持格式：jpeg、png、jpg
          </div>
      </el-form>
        
      <div class="dynamic">
        <div v-if="type===1">
          <div>
          <span class="handle dynamic-text">动态图片</span>
          <!-- <span class="text-tips">拖拽可调整图片顺序</span> -->
        </div>
        <div class="dynamic-list">
          <div
            v-for="(val, index) in gallery"
            class="dynamic-list-item"
            :key="index"
          >
            <!-- {{ index }}--index -->
            <el-upload
              v-if="!val"
              action="/"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :http-request="function (content) {return clickUpload(content, index, 'articleCoverImg');}"
              :show-file-list="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="goods-pre" v-else>
              <i
                class="el-icon-error"
                @click="deleteCurrentImg(index, 'articleCoverImg')"
              ></i>
              <el-image
                :preview-src-list="previewList"
                :src="val"
                class="goods-avatar"
              />
              <div class="goods-pre-btn" @click="openPreviewModal(val)">
                预览
              </div>
            </div>
          </div>
        </div>
        </div>
        
        <span class="handle dynamic-text">选择同步商会</span>
        <div class="chamber-view">
          <div class="chamber-view-text">在这些商会内同步动态</div>
          <div>
            <span style="color: #1890ff">已选:</span>
            <el-tag
              :key="tag"
              v-for="(tag, index) in selectChamberList"
              @keydown="tag.id"
              :closable="mode==='add' ?true :false"
              :disable-transitions="false"
              @close="handleClose(tag, index)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
          <div class="chamber-view-text" style="margin-top:10px">不同步到以下商会</div>
          <div
            class="noChamber"
          >
            <div   :key="tag"  v-for="(tag, index) in noChamberList"  @close="noChamberList(tag, index)" class="noChamber-list">
            <span class="noChamberList-item-text"> {{ tag.name }}</span> 
              <i v-if="mode==='add'" class="el-icon-circle-plus add" @click="addSelectChamber(tag, index)"></i>
               <!-- <div class="add">+</div> -->
            </div>

           
          </div>
        </div>
      </div>
      <div class="share-msg">
        <div class="hd">分享信息</div>
        <el-form
          label-position="top"
          label-width="80px"
          :model="dynamicExtendDTO"
        >
          <el-form-item label="分享标题">
            <el-input v-model="dynamicExtendDTO.shareTitle"></el-input>
          </el-form-item>
         
          <el-form-item label="分享微信好友图">
            <el-upload
              v-if="!dynamicExtendDTO.shareFriendPicture"
              action="/"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :http-request="function (content) {return clickUpload(content, index, 'share');}"
              :show-file-list="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <div class="goods-pre" v-else>
              <i
                class="el-icon-error"
                @click="deleteCurrentImg(1, 'share', 1)"
              ></i>
              <el-image
                :src="dynamicExtendDTO.shareFriendPicture"
                class="goods-avatar"
              />
              <div class="goods-pre-btn" @click="openPreviewModal(dynamicExtendDTO.shareFriendPicture)">
                预览
              </div>
            </div>
          </el-form-item>
          <div class="share-tips">
            建议尺寸：750 × 600 ； 支持格式：png、jpg
          </div>
          <el-form-item label="分享海报图">
            <el-upload
              v-if="!dynamicExtendDTO.sharePoster"
              action="/"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :http-request="function (content) {return clickUpload(content, 2, 'share', 2);}"
              :show-file-list="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <div class="goods-pre" v-else>
              <i
                class="el-icon-error"
                @click="deleteCurrentImg(1, 'share', 2)"
              ></i>
              <el-image
                :src="dynamicExtendDTO.sharePoster"
                class="goods-avatar"
              />
              <div class="goods-pre-btn" @click="openPreviewModal(dynamicExtendDTO.sharePoster)">
                预览
              </div>
            </div>
          </el-form-item>
          <div class="share-tips">
            建议尺寸：600 × 446 ； 支持格式：png、jpg
          </div>
          <el-form-item style="margin-top:14px">
            <el-button type="primary" @click="submitForm">发布</el-button>
            <el-button @click="resetForm"> 取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <officialComponent
      :type="2"
      ref="OfficialComponent"
      title="添加发布者"
    ></officialComponent>
       
    <kdDialog ref="kdDialog" :showFooter="false" dialogTitle="" dialogWidth="60%">
      <div slot="content">
        <img :src="currentImg" style="max-width:90%"/>
        </div> </kdDialog>

  </div>
</template>

<script src="./index.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.promulgator {
  font-size: 14px;
  color: #333333;
  font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
  font-weight: 700;
  .text-tips {
    color: #aaaaaa;
    margin-left: 15px;
  }
  .handle {
    margin-right: 20px;
  }
  .table {
    margin-top: 20px;
  }
  .dynamic {
    margin: 30px 0px;
  }
  .dynamic-text {
    margin: 0px 0px 20px 5px;
  }
}
.hd {
  padding: 12px 14px;
  color: #333333;
  background: #f2f2f2;
  font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  margin-bottom: 20px;
}
.dynamic-list {
  width: 560px;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
}
.dynamic-list-item {
  margin-right: 18px;
  margin-bottom: 10px;
  width: 148px;
  height: 148px;
}
.goods-pre {
  // border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  width: 148px;
  height: 148px;
  // overflow: hidden;
  /*float: left;*/
  // margin-right: 10px;
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
  margin-top: -30px;
  color: #fff;
  cursor: pointer;
  position: absolute;
  text-align: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  display: none;
}
.share-tips {
  font-size: 13px;
  color: #aaaaaa;
}
.chamber-view {
  border: 1px solid #ededed;
  padding: 20px 10px 20px 10px;
  margin-top: 20px;
}
.contentHtml {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  img {
    width: 20% !important;
    height: 20% !important;
  }
}
.noChamber {
  
  display: flex;
  .add {
    position: absolute;
    top: -8px;
    right: -6px;
    color: rgb(24, 144, 255);
    z-index: 4;
    font-size: 16px;
    // border: 1px solid rgb(24, 144, 255);
    // width: 18px;
    // height: 18px;
    // text-align: center;
    // border-radius: 50%;
  }
  .noChamber-list{
    padding: 7px 5px;
    border: 1px solid #555555;
    border-radius: 2px;
position: relative;
display: flex;
margin-right: 6px;
font-size: 13px;
  }
  
  .noChamberList-item-text{
    position: relative;
    z-index: 2;
  }
}
.chamber-view-text{
    margin-bottom: 10px;
  }
#myhtml img {
  width: 20% !important;
  height: 20% !important;
}
</style>
