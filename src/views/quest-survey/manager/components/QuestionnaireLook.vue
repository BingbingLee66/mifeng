<template>
  <el-dialog class="look" :visible="visible" width="425px" center v-bind="$attrs" v-on="$listeners">
    <div v-loading="loading">
      <div class="phone-page">
        <img class="phone-bg" src="@/assets/img/iphone.png">
        <div class="questionnaire-title">{{ questionnaire.questionnaireTitle }}</div>
        <div class="questionnaire-content">
          <div class="title flex-x-start-center">
            <img class="title-icon" :src="getCDNImg('questionnaire/query-icon.png')">
            问卷调查
          </div>
          <div v-if="questionnaire.state === 0 || (questionnaire.state === 1 && questionnaire.endTs)" class="hint flex-x-start-center">
            <img class="hint-icon" :src="getCDNImg('questionnaire/hint-icon.png')">
            <div class="hint-text">
              <template v-if="questionnaire.state === 0">该问卷未发布，无法提交</template>
              <template v-else>
                将于{{ formatDateTime(+questionnaire.endTs,'yyyy-MM-dd hh:mm') }}结束，请及时填写。
              </template>
            </div>
            <img class="hint-icon" :src="getCDNImg('questionnaire/hint-close.png')" catch:tap="closeTip">
          </div>
          <div v-for="model in questionnaire.commonModelDTOS" :key="model.id" class="quest-card">
            <div class="card-title flex-x">
              <div class="card-required">*</div>
              123132132
              <div v-if="model.componentKey === 'Component_Single_Select'" class="tag flex-x-center-center">单选</div>
              <div v-else-if="model.componentKey === 'Component_Multiple_Select'" class="tag flex-x-center-center">多选</div>
              <div v-else-if="model.componentKey === 'Component_Upload_Image'" class="tag flex-x-center-center">上传照片</div>
              <div v-else-if="model.componentKey === 'Component_Upload_Video'" class="tag flex-x-center-center">上传视频</div>
            </div>
            <!-- 单选 -->
            <template v-if="model.componentKey === 'Component_Single_Select'">
              <div v-for="item in model.selectItem" :key="item.value" class="select flex-x-start-center">
                <img class="select-icon" :src="getCDNImg('questionnaire/radio-unselect.png')">
                <div class="flex-1">{{ item.label }}</div>
              </div>
            </template>
            <!-- 多选 -->
            <template v-if="model.componentKey === 'Component_Multiple_Select'">
              <div v-for="item in model.selectItem" :key="item.value" class="select flex-x-start-center">
                <img class="select-icon" :src="getCDNImg('questionnaire/checkbox-unselect.png')">
                <div class="flex-1">{{ item.label }}</div>
              </div>
            </template>
            <!-- 下拉 -->
            <template v-if="model.componentKey === 'Component_Pulldown_Select'">
              <div class="pull flex-x-between-center">
                <div class="flex-1">请选择</div>
                <img class="right-arrows" :src="getCDNImg('common/icon_arrows_right.png')">
              </div>
            </template>
            <!-- 单行文本 -->
            <template v-if="model.componentKey === 'Component_Single_Text'">
              <div class="textarea">
                最多输入200个字
              </div>
            </template>
            <!-- 上传图片 -->
            <template v-if="model.componentKey === 'Component_Upload_Image'">
              <div class="upload flex-y-center-center">
                <img class="add" :src="getCDNImg('questionnaire/upload-add.png')">
                添加图片
              </div>
            </template>
            <!-- 上传视频 -->
            <template v-if="model.componentKey === 'Component_Upload_Video'">
              <div class="upload flex-y-center-center">
                <img class="add" :src="getCDNImg('questionnaire/upload-add.png')">
                添加视频
              </div>
            </template>
            <!-- 省市区 -->
            <template v-if="model.componentKey === 'Component_Province_City_Area'">
              <div class="area flex-x-between-center" catch:tap="onOpen">
                <img class="area-icon" :src="getCDNImg('questionnaire/area-icon.png')">
                <div class="flex-1">请选择</div>
                <img class="right-arrows" :src="getCDNImg('common/icon_arrows_right.png')">
              </div>
            </template>
          </div>
          <div class="questionnaire-bottom">没有题目了</div>
        </div>
      </div>
    </div>
    <el-button slot="footer" type="primary" @click.stop="$emit('update:visible',!visible)">关闭</el-button>
  </el-dialog>
