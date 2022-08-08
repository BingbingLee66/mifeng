<template>
  <el-dialog
    :visible="visible"
    title="添加/编辑招商办"
    width="50%"
    @close="close"
  >
    <el-form
      ref="form"
      :model="formObj"
      :rules="rules"
      label-position="left"
      label-width="150px"
    >
      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="招商办名称：" prop="name">
            <el-input v-model.trim="formObj.name" max-length="100" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="招商办LOGO：" prop="systemLogo">
            <el-upload
              class="systemLogo_uploader"
              action="/"
              :show-file-list="false"
              :before-upload="beforeSystemLogoUpload"
              :http-request="uploadSystemLogo"
            >
              <img
                v-if="formObj.systemLogo"
                :src="formObj.systemLogo"
                class="system_logo"
                alt=""
              >
              <i v-else class="el-icon-plus systemLogo_uploader_icon" />
            </el-upload>
            <p style="margin: 0; padding: 0">
              建议尺寸:88*88px; 格式:png/jpeg/jpg
            </p>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="联系人姓名：" prop="president">
            <el-input
              v-model.trim="formObj.president"
              max-length="20"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="联系人手机号" prop="phone">
            <el-input
              v-model="formObj.phone"
              minlength="1"
              placeholder="手机号码即商会后台登录账号"
              :readonly="isEdit"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="地区" prop="area">
            <el-cascader
              v-model="formObj.area"
              clearable
              separator="-"
              :options="areaOptions"
              :props="{ expandTrigger: 'hover', value: 'code', label: 'name'}"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="办公地址" prop="address">
            <el-input
              v-model.trim="formObj.address"
              max-length="200"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="推荐人">
            <el-input v-model.trim="formObj.referrer" max-length="20" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formObj.password"
              type="password"
              minlength="1"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="!isEdit">
        <el-col :offset="2" :span="20">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="formObj.confirmPassword"
              type="password"
              minlength="1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-col :offset="6" :span="8">
          <el-button v-dbClick type="primary" @click="save">保存</el-button>
          <el-button @click.native="close">取消</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import { getDetail, save, upload } from '@/api/chamber/manager'

export default {
  name: 'FormDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    areaOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formObj: {
        name: '',
        president: '',
        address: '',
        phone: '',
        referrer: '',
        password: '',
        confirmPassword: '',
        systemLogo: '',
        area: []
      },
    }
  },
  computed: {
    isEdit() {
      return !!this.id
    },
    rules() {
      return {
        name: [
          { required: true, message: '招商办名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '招商办名称1-50个字', trigger: 'change' }
        ],
        systemLogo: [{ required: true, message: '请上传商/协会logo', trigger: 'change' }],
        president: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }],
        phone: [
          { required: true, message: '联系人手机号不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
                return callback(new Error('号码格式不正确'))
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        area: [{
          required: true, message: '地区不能为空', trigger: 'change',
          validator: (rule, value, callback) => {
            if (!value[0]) return callback(new Error(rule.message))
            callback()
          }
        }],
        address: [{ required: true, message: '办公地址不能为空', trigger: 'change' }],
        password: [
          { required: !this.isEdit, message: '账号密码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\w*$/.test(value)) return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
              callback() // 必须加上这个，不然一直塞在验证状态
            },
            trigger: 'change'
          }
        ],
        confirmPassword: [
          { required: !this.isEdit, message: '确认密码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\w*$/.test(value)) return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
              if (value !== this.formObj.password) return callback(new Error('两次输入密码不一致!'))
              callback() // 必须加上这个，不然一直塞在验证状态
            },
            trigger: 'blur'
          }
        ],
      }
    }
  },
  watch: {
    visible(n) {
      if (!n || !this.isEdit) return

      // TODO 获取详情逻辑
      // getDetail({ id: this.id }).then(response => {
      //   const { dtl = {}} = response.data
      //   this.formObj = {
      //     ...dtl,
      //     password: '',
      //     area: [dtl.provinceCode, dtl.cityCode]
      //   }
      // })
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        // TODO 保存逻辑待完善
        // const { area: [province, city], ...formObj } = this.formObj
        // save({ ...formObj, province, city }).then(response => {
        //   if (response.state === 1) {
        //     this.$message({
        //       message: '操作成功',
        //       type: 'success'
        //     })
        //     this.fetchData()
        //     this.editorVisible = false
        //   } else {
        //     this.$message({
        //       message: response.msg,
        //       type: 'success'
        //     })
        //   }
        // })
      })
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
        this.formObj.systemLogo = response.data.filePath
      })
    },

    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.systemLogo_uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.systemLogo_uploader_icon {
  font-size: 28px;
  color: #8c939d;
  width: 88px;
  height: 88px;
  line-height: 88px;
  border-radius: 50%;
  text-align: center;
}

.avatar {
  width: 180px;
  height: 100px;
  display: block;
}

.system_logo {
  width: 88px;
  height: 88px;
  display: block;
  object-fit: cover;
  border-radius: 50%;
}
</style>
