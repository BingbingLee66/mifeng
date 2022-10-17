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
          <el-form-item label="所在公司/组织：" prop="unit">
            <el-input v-model.trim="formState.unit" placeholder="限40字内" max-length="40" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="嘉宾头像：" prop="portrait">
            <el-upload
              class="avator-uploader"
              action="/"
              :show-file-list="false"
              :before-upload="beforeSystemLogoUpload"
              :http-request="uploadSystemLogo"
            >
              <img v-if="formState.portrait" :src="formState.portrait" class="avator" alt="">
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
          <el-form-item label="嘉宾介绍：" prop="introduction">
            <el-input
              v-model.trim="formState.introduction"
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
          <el-form-item label="保存至嘉宾库" prop="isChamber">
            <el-checkbox v-model="formState.isChamber" :disabled="disabledChamber">同时添加至嘉宾库中，方便下次直接从嘉宾库选择，无需再次创建</el-checkbox>
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

<script>
import { upload } from '@/api/chamber/manager'
import { updateChamberGuest } from '@/api/activity/activity-guest'
import { cloneDeep } from 'lodash'

export default {
  name: 'GuestFormDialog',
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    showBank: {
      type: Boolean,
      default: false
    },
    staticData: {
      type: Object,
      default: () => {}
    },
    endTime: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      formState: {
        name: '',
        post: '',
        unit: '',
        portrait: '',
        introduction: '',
        isChamber: false
      },
      rules: {
        name: [{ required: true, message: '请输入嘉宾姓名', trigger: 'blur' }],
        post: [{ required: true, message: '请输入职位/头衔', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入所在公司/组织', trigger: 'blur' }],
        portrait: [{ required: true, message: '请上传嘉宾头像', trigger: 'change' }],
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.id
    },
    activityId() {
      return this.$route.query.activityId || ''
    },
    userId() {
      return this.$store.getters.profile?.id || ''
    },
    disabledChamber() {
      return this.isEdit && this.formState.isChamber
    }
  },
  watch: {
    visible(val) {
      if (!val) return

      const { chamberGuestsId } = this.staticData

      this.formState = {
        ...cloneDeep(this.staticData),
        isChamber: chamberGuestsId ? chamberGuestsId !== '0' : !this.staticData.isChamber
      }
    }
  },
  methods: {
    onSave() {
      this.$refs['form'].validate(valid => {
        if (!valid) return

        this.isEdit ? this.editGuest() : this.createGuest()
      })
    },

    createGuest() {
      this.$emit('add', {
        id: Date.now(),
        ...this.formState,
        userId: this.userId,
        isChamber: this.formState.isChamber ? 0 : 1,
        isStatic: true
      })
      this.$message.success('操作成功')
      this.onClose()
    },

    editGuest() {
      if (this.formState.isStatic || this.showBank) {
        this.$emit('edit', { ...this.formState, isChamber: this.formState.isChamber ? 0 : 1 })
        this.$message.success('操作成功')
        this.onClose()
      }

      if (!this.formState.isStatic && !this.showBank) {
        this.editChamberGuestPromise()
      }
    },

    async editChamberGuestPromise() {
      const params = {
        id: this.id,
        ...this.formState,
        ckey: this.$store.getters.ckey || 'ysh',
        activityEndTime: this.endTime
      }

      delete params.isChamber

      const { state, msg } = await updateChamberGuest(params)

      if (!state) return this.$message.error(msg)
      this.$message.success('操作成功')
      this.$emit('editChamber', { ...this.formState, isChamber: this.formState.isChamber ? 0 : 1 })
      this.onClose()
    },

    onClose() {
      this.$emit('update:visible', false)
      this.$refs['form'].resetFields()
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
        this.formState.portrait = response.data.filePath
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
