<template>
  <el-dialog :title="isEdit ? '编辑嘉宾' : '添加嘉宾'" :visible="visible" width="800px" @close="onClose">
    <el-form
      ref="form"
      :model="formState"
      :rules="rules"
      label-position="left"
      label-width="150px"
    >
      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="嘉宾姓名：" prop="name">
            <el-input v-model.trim="formState.name" placeholder="限15字内" max-length="15" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="职位/头衔：" prop="post">
            <el-input v-model.trim="formState.post" placeholder="限20字内" max-length="20" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="所在公司/组织：" prop="company">
            <el-input v-model.trim="formState.company" placeholder="限40字内" max-length="40" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="嘉宾头像：" prop="avator">
            <el-upload
              class="avator-uploader"
              action="/"
              :show-file-list="false"
              :before-upload="beforeSystemLogoUpload"
              :http-request="uploadSystemLogo"
            >
              <img v-if="formState.avator" :src="formState.avator" class="avator" alt="">
              <i v-else class="el-icon-plus avator-uploader-icon" />
            </el-upload>
            <p style="margin: 0; padding: 0">
              建议上传尺寸600px*600px；小于300kb；.jpg,.gif,.png的图片
            </p>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="嘉宾介绍：" prop="president">
            <el-input
              v-model.trim="formState.introduce"
              type="textarea"
              :rows="6"
              placeholder="5000字内"
              max-length="5000"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="showBank">
        <el-col :offset="2" :span="20">
          <el-form-item label="保存至嘉宾库" prop="saveBank">
            <el-checkbox v-model="formState.saveBank">同时添加至嘉宾库中，方便下次直接从嘉宾库选择，无需再次创建</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-col :offset="6" :span="8">
          <el-button @click.native="onClose">取消</el-button>
          <el-button v-dbClick type="primary" @click="onSave">保存</el-button>
        </el-col>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script >
import { upload } from '@/api/chamber/manager'

export default {
  name: 'GuestFormDialog',
  props: {
    id: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    showBank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formState: {
        name: '',
        post: '',
        company: '',
        avator: '',
        introduce: '',
        saveBank: false
      },
      rules: {
        name: [{ required: true, message: '请输入嘉宾姓名', trigger: 'blur' }],
        post: [{ required: true, message: '请输入职位/头衔', trigger: 'blur' }],
        company: [{ required: true, message: '请输入所在公司/组织', trigger: 'blur' }],
        avator: [{ required: true, message: '请上传嘉宾头像', trigger: 'change' }],
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.id
    }
  },
  methods: {
    onSave() {
      this.$refs['form'].validate(valid => {
        if (!valid) return
        // TODO save
        console.log('pass')
      })
    },

    onClose() {
      this.$emit('update:visible', false)
    },

    beforeSystemLogoUpload(file) {
      if (file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png') {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
    },
    uploadSystemLogo(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      upload(formData).then(response => {
        this.formState.avator = response.data.filePath
      })
    },
  }
}
</script>

<style scoped lang="scss">
.avator-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avator-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 88px;
  height: 88px;
  line-height: 88px;
  border-radius: 50%;
  text-align: center;
}

.avator {
  width: 88px;
  height: 88px;
  display: block;
  object-fit: cover;
}
</style>
