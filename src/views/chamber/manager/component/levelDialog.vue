<template>
  <div>
    <el-dialog title="详情" :visible.sync="detailVisible" :width="width" @close="close">
      <div slot="title" class="header-title">
                    <span class="title-name">{{ title }} </span>
      </div>
      <el-form ref="formName" label-width="60px" :model="form" :rules="rules">
        <el-form-item label="权重" prop="level">
          <el-input v-model.number="form.level" maxlength="3" min="1" />
        </el-form-item>
        <div class="msg-view">
          <div>权重值的范围为0-999</div>
          <div>权重值为0时，商会不在小程序端显示</div>
          <div>权重值大的商会，在小程序那边的显示会靠前</div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="detailVisible = false">取消</el-button>
        <el-button type="primary" @click="updateChamberLevelFunc">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateChamberLevel } from '@/api/chamber/manager'
export default {
  props: ['title', 'width'],
  data() {
    const levelChack = (rule, value, callback) => {
      if (value < 0) {
        return callback(new Error('权重不能小于0'))
      } else {
        callback()
      }
    }
    return {
      // 状态
      reject: null,
      reslove: null,
      detailVisible: false,
      form: { level: null },
      chamberId: null,
      rules: {
        level: [
          { required: true, message: '权重不能为空', trigger: 'blur' },
          { type: 'number', message: '权重必须为数字值', trigger: 'blur' },
          { validator: levelChack, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 打开
    open(id, level) {
      return new Promise((reslove, reject) => {
        this.form.level = level || null
        this.reslove = reslove
        this.reject = reject
        this.chamberId = id
        this.show()
      })
    },
    // 展示
    show() {
      this.detailVisible = true
    },
    // 关闭
    close() {
      this.$refs.formName.clearValidate()
      this.detailVisible = false
      this.reject = null
      this.reslove = null
      this.form.level = null
    },
    // 修改权重
    updateChamberLevelFunc() {
      const self = this
      self.$refs['formName'].validate(valid => {
        if (valid) {
          const params = {
            chamberId: self.chamberId,
            level: self.form.level
          }
          updateChamberLevel(params).then(res => {
            if (res.state === 1) {
              self.$message({
                message: '修改成功',
                type: 'success'
              })

              self.reslove()
            }
            self.close()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.msg-view {
  margin-left: 58px;
}
.audit-result-view {
  margin-left: 50px;

  .linemargin {
    margin-bottom: 5px;
  }
}

.th_title {
  width: 100px;
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  margin: 0 30px;
  padding: 20px 0 !important;
}

.header-title {
  .title-name {
    color: #4d82f3;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
  }
}

.updateImg {
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
</style>
