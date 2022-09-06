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
          <el-input v-model.trim="formObj.templateName" maxlength="60" clearable show-word-limit />
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
            <el-input v-model="item.key" placeholder="请输入模板名称" />
            <el-input v-model="item.value" placeholder="请输入关键词" />
            <el-button type="danger" :disabled="index == 0" @click="onDelete(index)">删除</el-button>
          </div>
          <div><el-button type="primary" @click="onNewly">+新增</el-button></div>
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
        type: '2', //模板类型 1短信通知、2订阅消息、3APP通知
        templateCode: '', // 模板code/模板id
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
              const res = await getNoticeTemplateDetail({ templateCode: value })
              if (res.state == 0) {
                return callback(new Error(res.msg))
              } else {
                let formObj = this.formObj

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
        let pass = false // 判断关键词内容是否填写
        this.formObj.subscriptionNoticeTemplateDTO.variableAttributes.forEach(v => {
          if (v.key === '' || v.value === '') pass = true
        })
        if (pass) return this.$message.error('请填写关键词')
        this.$emit('save', this.formObj)
      })
    },
    // 取消
    close() {
      this.$emit('close')
    },
    // 新增
    onNewly() {
      let obj = {
        key: '',
        value: ''
      }
      this.formObj.subscriptionNoticeTemplateDTO.variableAttributes.push(obj)
    },
    // 删除
    onDelete(index) {
      console.log(index)
      this.formObj.subscriptionNoticeTemplateDTO.variableAttributes.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.hinge {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  .el-input {
    width: 250px;
    margin-right: 20px;
  }
}
</style>
