<template>
  <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="110px">
    <el-row>
      <el-col :span="15">
        <el-form-item label="模板CODE：" prop="templateCode">
          <el-input v-model.trim="formObj.templateCode" maxlength="20" @change="check_num" clearable show-word-limit />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form-item label="模板类型：" :required="true">
          <el-radio disabled v-model="formObj.smsNoticeTemplateDTO.templateType" label="1">通知短信</el-radio>
          <el-radio disabled v-model="formObj.smsNoticeTemplateDTO.templateType" label="2">推广短信</el-radio>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form-item label="模板名称：" prop="templateName">
          <el-input disabled v-model.trim="formObj.templateName" maxlength="30" clearable show-word-limit />
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
          <div class="property" v-for="(item, index) in formObj.smsNoticeTemplateDTO.variableAttributes" :key="index">
            {{ item.key }}
          </div>
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
</template>

<script>
import { getNoticeTemplateDetail } from '@/api/mass-notification'
export default {
  name: 'Note',
  data() {
    return {
      formObj: {
        type: '1', //模板类型 1短信通知、2订阅消息、3APP通知
        templateCode: '', //模板code/模板id  SMS_251110108
        templateName: '', // 模板名称
        content: '', //模板内容
        smsNoticeTemplateDTO: {
          templateType: '1', // 1通知短信 2推广短信
          variableAttributes: []
        }
      }
    }
  },
  computed: {
    rules() {
      return {
        templateCode: [
          { required: true, message: '模板CODE不能为空', trigger: 'blur' },
          {
            validator: async (rule, value, callback) => {
              const res = await getNoticeTemplateDetail({ templateCode: value })
              if (res.state == 0) {
                return callback(new Error(res.msg))
              } else {
                let formObj = this.formObj
                formObj.content = res.data.content
                formObj.smsNoticeTemplateDTO.templateType = res.data.smsNoticeTemplateVo.templateType + ''
                formObj.smsNoticeTemplateDTO.variableAttributes = res.data.variableAttributes
                formObj.templateName = res.data.templateName
                callback() // 必须加上这个，不然一直塞在验证状态
              }
            },
            trigger: 'blur'
          }
        ],
        templateName: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.$emit('save', this.formObj)
      })
    },
    close() {
      this.$emit('close')
    },
    check_num() {
      this.formObj.templateCode = this.formObj.templateCode.replace(/[^\x00-\xff]/g, '')
    }
  }
}
</script>

<style scoped lang="scss"></style>
