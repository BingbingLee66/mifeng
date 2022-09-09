<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="app-container">
    <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="110px">
      <el-row>
        <el-col :span="15">
          <el-form-item label="所属类型：" :required="true">
            <el-radio-group v-model="formObj.noticeTypeId">
              <el-radio label="1">缴费通知</el-radio>
              <el-radio label="2">活动通知</el-radio>
              <el-radio label="3">招商活动</el-radio>
              <el-radio label="4">邀请入会</el-radio>
              <el-radio label="5">自定义通知</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="formObj.type == 3 ? '消息标题：' : '模板名称：'" prop="ntId">
            <el-select v-model="formObj.ntId" filterable placeholder="请选择模板" @change="onLibrary">
              <el-option v-for="(item, index) in originOpt" :key="index" :label="item.templateName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formObj.type != 2">
        <el-col :span="13">
          <el-form-item :label="formObj.type == 3 ? '内容：' : '模板内容：'" prop="content">
            <el-input
              v-model.trim="formObj.content"
              disabled
              type="textarea"
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 7 }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">
          <el-form-item :label="formObj.type == 2 ? '关键词：' : '变量属性：'" :required="true">
            <div
              v-for="(item, index) in formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList"
              :key="index"
              class="hinge"
            >
              <div class="hinge-additional">{{ item.key }}</div>
              <el-select v-model="item.codeKey" clear="hinge-sele" filterable placeholder="请选择" size="mini">
                <el-option v-for="(item, index) in variateList" :key="index" :label="item.value" :value="item.key" />
              </el-select>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
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
import {
  noticeTemplateNameList,
  getNoticeTemplateDetail,
  noticeTemplateSetAdd,
  getKeyValueList,
  getNoticeTemplateSetDetailById
} from '@/api/mass-notification'
export default {
  data() {
    return {
      formObj: {
        type: '', // 模板类型 1短信通知、2订阅消息、3APP通知
        noticeTypeId: '1', //	所属类型 1缴费通知、2活动通知、3招商活动、4邀请入会、5自定义通知
        ntId: '', // 模板名称 模板库id
        content: '', // 模板内容
        templateRemark: '', // 模板备注
        keyValueNoticeTemplateSetVo: {
          keyValueTypeVOMapList: []
        },
        status: 1, // 状态 0禁用 1启用 2删除
        id: null // 编辑的时候需要带id
      },
      originOpt: [], // 模板名称
      variateList: [] // 变量属性值
    }
  },
  computed: {
    rules() {
      return {
        ntId: [{ required: true, message: '请选择模板', trigger: 'change' }],
        content: [{ required: true, message: '模板内容不能为空', trigger: 'change' }],
        templateRemark: [{ required: true, message: '模板备注不能为空', trigger: 'blur' }]
      }
    }
  },
  async created() {
    this.formObj.type = this.$route.query.type || '1'
    await this.onRiginOpt()
    await this.onGetKeyValueList()
    if (this.$route.query.id) {
      this.formObj.id = this.$route.query.id || null
      this.formObj.status = this.$route.query.status
      await this.particulars()
    }
  },
  methods: {
    // 模板名称数据
    async onRiginOpt() {
      const res = await noticeTemplateNameList({ type: this.formObj.type })
      this.originOpt = res.data
    },
    // 变量值列表
    async onGetKeyValueList() {
      const res = await getKeyValueList({ type: this.formObj.type })
      this.variateList = res.data
    },
    // 选择模板名称 列表
    async onLibrary() {
      let { formObj } = this
      let detailsCode = ''
      if (!formObj.ntId) return
      this.originOpt.forEach(v => {
        if (v.id === formObj.ntId) detailsCode = v.templateCode
      })
      const res = await getNoticeTemplateDetail({ templateCode: detailsCode })
      formObj.content = res.data.content
      formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList = res.data.variableAttributes.map(v => {
        return { key: v.key, codeKey: '', value: {} }
      })
    },
    // 编辑获取数据
    async particulars() {
      let { formObj } = this
      const { data } = await getNoticeTemplateSetDetailById({ id: formObj.id })
      formObj.noticeTypeId = data.noticeTypeId + ''
      formObj.content = data.content
      formObj.templateRemark = data.templateRemark
      formObj.ntId = data.ntId
      data.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.forEach(v => {
        v.codeKey = v.value.key
      })
      formObj.keyValueNoticeTemplateSetVo = data.keyValueNoticeTemplateSetVo
    },

    save() {
      this.$refs.form.validate(async valid => {
        if (!valid) return

        if (this.formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.some(v => v.codeKey === '')) {
          return this.$message({
            message: '请选择属性变量',
            type: 'error'
          })
        }

        this.formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.forEach(v => {
          this.variateList.forEach(j => {
            if (v.codeKey === j.key) v.value = j
          })
        })

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
    // 关闭
    close() {
      this.$router.push({
        path: '/mass-notification/template-set',
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
.hinge {
  display: flex;
  align-items: center;
  margin-bottom: 7px;
  .hinge-additional {
    margin-right: 50px;
  }
  .hinge-sele {
    width: 100px !important;
  }
}
</style>
