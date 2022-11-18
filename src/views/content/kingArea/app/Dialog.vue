<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="600px" @closed="close">
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
import { uploadFile } from '@/api/content/article'
import { validateWeight } from '@/utils/validate'
import Kingkong from '@/api/home-config/KingKong'
export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      /** 提交表单 */
      formConfig: {
        type: 'submit',
        inline: false,
        labelWidth: '120px',
        size: 'medium'
      },
      formObj: {
        // 金刚区名称
        name: '',
        // 金刚区图片
        image: '',
        // 跳转协议
        jsonContext: '',
        // 权重
        weight: ''
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
          formTip: ['建议尺寸76*76px; 支持png、jpg、gif'],
          rules: [
            {
              required: true,
              message: '请上传金刚区图片',
              trigger: ['blur', 'change']
            }
          ],
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
    show() {
      this.dialogVisible = true
    },

    close() {
      this.formObj = {
        name: '',
        image: '',
        jsonContext: '',
        weight: ''
      }
      this.$refs.formRef.resetFileds()
      this.dialogVisible = false
    },

    add() {
      this.dialogTitle = '新增金刚区'
      this.show()
    },

    edit(data) {
      this.dialogTitle = '编辑金刚区'
      const { name, image, jsonContext, weight, id } = data
      this.formObj = { name, image, jsonContext, weight, id }
      this.show()
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
        this.$emit('Refresh')
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
      uploadFile(formData, 'demand').then(res => {
        this.$refs.formRef.updateFileds(prop, res.data)
      })
    }
  }
}
</script>

<style>
</style>
