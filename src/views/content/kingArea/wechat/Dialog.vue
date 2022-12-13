<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
      width="600px"
      @closed="close"
    >
      <ysh-form
        ref="formRef"
        :form-config="formConfig"
        :form-item="formItem"
        :form-obj="formObj"
        @submit="submit"
      >
        <template v-slot:customConetent>
          <div class="text-center mt-40">
            <el-button class="mr-20" @click="close">取消</el-button>
            <el-button class="mr-20" @click="handleSubmit(2)">保存</el-button>
            <el-button type="primary" @click="handleSubmit(1)">发布</el-button>
          </div>
        </template>
      </ysh-form>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFileRandomName } from '@/api/content/article'
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
        title: '', // 入口名称
        icon: '', // 上传图片
        content: '' // 关联内容
      },
      formItem: [
        {
          label: '入口名称：',
          prop: 'title',
          type: 'input',
          width: '90%',
          showWordLimit: true,
          maxlength: 6,
          placeholder: '请输入入口名称，不超过6个字符',
          clearable: true,
          value: '',
          rules: [
            { min: 1, max: 6, message: '只限6个字以内哦', trigger: 'blur' },
            { required: true, message: '请输入入口名称', trigger: 'blur' }
          ]
        },
        {
          label: '关联内容：',
          prop: 'content',
          type: 'textarea',
          width: '90%',
          rows: 5,
          placeholder: '请输入banner跳转链接或路径',
          clearable: true,
          value: '',
          rules: [{ required: true, message: '请输入关联内容', trigger: 'blur' }]
        },
        {
          label: '上传图片：',
          prop: 'icon',
          type: 'upload',
          value: '',
          formTip: ['建议尺寸100*100px; 支持jpg、png'],
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
            this.uploadKingkongImage(content, 'icon')
          }
        }
      ],
      submitStatus: 1, // 1-发布 2-保存
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
      this.dialogTitle = '新增功能入口'
      this.dialogVisible = true
    },

    edit(data) {
      this.dialogTitle = '编辑功能入口'
      const { title, icon, content, kingKongId } = data
      this.formObj = { title, icon, content, kingKongId }
      this.dialogVisible = true
    },

    close() {
      this.formObj = { title: '', icon: '', content: '' }
      this.$refs.formRef.resetFileds()
      this.dialogVisible = false
    },

    handleSubmit(status) {
      this.submitStatus = status
      this.$refs.formRef.submit()
    },

    async submit(data) {
      const res = await Kingkong.saveKingkongV1({
        ...data,
        clientType: 0,
        status: this.submitStatus,
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
        this.$message.error('图片大小不能超过 2MB!')
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
