<template>
  <div>
    <AModal
      v-model:visible="props.articleVisible"
      :confirm-loading="confirmLoading"
      title="导入微信公众号文章"
      @ok="handleOk"
      @cancel="cancelModel"
    >
      <AForm
        ref="formRef"
        :model="formObj"
        :rules="rules"
        label-position="right"
        label-width="100px"
        autocomplete="off"
        :label-col="{ span: 4 }"
      >
        <AFormItem label="文章链接:" name="articleUrl" has-feedback>
          <AInput
            autocomplete="off"
            allowClear
            v-model:value="formObj.articleUrl"
            placeholder="请输入微信文章链接地址"
          />
        </AFormItem>
        <AFormItem label="注意：">
          <div>
            <div class="case">支持导入微信公众号文章</div>
            <div>1.如需获得正式使用权，请自行联系版权所有者</div>
            <div>2.多次导入内容会进行覆盖</div>
          </div>
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { getWechatContent } from '@/api/content/article'
export default defineComponent({
  props: {
    articleVisible: {
      type: Boolean,
      default: false
    },
    contentHtml: {
      type: String,
      default: ''
    }
  },
  emits: ['update:articleVisible', 'update:contentHtml'],
  setup(props, { emit }) {
    const confirmLoading = ref(false)
    const formRef = ref(null)
    const formObj = reactive({
      articleUrl: null
    })
    const rules = {
      articleUrl: [{ required: true, message: '文章链接不能为空', trigger: 'blur' }]
    }
    const cancelModel = () => {
      formRef.value.resetFields()
      emit('update:articleVisible', false)
    }
    const handleOk = async () => {
      try {
        await formRef.value.validateFields()
        confirmLoading.value = true
        const { data } = await getWechatContent(formObj.articleUrl)
        confirmLoading.value = false
        emit('update:contentHtml', data.text)
        formRef.value.resetFields()
        emit('update:articleVisible', false)
      } catch (errorInfo) {
        confirmLoading.value = false
        return false
      }
    }
    return {
      cancelModel,
      handleOk,
      formObj,
      confirmLoading,
      formRef,
      props,
      rules
    }
  }
})
</script>

<style></style>
