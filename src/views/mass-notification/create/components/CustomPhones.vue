<template>
  <div>
    <el-form-item label="接收号码" required>
      <el-radio-group :value="type" @input="onTypeChange">
        <el-radio :value="type" label="input">输入手机号</el-radio>
        <el-radio label="import">导入手机号</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="type === 'input'">
      <el-input
        :value="value"
        type="textarea"
        placeholder="请输入手机号"
        :autosize="{ minRows: 1, maxRows: 6 }"
        style="width: 600px"
        @input="$emit('change',$event)"
      />
      <div class="tips">
        <span>提示:</span>
        <span>1.输入多个手机号时，请以回车换行。</span>
        <span>2.单次指定的手机号不得大于1000个。</span>
      </div>
    </template>
    <template v-else-if="type==='import'">
      <el-button type="text" @click="onDownload">下载导入模板</el-button>
      <input style="cursor:pointer" type="file" :accept="fileAccept.join(',')" :disabled="reading" @change="onFileChange">
      <div style="margin-left:90px;" class="tips">支持格式：xls、xlsx</div>
      <div v-loading="reading" class="table">
        <KdTable v-if="tableData.length > 0" :columns="columns" :rows="tableData" />
        <div v-else-if="importError" style="color:red;"> 导入手机号失败 </div>
      </div>
    </template>
  </div>
</template>

<script>
import { downloadFile } from '@/utils'
import XLSX from 'xlsx'
export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),

  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'input'
    }
  },
  data() {
    return {
      fileAccept: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
      reading: false,
      columns: [{ label: '手机号', prop: 'phone' }],
      importError: false
    }
  },
  computed: {
    tableData() {
      if (!this.value) return []
      return this.value.split('\n').map(v => ({ phone: v }))
    }
  },
  methods: {
    onTypeChange(e) {
      this.$emit('change', '')
      this.$emit('update:type', e)
    },
    async onFileChange(e) {
      const $input = e.target
      this.reading = true
      try {
        const file = $input.files[0]
        if (!this.fileAccept.includes(file.type)) {
          this.$message.warning('请上传xls、xlsx格式的表格')
          $input.value = null
          return
        }
        await this.readExcel(file)
      } catch {
        $input.value = null
      } finally {
        this.reading = false
      }
    },
    readExcel(file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = e => {
          try {
            const data = e.target.result
            const workbook = XLSX.read(data, { type: 'binary' })
            const [sheetName] = workbook.SheetNames
            const phoneReg = /^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/
            let phones = XLSX.utils
              .sheet_to_json(workbook.Sheets[sheetName])
              .map(v => v['手机号'])
              .filter(v => v && +v && phoneReg.test(v))
            phones = [...new Set(phones)]
            this.importError = !phones.length
            this.$emit('change', phones.join('\n'))
            resolve()
          } catch (error) {
            reject(error)
          }
        }
        fileReader.readAsBinaryString(file)
      })
    },
    onDownload() {
      downloadFile({ url: 'https://ysh-cdn.kaidicloud.com/ysh-prod/excel_template/导入手机号.xlsx', title: '导入手机号.xlsx' })
    }
  },
}
</script>

<style lang="scss" scoped>
.tips {
  display: flex;
  flex-direction: column;
  color: #7f7f7f;
  line-height: 22px;
}

.table {
  width: 200px;
  max-height: 300px;
  overflow: auto;
}
</style>
