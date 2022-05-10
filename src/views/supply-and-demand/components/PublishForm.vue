<template>
  <div class="publish-img">
    <h1 class="title">供需信息</h1>

    <el-form>
      <el-form-item label="发布者" required>
        <el-button type="warning" icon="el-icon-edit" plain @click="showDialog('Publisher')">选择发布者</el-button>
        <span class="span">仅可选择一位发布者，重选后，新选择的发布者将会替换已选发布者</span>
      </el-form-item>
      <!-- 发布者表格 -->
      <el-table class="margin-bottom" :data="formData.publisherList" style="width: 842px" stripe border header-row-class-name="tableheader" empty-text="请选择发布者">
        <el-table-column v-for="it in tableRows" :key="it.prop" :prop="it.prop" :label="it.lable" :width="it.width" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.row)">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="供需类型" required>
        <el-radio v-model="formData.tarType" :label="1">供应</el-radio>
        <el-radio v-model="formData.tarType" :label="2">需求</el-radio>
      </el-form-item>
      <el-form-item label="供需标签" required>
        <LableList
          :list="formData.supplyLableList"
          limit="5"
          icon="el-icon-goods"
          @click="showDialog('SupplyLable')"
          @delete="handleLableDelete"
        >
          请选择标签
        </LableList>
      </el-form-item>
      <el-form-item label="行业标签" required>
        <LableList
          :list="formData.industryLableList"
          name-key="typeName"
          limit="3"
          icon="el-icon-coin"
          @click="showDialog('IndustryLable')"
          @delete="handleLableDelete"
        >
          请选择行业
        </LableList>
      </el-form-item>
      <el-form-item label="发布者常驻地" required>
        <LableList
          :list="formData.publisherStationList"
          limit="1"
          name-key="fullName"
          icon="el-icon-location-information"
          @click="showDialog('PublisherStation')"
          @delete="handleLableDelete"
        >
          请选择省市
        </LableList>
      </el-form-item>
      <el-form-item label="有效时间" required>
        <el-radio v-model="formData.validType" :label="1">长期有效</el-radio>
        <el-radio v-model="formData.validType" :label="2">自定义时间</el-radio>
        <el-date-picker v-show="formData.validType===2" v-model="formData.date" type="datetime" placeholder="选择日期时间" />
      </el-form-item>
    </el-form>

    <el-form label-position="top">
      <el-form-item label="供需标题" required>
        <el-input v-model="formData.title" clearable placeholder="请输入简明扼要的标题" maxlength="40" show-word-limit />
      </el-form-item>
      <el-form-item label="供需内容" required>
        <editorElem
          :hidden-menu="true"
          :height="200"
          :content="formData.content"
          @addParentHtml="addParentHtml"
          @textNumber="textNumber"
        />
      </el-form-item>

      <slot />

      <el-form-item label="选择同步商/协会">
        <div class="association-sync">
          <div class="association-sync-title"> 在这些商/协会内同步供需 </div>
          <div class="association-selected">
            已选：<LableList :list="formData.selectedChamberList" limit="0" @delete="onChamberChange($event,'unSelecteChamberList')" />
          </div>
          <div class="association-sync-title"> 不同步到以下商/协会 </div>
          <div class="association-unselect">
            <LableList :list="formData.unSelecteChamberList" limit="0" :item-style="{color: '#555',border:'1px solid #555'}">
              <i slot="icon" slot-scope="event" class="lable-icon el-icon-circle-plus-outline" @click="onChamberChange(event,'selectedChamberList')" />
            </LableList>
          </div>
        </div>
      </el-form-item>

    </el-form>

    <div class="footer">
      <el-button @click="$router.push('/management')">取消</el-button>
      <el-button type="primary" @click="onSubmit">发布</el-button>
    </div>

    <!-- 弹窗表单 -->
    <kdDialog
      ref="kdDialog"
      :dialog-title="dialogTitle"
      dialog-width="60%"
      @savePopupData="$refs.dialogContent.handleConfirm()"
    >
      <template slot="content">
        <keep-alive>
          <component :is="dialogType" ref="dialogContent" :data="dialogData" @confirm="onDialogConfirm" />
        </keep-alive>
      </template>
    </kdDialog>
  </div>
</template>

<script>
import editorElem from '@/components/wangEditor/index'
import { getChamberList } from '@/api/content/article'

const dialogTitleMap = {
  Publisher: '添加发布者',
  SupplyLable: '供需标签',
  IndustryLable: '行业标签',
  PublisherStation: '发布者常驻地'
}

