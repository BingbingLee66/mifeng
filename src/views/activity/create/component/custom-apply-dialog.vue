<template>
  <div>
    <el-dialog
      :title="(editCol ? '编辑' : '新增') + '自定义信息'"
      :visible.sync="dialogFormVisible"
      width="500px"
      :close-on-click-modal="false"
      @close="onClose"
    >
      <el-form ref="f2" :model="colData" label-width="120px">
        <el-form-item label="信息类型:" :rules="[{ required: true }]">
          <el-select v-model="infoDate.info" disabled placeholder="请选择">
            <el-option label="输入框" value="0" />
            <el-option label="下拉框" value="1" />
            <el-option label="文件上传" value="2" />
          </el-select>
        </el-form-item>
        <!-- 输入框 -->
        <div v-if="+infoDate.info === 0">
          <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '不能为空' }]">
            <el-input v-model="colData.title" autocomplete="off" placeholder="标题，50字内" :maxlength="50" />
          </el-form-item>
          <el-form-item label="输入框提示" prop="msgAlert" :rules="[{ required: true, message: '不能为空' }]">
            <el-input
              v-model="colData.msgAlert"
              autocomplete="off"
              placeholder="输入框提示文字，50字内"
              :maxlength="50"
            />
          </el-form-item>
          <el-form-item label="输入字数限制" prop="lengthLimit">
            <el-input v-model="colData.lengthLimit" autocomplete="off" placeholder="不限制" type="number" />
            <br>不填写，则默认不限制
          </el-form-item>
        </div>
        <!-- 文件上传 -->
        <div v-else-if="+infoDate.info === 2">
          <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '不能为空' }]">
            <el-input v-model="colData.title" autocomplete="off" placeholder="标题，50字内" :maxlength="50" />
          </el-form-item>
          <div style="margin-left: 116px">
            (支持文件类型：PDF、Word、Excel、PPT )大小限制30M

            <el-upload class="avatar-uploader" action="/" :show-file-list="false" disabled>
              <i class="el-icon-plus uploader-pic-icon" style="color: #d9d9d9" />
            </el-upload>
          </div>
        </div>
        <!-- 下拉框 -->
        <div v-else>
          <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '不能为空' }]">
            <el-input v-model="colData.title" autocomplete="off" placeholder="标题，50字内" :maxlength="50" />
          </el-form-item>
          <el-form-item
            v-for="(item, index) in colData.selects"
            :key="index"
            :label="`选项${index + 1}`"
            :rules="[{ required: true }]"
          >
            <el-input v-model="item.value" autocomplete="off" placeholder="选项，50字内" :maxlength="50" />
          </el-form-item>
          <div class="add-option" @click="onOptions">+添加选项</div>
        </div>

        <el-form-item label="是否必填" prop="check">
          <el-radio-group v-model="colData.check">
            <el-radio :label="1">必填</el-radio>
            <el-radio :label="0">选填</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onAdd">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="新增自定义信息"
      :visible.sync="iscustom"
      width="25%"
      center
      :close-on-click-modal="false"
      :before-close="onCancelDate"
    >
      <el-form :model="infoDate" label-width="100px">
        <el-form-item label="信息类型:" :rules="[{ required: true }]">
          <el-select v-model="infoDate.info" placeholder="请选择">
            <el-option label="输入框" value="0" />
            <el-option label="下拉框" value="1" />
            <el-option label="文件上传" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelDate">取 消</el-button>
        <el-button type="primary" @click="onInfoDate">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CustomApplyDialog',
  props: {
    editCol: {
      type: Boolean,
      default: false
    },
    iscustom: {
      type: Boolean,
      default: false
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 信息类型
      infoDate: {
        info: ''
      },
      colData: {
        title: '', // 标题
        msgAlert: '', // 输入框提示
        lengthLimit: '', // 输入字数限制
        check: 1, // 是否 必填 选填
        // 下拉框
        selects: [
          {
            value: '' // 选项1
          },
          {
            value: '' // 选项2
          }
        ],
        key: '', // 参数名称，下拉框情况下多个参数请;拼接
        type: '' // 0: 输入框  1：下拉框
      }
    }
  },

  methods: {
    onClose() {
      this.$emit('update:dialogFormVisible', false)
      this.colData = {
        title: '',
        msgAlert: '',
        lengthLimit: '',
        check: 1,
        selects: [{ value: '' }, { value: '' }]
      }
      this.$emit('update:editCol', false)
      this.infoDate.info = ''
      this.$refs['f2'].resetFields()
    },

    // 下拉框添加选项
    onOptions() {
      const obj = {
        value: ''
      }
      if (this.colData.selects.length >= 100) return this.$message.error('最多只能添加100个')
      this.colData.selects.push(obj)
    },

    onCancelDate() {
      this.infoDate.info = ''
      this.$emit('update:iscustom', false)
    },

    onAdd() {
      let completely = false
      if (+this.infoDate.info === 1) {
        this.colData.selects.forEach(v => {
          if (v.value === '') completely = true
        })
      }
      if (completely) return this.$message.error('请填写选项标题')

      if (this.colData.lengthLimit !== '' && +this.infoDate.info === 0) {
        if (this.colData.lengthLimit < 0) {
          this.$message({
            message: '字数限制必须大于0',
            type: 'warning'
          })
          return
        } else if (this.colData.lengthLimit > 200 && +this.infoDate.info === 0) {
          this.$message({
            message: '字数限制必须小于200',
            type: 'warning'
          })
          return
        }
      }
      const key = []
      if (this.colData.selects) {
        this.colData.selects.forEach(v => {
          key.push(v.value)
        })
      }

      this.colData.key = key.join(';')

      this.$refs['f2'].validate(valid => {
        if (valid) {
          this.colData.type = this.infoDate.info

          if (this.editCol) {
            // 编辑
            this.$emit('edit', { ...this.colData })
          } else {
            // 新增
            this.$emit('add', { ...this.colData })
          }
          this.onClose()
        } else {
          console.log('error submit!!')
        }
      })
    },

    onInfoDate() {
      if (this.infoDate.info === '') return this.$message.error('请选择类型')
      if (+this.infoDate.info === 0 || +this.infoDate.info === 1 || +this.infoDate.info === 2) {
        this.$emit('update:dialogFormVisible', true)
      }

      this.$emit('update:iscustom', false)
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-uploader {
  width: 100px;
  height: 100px;
  display: block;
  border: 1px solid #ededed;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
