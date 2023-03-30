<template>
  <a-modal v-model:visible="visible" :title="dialogTitle" @cancel="cancelModel">
    <a-form :model="formState" :labelCol="{ span: 4 }" :rules="rules" ref="formRef">
      <a-form-item name="title" label="标题">
        <a-input v-model:value="formState.title" placeholder="请输入banner标题，不超过20个字符" />
      </a-form-item>
      <a-form-item name="content" label="关联内容">
        <a-textarea
          v-model:value="formState.content"
          placeholder="请输入banner跳转链接或路径"
          :auto-size="{ minRows: 5 }"
        />
      </a-form-item>
      <a-form-item name="img" label="上传图片">
        <a-upload
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="/"
          :before-upload="beforeUpload"
          :maxCount="1"
          :multiple="false"
          :customRequest="uploadCustomRequest"
        >
          <img class="logo" v-if="formState.img" :src="formState.img" alt="图片" />
          <div v-else>
            <plus-outlined style="font-size: 20px"></plus-outlined>
          </div>
        </a-upload>
        <div class="logo-tips">
          <p>建议尺寸:400*750px；格式:png、jpg</p>
        </div>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="cancelModel">取消</a-button>
      <a-button @click="submit(2)">保存</a-button>
      <a-button type="primary" @click="submit(1)">发布</a-button>
    </template>
  </a-modal>
</template>
<script>
import { reactive, defineComponent, ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadFileRandomName } from '@/api/content/article'
import { saveBanner } from '@/api/content/banner'
export default defineComponent({
  props: {
    clientType: {
      type: String,
      default: ''
    }
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const formState = reactive({
      title: '',
      content: '',
      img: ''
    })
    const rules = {
      title: [
        { min: 1, max: 20, message: '只限20个字以内哦', trigger: 'blur' },
        { required: true, message: '请输入标题', trigger: 'blur' }
      ],

      img: [{ required: true, message: '请上传图片', trigger: 'change' }]
    }
    const dialogTitle = ref('')
    const visible = ref(false)
    const open = (data = {}) => {
      if (data.bannerId) {
        dialogTitle.value = '编辑banner图'
        Object.assign(formState, data)
      } else {
        dialogTitle.value = '添加banner图'
      }
      visible.value = true
    }
    const cancelModel = () => {
      visible.value = false
      formRef.value.resetFields()
    }
    // logo上传前校验
    const beforeUpload = file => {
      const isPic = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
      if (!isPic) message.error(`${file.name} 不是JPG 或 PNG 格式!`)
      const is2m = file.size <= 1024 * 1024 * 2
      if (isPic && !is2m) message.error('上传头像图片大小不能超过 2MB!')
      return isPic && is2m
    }

    // 自定义logo上传
    const uploadCustomRequest = async ({ file }) => {
      const formData = new FormData()
      formData.append('file', file)
      const res = await uploadFileRandomName(formData, 'demand')
      formState.img = res.data
      formRef.value.validate('img')
    }
    const formRef = ref()
    const submit = async status => {
      await formRef.value.validate()
      await saveBanner({
        clientType: +props.clientType,
        ...formState,
        status
      })
      cancelModel()
      emit('refresh')
    }

    return {
      formState,
      formRef,
      rules,
      props,
      visible,
      dialogTitle,
      open,
      cancelModel,
      beforeUpload,
      uploadCustomRequest,
      submit
    }
  }
})
</script>
<style lang="scss" scoped>
.logo {
  width: 100px;
  height: 100px;
}
</style>
