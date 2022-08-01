<template>
  <el-dialog title="添加社会组织" :visible.sync="visible" width="55%" center @close="close">
    <el-form ref="form" :model="form" label-width="150px" :rules="rules">
      <el-form-item label="社会组织名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入社会组织名称" />
      </el-form-item>
      <el-form-item label="会长姓名" prop="president">
        <el-input v-model="form.president" placeholder="请输入会长姓名" />
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="socialCode">
        <el-input v-model.trim="form.socialCode" placeholder="请输入统一社会信用代码" />
      </el-form-item>
      <el-form-item label="地区" prop="city">
        <el-cascader
          v-model="form.city"
          clearable
          separator="-"
          :options="areaOptions"
          :props="{ expandTrigger: 'hover', value: 'code', label: 'name' }"
        />
      </el-form-item>
      <el-form-item label="办公地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入办公地址" />
      </el-form-item>
      <el-form-item label="成立时间" prop="establishTime">
        <el-date-picker
          v-model="form.establishTime"
          type="date"
          value-format="timestamp"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { setOrganization } from '@/api/chamber/directoryOrganizations'
import { getAreaTree } from '@/api/area'
export default {
  data() {
    return {
      visible: false,
      form: {
        name: '',
        president: '',
        socialCode: '',
        city: '',
        province: '',
        address: '',
        establishTime: ''
      },
      rules: {
        name: [
          { required: true, message: '社会组织名称不能为空', trigger: 'blur' },
        ],
        president: [
          { required: true, message: '会长名称不能为空', trigger: 'blur' },
        ],
        socialCode: [
          { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
        ],
        city: [
          { required: true, message: '请选择地区', trigger: 'change' },
        ],
        address: [
          { required: true, message: '办公地址不能为空', trigger: 'blur' }
        ],
        establishTime: [
          { required: true, message: '成立时间不能为空', trigger: 'blur' }
        ],
      },
      areaOptions: []
    }
  },
  methods: {
    init() {
      this.visible = true
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
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.loading) return
          const { city } = this.form
          const data = {
            ...this.form,
            city: city[1],
            province: city[0]
          }
          this.loading = true
          setOrganization(data).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$emit('refresh')
              this.visible = false
              this.close()
            } else {
              this.$message.error(response.msg)
            }
          }).finally(res => {
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
