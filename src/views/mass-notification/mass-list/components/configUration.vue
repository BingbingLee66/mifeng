<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <el-dialog
      title="批量配置模板"
      :visible.sync="showConfiguration"
      width="40%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="app-container">

        <div>1、请选择模板</div>
        <div class="container-top">
          <div class="container-sel">
            <el-select v-model="formObj.channelTypeId" placeholder="请选择渠道" @change="onLibrary">
              <el-option label="短信" :value="1" />
              <el-option label="订阅消息" :value="2" />
              <el-option label="APP推送" :value="3" />
            </el-select>
          </div>
          <div class="container-sel">
            <el-select v-model="formObj.id" filterable placeholder="请选择模板">
              <el-option v-for="(item, index) in stencil" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </div>
        </div>

        <div>2、请选择模板应用商协会 (选择后，以下商协会可使用此模板)</div>
        <div class="container-top">
          <div clear="container-sel"> <el-input v-model="name" clearable placeholder="请输入内容" /></div>
          <el-button type="primary" @click="query">
            查询
          </el-button>
          <div>已选 <span class="container-choice">{{ formObj.ckeys.length }}</span>个商协会</div>
        </div>

        <!-- 商协会 -->
        <div class="business">
          <el-checkbox-group
            v-model="formObj.ckeys"
            class="country-group"
          >
            <div class="group-box">
              <el-checkbox
                v-for="country in originOpt"
                :key="country.ckey"
                class="country-group-item"
                :label="country.ckey"
              > {{ country.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

      </div>

      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  selectTemplateListAdmin,
  distributionChambers,
  batchTemplateDistribution
} from '@/api/mass-notification'
export default {
  props: {
    showConfiguration: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formObj: {
        channelTypeId: 1, // 1短信 2订阅消息 3app通知
        ckeys: [],
        id: null
      },
      name: '',
      originOpt: [], // 商协会
      stencil: [], // 模板
      loading: false
    }
  },
  watch: {
    showConfiguration(n) {
      if (!n) return
      this.onLibrary()
      this.query()
    },

  },

  methods: {
    // 取消
    handleClose() {
      this.formObj = {
        channelTypeId: 1,
        ckeys: [],
        id: null
      }
      this.name = ''
      this.originOpt = []
      this.stencil = []
      this.loading = false
      this.$emit('update:showConfiguration', false)
    },
    // 确定
    async handleSave() {
      if (!this.formObj.id) return this.$message.error('请选择模板')
      if (!this.formObj.ckeys.length) return this.$message.error('请选择商协会')

      this.loading = true
      const res = await batchTemplateDistribution(this.formObj)

      if (res.state === 1) {
        this.$message.success('操作成功')
        this.handleClose()
        this.$emit('onClick')
      } else {
        this.$message.error(res.msg)
        this.loading = false
      }
    },
    // 搜索渠道
    async onLibrary() {
      this.formObj.id = ''
      this.stencil = []

      const parmas = {
        channelTypeId: this.formObj.channelTypeId,
      }
      const res = await selectTemplateListAdmin(parmas)
      this.stencil = res.data
    },
    // 查询
    async query() {
      const parmas = {
        name: this.name
      }
      const res = await distributionChambers(parmas)
      this.originOpt = res.data
    }
  }
}
</script>
<style scoped lang="scss">
.container-top{
  display: flex;
  align-items: center;
  margin: 15px 0;
  .container-sel{
    margin-right: 30px;
  }
  .container-choice{
    color: #4daaff;
  }
}
.business{
  max-height: 350px;
  overflow-y: auto;
  width: 100%;
  padding: 10px 0;
  .el-checkbox{
    display: block !important;
  }
}
.dialog-footer{
  margin-top: 40px;
  width: 100%;
  text-align: center;
}
.el-button--primary{
  margin: 0 20px;
}
</style>
