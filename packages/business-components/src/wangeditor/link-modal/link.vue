<template>
  <div>
    <a-form :model="form" label-width="100px">
      <a-form-item label="展示方式">
        <a-radio-group v-model:value="form.type">
          <a-radio :value="0">文字</a-radio>
          <a-radio :value="1">图片</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="链接">
        <a-input v-model:value="form.path" />
      </a-form-item>
      <a-form-item v-show="form.type === 0" label="文字内容">
        <a-input v-model:value="form.content" />
      </a-form-item>
      <a-form-item v-show="form.type === 1" label="图片">
        <ImageUpload @upload="url => (form.src = url)" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="finish">确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import ImageUpload from './upload.vue'
import { Message } from 'ant-design-vue'
defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['onClick'])
const form = reactive({
  type: 0,
  path: '',
  content: '',
  src: ''
})

const finish = () => {
  if (form.type === 0) {
    if (!form.path || !form.content) {
      Message.error('请输入链接或文字内容')
      return false
    }
  } else {
    if (!form.path || !form.src) {
      Message.error('请输入链接或图片')
      return false
    }
  }
  emit('onClick', form)
}
</script>
<style lang="scss">
.a-dialog__body {
  padding: 0px 20px 30px;
}
</style>
