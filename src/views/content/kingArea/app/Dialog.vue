<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @closed="close"
    >
      <ysh-form
        ref="formRef"
        :form-config="formConfig"
        :form-item="formItem"
        :form-obj="formObj"
        @cancel="close"
        @submit="submit"
      />
    </el-dialog>
  </div>
</template>

<script>
import { uploadFileRandomName } from '@/api/content/article'
import { validateWeight } from '@/utils/validate'
import Kingkong from '@/api/home-config/KingKong'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      formConfig: {
        type: 'submit',
        inline: false,
        labelWidth: '120px',
        size: 'medium'
      },
      formObj: {
        name: '', // 金刚区名称
        image: '', // 金刚区图片
        jsonContext: '', // 跳转协议
        weight: '' // 权重
      },
      formItem: [
        {
          label: '金刚区名称：',
          prop: 'name',
          type: 'input',
          width: '90%',
          showWordLimit: true,
          maxlength: 6,
          placeholder: '限6个字内',
          clearable: true,
          value: '',
          rules: [
            { min: 1, max: 6, message: '只限6个字以内哦', trigger: 'blur' },
            { required: true, message: '请输入金刚区名称', trigger: 'blur' }
          ]
        },
        {
          label: '金刚区图片：',
          prop: 'image',
          type: 'upload',
          value: '',
          rules: [{ required: true, message: '请上传金刚区图片', trigger: 'change' }],
          formTip: ['建议尺寸123*123px; 支持png、jpg、gif'],
          beforeUpload: file => {
            this.beforeUpload(file)
          },
          upload: content => {
            this.uploadKingkongImage(content, 'image')
          }
        },
        {
          label: '跳转协议：',
          prop: 'jsonContext',
          type: 'textarea',
          width: '90%',
          rows: 5,
          placeholder: '请输入内容',
          clearable: true,
          value: '',
          rules: [{ required: true, message: '请输入跳转协议', trigger: 'blur' }]
        },
        {
          label: '权重：',
          prop: 'weight',
          type: 'input',
          width: '90%',
          placeholder: '',
          clearable: true,
          value: '',
          rules: [
            { required: true, message: '请输入权重', trigger: 'blur' },
            { validator: validateWeight, trigger: 'blur' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('add', () => {
        this.add()
      })
      this.$on('edit', data => {
        this.edit(data)
      })
    })
  },
  methods: {
    add() {
      this.dialogTitle = '新增金刚区'
      this.dialogVisible = true
    },

    edit(data) {
      this.dialogTitle = '编辑金刚区'
      const { name, image, jsonContext, weight, id } = data
      this.formObj = { name, image, jsonContext, weight, id }
      this.dialogVisible = true
    },

    close() {
      this.formObj = { name: '', image: '', jsonContext: '', weight: '' }
      this.$refs.formRef.resetFileds()
      this.dialogVisible = false
    },

    async submit(data) {
      const res = await Kingkong.saveKingkong({
        ...data,
        clientType: 1
      })
      if (res.state !== 1) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.close()
        this.$emit('refresh')
      }
    },

    /** 上传金刚区图片校验 */
    beforeUpload(file) {
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/gif' &&
        file.type !== 'image/png'
      ) {
        this.$message.error('上传图片只能是 JPG 或 PNG 或 gif 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('金刚区图片大小不能超过 2MB!')
        return false
      }
    },

    /** 上传金刚区图片 */
    uploadKingkongImage(content, prop) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadFileRandomName(formData, 'demand').then(res => {
        this.$refs.formRef.updateFileds(prop, res.data)
      })
    }
  }
}
</script>
