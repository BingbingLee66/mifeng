<!-- 修改权重弹窗 -->
<template>
  <el-dialog title="展示权重" :visible.sync="visible" width="40%">
    <main v-loading="loading">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入" />
          <p class="font-small">权重值范围为0-999</p>
          <p class="font-small">权重值为0时，商会不在小程序端显示</p>
          <p class="font-small">权重值越大的商会，在小程序那边的显示会越靠前</p>
          <div class="mg-t">权重值越大的商会，在小程序社会组织名录列表会越靠前</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <el-button type="primary" @click="updateSort('sortForm')">提交</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </main>
  </el-dialog>
</template>
<script>
import { checkNumber } from '@/utils/utils'
import { updateOrganizationsSort } from '@/api/chamber/directoryOrganizations'
export default {
  name: 'Weight',
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        weight: 0,
        id: '',
      },
      rules: {
        weight: [
          { required: true, message: '权重不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.form.weight = data.level
      this.form.id = data.id
    },
    updateSort() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.loading) return
          this.loading = true
          updateOrganizationsSort(this.form).then(response => {
            const { state } = response
            if (state === 1) {
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
  }
}
</script>
<style lang="scss" scoped>
.font-small {
  margin: 0px;
  line-height: 20px;
  font-size: 12px;
  color: #646464;

  &:first-of-type {
    margin-top: 10px;
  }
}

.mg-t {
  margin-top: 0px;
}

.text-center {
  text-align: center;
}
</style>
