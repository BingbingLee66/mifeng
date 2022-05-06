<template>
  <div class="publish-img">
    <h1 class="title">供需信息</h1>
    <div class="publish margin-bottom">
      <commontitle>发布者</commontitle>
      <el-button type="warning" icon="el-icon-edit" plain>选择发布者</el-button>
      <span class="span">仅可选择一位发布者，重选后，新选择的发布者将会替换已选发布者</span>
    </div>
    <!-- 发布者表格 -->
    <el-table class="margin-bottom" :data="tableData" style="width: 842px" stripe border header-row-class-name="tableheader" empty-text="请选择发布者">
      <el-table-column v-for="it in tableRows" :key="it.prop" :prop="it.prop" :label="it.lable" :width="it.width"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">
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
      <el-button type="success" icon="el-icon-goods">请选择标签</el-button>
    </div>
    <div class="margin-bottom">
      <commontitle>行业标签</commontitle>
      <el-button type="success" icon="el-icon-coin">请选择行业</el-button>
    </div>
    <div class="margin-bottom">
      <commontitle>发布者常驻地</commontitle>
      <el-button type="success" icon="el-icon-location-information">请选择省市</el-button>
    </div>
    <div class="margin-bottom">
      <commontitle>供需标题</commontitle>
      <el-input clearable v-model="supplyData.title" placeholder="请输入简明扼要的标题" maxlength="40" show-word-limit></el-input>
    </div>
    <div class="margin-bottom">
      <commontitle>供需内容</commontitle>
      <editorElem
        :hiddenMenu="true"
        :height="200"
        @addParentHtml="addParentHtml"
        @textNumber="textNumber"
        :content="supplyData.contentHtml"
      ></editorElem>
    </div>
    <div class="margin-bottom">
      <commontitle>供需图片</commontitle>
      <span class="span">选填，最多9张</span>
    </div>
    <div class="margin-bottom">
      <commontitle>选择同步商/协会</commontitle>
    </div>
    <!--添加发布者弹窗-->
    <publisher-dialog :dialogVisible.sync="dialogVisible"></publisher-dialog>
  </div>
</template>

<script>
import editorElem from '@/components/wangEditor/index'
export default {
  name: 'PublishImg',
  components: {
    editorElem,
    'commontitle': () => import(/* webpackChunkName: "common-title" */ './CommonTitle'),
    'publisher-dialog': () => import(/* webpackChunkName: "publisher-dialog" */ './PublisherDialog')
  },
  data() {
    return {
      // 发布者弹窗
      dialogVisible: true,
      // 富文本字数，用于字数限制
      contentHtmlNumber: 0,
      // 选中的发布者
      tableData: [{
        id: 1,
        username: 'zs',
        phone: '188888',
        business: '云商会'
      }],
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
      }
    }
  },
  methods: {
    // 移除，发布者
    deleteRow(row) {
      console.log(row)
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
