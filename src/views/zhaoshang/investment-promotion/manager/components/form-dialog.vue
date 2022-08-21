<template>
  <el-dialog
    ref="form"
    :visible="visible"
    title="添加/编辑招商办"
    width="50%"
    @close="close"
    :close-on-click-modal="false"
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
          <el-form-item label="账号名称：" prop="invesName">
            <el-input :disabled="editId!= ''"  v-model.trim="formObj.invesName" max-length="12" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="招商办名称：" prop="name">
            <el-input v-model.trim="formObj.name" max-length="100" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="招商办LOGO：" prop="logoUrl">
            <el-upload
              class="systemLogo_uploader"
              action="/"
              :show-file-list="false"
              :before-upload="beforeSystemLogoUpload"
              :http-request="uploadSystemLogo"
            >
              <img
                v-if="formObj.logoUrl"
                :src="formObj.logoUrl"
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
          <el-form-item label="联系人姓名：" prop="contactUser">
            <el-input
              v-model.trim="formObj.contactUser"
              max-length="20"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="联系人手机号" prop="contactPhone">
            <el-input
              v-model="formObj.contactPhone"
              minlength="1"
              placeholder=""
              :readonly="isEdit"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="2" :span="20">
          <el-form-item label="地区" prop="district">
            <el-cascader
              ref="cascader"
              v-model="formObj.district"
              clearable
              separator="-"
              :options="areaOptions"
              :props="{ expandTrigger: 'hover', value: 'name', label: 'name'}"
              @change="handleChange"
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
          <el-form-item label="密码" prop="password" v-if="!editId">
            <el-input
              v-model="formObj.password"
              type="password"
              minlength="1"
            />
          </el-form-item>
           <el-form-item label="密码"  v-else>
            <el-input
              v-model="formObj.password"
              type="password"
              minlength="1"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="!editId">
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

import {  upload } from '@/api/chamber/manager'
import { getInfoAdd,getInfoEdit,getInfoDetails } from '@/api/attract'
export default {
  name: 'FormDialog',
  props: {
    areaOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      editId:'', // 编辑获取id
      visible:false,
      formObj: {
        name: '', // 招商办名称
        contactUser: '', // 联系人姓名
        address: '',// 	办公地址
        contactPhone: '', // 联系人手机号
        referrer: '', // 推荐人
        password: '', // 密码
        confirmPassword: '',
        logoUrl: '', // 招商办logo图，oss存储
        area: '', // 选中地区字符串拼接在一起 
        district:[], // 地区选择
        areaCode:'' , // 选择地区最后一个城区code
        invesName:'', // 账号名称
      },
     
    }
  },
  computed: {
    isEdit() {
      return !!this.id
    },
    rules() {
      return {
      invesName: [
          { required: true, message: '账号名称不能为空', trigger: 'blur' },
            {
            validator: (rule, value, callback) => {
               if (!/(^[a-zA-Z]{1}[a-zA-Z0-9]{5,11}$)|(^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$)/.test(value)) {
                return callback(new Error('账号只能为字母和数字，且以字母开头，长度为6-12个字符！或为11位手机号码'))
              } else {
                callback() // 必须加上这个，不然一直塞在验证状态
              }
            },
            trigger: 'change'
          }
        ],
        name: [
          { required: true, message: '招商办名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '招商办名称1-50个字', trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: '请上传招商办logo', trigger: 'change' }],
        contactUser: [{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }],
        contactPhone: [
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
        district: [{
          required: true, message: '地区不能为空', trigger: 'change',
          validator: (rule, value, callback) => {
            if (!value[0]) return callback(new Error(rule.message))
            callback()
          }
        }],
        address: [{ required: true, message: '办公地址不能为空', trigger: 'change' }],
        password: [
          { required: true, message: '账号密码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!/^\w*$/.test(value)) return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
              callback() // 必须加上这个，不然一直塞在验证状态
            },
            trigger: 'change'
          }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
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

  methods: {
    // 显示
    show(id){
      this.visible = true
      if(id){
        this.editId = id
        this.ongetInfoDetails(id)
      }
    },
    // 保存
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        // TODO 保存逻辑待完善
        const { district,...formObj } = this.formObj
      
        let response
        if(this.editId){
          // 编辑 
          response = getInfoEdit({ ...formObj, id:this.editId })
        }else{
          // 新增
          response = getInfoAdd({ ...formObj })
        }
        response.then((res)=>{
          if (res.state === 1) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$emit('fetchData')
            this.close()
          } else {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          }
        })
      })
    },

    // 编辑获取页面详情
    ongetInfoDetails(id){
      getInfoDetails(id).then((res)=>{
        const  dtl = res.data
        this.formObj = {
          ...dtl,
          password:''
        }
        this.formObj.district = dtl.area.split("-")
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
    // 上传图片
    uploadSystemLogo(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      upload(formData).then(response => {
        this.formObj.logoUrl = response.data.filePath
      })
    },
    // 关闭
    close() {
      this.visible = false
      this.formObj = {
        name: '',
        contactUser: '',
        address: '',
        contactPhone: '',
        referrer: '',
        password: '',
        createdTs: '',
        logoUrl: '',
        area: '',
        district:[],
        areaCode:'',
        invesName:'',
      }
      this.editId = ""
      this.$refs['form'].resetFields();
    },
    // 选择地区回调
    handleChange(){
      let getCheckedNodes = this.$refs.cascader.getCheckedNodes()[0]
      this.formObj.area = getCheckedNodes.pathLabels.join('-')
      this.formObj.areaCode = getCheckedNodes.data.code
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
  border: 1px dashed #d9d9d9;
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