export default {
  name: 'PublishForm',
  components: {
    editorElem,
    kdDialog: () => import('@/components/common/kdDialog'),
    Publisher: () => import(/* webpackChunkName: "Publisher" */ './Publisher'),
    SupplyLable: () => import(/* webpackChunkName: 'SupplyLable' */'./SupplyLable'),
    IndustryLable: () => import(/* webpackChunkName: 'IndustryLable' */'./IndustryLable'),
    LableList: () => import(/* webpackChunkName: 'LableList' */'./LableList'),
    PublisherStation: () => import(/* webpackChunkName: 'PublisherStation' */'./PublisherStation'),
  },
  data() {
    return {
      dialogType: '',
      dialogTitle: '',
      dialogData: [],
      contentNumber: 0,

      tableRows: [ // 表格行的初始化
        { prop: 'wxUserId', lable: '用户ID' },
        { prop: 'userName', lable: '用户名' },
        { prop: 'phone', lable: '手机号' },
        { prop: 'chamberName', lable: '所属商会' }
      ],

      // 供需数据
      formData: {
        content: '', // 供需内容
        tarType: 0, // 供应: 1 or 需求: 2
        validType: 1, // 长期有效: 1  自定义时间: 2
        title: '', // 供需标题
        publisherList: [], // 发布人列表
        supplyLableList: [], // 供需标签
        industryLableList: [], // 行业标签
        publisherStationList: [], // 发布者常驻地
        date: '',
        selectedChamberList: [], // 已选择商协会
        unSelecteChamberList: [] // 未选择商协会
      },
    }
  },
  watch: {
    'formData.publisherList'([publisher]) {
      if (publisher) {
        this.getChamberList(publisher.wxUserId)
      } else {
        this.formData.selectedChamberList = []
        this.formData.unSelecteChamberList = []
      }
    }
  },
  methods: {
    // 序列化字段
    normalizeField(type) {
      return type[0].toLocaleLowerCase() + type.slice(1) + 'List'
    },
    // 弹窗显示
    showDialog(type) {
      this.dialogTitle = dialogTitleMap[type]
      this.$refs.kdDialog.show()
      this.dialogData = this.formData[this.normalizeField(type)]
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
        const index = this.formData.publisherList.findIndex(v => v.id === row.id)
        this.formData.publisherList.splice(index, 1)
      })
    },
    // 移除标签
    handleLableDelete({ list, index }) {
      list.splice(index, 1)
    },
    // 富文本变化
    addParentHtml(event) {
      // console.log(event, 23)
      this.formData.content = event
    },
    // 字数
    textNumber(val) {
      // console.log(val, 45)
      this.contentNumber = val.length
    },
    // 弹窗确认
    onDialogConfirm({ type, data }) {
      this.$refs.kdDialog.hide()
      this.dialogData = this.formData[this.normalizeField(type)] = data
    },

    // 获取商会列表
    async getChamberList(wxUserId) {
      const { data = [] } = await getChamberList(wxUserId)
      this.formData.selectedChamberList = data
      this.formData.unSelecteChamberList = []
    },
    // 切换商会列表
    onChamberChange({ list, item, index }, key) {
      list.splice(index, 1)
      this.formData[key].push(item)
    },

    // 轻提示
    alert(message, cb) {
      this.$message({ message, type: 'warning' })
      cb && cb(message)
    },

    // 序列化表单数据 用于接口提交
    normalizeFormData() {
      return new Promise((resolve, reject) => {
        const { formData: {
          content,
          tarType,
          validType,
          title,
          publisherList,
          supplyLableList,
          industryLableList,
          publisherStationList,
          date,
          selectedChamberList,
        }} = this

        if (!tarType) return this.alert('请选择类型', reject)
        if (!supplyLableList.length) return this.alert('请选择供需标签', reject)
        if (!industryLableList.length) return this.alert('请选择行业标签', reject)
        if (!publisherStationList.length) return this.alert('请选择发布者常驻地', reject)
        if (!title) return this.alert('请填写标题', reject)
        if (!content) return this.alert('请填写内容', reject)

        const [province, city] = publisherStationList[0].fullName.split('-')

        resolve({
          chamberIds: selectedChamberList.map(v => v.id),
          city,
          content,
          labelIds: supplyLableList.map(v => v.id),
          province,
          tarType,
          title,
          tradeIds: industryLableList.map(v => v.id),
          type: 2,
          userId: publisherList[0].wxUserId,
          validEndTs: date ? date.getTime() : void 0,
          validType
        })
      })
    },

    // 表单提交
    async onSubmit() {
      try {
        const params = await this.normalizeFormData()
        this.$emit('submit', params)
      } catch (error) {
        //
      }
    }
  }
}
</script>

<style scoped lang="scss">
.publish-img {
  padding: 0 20px;
  // max-width: 1000px;

  .margin-bottom {
    margin-bottom: 20px;
  }

  .mb10 {
    margin-bottom: 10px;
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

  .association-sync {
    border: 1px solid #d7d7d7;
    padding: 10px;
    line-height: 1.15;
    .association-sync-title {
      padding: 10px 0;
    }

    .lable-icon {
      color: #14c468;
    }

    .association-selected {
      color: #409eff;
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    border: 1px solid #d7d7d7;
  }
}
</style>
