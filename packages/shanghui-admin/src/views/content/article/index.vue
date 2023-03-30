<template>
  <Panel>
    <AForm
      ref="formRef"
      class="article-box"
      :model="formObj"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <div class="article-box-left">
        <ARow>
          <ACol :span="8">
            <AFormItem label="1">
              <span>内容信息</span>
            </AFormItem>
          </ACol>
        </ARow>
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
        <AFormItem label="文章来源" name="sourceId">
          <a-select v-model:value="formObj.sourceId" placeholder="请选择对应栏目">
            {{ articleSourceOptions }}
            <a-select-option v-for="item in articleSourceOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </AFormItem>
        <AFormItem label="对应栏目" name="contentColumnId">
          <div style="display: flex">
            <a-select v-model:value="formObj.contentColumnId" placeholder="请选择对应栏目">
              <a-select-option v-for="item in contentColumnOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
            <AButton type="primary" class="ml-5" @click="importArticle">导入微信文章</AButton>
          </div>
        </AFormItem>
        <AFormItem label="文章内容" name="content">
          <WangEditor ref="editorElem" v-model:content="formObj.contentHtml" />
        </AFormItem>
        <ARow>
          <ACol :push="3" :span="10">
            <AFormItem name="video">
              <div class="vdo">视频</div>
              <VideoUpLoad v-model:value="videoValue" @Succeed="uploadVideoSucceed" />
              <div class="tips">建议视频大小不超过500M, 选填</div>
            </AFormItem>
          </ACol>
          <ACol :span="10">
            <AFormItem name="videoImg">
              <div class="vdo">视频封面</div>
              <CropperUpLoad
                v-model:url="formObj.videoCoverURL"
                :limit="1"
                :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
                :autoCropWidth="176"
                :autoCropHeight="176"
                :isArticleCoverImg="true"
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
            <AFormItem label="发布时间：" name="status">
              <ARadioGroup v-model:value="formObj.status">
                <ARadio :value="1">立即发布</ARadio>
                <ARadio :value="4">定时发布</ARadio>
              </ARadioGroup>
            </AFormItem>
            <ARow>
              <ACol :push="3" :span="8">
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
            <AFormItem>
              <AButton type="primary" style="margin-left: 10px" @click="showPreview">实时预览</AButton>
            </AFormItem>
          </ATabPane>
        </ATabs>
        <ARow>
          <ACol :push="2" :span="12" style="margin-top: 50px">
            <AButton type="primary" v-dbClick @click="ToSave" :loading="saveLoading">发布</AButton>
            <AButton @click="closeTab" style="margin-left: 20px">取消</AButton>
          </ACol>
        </ARow>
      </div>
    </AForm>
    <Preview v-model:previewVisible="previewVisible" :previewObj="formObj" />
    <ArtLink v-model:articleVisible="articleVisible" v-model:contentHtml="formObj.contentHtml" />
  </Panel>
</template>

<script src="./editor.js"></script>

<style lang="scss" scoped>
:deep(.editor) {
  width: 100%;
}
:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin-bottom: 10px;
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
    padding: 0 20px;
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
              margin-top: 10px;
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
</style>
