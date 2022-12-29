<template>
  <el-card class="box-card">
    <el-steps :active="1" simple class="step">
      <el-step title="步骤 1" icon="el-icon-edit" />
      <el-step title="步骤 2" icon="el-icon-upload" />
    </el-steps>

    <!--使用draggable组件-->
    <div class="content">
      <div class="left">
        <div class="title">基础模板</div>
        <draggable v-model="templateList" class="left-content" :group="leftGroup" animation="300" :sort="false">
          <transition-group :style="style">
            <div v-for="item in templateList" :key="item.id" class="item-left" @click="clickComponent(item)">{{ item.name }}</div>
          </transition-group>
        </draggable>
      </div>
      <div class="right">
        <!-- <div class="title">B组（本组不能拖入A组）</div> -->
        <img :src="iphone" class="phone">
        <div class="right-content">
          <!-- 问卷标题 -->
          <div v-if="!showTitleInput" class="query-title" @click="showTitleInput = true">{{ title }}</div>
          <el-input
            v-else
            v-model="title"
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
                  v-if="item.componentKey === COMPONENT_KEY.PULLDOWN_SELECT"
                  :index="index"
                  :item="item"
                  @delSelectItem="delSelectItem"
                  @addSelectItem="addItem"
                />
                <Component_Single_Text
                  v-if="item.componentKey === COMPONENT_KEY.SINGLE_TEXT"
                  :index="index "
                  :item="item"
                />
                <Component_Upload
                  v-if="item.componentKey === COMPONENT_KEY.UPLOAD_FILE || item.componentKey === COMPONENT_KEY.UPLOAD_VIDEO"
                  :index="index "
                  :item="item"
                />
                <div class="operate">
                  <el-checkbox v-model="item.checked" @change="requireChange(item)">必填</el-checkbox>
                  <span @click="addItem(item.id,0)">添加选项</span>
                  <span @click="addItem(item.id,1)">添加其他项</span>
                  <span @click="sort(1,item.id)">上移</span>
                  <span @click="sort(2,item.id)">下移</span>
                  <span class="del" @click="delComponent(item.id)">删除</span>
                </div>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div></el-card>
</template>
<script>
import draggable from 'vuedraggable'
import { COMPONENT_KEY, BUSINESS_TYPE } from './constant/index'
import { getBaseQuestion, getCommonList } from '@/api/quest-survey/index'
export default {
  components: { draggable, Component_Single_Select: () => import('./components/Component_Single_Select.vue'),
    Component_Pulldown_Select: () => import('./components/Component_Pulldown_Select.vue'),
    Component_Single_Text: () => import('./components/Component_Single_Text.vue'),
    Component_Upload: () => import('./components/Component_Upload.vue'),
  },
  data() {
    return {
      iphone: require('@/assets/img/iphone.png'),
      leftGroup: {
        name: 'site',
        pull: 'clone',
        put: false
      },
      templateList: [
        {
          id: 1,
          name: '单选',
          title: '标题',
          componentKey: 'Component_Single_Select',
          componentType: 'uploadImg',
          required: false,
          selectItem: [
            {
              select: false, // 是否选择
              key: '', //
              value: 'xxx', // 选择组件属性 string
              label: '选项1' // label文本
            }
          ]
        },
        { id: 2, required: false, name: '多选', componentKey: 'Component_Multiple_Select', componentType: 'uploadImg' },
        { id: 3, required: false, name: '上传图片', componentKey: 'Component_Upload_File', componentType: 'uploadImg' },
        { id: 4, required: false, name: '上传视频', componentKey: 'Component_Upload_Video', componentType: 'uploadImg' },
        { id: 5, required: false, name: '单项填坑', componentKey: 'Component_Single_Text', componentType: 'uploadImg' },
        { id: 6, required: false, name: '下拉', selectItem: [
          {
            select: false, // 是否选择
            key: '', //
            value: 'xxx', // 选择组件属性 string
            label: '选项1' // label文本
          }
        ], title: '标题', componentKey: 'Component_Pulldown_Select', componentType: 'uploadImg' },
        // { id: 7, required: false, name: '单项填坑', componentKey: 'Component_Single_Text', componentType: 'uploadImg' },
      ],
      componentsList: [],
      style: 'min-height:120px;display: block;',
      showTitleInput: false,
      title: '标题',
      showDescInput: false,
      desc: '',
      COMPONENT_KEY
    }
  },
  created() { this.getBaseQuestionFunc(); this.getCommonListFunc },
  methods: {
    // 请求
    // 基础题型:列表查询
    async getBaseQuestionFunc() {
      const res = await getBaseQuestion({ businessType: BUSINESS_TYPE })
      console.log('res', res)
    },
    async getCommonListFunc() {
      const res = await getCommonList()
      console.log('res', res)
    },
    // 失去焦点 1标题 2 描述
    inputBlur(type = 1) {
      if (type === 1) {
        this.showTitleInput = false
      } else if (type === 2) {
        this.showDescInput = false
      }
    },
    // 点击基础组件
    clickComponent(item) {
      this.componentsList.push(item)
    },
    // 必填项发生改变
    requireChange(change) {
      const { templateList } = this
      const { id, checked } = change
      const index = templateList.findIndex(i => i.id === id)
      if (index > -1) { this.templateList[index].required = checked }
    },
    // 添加选项
    addItem(id, type = 0) {
      const { componentsList } = this
      const index = componentsList.findIndex(i => i.id === id)
      if (index > -1) {
        let flag = -1
        if (type === 1) {
          flag = componentsList[index].selectItem.findIndex(i => i.otherItems === 1)
        }
        if (flag === -1) {
          componentsList[index].selectItem.push({
            select: false, // 是否选择
            key: '', //
            value: type === 1 ? '其他' : '选项', // 选择组件属性 string
            label: type === 1 ? '其他' : '选项', // label文本
            otherItems: type
          })
        } else { this.$message.warning('其他选项已经存在') }
      }
    },
    // 删除组件
    delComponent(id) {
      const { componentsList } = this
      const index = componentsList.findIndex(i => i.id === id)
      index > -1 && this.componentsList.splice(index, 1)
    },
    // 上下移动组件 1上移 2下移
    sort(type, id) {
      const { componentsList } = this
      const index = componentsList.findIndex(i => i.id === id)
      if (index > -1) {
        const item = this.componentsList.splice(index, 1)
        item && this.componentsList.splice(type === 1 ? index - 1 : index + 1, 0, ...item)
      }
    },
    // 删除组件的某一项
    delSelectItem(detail) {
      const { index, item } = detail
      this.componentsList[index].selectItem.splice(item, 1)
      console.log('d', detail)
    }
  }
}
</script>

<style lang="scss" scoped>
.step {
  width: 50%;
}
.content {
  background-color: #fff;
  display: flex;
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
</style>
