<template>
  <div>
    <!-- 新增/编辑领导风采 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="600px" @closed="close">
      <ysh-form ref="formRef" :form-config="formConfig" :form-item="formItem" :form-obj="formObj" @submit="submit">
        <template v-slot:customConetent>
          <div class="text-center mt-40">
            <el-button class="mr-20" @click="close">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
          </div>
        </template>
      </ysh-form>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFile } from '@/api/content/article'
import Kingkong from '@/api/home-config/KingKong'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      formConfig: {
        type: 'custom',
        inline: false,
        labelWidth: '120px',
        size: 'medium'
      },
      formObj: {
        avatar: '', // 领导照片
        name: '', // 领导名字
        post: '', // 会内职务
        identity: '', // 其他身份
        intro: '', // 领导简介
        report: '' // 相关报道
      },
      formItem: [
        {
          label: '领导照片：',
          prop: 'avatar',
          type: 'upload',
          value: '',
          formTip: ['建议尺寸1234*1234px; 支持png、jpg'],
          rules: [
            {
              required: true,
              message: '请上传图片',
              trigger: ['blur', 'change']
            }
          ],
          beforeUpload: file => {
            this.beforeUpload(file)
          },
          upload: content => {
            this.uploadKingkongImage(content, 'avatar')
          }
        },
        {
          label: '领导名字：',
          prop: 'name',
          type: 'input',
          width: '90%',
          showWordLimit: true,
          maxlength: 50,
          placeholder: '请输入领导名字，不超过50个字符',
          clearable: true,
          value: '',
          rules: [
            { min: 1, max: 50, message: '只限50个字以内哦', trigger: 'blur' },
            { required: true, message: '请输入领导名字', trigger: 'blur' }
          ]
        },
        {
          label: '会内职务：',
          prop: 'post',
          type: 'input',
          width: '90%',
          showWordLimit: true,
          maxlength: 15,
          placeholder: '请输入会内职务，不超过15个字符',
          clearable: true,
          value: '',
          rules: [
            { min: 1, max: 15, message: '只限15个字以内哦', trigger: 'blur' },
            { required: true, message: '请输入会内职务', trigger: 'blur' }
          ]
        },
        {
          label: '其他身份：',
          prop: 'post',
          type: 'input',
          width: '90%',
          placeholder: '请输入，多个身份请用逗号隔开',
          clearable: true,
          value: '',
        },
        {
          label: '领导简介：',
          prop: 'url',
          type: 'textarea',
          width: '90%',
          rows: 6,
          maxlength: '2000',
          placeholder: '',
          value: ''
        },
        {
          label: '相关报道：',
          prop: 'report',
          type: 'select',
          width: '90%',
          placeholder: '',
          value: '',
          options: []
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
        url: ''
      }
      this.$refs.formRef.resetFileds()
      this.dialogVisible = false
    },

    add() {
      this.dialogTitle = '新增领导'
      this.show()
    },

    edit(data) {
      this.dialogTitle = '编辑领导'
      const { name, image, url, id } = data
      this.formObj = { name, avatar: image, url, id }
      this.show()
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
        this.$message.error('图片大小不能超过 2MB!')
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
    },

    handleSubmit() {
      this.$refs.formRef.submit()
    },

    async submit(data) {
      const res = await Kingkong.saveKingkong({
        ...data,
        clientType: 0,
        weight: 0
      })
      if (res.state !== 1) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.close()
        this.$emit('Refresh')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  margin-top: 10vh !important;
  min-height: 60vh !important;
}
</style>
