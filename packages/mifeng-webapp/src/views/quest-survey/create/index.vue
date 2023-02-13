<template>
  <a-card>
    <!--使用draggable组件-->
    <div class="create-content">
      <div class="flex-x">
        <div class="left">
          <div class="title">基础题型</div>
          <draggable
            class="left-content"
            :clone="cloneDefaultField"
            :group="leftGroup"
            animation="300"
            :sort="false"
            :list="templateList"
          >
            <template #item="{ element }">
              <a-button
                :disabled="active === 1"
                :class="{ 'item-left': true, 'item-disable': active === 1 }"
                @click="clickComponent(element)"
              >
                {{ element.title }}
              </a-button>
            </template>
          </draggable>

          <div class="title title-use">常用题型</div>
          <draggable
            :list="commonList"
            class="left-content"
            :clone="cloneDefaultField"
            :group="leftGroup"
            animation="300"
            :sort="false"
          >
            <template #item="{ element }">
              <a-button
                :disabled="active === 1"
                :class="{ 'item-left': true, 'item-disable': active === 1 }"
                @click="clickComponent(element)"
              >
                {{ element.title }}
              </a-button>
            </template>
          </draggable>
        </div>

        <div class="right">
          <div class="flex-x-center">
            <a-steps :current="active" simple class="step">
              <a-step title="问卷信息" />
              <a-step title="问卷设置" />
            </a-steps>
          </div>

          <div class="right-content" v-if="active === 0">
            <!-- 问卷标题 -->
            <div v-if="!showTitleInput" class="query-title" @click="showTitleInput = true">
              {{ questionnaireTitle }}
            </div>
            <div v-else class="flex-x-0-center">
              <span style="flex-shrink: 0">问卷标题：</span>
              <a-input
                v-model:value="questionnaireTitle"
                placeholder="请输入内容"
                :maxlength="30"
                autofocus
                show-word-limit
                @blur="inputBlur(1)"
              />
            </div>

            <!-- 问卷说明 -->
            <div v-if="!showDescInput" class="query-desc" @click="showDescInput = true">
              <div><span class="desc-text">说明</span> <br /><br />{{ desc }}</div>
            </div>
            <div v-else class="flex-x-0-center">
              <span style="flex-shrink: 0">问卷说明：</span>
              <a-input
                v-model:value="desc"
                placeholder="请输入内容"
                :maxlength="300"
                autosize
                autofocus
                type="textarea"
                show-word-limit
                @blur="inputBlur(2)"
              />
            </div>

            <!-- 为空时显示 -->
            <div style="margin-top: 20px" v-if="componentsList.length === 0" class="flex-x-0-center">
              <span style="flex-shrink: 0">添加题型：</span>
              <a-input disabled placeholder="点击/拖拉左侧按钮添加题目" />
            </div>

            <draggable :list="componentsList" group="site" animation="100" :move="onMove">
              <!-- <transition-group :style="style"> -->
              <template #item="{ element, index }">
                <div :class="element.isDisable ? 'item forbid' : 'item'">
                  <Component_Single_Select
                    v-if="
                      element.componentKey === COMPONENT_KEY.SINGLE_SELECT ||
                      element.componentKey === COMPONENT_KEY.MULTIPLE_SELECT
                    "
                    :index="index"
                    :item="element"
                    :disable="isDisable"
                    @delSelectItem="delSelectItem"
                  />
                  <Component_Pulldown_Select
                    v-if="
                      element.componentKey === COMPONENT_KEY.PULLDOWN_SELECT ||
                      element.componentKey === COMPONENT_KEY.PROVINCE_CITY_AREA
                    "
                    :index="index"
                    :item="element"
                    :disable="isDisable"
                    @delSelectItem="delSelectItem"
                    @addSelectItem="addItem(index, 0)"
                  />
                  <Component_Single_Text
                    v-if="element.componentKey === COMPONENT_KEY.SINGLE_TEXT"
                    :index="index"
                    :disable="isDisable"
                    :item="element"
                  />
                  <Component_Upload
                    v-if="
                      element.componentKey === COMPONENT_KEY.UPLOAD_FILE ||
                      element.componentKey === COMPONENT_KEY.UPLOAD_VIDEO ||
                      element.componentKey === COMPONENT_KEY.UPLOAD_IMAGE
                    "
                    :index="index"
                    :disable="isDisable"
                    :item="element"
                  />
                  <div class="operate flex-x-between-center">
                    <a-checkbox
                      v-model:checked="element.required"
                      data-index="index"
                      @change="requireChange(index, element)"
                      >必填</a-checkbox
                    >
                    <div>
                      <template v-if="showAddItem(element)">
                        <a-button class="btn" @click="addItem(index, 0)" type="link">添加选项</a-button>
                        <a-button class="btn" v-if="showOtherBtn(element)" type="text" @click="addItem(index, 1)"
                          >添加其他项</a-button
                        >
                      </template>
                      <template v-if="!element.isDisable">
                        <a-button
                          class="btn"
                          type="text"
                          v-if="index !== 0 && showMoveUp(componentsList, index)"
                          @click="sort(1, index)"
                          >上移</a-button
                        >
                        <a-button
                          class="btn"
                          type="text"
                          v-if="index !== componentsList.length - 1"
                          @click="sort(2, index)"
                          >下移</a-button
                        >
                        <a-button type="text" class="del" @click="delComponent(index)">删除</a-button>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
              <!-- </transition-group> -->
            </draggable>
          </div>
          <div v-if="active === 1">
            <a-form ref="form" :model="form" label-width="80px">
              <a-form-item label="结束时间">
                <a-switch class="my-switch" v-model:checked="formObj.delivery" />
                <a-date-picker
                  show-time
                  format="YYYY-MM-DD HH:mm"
                  valueFormat="YYYY-MM-DD HH:mm"
                  v-if="formObj.delivery"
                  v-model:value="formObj.endTime"
                  placeholder="选择日期时间"
                />
              </a-form-item>
              <div class="flex-x share-img">
                <a-tooltip>
                  <template #title>
                    <span>{{ SHARE_TIPS }}</span>
                  </template>
                  <div class="share-text">分享图片<QuestionCircleOutlined style="margin: 0px 4px" />:</div>
                </a-tooltip>
                <div>
                  <a-upload
                    action="/"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :customRequest="upload"
                    :showUploadList="false"
                  >
                    <img v-if="formObj.shareImgUrl" class="share-img-url" :src="formObj.shareImgUrl" />
                    <div v-else class="avatar-uploader">
                      <plus-outlined></plus-outlined>
                    </div>
                  </a-upload>
                  <div>建议尺寸：750 x 600</div>
                  <div>支持格式：png、jpg、jpeg</div>
                </div>
              </div>
            </a-form>
          </div>
        </div>
      </div>

      <div class="next-step flex-x-center">
        <a-button v-if="active === 0" :disabled="componentsList.length < 1" type="primary" @click="active = 1"
          >下一步</a-button
        >
        <template v-else>
          <a-button plain @click="active = 0">上一步</a-button>
          <a-button type="primary" class="save" @click="saveQuestFunc">保存</a-button>
        </template>
      </div>
    </div>
    <Save_Dialog
      ref="saveDialog"
      :ckey="ckey"
      v-model:save-visible="showSaveDialog"
      :question-id="questionId"
      :questionnaireTitle="questionnaireTitle"
    />
  </a-card>
