<template>
  <div class="containers">
    <!-- 上传视频阿里云组件 -->
    <videoUpLoad :id="articleId === '' ? 0 : articleId" ref="VideoUpLoad" :source-type="1" @Succeed="onSucceed" @error="loading = false" />
    <preview ref="preview" />
    <div class="article-box">
      <el-form ref="form" style="display: flex;" :model="formObj" :rules="rules" label-position="right" label-width="100px">

        <div class="article-box-left">

          <el-row>
            <el-col :span="24">
              <el-form-item label="文章标题：" prop="title">
                <el-input v-model="formObj.title" maxlength="60" placeholder="限输入5-60个字的标题" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <div>
              <el-col :span="12">
                <el-form-item label="对应栏目：" prop="contentColumnId">
                  <el-select v-model="formObj.contentColumnId" placeholder="请选择对应栏目" style="display: inline-block">
                    <el-option v-for="cc in contentColumnOptions" :key="cc.value" :label="cc.label" :value="cc.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
            <el-button v-if="!committee" type="primary" style="margin-left:10px" @click="addColumnFunc">添加栏目</el-button>

            <el-button type="primary" style="margin-left:10px" @click="importArticle">导入微信文章</el-button>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="相关推荐：" class="ue-wrap">
                <RelatedRecommend
                  :entry-list="entryList"
                  @remove-entry="removeHandler"
                  @add-entry="addEntry"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="文章内容：" class="ue-wrap">
                <editorElem ref="editorElem" :content="formObj.contentHtml" @addParentHtml="addParentHtml" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item v-loading="loading">
                <div class="vdo">视频</div>
                <el-upload
                  v-if="!formObj.vid"
                  action="/"
                  list-type="picture-card"
                  :before-upload="beforeAvatarUploadVideo"
                  :http-request="function (content) {return uploadVideoFunc(content);}"
                  :show-file-list="false"
                >
                  <i class="el-icon-plus" />
                </el-upload>

                <div v-else class="goods-pres">
                  <videoComponent v-if="formObj.vid" ref="videoRef" :vid="formObj.vid" height="148px" />
                  <i
                    class="el-icon-error"
                    style="font-size:20px;color:red;"
                    @click="deleteCurrentVideo"
                  />
                </div>

                <div class="tips">建议视频大小不超过500M, 选填</div>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item>
                <div class="vdo">视频封面</div>
                <el-upload
                  v-if="!formObj.videoCoverURL"
                  action="/"
                  list-type="picture-card"
                  :before-upload="function (file) { return beforeAvatarUpload(file) }"
                  :http-request="function (content) {return upload(content, 'videoCoverURL')}"
                  :show-file-list="false"
                >
                  <i class="el-icon-plus" />
                </el-upload>

                <div v-else class="goods-pres">
                  <i
                    class="el-icon-error"
                    @click="deleteCurrentImg('videoCoverURL')"
                  />
                  <el-image
                    :src="formObj.videoCoverURL"
                    class="goods-avatar"
                  />
                  <div class="goods-pres-btn" @click="openPreviewModal(formObj.videoCoverURL)">
                    预览
                  </div>
                </div>
                <div class="tips">支持格式：jpeg、png、jpg</div>
              </el-form-item>
            </el-col>

          </el-row>

        </div>

        <div class="article-box-right">

          <el-row>
            <div class="cover-radio-df">
              <div class="df-box" @click="formObj.type = 1">
                <img class="cover-img" src="https://ysh-cdn.kaidicloud.com/prod/png/association.png">
                <span :class="formObj.type == 1 ?'site':''" style="margin-left: 5px;">云商会</span>
              </div>
              <div class="df-box" @click="formObj.type = 2">
                <img class="cover-img" src="https://ysh-cdn.kaidicloud.com/prod/png/weixin.png">
                <span :class="formObj.type == 2 ?'site':''" style="margin-left: 5px;">公众号</span>
              </div>
            </div>
          </el-row>
          <!-- 商协会内容 -->
          <div v-if="formObj.type == 1">
            <div class="hd">1、文章封面设置</div>
            <el-row>
              <div class="cover-radio">
                <el-radio-group v-model="formObj.coverType" style="display: flex;flex-direction: column;" @change="resetCoverImgs(formObj.coverType)">
                  <el-radio style="margin-bottom: 10px;" :label="0">自动（使用文章图片，无图片不显示）</el-radio>
                  <el-radio style="margin-bottom: 10px;" :label="1">自定义（单图）</el-radio>
                  <el-radio style="margin-bottom: 10px;" :label="2">自定义（3图）</el-radio>
                </el-radio-group>
              </div>
            </el-row>

            <el-row v-if="formObj.coverType == 1">
              <el-col :span="24">
                <el-form-item label="封面图片：" prop="coverImgs[0]" :rules="rules.coverImg1">
                  <el-upload class="avatar-uploaders" action="/" :show-file-list="false" :before-upload="function (file) { return beforeAvatarUpload(file, 0) }" :http-request="upload">
                    <img v-if="formObj.coverImgs[0]" :src="formObj.coverImgs[0]" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icons" />
                  </el-upload>
                  <div class="tips">建议尺寸：176 x 176;支持格式：jpeg、png、jpg</div>
                </el-form-item>

              </el-col>
            </el-row>
            <el-row v-if="formObj.coverType == 2" style="margin-bottom:0px">
              <el-col :span="7">
                <el-form-item label="封面图片：" prop="coverImgs[0]" :rules="rules.coverImg1">
                  <el-upload class="avatar-uploaders" action="/" :show-file-list="false" :before-upload="function (file) { return beforeAvatarUpload(file, 0) }" :http-request="upload">
                    <img v-if="formObj.coverImgs[0]" :src="formObj.coverImgs[0]" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icons" />
                  </el-upload>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row v-if="formObj.coverType == 2" style="margin-bottom:0px">
              <el-col :span="7">
                <el-form-item label="" prop="coverImgs[1]" :rules="rules.coverImg2">
                  <el-upload class="avatar-uploaders" action="/" :show-file-list="false" :before-upload="function (file) { return beforeAvatarUpload(file, 1) }" :http-request="upload">
                    <img v-if="formObj.coverImgs[1]" :src="formObj.coverImgs[1]" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icons" />
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="formObj.coverType == 2" style="margin-bottom:0px">
              <el-col :span="7">
                <el-form-item label="" prop="coverImgs[2]" :rules="rules.coverImg3">
                  <el-upload class="avatar-uploaders" action="/" :show-file-list="false" :before-upload="function (file) { return beforeAvatarUpload(file, 2) }" :http-request="upload">
                    <img v-if="formObj.coverImgs[2]" :src="formObj.coverImgs[2]" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icons" />
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

            <div v-if="formObj.coverType == 2" style="margin:0px 0px 10px 100px" class="tips">建议尺寸：220 x 220;支持格式：jpeg、png、jpg</div>

            <div class="hd">2、文章分享设置</div>

            <el-form-item label="分享标题：">
              <!-- <div class="vdo">分享标题</div> -->
              <el-input v-model="formObj.articleExtendDTO.shareTitle" placeholder="请输入分享标题" maxlength="25" show-word-limit />
            </el-form-item>

            <div style="margin-left:-80px">
              <el-row>
                <el-col :span="12">
                  <el-form-item>
                    <div class="vdo">分享微信好友图</div>
                    <el-upload
                      v-if="!formObj.articleExtendDTO.shareFriendPicture"
                      action="/"
                      list-type="picture-card"
                      :before-upload="function (file) { return beforeAvatarUpload(file) }"
                      :http-request="function (content) {return upload(content, 'shareFriendPicture')}"
                      :show-file-list="false"
                    >
                      <i class="el-icon-plus" />
                    </el-upload>

                    <div v-else class="goods-pres">
                      <i
                        class="el-icon-error"
                        @click="deleteCurrentImg('shareFriendPicture')"
                      />
                      <el-image
                        :src="formObj.articleExtendDTO.shareFriendPicture"
                        class="goods-avatar"
                      />
                      <div class="goods-pres-btn" @click="openPreviewModal(formObj.articleExtendDTO.shareFriendPicture)">
                        预览
                      </div>
                    </div>
                    <div class="tips">建议尺寸：750 x 600</div>
                    <div class="tips"> 支持格式：png、jpg</div>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item>
                    <div class="vdo">分享海报图</div>
                    <el-upload
                      v-if="!formObj.articleExtendDTO.sharePoster"
                      action="/"
                      list-type="picture-card"
                      :before-upload="function (file) { return beforeAvatarUpload(file) }"
                      :http-request="function (content) {return upload(content, 'sharePoster')}"
                      :show-file-list="false"
                    >
                      <i class="el-icon-plus" />
                    </el-upload>

                    <div v-else class="goods-pres">
                      <i
                        class="el-icon-error"
                        @click="deleteCurrentImg('sharePoster')"
                      />
                      <el-image
                        :src="formObj.articleExtendDTO.sharePoster"
                        class="goods-avatar"
                      />
                      <div class="goods-pres-btn" @click="openPreviewModal(formObj.articleExtendDTO.sharePoster)">
                        预览
                      </div>
                    </div>
                    <div class="tips">建议尺寸：600 x 446</div>
                    <div class="tips"> 支持格式：png、jpg</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <el-row>
              <el-col :span="11">
                <el-form-item label="发布时间：">
                  <el-radio-group v-model="formObj.status" style="display: flex;flex-direction: column;margin-top: 12px;">
                    <el-radio style="margin-bottom: 15px;" :label="1">立即发布</el-radio>
                    <el-radio style="margin-bottom: 15px;" :label="4">定时发布</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="formObj.status == 4" :span="8">
                <el-form-item label="" prop="publishTs" label-width="0">
                  <el-date-picker v-model="formObj.publishTs" style="width: 205px;margin-top: 30px;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-button type="primary" style="margin-left:10px" @click="showPreview">实时预览</el-button>
          </div>
          <!--  公众号内容 -->
          <div v-if="formObj.type == 2">
            <div v-if="!isImpower" class="impower">
              您未授权公众号,  <el-link type="primary" @click="goHref">立即授权</el-link>
            </div>
            <div v-else>
              <div class="hd">1、封面设置</div>
              <el-row>
                <el-col :span="18">
                  <el-form-item label="封面图片：" :required="true">
                    <div class="cover-pre">
                      <el-upload
                        class="avatar-uploaders"
                        action="/"
                        :show-file-list="false"
                        :before-upload="function (file) { return beforeAvatarUpload(file, 0) }"
                        :http-request="function (content) {return upload(content, 'wechatCover')}"
                      >
                        <img v-if="formObj.wechatCover" :src="formObj.wechatCover" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icons" />
                        <i v-if="formObj.wechatCover" class="el-icon-edit-outline" />
                      </el-upload>
                      <div class="tips">建议尺寸：900*383px</div>
                    </div>

                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="内容摘要：">
                <el-input v-model="formObj.wechatAbstract" :autosize="{ minRows: 4, maxRows: 6}" placeholder="选填，摘要会在订阅号消息，转发链接等文章外的场景显露，帮助读者快速了解内容，如不填写则默认抓取正文前54字" type="textarea" maxlength="120" show-word-limit />
              </el-form-item>

              <el-form-item label="原文链接：">
                <el-input v-model="formObj.articleLink" />
              </el-form-item>

              <div class="hd">2、发布设置</div>

              <el-row>
                <div class="cover-radio">
                  <el-radio-group v-model="formObj.publishSet">
                    <el-radio :label="1">立即发布到公众号</el-radio>
                    <el-radio :label="2">
                      <span>我还要写多篇文章，暂不发布到公众号</span>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="当您第一次使用发布功能，并且需要将多篇文章发布到公众号时，假设是A、B两篇，
                        您创作A时，选择”我还要写多篇文章，暂不发布到公众号“；
                        创作B时，将A添加进来，即可实现一次性将A、B发布到公众号；"
                        placement="top"
                      >
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-radio>
                  </el-radio-group>
                </div>
              </el-row>
              <el-button type="primary" plain :disabled="formObj.wechatArticles.length >= 8" style="margin-left:10px" @click="onSelectArticle">选择更多文章</el-button>
              <!-- 文章数组 -->
              <div class="article_news">
                <div v-for="(item,index) in formObj.wechatArticles" :key="index" class="article_news-boxes">
                  <div class="news-boxes-left">
                    <!-- 数组第一个数据 -->
                    <div v-if="index == 0" class="news-boxes-frist">
                      <div class="frist-essay">
                        <!-- <img class="frist-essay-img" :src="item.img || imgUrl" alt=""> -->
                        <el-image
                          style="width: 400px; height: 200px"
                          :src="item.img || imgUrl"
                          fit="cover"
                        />
                        <div class="frist-pre-btn">
                          {{ item.title || '暂无标题' }}
                        </div>
                      </div>
                      <div class="frist-essay-button">
                        <el-button type="primary" plain @click="onNewest(3)">最新三篇</el-button>
                        <el-button type="primary" plain @click="onNewest(5)">最新五篇</el-button>
                        <el-button type="primary" plain @click="onNewest(7)">最新七篇</el-button>
                      </div>
                    </div>

                    <!-- 后面7条文章数据 -->
                    <div v-else class="news-boxes-frist news-boxes-rear">
                      <div class="news-boxes-topic"> {{ item.title || '暂无标题' }}</div>
                      <el-image
                        style="width: 88px; height: 88px"
                        :src="item.img || imgUrl"
                        fit="cover"
                      />
                    </div>
                  </div>
                  <div class="news-boxes-right">
                    <!-- 上移 -->
                    <i v-if="index!= 0" class="el-icon-top" @click="up(index)" />
                    <!-- 删除 -->
                    <i v-if="item.id != 0" class="el-icon-close" @click="del(index)" />
                    <!-- 下移 -->
                    <i v-if="formObj.wechatArticles.length - 1 != index" class="el-icon-bottom" @click="down(index)" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </el-form>
    </div>

    <div class="article-btn">
      <el-button @click="closeTab">取消</el-button>
      <el-button v-dbClick type="primary" :loading="btnLoading" @click="save">发布</el-button>
    </div>

    <addColumn ref="addColumnRef" />

    <kdDialog ref="kdDialog" dialog-title="导入微信文章" @savePopupData="savePopupData">
      <div slot="content" class="content">
        <el-input v-model="articleUrl" placeholder="请输入微信文章链接地址" />
        <div class="case">支持导入微信公众号文章</div>
        <div>注意：1.如需获得正式使用权，请自行联系版权所有者
          <br> <span v-for="item in 10" :key="item">&nbsp;</span>2.多次导入内容会进行覆盖
        </div>
      </div>
    </kdDialog>

    <kdDialog ref="look-kdDialog" :show-footer="false" dialog-title="" dialog-width="60%">
      <div slot="content" style="text-align:center">
        <img :src="currentImg" style="max-width:90%">
      </div>
    </kdDialog>
    <!-- 选择文章 -->
    <selectArticle ref="selectArticle" :article-id="articleId || null" @confirm="onConfirm" />
    <entry-dialog
      :visible.sync="entryVisible"
      title="添加词条"
      :entry-info="entryInfo"
      @sure-handler="sureHandler"
      @close="(entryVisible = false)"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <div>
        <span>已发布，扫码立即分享</span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script src="./editor-article.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style lang="scss" scoped>

