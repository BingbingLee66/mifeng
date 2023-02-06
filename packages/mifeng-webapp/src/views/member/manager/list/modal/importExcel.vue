<!-- ImportExcel -->
<template>
  <div>
    <a-modal v-model:visible="visible" title="数据导入" width="520px" @cancel="cancel" :afterClose="afterClose">
      <h3>导入说明</h3>
      <p>1、请勿增加、删除、修改表格中的字段</p>
      <p>2、其他字段多次导入数据会进行覆盖</p>
      <div class="mb10">
        <a-radio-group v-model:value="importType" name="radioGroup">
          <a-radio value="">个人/企业</a-radio>
          <a-radio value="1">社会组织</a-radio>
        </a-radio-group>
      </div>
      <a-upload
        v-model:file-list="fileList"
        name="file"
        :action="uploadParams.url"
        :headers="uploadParams.headers"
        :data="uploadParams.data"
        :showUploadList="false"
        @change="handleChange"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          导入文件
        </a-button>
        支持扩展名：xsl、xslx
      </a-upload>
      <div class="mt20" v-if="result.state === 1">
        <div>
          导入结果：导入成功
          <span style="color: red">{{ result.successCount }}</span>
          条记录,导入失败
          <span style="color: red">{{ result.failureCount }}</span>
          条记录
        </div>
        <div v-if="result.failureCount > 0">
          <div>导入失败详情：</div>
          <a-table :columns="columns" :data-source="result.failureReasonList"></a-table>
        </div>
      </div>
      <div class="mt20" v-if="result.state === 0">
        <div>{{ result.msg }}</div>
      </div>
      <template #footer>
        <a-button type="default" @click="cancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, inject, reactive, ref, toRefs, watch } from 'vue'
import { closeModal } from '@/hooks/useModal'
import { UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { getToken } from '@/utils/token'
export default defineComponent({
  components: { UploadOutlined },
  setup() {
    const { visible, cancel } = closeModal('ImportExcel')
    const ckey = inject('ckey')
    const importType = ref('')
    const uploadParams = {
      url: process.env.VUE_APP_BASE_API + '/ecservice/ec/member/import-excel',
      headers: {
        'access-token': getToken()
      },
      data() {
        return { ckey: ckey.value, type: importType.value }
      }
    }
    watch(
      () => visible.value,
      () => {
        if (visible.value) importType.value = ''
      }
    )
    const modalState = reactive({
      fileList: [],
      result: {
        state: null,
        msg: '',
        failureCount: 0,
        failureReasonList: [],
        successCount: 0,
        total: 0
      }
    })

    const columns = [
      { title: '行标(表头不算在内)', dataIndex: 'row' },
      { title: '失败原因', dataIndex: 'reason' }
    ]
    const handleChange = info => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        const { state, msg } = info.file.response
        modalState.result = { state, msg, ...info.file.response.data }
      } else if (info.file.status === 'error') {
        message.error('上传失败')
      }
    }
    const afterClose = () => {
      modalState.result.state = null
    }
    return {
      visible,
      cancel,
      uploadParams,
      columns,
      afterClose,
      handleChange,
      importType,
      ...toRefs(modalState)
    }
  }
})
</script>
