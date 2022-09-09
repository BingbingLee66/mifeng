<template>
  <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="110px">
    <el-row>
      <el-col :span="15">
        <el-form-item label="模板ID：" prop="templateCode">
          <el-input v-model.trim="formObj.templateCode" maxlength="60" clearable show-word-limit />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form-item label="模板名称：" prop="templateName">
          <el-input v-model.trim="formObj.templateName" disabled maxlength="60" clearable show-word-limit />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="15">
        <el-form-item label="关键词：" :required="true">
          <div
            v-for="(item, index) in formObj.subscriptionNoticeTemplateDTO.variableAttributes"
            :key="index"
            class="hinge"
          >
            <div>{{ item.value }}</div>
            <dir>{{ item.key }}</dir>
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
  name: 'Subscribe',
  data() {
    return {
      formObj: {
        type: '2', // 模板类型 1短信通知、2订阅消息、3APP通知
        templateCode: '', // 模板code/模板id  A40fmD49mtgMnh9RqQ_fP-yz_B-ljLHYgDCA63y2Cd4
        templateName: '', // 模板名称
        subscriptionNoticeTemplateDTO: {
          // 订阅消息模板库dto
          variableAttributes: [
            {
              key: '',
              value: ''
            }
          ]
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
              const res = await getNoticeTemplateDetail({ templateCode: value, type: '2' })
              if (res.state === 0) {
                return callback(new Error(res.msg))
              } else {
                const { formObj } = this
                formObj.subscriptionNoticeTemplateDTO.variableAttributes = res.data.variableAttributes
                formObj.templateName = res.data.templateName
                callback() // 必须加上这个，不然一直塞在验证状态
              }
            },
            trigger: 'blur'
          }
        ],
        templateName: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  methods: {
    // 确认
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.$emit('save', this.formObj)
      })
    },
    // 取消
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.hinge {
  display: flex;
  align-items: center;
  line-height: 10px;
}
</style>
