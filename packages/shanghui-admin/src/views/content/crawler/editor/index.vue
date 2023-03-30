<template>
  <Panel>
    <AForm ref="formRef" :model="formObj" :rules="rules" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
      <AFormItem label="文章标题：" name="title" has-feedback>
        <AInput
          :showCount="true"
          :maxlength="60"
          allowClear
          v-model:value="formObj.title"
          placeholder="限输入5-60个字的标题"
        />
      </AFormItem>
      <AFormItem label="文章内容" name="content">
        <ARow>
          <ACol :span="14">
            <WangEditor ref="editorElem" v-model:content="formObj.webContent" />
          </ACol>
          <ACol :span="6">
            <ArticlePreview :title="formObj.title" :htmlObj="formObj.webContent" />
          </ACol>
        </ARow>
      </AFormItem>
      <ARow>
        <ACol :push="2" :span="8">
          <AButton type="primary" v-dbClick @click="toSave">确定</AButton>
          <AButton @click="closeTab" style="margin-left: 20px">取消</AButton>
        </ACol>
      </ARow>
    </AForm>
  </Panel>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getDetail, save } from '@business/common/src/content/api/crawler'
import { useRouter } from 'vue-router'
import WangEditor from '@business/components/src/wangeditor/WangEditor.vue'
import ArticlePreview from '@business/components/src/article-preview/ArticlePreview.vue'
const router = useRouter()
const articleId = ref()
const formRef = ref(null)
const formObj = reactive({
  title: '',
  webContent: ''
})
const rules = reactive({
  title: [
    { required: true, message: '文章标题不能为空', trigger: 'blur' },
    { min: 5, max: 60, message: '限输入5-60个字的标题', trigger: 'blur' }
  ]
})
onMounted(async () => {
  const { query } = router.currentRoute.value
  if (query.articleId) {
    articleId.value = query.articleId
    fetchData()
  }
})
const fetchData = async () => {
  const params = {
    id: articleId.value
  }
  const {
    data: { dtl }
  } = await getDetail(params)
  Object.assign(formObj, dtl)
}
const closeTab = () => {
  router.go(-1)
}
const toSave = async () => {
  try {
    await formRef.value.validateFields()
    await save(formObj)
    closeTab()
  } catch (errorInfo) {
    return false
  }
}
</script>

<style lang="scss" scoped>
:deep(.editor) {
  width: 100%;
}
// fix:菜单换行下拉框弹出遮挡
:deep(.w-e-menu) {
  z-index: auto !important;
  .w-e-droplist {
    z-index: 3 !important;
  }
}
</style>
