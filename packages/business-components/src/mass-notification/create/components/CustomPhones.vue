<template>
  <div class="mt5" style="width: 300px">
    <a-form-item-rest>
      <a-radio-group :value="type" :options="phoneTypeOptions" @change="onTypeChange" />
    </a-form-item-rest>
    <template v-if="type === 'input'">
      <a-textarea
        class="mt5"
        :value="value.join('\n')"
        :autoSize="{ minRows: 1, maxRows: 6 }"
        @blur="onFieldBlur"
        @change="onPhoneChange"
      />
      <div class="tips">
        <span>提示:</span>
        <span>1.输入多个手机号时，请以回车换行。</span>
        <span>2.单次指定的手机号不得大于1000个。</span>
      </div>
    </template>
    <template v-else-if="type === 'import'">
      <a-button type="link mt5" @click="onDownload">下载导入模板</a-button>
      <a-upload
        class="mt5"
        v-model:file-list="fileList"
        :accept="accepts.join(',')"
        :beforeUpload="onBeforeUpload"
        @remove="onRemoveFile"
      >
        <a-button type="primary"> 选择文件 </a-button>
      </a-upload>
      <div class="import-result mt10">
        <a-table v-if="tableData.length > 0" :columns="columns" :data-source="tableData" :pagination="false" sticky />
        <div v-else-if="importError" style="color: red">导入手机号失败</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Form, message } from 'ant-design-vue'
import XLSX from 'xlsx'
import { phoneNumberReg } from '@business/common/src/mass-notification/constant/regExp'
import { downloadFile } from '@/utils/index'
const { onFieldBlur, onFieldChange, clearValidate } = Form.useInjectFormItemContext()
const props = defineProps({
  type: {
    type: String,
    default: 'input'
  },
  value: {
    type: Array,
    default() {
      return []
    }
  }
})

const emit = defineEmits(['update:type', 'update:value'])

const phoneTypeOptions = [
  { label: '输入手机号', value: 'input' },
  { label: '导入手机号', value: 'import' }
]

// 指定手机号类型变更
const onTypeChange = e => {
  emit('update:type', e.target.value)
  emit('update:value', [])
  clearValidate()
}

// 输入手机号值变更
const onPhoneChange = e => {
  emit('update:value', e.target.value.split('\n'))
  onFieldChange(e)
}

const onDownload = () =>
  downloadFile({
    url: 'https://ysh-cdn.kaidicloud.com/ysh-prod/excel_template/导入手机号.xlsx',
    title: '导入手机号.xlsx'
  })

const accepts = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']

const fileList = ref([])

const columns = [{ title: '手机号', dataIndex: 'phone', align: 'center' }]
const tableData = computed(() => props.value.map(v => ({ phone: v })))
const importError = ref(false)

const onBeforeUpload = async file => {
  if (!accepts.includes(file.type)) {
    fileList.value = []
    message.warning('请上传xls、xlsx格式的表格')
  } else {
    fileList.value = [file]
    await readExcel(file)
  }
}

const onRemoveFile = () => {
  fileList.value = []
  importError.value = false
  emit('update:value', [])
}

const readExcel = file => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = e => {
      try {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const [sheetName] = workbook.SheetNames
        let phones = XLSX.utils
          .sheet_to_json(workbook.Sheets[sheetName])
          .map(v => v['手机号'])
          .filter(v => v && +v && phoneNumberReg.test(v))
        phones = [...new Set(phones)]
        importError.value = !phones.length
        emit('update:value', phones)
        resolve()
      } catch (error) {
        reject(error)
      }
    }
    fileReader.readAsBinaryString(file)
  })
}
</script>

<style lang="scss" scoped>
.tips {
  display: flex;
  flex-direction: column;
  color: #7f7f7f;
  line-height: 22px;
}

.import-result {
  max-height: 300px;
  overflow: auto;
}
</style>
