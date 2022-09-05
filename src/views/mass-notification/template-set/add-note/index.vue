<template>
  <div class="app-container">
    <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="110px">
      <el-row>
        <el-col :span="15">
          <el-form-item label="所属类型：" :required="true">
            <el-radio v-model="formObj.noticeTypeId" label="1">缴费通知</el-radio>
            <el-radio v-model="formObj.noticeTypeId" label="2">活动通知</el-radio>
            <el-radio v-model="formObj.noticeTypeId" label="3">招商活动</el-radio>
            <el-radio v-model="formObj.noticeTypeId" label="4">邀请入会</el-radio>
            <el-radio v-model="formObj.noticeTypeId" label="5">自定义通知</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="模板名称：" prop="ntId">
            <el-select v-model="code" @change="onLibrary" clearable filterable placeholder="请选择">
              <el-option
                v-for="(item, index) in originOpt"
                :key="index"
                :label="item.templateName"
                :value="item.templateCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-form-item label="模板内容：" prop="content">
            <el-input
              disabled
              v-model.trim="formObj.content"
              type="textarea"
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 7 }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-form-item label="变量属性：" :required="true">
            <div
              class="property"
              v-for="(item, index) in formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList"
              :key="index"
            >
              {{ item.additionalProperty1 }}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-form-item label="模板备注：" prop="templateRemark">
            <el-input v-model.trim="formObj.templateRemark" clearable maxlength="30" show-word-limit />
            <div class="base">同个模板可以配置不同属性值，需添加模板备注作为区分</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-col :span="8">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { noticeTemplateNameList, getNoticeTemplateDetail, noticeTemplateSetAdd } from '@/api/mass-notification'
export default {
  data() {
    return {
      formObj: {
        type: '', // 模板类型 1短信通知、2订阅消息、3APP通知
        noticeTypeId: '1', //	所属类型 1缴费通知、2活动通知、3招商活动、4邀请入会、5自定义通知
        ntId: '', // 模板名称
        content: '', // 模板内容
        templateRemark: '', // 模板备注
        keyValueNoticeTemplateSetVo: {
          keyValueTypeVOMapList: []
        },
        id: '' // 编辑的时候需要带id
      },
      code: '',
      originOpt: []
    }
  },
  computed: {
    rules() {
      return {
        ntId: [{ required: true, message: '请选择模板名称', trigger: 'change' }],
        content: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }],
        templateRemark: [{ required: true, message: '模板备注不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.formObj.type = this.$route.query.type || '1'
    this.onRiginOpt()
  },
  methods: {
    save() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const res = await noticeTemplateSetAdd(this.formObj)
        if (res.state === 1) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.close()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 模板名称数据
    async onRiginOpt() {
      const res = await noticeTemplateNameList({ type: this.formObj.type })
      this.originOpt = res.data
    },
    // 选择模板名称
    async onLibrary() {
      let formObj = this.formObj
      if (!this.code) return
      this.originOpt.forEach(v => {
        if (v.templateCode == this.code) formObj.ntId = v.id
      })

      const res = await getNoticeTemplateDetail({ templateCode: this.code })
      formObj.content = res.data.content
      formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList = res.data.smsNoticeTemplateVo.variableAttributes.map(
        v => {
          return { additionalProperty1: v.key }
        }
      )
      console.log('ntId', formObj, res)
    },
    // 关闭
    close() {
      this.$router.push({
        path: '/dashboard',
        query: {
          type: this.formObj.type
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.base {
  color: #aaaaaa;
}
</style>
