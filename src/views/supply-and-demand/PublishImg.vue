<template>
  <div class="publish-img">
    <h1 class="title">供需信息</h1>
    <div class="publish margin-bottom">
      <commontitle>发布者</commontitle>
      <el-button type="warning" icon="el-icon-edit" plain @click="showDialog('Publisher')">选择发布者</el-button>
      <span class="span">仅可选择一位发布者，重选后，新选择的发布者将会替换已选发布者</span>
    </div>
    <!-- 发布者表格 -->
    <el-table class="margin-bottom" :data="supplyData.publisherList" style="width: 842px" stripe border header-row-class-name="tableheader" empty-text="请选择发布者">
      <el-table-column v-for="it in tableRows" :key="it.prop" :prop="it.prop" :label="it.lable" :width="it.width" />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.row)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="margin-bottom">
      <commontitle>供需类型</commontitle>
      <el-radio v-model="supplyData.radio" label="1">供应</el-radio>
      <el-radio v-model="supplyData.radio" label="2">需求</el-radio>
    </div>
    <div class="margin-bottom">
      <commontitle>供需标签</commontitle>
      <LableList
        :list="supplyData.supplyLableList"
        maxlength="5"
        name-key="lableName"
        icon="el-icon-goods"
        @click="showDialog('SupplyLable')"
        @delete="handleLableDelete"
      >
        请选择标签
      </LableList>
    </div>
    <div class="margin-bottom">
      <commontitle>行业标签</commontitle>
      <LableList
        :list="supplyData.industryLableList"
        maxlength="3"
        icon="el-icon-coin"
        @click="showDialog('IndustryLable')"
        @delete="handleLableDelete"
      >
        请选择行业
      </LableList>
    </div>
    <div class="margin-bottom">
      <commontitle>发布者常驻地</commontitle>
      <LableList
        :list="supplyData.publisherStationList"
        maxlength="1"
        icon="el-icon-location-information"
        @click="showDialog('PublisherStation')"
        @delete="handleLableDelete"
      >
        请选择省市
      </LableList>
    </div>
    <div class="margin-bottom">
      <commontitle>供需标题</commontitle>
      <el-input v-model="supplyData.title" clearable placeholder="请输入简明扼要的标题" maxlength="40" show-word-limit />
    </div>
    <div class="margin-bottom">
      <commontitle>供需内容</commontitle>
      <editorElem
        :hidden-menu="true"
        :height="200"
        :content="supplyData.contentHtml"
        @addParentHtml="addParentHtml"
        @textNumber="textNumber"
      />
    </div>
    <div class="margin-bottom">
      <commontitle>供需图片</commontitle>
      <span class="span">选填，最多9张</span>
    </div>
    <div class="margin-bottom">
      <commontitle>选择同步商/协会</commontitle>
    </div>

    <!-- 弹窗表单 -->
    <kdDialog
      ref="kdDialog"
      :dialog-title="dialogTitle"
      dialog-width="60%"
      @savePopupData="$refs.dialogContent.handleConfirm()"
    >
      <template slot="content">
        <component :is="dialogType" ref="dialogContent" :data="dialogData" @confirm="onConfirm" />
      </template>
    </kdDialog>
  </div>
</template>

<script>
import editorElem from '@/components/wangEditor/index'

const dialogTitleMap = {
  Publisher: '添加发布者',
  SupplyLable: '供需标签',
  IndustryLable: '行业标签',
  PublisherStation: '发布者常驻地'
}

export default {
  name: 'PublishImg',
  components: {
    editorElem,
    kdDialog: () => import('@/components/common/kdDialog'),
    'commontitle': () => import(/* webpackChunkName: "common-title" */ './components/CommonTitle'),
    Publisher: () => import(/* webpackChunkName: "Publisher" */ './components/Publisher'),
    SupplyLable: () => import(/* webpackChunkName: 'SupplyLable' */'./components/SupplyLable'),
    IndustryLable: () => import(/* webpackChunkName: 'IndustryLable' */'./components/IndustryLable'),
    LableList: () => import(/* webpackChunkName: 'LableList' */'./components/LableList'),
    PublisherStation: () => import(/* webpackChunkName: 'PublisherStation' */'./components/PublisherStation'),
  },
  data() {
    return {
      dialogType: '',
      dialogTitle: '',
      dialogData: [],
      contentHtmlNumber: 0,
      // 选中的发布者

      tableRows: [ // 表格行的初始化
        { prop: 'id', lable: '用户ID', width: 180 },
        { prop: 'username', lable: '用户名', width: 180 },
        { prop: 'phone', lable: '手机号', width: 180 },
        { prop: 'business', lable: '所属商会', width: 180 }
      ],
      // 供需数据
      supplyData: {
        contentHtml: '', // 供需内容
        radio: '1', // 供应: 1 or 需求: 2
        title: '', // 供需标题
        publisherList: [], // 发布人列表
        supplyLableList: [], // 供需标签
        industryLableList: [], // 行业标签
        publisherStationList: [] // 发布者常驻地
      }
    }
  },
  methods: {
    normalizeField(type) {
      return type[0].toLocaleLowerCase() + type.slice(1) + 'List'
    },
    showDialog(type) {
      this.dialogTitle = dialogTitleMap[type]
      this.$refs.kdDialog.show()
      this.dialogData = this.supplyData[this.normalizeField(type)]
      if (this.dialogType === type) {
        const { dialogContent } = this.$refs
        dialogContent.initData && dialogContent.initData()
      } else {
        this.dialogType = type
      }
    },
    // 移除，发布者
    deleteRow(row) {
      this.$confirm('确认移除所选发布者吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(e => {
        const index = this.supplyData.publisherList.findIndex(v => v.id === row.id)
        this.supplyData.publisherList.splice(index, 1)
      })
    },
    // 移除标签
    handleLableDelete({ list, item }) {
      const i = list.findIndex(v => v.id === item.id)
      list.splice(i, 1)
    },
    // 富文本变化
    addParentHtml(event) {
      console.log(event, 23)
      this.supplyData.contentHtml = event
    },
    // 字数
    textNumber(val) {
      console.log(val, 45)
      this.contentHtmlNumber = val.length
    },
    onConfirm({ type, data }) {
      this.$refs.kdDialog.hide()
      this.dialogData = this.supplyData[this.normalizeField(type)] = data
    }
  }
}
</script>

<style scoped lang="scss">
.publish-img {
  padding: 0 20px;
  .margin-bottom {
    margin-bottom: 20px;
  }
  .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #F2F2F2;
    text-indent: 20px;
  }
  .span {
    color: #bbb;
  }
}
</style>
