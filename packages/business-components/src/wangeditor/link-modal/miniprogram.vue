<template>
  <div>
    <a-form :model="form" label-width="100px" @finish="$emit('onClick', form)">
      <a-form-item label="展示方式" name="type">
        <a-radio-group v-model:value="form.type">
          <a-radio :value="0">文字</a-radio>
          <a-radio :value="1">图片</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="小程序路径"
        name="path"
        :rules="[
          { required: true, message: '小程序路径不能为空' },
          {
            required: true,
            validator: async (rule, value) => {
              if (!value.split('?')[1]) throw '小程序路径格式错误'
            }
          }
        ]"
      >
        <a-input v-model:value="form.path" />
      </a-form-item>

      <a-form-item v-if="form.type === 0" label="文字内容" name="content">
        <a-input v-model:value="form.content" />
      </a-form-item>

      <a-form-item v-if="form.type === 1" label="图片" name="src">
        <ImageUpload @upload="url => (form.src = url)" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import ImageUpload from './upload.vue'
const form = reactive({
  type: 0,
  path: '',
  content: '',
  src: ''
})
</script>

<style scoped lang="scss"></style>