</template>
<script>
import draggable from 'vuedraggable'
import { useRoute, onBeforeRouteLeave, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { COMPONENT_KEY, BUSINESS_TYPE, SHARE_TIPS } from './constant/index'
import dayjs from 'dayjs'
import {
  getBaseQuestion,
  questionDetailBiMiF,
  getCommonList,
  uploadAndCheckImg,
  saveQuestByMiF
} from '@/api/quest-survey/index'
import { computed, ref, inject, getCurrentInstance } from 'vue'
import Component_Single_Select from './components/Component_Single_Select.vue'
import Component_Pulldown_Select from './components/Component_Pulldown_Select.vue'
import Component_Single_Text from './components/Component_Single_Text.vue'
import Component_Upload from './components/Component_Upload.vue'
import Save_Dialog from './components/Save_Dialog.vue'
export default {
  components: {
    draggable,
    Component_Single_Select,
    Component_Pulldown_Select,
    Component_Single_Text,
    Component_Upload,
    Save_Dialog
    // Component_Single_Select: () => import('./components/Component_Single_Select.vue'),
    // Component_Pulldown_Select: () => import('./components/Component_Pulldown_Select.vue'),
    // Component_Single_Text: () => import('./components/Component_Single_Text.vue'),
    // Component_Upload: () => import('./components/Component_Upload.vue'),
    // Save_Dialog: () => import('./components/Save_Dialog.vue')
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const ckey = inject('ckey')
    const iphone = require('@/assets/imgs/img/iphone.png')
    const { proxy } = getCurrentInstance()
    const leftGroup = {
      name: 'site',
      pull: 'clone',
      put: false
    }
    const active = ref(0)
    // 表单
    const formObj = ref({ delivery: false, endTime: null, shareImgUrl: '' })
    // 弹框
    const showSaveDialog = ref(false)
    // 标题
    const questionnaireTitle = ref('')
    // 描述
    const desc = ref()
    // 问卷id
    const questionId = ref()
    // 状态 1新增 2编辑
    const type = ref()
    const showTitleInput = ref(false)
    const showDescInput = ref(true)
    questionnaireTitle.value = route.query.title || '标题'
    if (route.query.id) {
      type.value = 2
      questionId.value = route.query.id
    }

    // 问卷状态是否可以编辑
    const isDisable = ref(false)
    const questionnaireState = ref(0) // 问卷状态 初始为未发布
    // showTitleInput: false,
    // questionnaireTitle: '标题',
    // showDescInput: false,
    // desc: '',
    // COMPONENT_KEY,
    // SHARE_TIPS,
    // active: 1,

    // // 问卷id
    // questionId: null,
    // // 状态 1新增 2编辑
    // type: 1,
    // // 问卷状态是否可以编辑
    // isDisable: false

    const showOtherBtn = computed(() => item => {
      if (!item.selectItem) return false
      const index = item.selectItem.findIndex(i => i.otherItems === 1)
      if (index === -1) {
        return true
      }
      return false
    })
    const showMoveUp = computed(() => (componentsList, index) => {
      if (index - 1 > -1 && componentsList[index - 1]) {
        return !componentsList[index - 1].isDisable
      } else {
        return true
      }
    })
    const showAddItem = computed(() => item => {
      // 单项和多选才有添加选项和其他按钮
      const arr = [COMPONENT_KEY.SINGLE_SELECT, COMPONENT_KEY.MULTIPLE_SELECT]
      if (arr.includes(item.componentKey)) {
        return true
      } else {
        return false
      }
    })
    // created() {
    //   this.getBaseQuestionFunc()
    //   this.getCommonListFunc()
    //   this.questionnaireTitle = this.$route.query.title || '标题'
    //   if (this.$route.query.id) {
    //     this.type = 2
    //     this.questionId = this.$route.query.id
    //   }
    //   this.type === 2 && this.questionDetailFunc()
    // },
    onBeforeRouteLeave((to, from, next) => {
      console.log('离开此页面？')
      if (questionId.value) {
        next()
        return
      }
      if (componentsList.value.length > 0) {
        Modal.confirm({
          title: () => '离开此页面？',
          content: () => '系统可能不会保存您所做的更改',
          onOk() {
            next()
          }
        })
      } else {
        next()
      }
    })
    // 基础模板
    const templateList = ref([])
    // 常用模板
    const commonList = ref([])
    const componentsList = ref([])

    // 请求
    // 基础题型:列表查询
    const getBaseQuestionFunc = async () => {
      const { data } = await getBaseQuestion({ businessType: BUSINESS_TYPE })
      templateList.value = data
      console.log('templateList', templateList)
    }

    // 常用题型:列表查询
    const getCommonListFunc = async () => {
      const { data } = await getCommonList({ businessType: BUSINESS_TYPE })
      commonList.value = data
    }
    getBaseQuestionFunc()
    getCommonListFunc()
    // 问卷详情
    const questionDetailFunc = async () => {
      const params = { id: questionId.value, businessType: 1 }
      const res = await questionDetailBiMiF(params)
      if (res.state === 1) {
        formatData(res)
      } else {
        message.error(res.msg)
      }
    }
    // 失去焦点 1标题 2 描述
    const inputBlur = (type = 1) => {
      if (type === 1) {
        showTitleInput.value = false
      } else if (type === 2) {
        showDescInput.value = !desc.value
      }
    }
    const cloneDefaultField = e => {
      return buildOption(e)
    }
    // 设置step状态
    const setStep = () => {
      active.value = 2
    }
    // 点击基础组件
    const clickComponent = item => {
      if (componentsList.value.length > 99) {
        message.warning('题目数量达到100，无法添加，请适当缩减')
        return
      }
      const val = buildOption(item)
      componentsList.value.push(val)
    }
    // 添加两个选项
    const buildOption = item => {
      // 对于单选、多选题、下拉题，默认生成2个选项
      const arr = [COMPONENT_KEY.SINGLE_SELECT, COMPONENT_KEY.MULTIPLE_SELECT, COMPONENT_KEY.PULLDOWN_SELECT]
      const val = JSON.parse(JSON.stringify(item))
      if (arr.includes(item.componentKey) && val.selectItem.length === 0) {
        val.title = val.title || '标题'
        for (var i = 0; i < 2; i++) {
          val.selectItem.push({
            select: false, // 是否选择
            key: '', //
            value: null, // 选择组件属性 string
            label: '选项', // label文本
            otherItems: 0
          })
        }
      }
      return val
    }
    // 必填项发生改变
    const requireChange = (index = -1, item) => {
      if (index === -1) return
      componentsList.value[index].required = item.required
    }
    // 添加选项  0:普通选项 1：其他选项
    const addItem = (index = -1, type = 0) => {
      if (index === -1) return
      if (componentsList.value[index].selectItem.length > 29) {
        message.warning('最多30个选项')
        return
      }
      let flag = -1
      if (type === 1) {
        flag = componentsList.value[index].selectItem.findIndex(i => i.otherItems === 1)
      }
      if (flag === -1) {
        componentsList.value[index].selectItem.push({
          select: false, // 是否选择
          key: '', //
          value: null, // 选择组件属性 string
          label: type === 1 ? '其他' : '选项', // label文本
          otherItems: type
        })
      } else {
        message.warning('其他选项已经存在')
      }
    }
    // 删除组件
    const delComponent = index => {
      if (index === -1) return
      Modal.confirm({
        title: () => '提示',
        content: () => '是否确定删除？',
        centered: 'true',
        onOk() {
          componentsList.value.splice(index, 1)
          message.success('删除成功!')
        }
      })
    }
    // 上下移动组件 1上移 2下移
    const sort = (type, index = -1) => {
      console.log('index', index)
      if (index > -1) {
        const item = componentsList.value.splice(index, 1)
        item && componentsList.value.splice(type === 1 ? index - 1 : index + 1, 0, ...item)
      }
    }
    const saveQuestFunc = async () => {
      componentsList.value.forEach(i => {
        if (i.selectItem && i.selectItem.length > 0) {
          i.selectItem.forEach(j => {
            if (j.otherItems === 1) {
              j.label = ''
            }
          })
        }
      })
      const params = {
        businessType: 1,
        commonModelDTOS: componentsList.value,
        endTime: formObj.value.endTime ? new Date(formObj.value.endTime).getTime() : null,
        shareImgUrl: formObj.value.shareImgUrl,
        remark: desc.value,
        questionnaireTitle: questionnaireTitle.value,
        questionnaireId: questionId.value
      }
      console.log('params', params)
      console.log(saveQuestByMiF, proxy)
      const res = await saveQuestByMiF(params)
      if (res.data) {
        questionId.value = res.data
      }
      // 未发布|已停止问卷显示未发布弹窗
      if (questionnaireState.value === 0 || questionnaireState.value === 3) {
        showSaveDialog.value = true
        proxy.$refs.saveDialog.getQrCodeFunc(questionId.value)
      } else {
        router.push({ path: '/quest-survey/manager' })
      }
    }
    // 删除组件的某一项
    const delSelectItem = detail => {
      const { index, item } = detail
      componentsList.value[index].selectItem.splice(item, 1)
    }
    // 上传图片
    const upload = async content => {
      const formData = new FormData()
      formData.append('file', content.file)
      const res = await uploadAndCheckImg(formData, 'questSurvey')
      console.log('res', res)
      if (res.state === 1) {
        formObj.value.shareImgUrl = res.data
        console.log('form.shareImgUrl', formObj.value)
      } else {
        message.error(res.msg)
      }
    }
    // 工具类函数
    const beforeAvatarUpload = file => {
      const arr = ['image/jpeg', 'image/jpg', 'image/png']
      if (!arr.includes(file.type)) {
        message.error('上传图片只能是 png、jpg、jpeg 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
    }
    // 回显数据处理
    const formatData = res => {
      const { data } = res
      console.log('res', data)
      const { imgUrl: shareImgUrl, endTime, state } = data
      // questionnaireTitle.value = res.data.questionnaireTitle
      questionnaireTitle.value = data.questionnaireTitle
      desc.value = data.remark
      componentsList.value = data.commonModelDTOS
      formObj.value = {
        shareImgUrl,
        endTime: endTime ? dayjs(+endTime).format('YYYY-MM-DD HH:mm') : null,
        delivery: !!endTime
      }
      isDisable.value = !!(state === 1 || state === 3)
      questionnaireState.value = state
      componentsList.value.forEach(i => {
        i.isDisable = isDisable.value
        if (i.selectItem?.length > 0) {
          i.selectItem.forEach(j => {
            j.isDisable = isDisable.value
          })
        }
      })
      if (desc.value) {
        showDescInput.value = false
      }
    }
    const onMove = e => {
      return !e.draggedContext.element.isDisable
    }
    type.value === 2 && questionDetailFunc()
    return {
      // 字段
      iphone,
      leftGroup,
      templateList,
      commonList,
      componentsList,
      active,
      formObj,
      showSaveDialog,
      questionnaireTitle,
      questionId,
      type,
      desc,
      isDisable,
      showTitleInput,
      showDescInput,

      // 计算属性
      showOtherBtn,
      showMoveUp,
      showAddItem,

      // 操作方法
      questionDetailFunc,
      inputBlur,
      cloneDefaultField,
      setStep,
      clickComponent,
      requireChange,
      addItem,
      delComponent,
      sort,
      saveQuestFunc,
      delSelectItem,
      upload,
      beforeAvatarUpload,
      formatData,

      // 常量
      SHARE_TIPS,
      COMPONENT_KEY,

      // 其他
      ckey,
      onMove
    }
  }
}
</script>

<style lang="scss" scoped>
.step {
  width: 50%;
  margin-bottom: 30px;
}
.box-card {
  width: 100% !important;
}
.create-content {
  background-color: #fff;
  // display: flex;
  padding: 20px;
  min-height: 100vh;
  // .phone {
  //   width: 375px;
  //   height: 667px;
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   top: 0;
  //   bottom: 0;
  //   z-index: 1;
  // }
  .right {
    background-color: #fff;
    flex: 1;
    height: 800px;
    overflow-y: scroll;
  }
  .left {
    border-right: solid 1px #eee;
    margin-right: 20px;
    width: 258px;

    .item-left {
      border: 1px solid #eee;

      display: inline-block;
      width: 100px;
      margin: 16px 16px 0px 0px;
    }
    .item-left:hover {
      background-color: #f4c820;
      cursor: pointer;
    }
    .item-disable:hover {
      background-color: #f5f5f5;
      cursor: no-drop;
    }
  }
  .right-content {
    // height: 522px;
    // margin: 100px 25px 0px 25px;
    .query-title {
      text-align: center;
      font-weight: bold;
      margin: 16px 0px;
      background: #fafafa;
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
    }
    .query-desc {
      background: #fafafa;
      border-radius: 2px;
      padding: 5px 10px;
      color: #555555;
      font-family: 'Arial Normal', 'Arial', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      .desc-text {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #222222;
      }
    }
  }
  .next-step {
    padding: 10px 0px 0px 0px;
    .save {
      margin-left: 10px;
    }
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    width: 178px;
    font-size: 24px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .share-img-url {
    width: 175px;
    height: 175px;
  }
  .share-text {
    flex-shrink: 0;
    margin-right: 6px;
    font-weight: 400;
  }
}
// /deep/ .el-checkbox__label {
//   color: #328ffe;
// }
.operate {
  font-size: 13px;
  padding: 10px 0px;
  margin-top: 15px;
  border-bottom: 1px solid #e9e9e9ff;
  * {
    margin-right: 5px;
  }
  .del {
    color: #e00000a6;
  }
}

.title {
  padding: 6px 12px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000d9;
  padding: 11px 0px 11px 18px;
  width: 217px;
  height: 44px;
  background: #fafafa;
  margin-bottom: 8px;
}
.title-use {
  margin: 32px 0px 8px 0px;
}

.col + .col {
  margin-left: 10px;
}

.item {
  margin: 24px 0px;
  background-color: #fff;
}

.item:hover {
  background-color: #fdfdfd;
  cursor: move;
}

.b {
  display: none;
  background: rgb(90, 98, 168);
}
.a {
  width: 300px;
  height: 300px;
  background: hotpink;
}
.a:hover .b {
  display: block;
}
.share-img {
  font-size: 14px;
  color: #606266;
  font-weight: 700;
  // margin-left: 10px;
  .add-icon {
    width: 170px;
    font-size: 30px;
    height: 170px;
    font-weight: 200;
  }
}
.ant-btn > span {
  border-right: 1px solid #e9e9e9ff;
}
.btn:after {
  content: '';
  background: #e9e9e9ff;
  width: 1px;
  height: 14px;
}
.my-switch {
  margin-right: 10px;
}
// /deep/ .el-form-item__content {
//   margin-left: 40px !important;
// }
</style>