</template>

<script>
import { questionDetail } from '@/api/quest-survey'
import { formatDateTime } from '@/utils/date'

export default {
  components: {},
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    questionnaireId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      questionnaireMap: {}
    }
  },
  computed: {
    questionnaire() {
      const { questionnaireMap, questionnaireId } = this
      return questionnaireMap[questionnaireId] || {}
    }
  },
  watch: {
    questionnaireId: {
      handler() {
        this.getQuestionDetail()
      },
      immediate: true
    },
    visible: {
      handler() {
        this.getQuestionDetail()
      },
      immediate: true
    }
  },
  methods: {
    formatDateTime,
    getCDNImg(path) {
      return `https://ysh-cdn.kaidicloud.com/test/${path}`
    },
    async getQuestionDetail() {
      const { questionnaireId, questionnaireMap, visible } = this
      if (!visible || !questionnaireId || this.loading) return
      this.loading = true
      try {
        if (questionnaireMap[questionnaireId]) return
        const { data } = await questionDetail({
          id: 25,
          businessType: 1
        })
        this.$set(questionnaireMap, questionnaireId, data)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.look /deep/ .el-dialog {
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin-top: 0 !important;
}

.phone-page {
  position: relative;
  width: 375px;
  height: 700px;

  .phone-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
  }

  .questionnaire-title {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translate(-50%);
    z-index: 1;
    width: 155px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    @include ellipsis(1);
    font-size: 15px;
    font-weight: 500;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #000;
  }

  .questionnaire-content {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%);
    width: 325px;
    height: 575px;
    z-index: 1;
    overflow: auto;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }

    .title {
      padding: 16px 16px 0;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;

      .title-icon {
        width: 19px;
        height: 19px;
        margin-right: 2px;
      }
    }

    .hint {
      padding: 0 13px 0 16px;
      margin-top: 10px;

      .hint-text {
        font-size: 12px;
        color: #222222;
        line-height: 18px;
        margin-left: 7px;
      }

      .hint-icon {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
      }
    }

    .quest-card {
      width: 100%;
      padding: 14px;
      background: #FFFFFF;
      border-radius: 7px;
      margin-top: 11px;

      .card-title {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #222222;
        line-height: 20px;
      }

      .card-required {
        flex-shrink: 0;
        font-size: 12px;
        color: #e00000;
        margin: 3px 3px 0 0;
      }

      .tag {
        flex-shrink: 0;
        padding: 0 4px;
        height: 15px;
        border-radius: 7px;
        border: 1px solid #F93809;
        font-size: 10px;
        color: #F93809;
        margin: 3px 0 0 3px;
      }

      .select {
        width: 100%;
        padding: 14px 0;
        overflow: hidden;
        font-size: 12px;
        color: #666666;

        &:last-child {
          padding-bottom: 0;
        }

        .select-icon {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          margin-right: 7px;
        }
      }

      .pull {
        width: 100%;
        height: 40px;
        overflow: hidden;
        font-size: 12px;
        color: #323233;
        margin-bottom: -14px;
      }

      .right-arrows {
        flex-shrink: 0;
        width: 12px;
        height: 12px;
        margin-left: 7px;
      }

      .textarea {
        width: 100%;
        height: 69px;
        padding: 11px;
        background: #F8F8F8;
        border-radius: 4px;
        line-height: 18px;
        font-size: 12px;
        box-sizing: border-box;
        border: 0;
        color: #999;
      }

      .upload {
        width: 97px;
        height: 97px;
        margin: 0 8px 0 0;
        overflow: hidden;
        background: #F3F3F3;
        border-radius: 4px;
        font-size: 11px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #999;

        .add {
          width: 22px;
          height: 22px;
          margin-bottom: 9px;
       }
      }

      .area {
        width: 100%;
        height: 40px;
        overflow: hidden;
        font-size: 12px;
        color: #323233;
        margin-bottom: -14px;

        .area-icon {
          flex-shrink: 0;
          width: 15px;
          height: 15px;
          margin-right: 5px;
        }

      }

    }

    .questionnaire-bottom {
      padding: 14px 0 24px;
      font-size: 14px;
      color: #ccc;
      text-align: center;
    }
  }
}

</style>
