<template>
  <el-dialog v-loading="loading" title="认领入驻" :visible.sync="visible" width="55%" close="close">
    <main v-loading="loading">
      <el-form ref="form" :model="form" label-width="150px" :rules="rules">
        <el-form-item label="社会组织名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入社会组织名称" />
        </el-form-item>
        <el-form-item label="社会组织logo" prop="systemLogo">
          <el-upload
            class="systemLogo_uploader"
            action="/"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="uploadSystemLogo"
          >
            <img
              v-if="form.systemLogo"
              :src="form.systemLogo"
              class="system_logo"
            >
            <i v-else class="el-icon-plus systemLogo_uploader_icon" />
          </el-upload>
          <p style="margin: 0; padding: 0">
            建议尺寸:88*88px; 格式:png/jpeg/jpg
          </p>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="president">
          <el-input v-model="form.president" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="地区" prop="city">
          <el-cascader
            v-model="form.city"
            clearable
            separator="-"
            :options="areaOptions"
            :props="{ expandTrigger: 'hover', value: 'code', label: 'name'}"
          />
        </el-form-item>
        <el-form-item label="办公地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入办公地址" />
        </el-form-item>
        <el-form-item label="社会团体法人登记证" prop="license">
          <el-upload
            class="avatar-uploader"
            action="/"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="uploadLicense"
          >
            <img
              v-if="form.license"
              :src="form.license"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="入驻来源：" prop="settledSource">
          <el-select v-model="form.settledSource" placeholder="请选择数据来源" filterable>
            <el-option label="APP名录" :value="5" />
            <el-option label="小程序名录" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="推荐人" prop="referrer">
          <el-input v-model="form.referrer" placeholder="请输入推荐人" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            minlength="1"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            minlength="1"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="footer">
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </main>
  </el-dialog>
</template>
<script>
import { claimOrganization, OrganizationDetail } from '@/api/chamber/directoryOrganizations'
import { phoneValidator, passwordValidator } from '@/utils/utils'
import { getAreaTree } from '@/api/area'
import { upload } from '@/api/chamber/manager'
export default {
  data() {
    return {
      visible: false,
      loading: false,
      areaOptions: [],
      imgType: '',
      form: {
        name: '',
        systemLogo: '',
        president: '',
        phone: '',
        address: '',
        settledSource: '',
        city: '',
        province: '',
        license: '',
        referrer: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        name: [
          { required: true, message: '社会组织名称不能为空', trigger: 'blur' }
        ],
        president: [
          { required: true, message: '联系人姓名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系人电话不能为空', trigger: 'blur' },
          {
            validator: phoneValidator,
            trigger: 'change'
          }
        ],
        systemLogo: [{ required: true, message: '社会组织logo必须上传', trigger: 'change' }],
        address: [
          { required: true, message: '办公地址不能为空', trigger: 'blur' }
        ],
        city: [{
          required: true, message: '地区不能为空', trigger: 'change',
          validator: (rule, value, callback) => {
            if (!value[0]) return callback(new Error(rule.message))
            callback()
          }
        }],
        license: [{ required: true, message: '社会团体法人登记证必须上传', trigger: 'change' }],
        settledSource: [
          { required: true, message: '入驻来源不能为空', trigger: 'change' }
        ],
        referrer: [
          { required: true, message: '推荐人不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            validator: passwordValidator,
            trigger: 'change'
          }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\w*$/.test(value)) return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
              if (value !== this.form.password) return callback(new Error('两次输入密码不一致!'))
              callback()
            },
            trigger: 'blur'
          }
        ],
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.form.id = data.id
      this.getInfo()
      if (!this.areaOptions.length) {
        this.getAreaList()
      }
    },
    // 获取地区信息
    async getAreaList() {
      const { data } = await getAreaTree({ level: 2 })
      if (data) {
        data.forEach(p => {
          p.children.forEach(c => (c.children = undefined))
        })
        this.areaOptions = data
      }
    },
    getInfo() {
      this.loading = true
      OrganizationDetail(this.form.id).then((res) => {
        const { state, data, msg } = res
        if (state === 1) {
          this.form = data
          this.form.settledSource = ''
          this.close()
        } else {
          this.$message.error(msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    beforeUpload(file) {
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
    uploadSystemLogo(data) {
      this.uploadFile(data, 'systemLogo')
    },
    uploadLicense(data) {
      this.uploadFile(data, 'license')
    },
    uploadFile(data, type) {
      const formData = new FormData()
      formData.append('file', data.file)
      upload(formData).then(response => {
        this.$set(this.form, type, response.data.filePath)
        this.$refs.form.validateField(type)
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.loading) return
          this.loading = true
          const { city } = this.form
          const data = { ...this.form }
          if (Array.isArray(city)) {
            data.city = city[1]
            data.province = city[0]
          }
          claimOrganization(data).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$emit('refresh')
              this.visible = false
            } else {
              this.$message.error(response.msg)
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    close() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style lang="scss" scoped>
.avatar-uploader, .systemLogo_uploader{
  cursor: pointer;
  position: relative;
  overflow: hidden;
  ::v-deep .el-upload {
    &:hover{
      border-color: #409eff;
    }
  }
  .avatar-uploader-icon,  .systemLogo_uploader_icon{
    font-size: 28px;
    color: #8c939d;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar-uploader-icon{
    width: 180px;
    height: 100px;
    line-height: 100px;
    border-radius: 6px;
  }
  .systemLogo_uploader_icon {
    width: 88px;
    height: 88px;
    line-height: 88px;
    border-radius: 50%;
  }
  .avatar {
    width: 180px;
    height: 100px;
    display: block;
    border-radius: 6px;
  }

  .system_logo {
    width: 88px;
    height: 88px;
    display: block;
    object-fit: cover;
    border-radius: 50%;
  }
}
.footer{
  text-align: center;
}
</style>
