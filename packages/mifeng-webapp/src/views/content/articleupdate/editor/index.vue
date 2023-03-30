<template>
  <cropperDialog
    :currentArticleId="currentArticleId"
    ref="cropperDialogRef"
    :ifReCropperImg="ifReCropperImg"
    v-model:dialogVisible="showCropperDialog"
    :content="formObj.contentHtml"
    @updateCover="updateCover"
    :current="current"
  ></cropperDialog>
  <Panel>
    <AForm
      ref="formRef"
      class="article-box"
      :model="formObj"
      :rules="rules"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 20 }"
    >
      <div class="article-box-left">
        <!-- <ARow>
          <ACol :span="8">
            <AFormItem label="1">
              <span>内容信息</span>
            </AFormItem>
          </ACol>
        </ARow> -->
        <AFormItem label="文章标题：" name="title" has-feedback>
          <AInput
            autocomplete="off"
            :showCount="true"
            :maxlength="60"
            allowClear
            v-model:value="formObj.title"
            placeholder="限输入5-60个字的标题"
          />
        </AFormItem>
        <AFormItem label="对应栏目" name="contentColumnId">
          <div style="display: flex">
            <a-select v-model:value="formObj.contentColumnId" placeholder="请选择对应栏目">
              <a-select-option v-for="cc in contentColumnOptions" :key="cc.value" :value="cc.value">
                {{ cc.label }}
              </a-select-option>
            </a-select>
            <AButton v-if="!committee" type="primary" style="margin-left: 10px" @click="addColumnFunc">
              添加栏目
            </AButton>
            <AButton type="primary" style="margin-left: 10px" @click="importArticle">导入微信文章</AButton>
          </div>
        </AFormItem>
        <AFormItem label="文章内容" name="content"> </AFormItem>
        <div style="margin-left: 30px">
          <WangEditor ref="editorElem" v-model:content="formObj.contentHtml" />
        </div>

        <AFormItem style="margin-top: 10px" v-if="hasEntry" label="相关人物：">
          <RelatedRecommend
            :entry-list="entryList"
            @remove-entry="removeHandler"
            @add-entry="addEntry"
            @left-handler="leftHandler"
            @right-handler="rightHandler"
          />
        </AFormItem>
        <ARow>
          <ACol :push="1" :span="10">
            <AFormItem name="video">
              <div class="vdo">视频</div>
              <VideoUpLoad v-model:value="videoValue" @Succeed="uploadVideoSucceed" />
              <div class="tips">建议视频大小不超过500M, 选填</div>
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem name="videoImg">
              <div class="vdo">视频封面</div>
              <ImageUpLoad
                v-model:url="formObj.videoCoverURL"
                :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
                :limit="1"
                :customRequest="
                  content => {
                    return uploadImage(content, 'videoCoverURL')
                  }
                "
              />
              <div class="tips">支持格式：jpeg、png、jpg</div>
            </AFormItem>
          </ACol>
        </ARow>
      </div>
      <div class="article-box-right">
        <ATabs v-model:activeKey="formObj.type">
          <ATabPane v-if="!committee" :key="2">
            <template #tab>
              <span>
                <img class="cover-img" src="https://ysh-cdn.kaidicloud.com/prod/png/weixin.png" />
                公众号
              </span>
            </template>
            <div v-if="!isImpower" class="impower">
              您未授权公众号, <AButton type="link" @click="goHref">立即授权</AButton>
            </div>
            <div v-else>
              <!-- <div> -->
              是否发布到微信公众号：
              <a-radio-group v-model:value="formObj.pushOfficialAccount">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
              <div v-if="formObj.pushOfficialAccount === 1">
                <div class="hd" style="margin-top: 18px">1、封面设置</div>
                <AFormItem label="封面图片：">
                  <a-popover trigger="hover">
                    <template #content>
                      <p><a-button @click="selectImg(1)">从正文选择</a-button></p>
                      <p>
                        <a-upload
                          :before-upload="handleBeforeUpload"
                          accept="image/*"
                          :show-upload-list="false"
                          :customRequest="
                            content => {
                              return uploadImage(content, 'wechatCover')
                            }
                          "
                        >
                          <a-button> 本地上传 </a-button>
                        </a-upload>
                      </p>
                      <p>
                        <a-button v-if="formObj.wechatCover" @click="reCropper({ img: formObj.wechatCover }, true)"
                          >重新裁剪</a-button
                        >
                      </p>
                    </template>
                    <div class="cover flex-x-center-center">
                      <plus-outlined v-if="!formObj.wechatCover" />
                      <img v-else :src="formObj.wechatCover" />
                    </div>
                  </a-popover>
                  <!-- <ImageUpLoad
                  v-model:url="formObj.wechatCover"
                  :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
                  :limit="1"
                  :customRequest="
                    content => {
                      return uploadImage(content, 'wechatCover')
                    }
                  "
                /> -->
                  <div class="tips flex-y">
                    <span>建议尺寸：900*383px </span><span>支持格式：jpg、jpeg、png、bmp </span>
                    <span>支持大小：10M以内</span>
                  </div>
                </AFormItem>
                <AFormItem label="内容摘要：">
                  <ATextarea
                    :showCount="true"
                    :maxlength="120"
                    :autoSize="{ minRows: 4, maxRows: 6 }"
                    allowClear
                    v-model:value="formObj.wechatAbstract"
                    placeholder="选填，摘要会在订阅号消息，转发链接等文章外的场景显露，帮助读者快速了解内容，如不填写则默认抓取正文前54字"
                  />
                </AFormItem>
                <AFormItem label="原文链接：">
                  <AInput allowClear v-model:value="formObj.articleLink" />
                </AFormItem>
                <div class="hd">2、发布设置</div>
                <AFormItem>
                  <ARadioGroup v-model:value="formObj.publishSet">
                    <ARadio :value="1">只发这一篇</ARadio>
                    <ARadio :value="2">
                      发多篇
                      <!-- <ATooltip>
                      <template #title>
                        当您第一次使用发布功能，并且需要将多篇文章发布到公众号时，假设是A、B两篇，
                        您创作A时，选择”我还要写多篇文章，暂不发布到公众号“；
                        创作B时，将A添加进来，即可实现一次性将A、B发布到公众号；
                      </template>
                      <question-circle-filled />
                    </ATooltip> -->
                    </ARadio>
                  </ARadioGroup>
                </AFormItem>
                <div v-if="formObj.publishSet === 2">
                  <AFormItem>
                    <AButton
                      type="primary"
                      plain
                      :disabled="formObj.wechatArticles.length >= 8"
                      style="margin-left: 10px"
                      @click="onSelectArticle"
                    >
                      选择更多文章
                    </AButton>
                  </AFormItem>
                  <AFormItem>
                    <!-- 文章数组 -->
                    <div class="article_news">
                      <div v-for="(item, index) in formObj.wechatArticles" :key="index" class="article_news-boxes">
                        <div class="news-boxes-left">
                          <!-- 数组第一个数据 -->
                          <div v-if="index == 0" class="news-boxes-frist">
                            <div class="frist-essay">
                              <AImage :src="item.img || imgUrl" fit="cover" />
                              <div class="frist-pre-btn">
                                {{ item.title || '暂无标题' }}
                              </div>
                            </div>
                            <div class="frist-essay-button">
                              <AButton type="primary" plain @click="onNewest(3)">最新三篇</AButton>
                              <AButton type="primary" style="margin: 0px 5px" plain @click="onNewest(5)"
                                >最新五篇</AButton
                              >
                              <AButton type="primary" plain @click="onNewest(7)">最新七篇</AButton>
                            </div>
                          </div>

                          <!-- 后面7条文章数据 -->
                          <div v-else class="news-boxes-frist news-boxes-rear">
                            <div class="news-boxes-topic">{{ item.title || '暂无标题' }}</div>
                            <AImage style="width: 88px; height: 88px" :src="item.img || imgUrl" fit="cover" />
                          </div>
                        </div>
                        <div class="news-boxes-right">
                          <a-popover trigger="hover" v-if="item.id !== 0">
                            <template #content>
                              <p><a-button @click="selectImg(2, item.id)">从正文选择</a-button></p>
                              <p>
                                <a-upload
                                  :before-upload="handleBeforeUpload"
                                  accept="image/*"
                                  :show-upload-list="false"
                                  :customRequest="
                                    content => {
                                      return uploadImage(
                                        content,
                                        index == 0 ? 'wechatCover' : 'updatePublishCover',
                                        index
                                      )
                                    }
                                  "
                                >
                                  <a-button> 本地上传 </a-button>
                                </a-upload>
                              </p>
                              <a-button v-if="item.img" @click="reCropper(item, false)">重新裁剪</a-button>
                            </template>
                            <div class="update-cover">调整封面</div>
                          </a-popover>

                          <!-- 上移 -->
                          <arrow-up-outlined v-if="index !== 0" @click="up(index)" />
                          <!-- 删除 -->
                          <close-outlined v-if="item.id !== 0" @click="del(index)" />
                          <!-- 下移 -->
                          <arrow-down-outlined
                            v-if="formObj.wechatArticles.length - 1 !== index"
                            @click="down(index)"
                          />
                        </div>
                      </div>
                    </div>
                  </AFormItem>
                </div>
              </div>
            </div>
          </ATabPane>
          <ATabPane :key="1">
            <template #tab>
              <span>
                <img class="cover-img" src="https://ysh-cdn.kaidicloud.com/prod/png/association.png" />
                云商会
              </span>
            </template>
            <div class="hd">1、封面设置</div>
            <AFormItem label="封面管理：" name="imgManager">
              <ARadioGroup v-model:value="formObj.coverType" @change="resetCoverImgs(formObj.coverType)">
                <ARadio :value="0">自动（使用文章图片，无图片不显示）</ARadio>
                <ARadio :value="1">自定义（单图）</ARadio>
                <ARadio :value="2">自定义（3图）</ARadio>
              </ARadioGroup>
            </AFormItem>
            <AFormItem v-if="formObj.coverType === YSH_COVERIMG_NUM.one" label="封面图片" name="coverImg1">
              <!-- <ImageUpLoad v-model:url="formObj.coverImgs[0]" :limit="1" :customRequest="uploadImage" /> -->
              <CropperUpLoad
                v-model:url="formObj.coverImgs[0]"
                :limit="1"
                :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
                :autoCropWidth="176"
                :autoCropHeight="176"
                :isArticleCoverImg="true"
              />
              <div class="tips">建议尺寸：176 x 176;支持格式：jpeg、png、jpg</div>
            </AFormItem>
            <AFormItem v-if="formObj.coverType === YSH_COVERIMG_NUM.three" label="封面图片" name="coverImg2">
              <AFormItemRest>
                <div style="display: flex">
                  <!-- <ImageUpLoad
                    v-for="(item, index) in 3"
                    :key="index"
                    v-model:url="formObj.coverImgs[item - 1]"
                    :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
                    :limit="1"
                    :customRequest="
                      content => {
                        return uploadImage(content, 'coverImgs', index)
                      }
                    "
                  /> -->
                  <CropperUpLoad
                    v-for="(item, index) in 3"
                    :key="index"
                    v-model:url="formObj.coverImgs[item - 1]"
                    :limit="1"
                    :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
                    :autoCropWidth="220"
                    :autoCropHeight="220"
                    :isArticleCoverImg="true"
                  />
                </div>
                <div class="tips">建议尺寸：220 x 220;支持格式：jpeg、png、jpg</div>
              </AFormItemRest>
            </AFormItem>

            <div class="hd">2、发布设置</div>
            <AFormItem label="分享标题:" has-feedback name="shareTitle">
              <AInput
                autocomplete="off"
                allowClear
                :maxlength="25"
                :showCount="true"
                v-model:value="formObj.articleExtendDTO.shareTitle"
                placeholder="请输入分享标题"
              />
            </AFormItem>
            <ARow>
              <ACol :push="3" :span="6">
                <AFormItem name="shareFriendPicture">
                  <div class="vdo">分享微信好友图</div>
                  <!-- <ImageUpLoad
                    v-model:url="formObj.articleExtendDTO.shareFriendPicture"
                    :pattern="new RegExp(/\.(?:png|jpg)$/i)"
                    :limit="1"
                    :customRequest="
                      content => {
                        return uploadImage(content, 'shareFriendPicture')
                      }
                    "
                  /> -->
                  <CropperUpLoad
                    v-model:url="formObj.articleExtendDTO.shareFriendPicture"
                    :limit="1"
                    :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
                    :autoCropWidth="750"
                    :autoCropHeight="600"
                    :isArticleCoverImg="true"
                  />
                  <div class="tips">建议尺寸：750x600;</div>
                  <div class="tips">支持格式：png、jpg</div>
                </AFormItem>
              </ACol>
              <ACol :push="5" :span="6">
                <AFormItem name="sharePoster">
                  <div class="vdo">分享海报图</div>
                  <!-- <ImageUpLoad
                    v-model:url="formObj.articleExtendDTO.sharePoster"
                    :pattern="new RegExp(/\.(?:png|jpg)$/i)"
                    :limit="1"
                    :customRequest="
                      content => {
                        return uploadImage(content, 'sharePoster')
                      }
                    "
                  /> -->
                  <CropperUpLoad
                    v-model:url="formObj.articleExtendDTO.sharePoster"
                    :limit="1"
                    :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
                    :autoCropWidth="600"
                    :autoCropHeight="446"
                    :isArticleCoverImg="true"
                  />
                  <div class="tips">建议尺寸：600x446;</div>
                  <div class="tips">支持格式：png、jpg</div>
                </AFormItem>
              </ACol>
            </ARow>

            <AFormItem>
              <AButton type="primary" style="margin-left: 10px" @click="showPreview">实时预览</AButton>
            </AFormItem>
          </ATabPane>
        </ATabs>
      </div>
    </AForm>

    <ARow style="margin-top: 30px">
      <ACol :push="9" :span="24">
        <AFormItem label="发布时间：" name="status">
          <ARadioGroup v-model:value="formObj.status">
            <ARadio :value="1">立即发布</ARadio>
            <ARadio :value="4">定时发布</ARadio>
          </ARadioGroup>
        </AFormItem>
        <AFormItem v-if="formObj.status == 4" name="publishTs">
          <a-date-picker
            show-time
            v-model:value="formObj.publishTs"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期时间"
            valueFormat="YYYY-MM-DD HH:mm:ss"
          />
        </AFormItem>
      </ACol>
    </ARow>
    <ARow>
      <ACol :push="10" :span="24">
        <AButton type="primary" v-dbClick @click="ToSave" :loading="saveLoading">发布</AButton>
        <AButton @click="closeTab" style="margin-left: 20px">取消</AButton>
      </ACol>
    </ARow>
    <AddColumn v-model:addColumnVisible="addColumnVisible" @freshData="getContentColumnType" />
    <EntryModel
      v-model:entryVisible="entryVisible"
      :entryInfo="entryInfo"
      @onSureHandler="sureHandler"
      :title="'绑定词条'"
    />
    <Preview v-model:previewVisible="previewVisible" :previewObj="formObj" />
    <ArtLink v-model:articleVisible="articleVisible" v-model:contentHtml="formObj.contentHtml" />
    <SelectArticle ref="selectArticle" :articleId="articleId" @confirm="onConfirm" />
    <AModal
      v-model:visible="qrCodeVisible"
      title="二维码分享"
      @cancel="handleClose"
      @ok="goToCarousel"
      okText="添加首页轮播图"
      centered
      :cancelButtonProps="{ style: { display: 'none' } }"
      :okButtonProps="{ style: { display: 'flex', marginLeft: '50%', transform: 'translateX(-50%)' } }"
    >
      <div class="share-content">
        <span class="tips-text">已发布到云商会，扫码立即分享</span>
        <img :src="qrCodeUrl" />
        <div class="tips-text recommend-tips">还可以将文章添加到首页轮播图，推荐给更多会员</div>
      </div>
    </AModal>
  </Panel>
