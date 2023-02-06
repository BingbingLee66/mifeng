<template>
  <div class="content">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div class="box">
        <el-form ref="formName" label-position="right" label-width="110px" :model="formObj" :rules="rules">
          <el-form-item v-if="tabsIndex == 1 || tabsIndex == 2" label="使用场景：" prop="usageSceneId">
            <el-select v-model="formObj.usageSceneId">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="tabsIndex != 4" :label="tabsIndex == '1' ? '打招呼语言：' : tabsIndex == '2' ? '快捷回复语：' :'常用语：' " prop="content">
            <el-input v-model="formObj.content" clearable :autosize="{ minRows: 4, maxRows: 6}" maxlength="200" type="textarea" />
          </el-form-item>
          <el-form-item v-if="tabsIndex == 3" label="权重：" prop="level">
            <el-input v-model="formObj.level" oninput="if(value<=0)value=1" maxlength="3" type="number" />
          </el-form-item>
          <el-form-item v-if="tabsIndex == 4" label="场景名称：" prop="name">
            <el-input v-model.trim="formObj.name" clearable maxlength="6" />
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { sceneSaveOrUpdate, usageSceneList, configSaveOrUpdate, sceneGetDetailById, configGetDetailById } from '@/api/content/languageConfiguration'
export default {
  props: {
    tabsIndex: { // 1.打招呼  2.快捷回复 3.常用语  4.场景列表
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false, // 开启弹框
      options: [], // 使用场景下拉框
      formObj: {
        usageSceneId: null, // 使用场景ID
        content: '', // 内容
        level: '999', // 权重
        name: '', // 场景名称
      },
      id: '', // 编辑需要id
      rules: {
        usageSceneId: [{ required: true, message: '请选择场景', trigger: 'change' }],
        content: [{ required: true, message: '请填写内容', trigger: 'blur' }],
        level: [{ required: true, message: '请填写权重', trigger: 'blur' }],
        name: [{ required: true, message: '请填写场景名称', trigger: 'blur' }],
      }
    }
  },
  methods: {
    show(id) {
      // 获取 使用场景下拉框
      this.GetusageSceneList()
      if (id) {
        this.id = id || ''
        this.GetDetailById()
      }

      this.dialogVisible = true
    },
    // 使用场景下拉框
    async GetusageSceneList() {
      const res = await usageSceneList()
      if (res.state === 1) {
        this.options = res.data || []
      }
    },
    // 编辑获取详情信息
    async GetDetailById() {
      // tabsIndex  1.打招呼 2.快捷回复 3.常用语  4.场景列表
      let Request = null
      if (this.tabsIndex === '4') Request = sceneGetDetailById
      else Request = configGetDetailById

      const res = await Request({
        id: this.id
      })
      if (res.state === 1) {
        if (this.tabsIndex === '4') {
          this.formObj = {
            name: res.data.name,
          }
        } else {
          this.formObj = {
            usageSceneId: res.data.usageSceneId,
            content: res.data.content,
            level: res.data.level,
          }
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    // 关闭
    handleClose() {
      this.dialogVisible = false
      this.formObj = {
        usageSceneId: null, // 使用场景ID
        content: '', // 内容
        level: '999', // 权重
        name: '', // 场景名称
      }
      this.id = ''
      this.$refs.formName.clearValidate()
    },
    // 确定
    onConfirm() {
      this.$refs['formName'].validate(valid => {
        if (valid) {
          // tabsIndex  1.打招呼  2.快捷回复 3.常用语  4.场景列表

          if (this.tabsIndex === '4') {
            this.GetsaveOrUpdate()
          } else {
            this.GetConfigSaveOrUpdate()
          }
        }
      })
    },
    // 新增-编辑场景
    async GetsaveOrUpdate() {
      const res = await sceneSaveOrUpdate({
        name: this.formObj.name,
        id: this.id,
      })
      if (res.state === 1) {
        this.$message.success('操作成功')
        this.handleClose()
        this.$emit('confirm')
      } else {
        this.$message.error(res.msg)
      }
    },
    // 新增-编辑  打招呼/快捷回复/常用语  语言内容
    async GetConfigSaveOrUpdate() {
      const { usageSceneId, content, level } = this.formObj
      const res = await configSaveOrUpdate({
        content, // 语言内容
        level, // 权重
        id: this.id,
        usageSceneId, // 使用场景ID
        type: this.tabsIndex, // 快捷语类型 1打招呼 2快捷回复 3常用语
      })
      if (res.state === 1) {
        this.$message.success('操作成功')
        this.handleClose()
        this.$emit('confirm')
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content{
  overflow: hidden;
}
.dialog-footer{
  display: flex;
  align-content: center;
  justify-content: center;
}
.box{
  width: 83%;
}
</style>
