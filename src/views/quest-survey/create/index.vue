<template>
  <el-card class="box-card">
    <el-steps :active="active" simple class="step">
      <el-step title="步骤 1" icon="el-icon-edit" />
      <el-step title="步骤 2" icon="el-icon-upload" />
    </el-steps>

    <!--使用draggable组件-->
    <div class="content">
      <div v-if="active===1" class="flex-x">
        <div class="left">
          <div class="title">基础模板</div>
          <draggable v-model="templateList" class="left-content" :clone="cloneDefaultField" :group="leftGroup" animation="300" :sort="false">
            <transition-group :style="style">
              <div v-for="(item,index) in templateList" :key="index" class="item-left" @click="clickComponent(item)">{{ item.title }}</div>
            </transition-group>
          </draggable>

          <div class="title">常用模板</div>
          <draggable v-model="commonList" class="left-content" :clone="cloneDefaultField" :group="leftGroup" animation="300" :sort="false">
            <transition-group :style="style">
              <div v-for="(item,index) in commonList" :key="index" class="item-left" @click="clickComponent(item)">{{ item.title }}</div>
            </transition-group>
          </draggable>
        </div>

        <div class="right">
          <img :src="iphone" class="phone">
          <div class="right-content">
            <!-- 问卷标题 -->
            <div v-if="!showTitleInput" class="query-title" @click="showTitleInput = true">{{ questionnaireTitle }}</div>
            <el-input
              v-else
              v-model="questionnaireTitle"
              placeholder="请输入内容"
              maxlength="30"
              autofocus
              show-word-limit
              @blur="inputBlur(1)"
            />
            <!-- 问卷说明 -->
            <div v-if="!showDescInput" class="query-desc" @click="showDescInput = true">
              <div v-if="desc">说明 <br><br>{{ desc }}</div>
              <div v-else>点击添加问卷说明</div>
            </div>
            <el-input
              v-else
              v-model="desc"
              autofocus
              placeholder="请输入内容"
              maxlength="300"
              autosize
              type="textarea"
              show-word-limit
              @blur="inputBlur(2)"
            />
            <draggable v-model="componentsList" group="site" animation="100">
              <transition-group :style="style">
                <div v-for="(item, index) in componentsList" :key="index" class="item">
                  <Component_Single_Select
                    v-if="item.componentKey === COMPONENT_KEY.SINGLE_SELECT || item.componentKey === COMPONENT_KEY.MULTIPLE_SELECT"
                    :index="index "
                    :item="item"
                    @delSelectItem="delSelectItem"
                  />
                  <Component_Pulldown_Select
                    v-if="item.componentKey === COMPONENT_KEY.PULLDOWN_SELECT || item.componentKey === COMPONENT_KEY.PROVINCE_CITY_AREA"
                    :index="index"
                    :item="item"
                    @delSelectItem="delSelectItem"
                    @addSelectItem="addItem(index,0)"
                  />
                  <Component_Single_Text
                    v-if="item.componentKey === COMPONENT_KEY.SINGLE_TEXT"
                    :index="index "
                    :item="item"
                  />
                  <Component_Upload
                    v-if="item.componentKey === COMPONENT_KEY.UPLOAD_FILE || item.componentKey === COMPONENT_KEY.UPLOAD_VIDEO ||item.componentKey === COMPONENT_KEY.UPLOAD_IMAGE"
                    :index="index "
                    :item="item"
                  />
                  <div class="operate">
                    <el-checkbox v-model="item.required" data-index="index" @change="requireChange(index,item)">必填</el-checkbox>
                    <template v-if="showAddItem(item)">
                      <span @click="addItem(index,0)">添加选项</span>
                      <span v-if="showOtherBtn(item)" @click="addItem(index,1)">添加其他项</span>
                    </template>
                    <span v-if="index!==0" @click="sort(1,index)">上移</span>
                    <span v-if="index!==componentsList.length-1" @click="sort(2,index)">下移</span>
                    <span class="del" @click="delComponent(index)">删除</span>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>

      <div v-if="active===2">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="结束时间">
            <el-switch v-model="form.delivery" />
            <el-date-picker
              v-if="form.delivery"
              v-model="form.endTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <div class="flex-x share-img">
            <div class="share-text">
              分享图片
              <el-tooltip effect="dark" :content="SHARE_TIPS" placement="top-start">
                <span class="el-icon-warning-outline" />
              </el-tooltip>
            </div>
            <el-form-item>
              <el-upload
                action="/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                class="avatar-uploader"
                :http-request="upload"
              >
                <img v-if="form.shareImgUrl" class="share-img-url" :src="form.shareImgUrl">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div>建议尺寸：750 x 600</div>
              <div>支持格式：png、jpg、jpeg</div>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="next-step">
        <el-button v-if="active===1" :disabled="componentsList.length<1" type="primary" @click="active=2">下一步</el-button>
        <template v-else>
          <el-button plain @click="active=1">上一步</el-button>
          <el-button type="primary" @click="saveQuestFunc">保存</el-button>
        </template>

      </div>
    </div>
    <Save_Dialog ref="saveDialog" :ckey="ckey" :save-visible.sync="showSaveDialog" :question-id="questionId" />
  </el-card>