.avatar-uploaders {
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 180px !important;
  }
}
.avatar-uploaders .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icons {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 180px;
  height: 100px;
  display: block;
}
.editor-wrap{
  /deep/ .editor{
    width: 100% !important;
  }
  .el-form-item__content {
    line-height: 1;
  }
}
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
.tips{
  color:#bdbdbd;
  font-size: 14px !important;
}
.hd{
  padding: 12px 14px;
  color: #333333;
  // background: #f2f2f2;
  font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  margin-bottom: 20px;
}
.vdo{
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.goods-pres {
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
.goods-pres:hover .goods-pres-btn {
  display: block;
}

.goods-pres:hover .el-icon-error {
  display: block;
}

.goods-pres .el-icon-error {
  right: 3px;
  top: 3px;
  cursor: pointer;
  position: absolute;
  z-index: 12;
  display: none;
}

.goods-pres-btn {
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
  bottom: 0;
}
.article-box{

  .article-box-left{
    width: 57%;
    padding: 20px;
    background: #f5f6fa;
  }
  .article-box-right{
    width: 43%;
    padding: 20px;
    background: #fff;
  }
}
.ue-wrap{
  width: 100%;
}
.editor{
  width: 100% !important;
}
.cover-radio{
  margin-left: 15px;
  .cover-img{
    width: 25px;
    height: 25px;
  }
}
.cover-radio-df{
  display: flex;
  align-items: center;
  margin-left: 15px;
  .df-box{
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 30px;
    .cover-img{
      width: 25px;
      height: 25px;
    }
    .site{
      color: #409eff;
    }
  }

}
.impower{
  width: 100%;
  text-align: center;
  margin-top: 70px;
}
.article-btn{
  width: 100%;
  text-align: center;
  margin: 20px 0;
}
.cover-pre{
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.cover-pre:hover .el-icon-edit-outline {
  display: block;
}

.cover-pre .el-icon-edit-outline {
  right: 3px;
  top: 3px;
  cursor: pointer;
  position: absolute;
  z-index: 12;
  display: none;
  font-size: 20px;
}
.article_news{
  margin-top: 20px;
  .article_news-boxes{
    display: flex;
    align-items: center;
    .news-boxes-right{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-left:20px;
      font-size: 25px;
    }
    .news-boxes-left{
      width: 450px;
      .news-boxes-frist{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 15px;
        .frist-essay{
          width: 400px;
          height: 200px;
          position: relative;
          .frist-essay-img{
            width: 100%;
            height: 100%;
          }
          .frist-pre-btn{
            width: 100%;
            min-height: 30px;
            line-height: 30px;
            margin-top: -45px;
            color: #fff;
            position: absolute;
            text-align: center;
            z-index: 10;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            overflow: hidden;
            text-overflow: ellipsis;  /* 超出部分省略号 */
            word-break: break-all;  /* break-all(允许在单词内换行。) */
            display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
            -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
            -webkit-line-clamp: 2; /* 显示的行数 */
          }
        }
        .frist-essay-button{
          width: 100%;
          text-align: center;
          margin-top: 10px;
        }
      }
      .news-boxes-rear{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        height: 110px;
        .news-boxes-topic{
          width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;  /* 超出部分省略号 */
          word-break: break-all;  /* break-all(允许在单词内换行。) */
          display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
          -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
          -webkit-line-clamp: 2; /* 显示的行数 */
        }
        .boxes-rear-img{
          height: 100%;
          width: 88px;
        }
      }
    }
  }
}
</style>
