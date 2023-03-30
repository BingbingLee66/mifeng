<template>
  <Panel>
    <a-form ref="formRef" :model="formObj" :rules="rules" :label-col="{ style: { width: '150px' } }">
      <a-row>
        <a-col :span="15">
          <a-form-item label="所属类型" name="noticeTypeId" :required="true">
            <a-radio-group v-model:value="formObj.noticeTypeId" @change="onChange">
              <a-radio :value="1">缴费通知</a-radio>
              <a-radio :value="2">活动通知</a-radio>
              <a-radio :value="3">招商活动</a-radio>
              <a-radio :value="4">邀请入会</a-radio>
              <a-radio :value="5">自定义通知</a-radio>
              <a-radio :value="6">课程通知</a-radio>
              <a-radio :value="8">节日海报</a-radio>
              <a-radio :value="9">问卷调查</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item :label="formObj.type === '3' ? '消息标题：' : '模板名称：'" name="ntId">
            <a-select
              v-model:value="formObj.ntId"
              filterable
              placeholder="请选择模板"
              @change="onLibrary"
              :options="originOpt"
              :field-names="{ label: 'templateName', value: 'id' }"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="formObj.type !== '2'">
        <a-col :span="13">
          <a-form-item :label="formObj.type === '3' ? '内容：' : '模板内容：'" name="content">
            <a-input
              v-model:value.trim="formObj.content"
              disabled
              type="textarea"
              :maxlength="500"
              show-account
              :autosize="{ minRows: 4, maxRows: 7 }"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="16">
          <a-form-item :label="formObj.type === '2' ? '关键词：' : '变量属性：'" :required="true">
            <div
              v-for="(item, index) in formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList"
              :key="index"
              class="hinge"
            >
              <div class="hinge-additional">{{ item.key }}</div>
              <a-select
                v-model:value="item.codeKey"
                clear="hinge-sele"
                filterable
                placeholder="请选择"
                size="mini"
                :options="variateList"
                :field-names="{ label: 'value', value: 'key' }"
              />
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="模板备注：" name="templateRemark">
            <a-input v-model:value.trim="formObj.templateRemark" clearable :maxlength="30" show-word-limit />
            <div class="base">同个模板可以配置不同属性值，需添加模板备注作为区分</div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
        <a-col :span="8">
          <a-button @click="close" class="mr-10">取消</a-button>
          <a-button type="primary" @click="save">确认</a-button>
        </a-col>
      </a-form-item>
    </a-form>
  </Panel>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import {
  noticeTemplateNameList,
  getNoticeTemplateDetail,
  noticeTemplateSetAdd,
  getKeyValueList,
  getNoticeTemplateSetDetailById
} from '@business/common/src/mass-notification/api/index'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
const formObj = reactive({
  type: '', // 模板类型 1短信通知、2订阅消息、3APP通知
  noticeTypeId: 1, //	所属类型 1缴费通知、2活动通知、3招商活动、4邀请入会、5自定义通知
  ntId: '', // 模板名称 模板库id
  content: '', // 模板内容
  templateRemark: '', // 模板备注
  keyValueNoticeTemplateSetVo: {
    keyValueTypeVOMapList: []
  },
  status: 1, // 状态 0禁用 1启用 2删除
  id: null // 编辑的时候需要带id
})
const originOpt = ref([])
const variateList = ref([])
const rules = {
  ntId: [{ required: true, message: '请选择模板', trigger: 'change' }],
  content: [{ required: true, message: '模板内容不能为空', trigger: 'change' }],
  templateRemark: [{ required: true, message: '模板备注不能为空', trigger: 'blur' }]
}
// 变量值列表
const onGetKeyValueList = async () => {
  const { data } = await getKeyValueList({ type: formObj.noticeTypeId })
  variateList.value = data
}
// 模板名称数据
const onRiginOpt = async () => {
  const { data } = await noticeTemplateNameList({ type: formObj.type })
  originOpt.value = data
}
// 单选点击
const onChange = () => {
  onGetKeyValueList()
  if (formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList) {
    formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.forEach(v => {
      v.codeKey = ''
    })
  }
}
// 选择模板名称 列表
const onLibrary = async () => {
  let detailsCode = ''
  if (!formObj.ntId) return
  originOpt.value.forEach(v => {
    if (v.id === formObj.ntId) detailsCode = v.templateCode
  })
  const {
    data: { content, variableAttributes }
  } = await getNoticeTemplateDetail({ templateCode: detailsCode, type: formObj.type })
  formObj.content = content
  await formRef.value.validateFields('content')
  formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList = []
  if (variableAttributes) {
    formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList = variableAttributes.map(v => {
      return { key: v.key, codeKey: '', value: {} }
    })
  }
}
// 编辑获取数据
const particulars = async () => {
  const { data } = await getNoticeTemplateSetDetailById({ id: formObj.id })
  data.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.forEach(v => {
    v.codeKey = v.value.key
  })
  Object.assign(formObj, data)
}
const formRef = ref(null)
const router = useRouter()
const save = async () => {
  await formRef.value.validateFields()
  if (formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.some(v => v.codeKey === '')) {
    return message.error('请选择属性变量')
  }
  formObj.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.forEach(v => {
    variateList.value.forEach(j => {
      if (v.codeKey === j.key) v.value = j
    })
  })

  await noticeTemplateSetAdd(formObj)
  close()
}
const close = () => {
  router.go(-1)
}
const route = useRoute()
const init = async () => {
  formObj.type = route.query.type || '1'
  await onRiginOpt()
  if (route.query.id) {
    formObj.id = route.query.id || null
    formObj.status = route.query.status
    await particulars()
  }
  await onGetKeyValueList()
}
onMounted(() => {
  init()
})
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
    // margin-right: 50px;
    width: 200px;
  }
  .hinge-sele {
    width: 100px !important;
  }
}
</style>