</template>
<script>
import draggable from 'vuedraggable'
import { COMPONENT_KEY, BUSINESS_TYPE, SHARE_TIPS } from './constant/index'
import { getBaseQuestion, getCommonList, saveQuest, uploadAndCheckImg, saveQuestByMiF } from '@/api/quest-survey/index'
export default {
  components: { draggable, Component_Single_Select: () => import('./components/Component_Single_Select.vue'),
    Component_Pulldown_Select: () => import('./components/Component_Pulldown_Select.vue'),
    Component_Single_Text: () => import('./components/Component_Single_Text.vue'),
    Component_Upload: () => import('./components/Component_Upload.vue'),
    Save_Dialog: () => import('./components/Save_Dialog.vue')
  },
  data() {
    return {
      iphone: require('@/assets/img/iphone.png'),
      leftGroup: {
        name: 'site',
        pull: 'clone',
        put: false
      },
      // 基础模板
      templateList: [],
      // 常用模板
      commonList: [],
      componentsList: [],
      style: 'min-height:120px;display: block;',
      showTitleInput: false,
      questionnaireTitle: '标题',
      showDescInput: false,
      desc: '',
      COMPONENT_KEY,
      SHARE_TIPS,
      active: 1,
      // 表单
      form: { delivery: false, endTime: null, shareImgUrl: '' },
      showSaveDialog: false,
      questionId: null
    }
  },
  computed: { showAddItem: () => {
    return item => {
      // 单项和多选才有添加选项和其他按钮
      const arr = [COMPONENT_KEY.SINGLE_SELECT, COMPONENT_KEY.MULTIPLE_SELECT]
      if (arr.includes(item.componentKey)) { return true } else { return false }
    }
  },
  showOtherBtn: () => {
    return item => {
      const index = item.selectItem.findIndex(i => i.otherItems === 1)
      if (index === -1) { return true }
      return false
    }
  },
  ckey() {
    return this.$store.getters.ckey || ''
  }
  },
  created() {
    this.getBaseQuestionFunc()
    this.getCommonListFunc()
    this.questionnaireTitle = this.$route.query.title || '标题'
  },
  beforeRouteLeave(to, from, next) {
    if (this.questionId) { next(); return }
    if (this.componentsList.length > 0) {
      this.$confirm('系统可能不会保存您所做的更改', '离开此页面？', {
        confirmButtonText: '离开',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => { next() })
    } else { next() }
  },
  methods: {
    // 请求
    // 基础题型:列表查询
    async getBaseQuestionFunc() {
      const { data } = await getBaseQuestion({ businessType: BUSINESS_TYPE })
      this.templateList = data
    },

    // 常用题型:列表查询
    async getCommonListFunc() {
      const { data } = await getCommonList({ businessType: BUSINESS_TYPE })
      this.commonList = data
    },
    // 失去焦点 1标题 2 描述
    inputBlur(type = 1) {
      if (type === 1) {
        this.showTitleInput = false
      } else if (type === 2) {
        this.showDescInput = false
      }
    },
    cloneDefaultField(e) {
      return JSON.parse(JSON.stringify(e))
    },
    // 设置step状态
    setStep() { this.active = 2 },
    // 点击基础组件
    clickComponent(item) {
      if (this.componentsList.lengh > 99) { this.$message.warning('题目数量达到100，无法添加，请适当缩减'); return }
      this.componentsList.push(JSON.parse(JSON.stringify(item)))
    },
    // 必填项发生改变
    requireChange(index = -1, item) {
      if (index === -1) return
      this.componentsList[index].required = item.required
    },
    // 添加选项  0:普通选项 1：其他选项
    addItem(index = -1, type = 0) {
      if (index === -1) return
      let flag = -1
      if (type === 1) {
        flag = this.componentsList[index].selectItem.findIndex(i => i.otherItems === 1)
      }
      if (flag === -1) {
        this.componentsList[index].selectItem.push({
          select: false, // 是否选择
          key: '', //
          value: type === 1 ? '其他' : '选项', // 选择组件属性 string
          label: type === 1 ? '其他' : '选项', // label文本
          otherItems: type
        })
      } else { this.$message.warning('其他选项已经存在') }
    },
    // 删除组件
    delComponent(index) {
      if (index === -1) return
      this.$confirm('是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.componentsList.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 上下移动组件 1上移 2下移
    sort(type, index = -1) {
      if (index > -1) {
        const item = this.componentsList.splice(index, 1)
        item && this.componentsList.splice(type === 1 ? index - 1 : index + 1, 0, ...item)
      }
    },
    async saveQuestFunc() {
      const { componentsList, form: { endTime, shareImgUrl }, questionnaireTitle, desc: remark } = this
      const params = {
        businessType: 1,
        commonModelDTOS: componentsList,
        endTime, shareImgUrl, remark, questionnaireTitle
      }
      let API = saveQuest
      if (this.ckey) { API = saveQuestByMiF }
      const res = await API(params)
      if (res.state === 1) {
        this.questionId = res.data
        this.showSaveDialog = true
        this.$refs['saveDialog'].getQrCodeFunc(this.questionId)
      } else { this.$message.error(res.msg) }
    },
    // 删除组件的某一项
    delSelectItem(detail) {
      const { index, item } = detail
      this.componentsList[index].selectItem.splice(item, 1)
    },
    // 上传图片
    async upload(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      const res = await uploadAndCheckImg(formData, 'questSurvey')
      if (res.state === 1) {
        this.form.shareImgUrl = res.data
      } else {
        this.$message.error({
          message: res.msg
        })
      }
    },
    beforeAvatarUpload(file) {
      const arr = ['image/jpeg', 'image/jpg', 'image/png']
      if (!arr.includes(file.type)) {
        this.$message.error('上传图片只能是 png、jpg、jpeg 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.step {
  width: 50%;
}
.content {
  background-color: #fff;
  // display: flex;
  padding: 20px;
  min-height: 700px;
  .phone {
    width: 375px;
    height: 667px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
  }
  .right {
    width: 385px;

    position: relative;
    background-color: #fff;
  }
  .left {
    border: solid 1px #eee;
    border-radius: 5px;
    padding: 10px;
    margin-right: 50px;
    width: 340px;
    height: 667px;
    .item-left {
      border: 1px solid #eee;
      padding: 10px;
      display: inline-block;
      width: 148px;
      margin: 5px;
      text-align: center;
    }
  }
  .right-content {
    position: relative;
    z-index: 2;
    height: 522px;
    overflow-y: scroll;
    margin: 100px 25px 0px 25px;
    .query-title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin: 16px 0px;
    }
    .query-desc {
      background-color: #fff;
      padding: 5px 10px;
      color: #555555;
      font-family: 'Arial Normal', 'Arial', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
    }
  }
  .next-step{
    padding: 10px 0px 0px 340px;
  }
  .avatar-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    width: 178px;
    font-size: 24px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .share-img-url{
    width: 175px;
    height: 175px;
  }
  .share-text{
    flex-shrink: 0;
  }
}
/deep/ .el-checkbox__label {
  color: #328ffe;
}
.operate {
  font-size: 13px;
  padding: 10px 0px;
  color: #328ffe;
  margin-top: 15px;
  border-top: 1px dashed #5b5454;
  * {
    margin-right: 5px;
  }
  .del {
    color: #d9001b;
  }
}
.title {
  padding: 6px 12px;
}

.col + .col {
  margin-left: 10px;
}

.item {
  margin: 20px 0px;
  border: solid 1px #eee;
  background-color: #fff;
  padding: 25px 10px;
}

.item:hover {
  background-color: #fdfdfd;
  cursor: move;
}

.item + .item {
  border-top: none;
  margin-top: 6px;
}
.b{
  display: none;
  background: rgb(90, 98, 168);
}
.a{
  width: 300px;
  height: 300px;
  background: hotpink;
}
.a:hover .b{
  display: block;
}
.share-img{
  font-size: 14px;
    color: #606266;
    font-weight: 700;
    margin-left: 10px;
}
/deep/ .el-form-item__content{
  margin-left: 40px!important;
}
</style>
