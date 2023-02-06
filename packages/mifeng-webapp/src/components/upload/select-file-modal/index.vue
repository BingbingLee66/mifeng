<template>
  <a-modal
    v-bind="$attrs"
    centered
    :visible="visible"
    :okButtonProps="okButtonProps"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <FileUploader v-if="visible" placeholder="选择文件" v-bind="$attrs" @uploaded="onFileUploaded">
      <a-button>
        <template #icon> <UploadOutlined /> </template>
        上传文件
      </a-button>
    </FileUploader>
  </a-modal>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import FileUploader from '../file-uploader/uploader.vue'

export default defineComponent({
  name: 'SelectFileModal',
  components: { FileUploader, UploadOutlined },
  emits: ['uploadComplete'],

  setup(props, { emit, expose }) {
    const visible = ref(false)
    const confirmLoading = ref(false)

    const fileUrls = ref([])

    const okButtonProps = computed(() => {
      return {
        disabled: !fileUrls.value.length
      }
    })

    const showModal = () => {
      visible.value = true
    }

    expose({ showModal })

    const handleOk = () => {
      confirmLoading.value = true

      try {
        if (fileUrls.value.length) {
          setTimeout(() => {
            visible.value = false
            confirmLoading.value = false
          }, 100)
          emit('uploadComplete', fileUrls.value)
        } else {
          confirmLoading.value = false
          message.error('请上传文件')
        }
      } catch (e) {
        console.error(e)
        confirmLoading.value = false
      }
    }

    const handleCancel = () => {
      visible.value = false
    }

    const onFileUploaded = async files => {
      console.log('files', files)
      fileUrls.value = files.reduce((urls, file) => {
        if (file && file.url) {
          urls.push(file.url)
        }
        return urls
      }, [])
    }

    return {
      visible,
      okButtonProps,
      confirmLoading,

      handleOk,
      handleCancel,
      onFileUploaded,
      showModal
    }
  }
})
</script>