</template>

<script src="./editor.js"></script>

<style lang="scss" scoped>
.b {
  color: aqua !important;
}
:deep(.editor) {
  width: 100%;
}
.share-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 248px;
    height: 248px;
  }
  .tips-text {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .recommend-tips {
    width: 388px;
    height: 36px;
    margin-top: 20px;
    text-align: center;
    background: #f7f7f7;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    line-height: 36px;
  }
}
.article-box {
  display: flex;

  .article-box-left {
    width: 57%;
    padding: 20px;
    background: #f5f6fa;
  }
  .article-box-right {
    width: 43%;
    padding: 20px;
    background: #fff;
    .cover-img {
      width: 25px;
      height: 25px;
    }
    .article_news {
      margin-top: 20px;
      .article_news-boxes {
        display: flex;
        align-items: center;
        .news-boxes-right {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin-left: 20px;
          font-size: 25px;
        }
        .news-boxes-left {
          width: 450px;
          .news-boxes-frist {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 15px;
            .frist-essay {
              position: relative;
              .frist-essay-img {
                width: 100%;
                height: 100%;
              }
              .frist-pre-btn {
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
                text-overflow: ellipsis; /* 超出部分省略号 */
                word-break: break-all; /* break-all(允许在单词内换行。) */
                display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
                -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
                -webkit-line-clamp: 2; /* 显示的行数 */
              }
            }
            .frist-essay-button {
              width: 100%;
              text-align: center;
              margin-top: 20px;
            }
          }
          .news-boxes-rear {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            height: 110px;
            .news-boxes-topic {
              width: 70%;
              overflow: hidden;
              text-overflow: ellipsis; /* 超出部分省略号 */
              word-break: break-all; /* break-all(允许在单词内换行。) */
              display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
              -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
              -webkit-line-clamp: 2; /* 显示的行数 */
            }
          }
        }
      }
    }
  }
  .tips {
    width: 100%;
    color: #bdbdbd;
    font-size: 14px !important;
  }
  .vdo {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
  }
  .hd {
    padding: 12px 14px;
    color: #333333;
    background: #f2f2f2;
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
    margin-bottom: 20px;
  }
}
// fix:菜单换行下拉框弹出遮挡
:deep(.w-e-menu) {
  z-index: auto !important;
  .w-e-droplist {
    z-index: 3 !important;
  }
}
.update-cover {
  font-size: 14px;
  width: 40px;
}
.cover {
  width: 100px;
  height: 100px;
  background: #f2f2f2;
  border: 1px dashed #d7d7d7;
  img {
    width: 98px;
    height: 98px;
  }
}
</style>
