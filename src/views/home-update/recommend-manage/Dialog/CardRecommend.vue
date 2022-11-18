<template>
  <div>
    <!-- 编辑内容推荐卡片 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="编辑内容推荐"
      width="800px"
      :close-on-click-modal="false"
      @closed="handleClose"
    >
      <div v-loading="dialogLoading">
        <el-form ref="formObj" :model="formObj" :rules="rules" label-width="120px">
          <el-form-item label="卡片名称：" prop="name">
            <el-input
              v-model.trim="formObj.name"
              style="width: 50%"
              placeholder="不多于6个字符"
              maxlength="6"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item label="内容类型：" prop="type">
            <el-select
              v-model="formObj.type"
              style="width: 50%"
              placeholder="请选择内容类型"
              @change="handleTypeChange"
            >
              <el-option label="招商资讯" value="2" />
              <el-option label="平台资讯" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="推荐内容：" prop="ids">
            <el-select
              v-model="formObj.ids"
              style="width: 50%"
              placeholder="请选择"
              :disabled="isDisable"
              @change="handleChange"
            >
              <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <div class="mt-20">
              <el-button class="mr-20" @click="handleClose">取消</el-button>
              <el-button type="primary" @click="submit">保存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validateInt } from '@/utils/validate'
import { getManagerList } from '@/api/content/article'
import { getinvesInfoList } from '@/api/attract'
import Kingkong from '@/api/home-config/KingKong'
import { tableColumn2, tableColumn3 } from './data'
export default {
  data() {
    return {
      dialogVisible: false,
      dialogLoading: true,
      /** 平台资讯列表 */
      articleList: [],
      /** 招商资讯列表 */
      investList: [],
      /** 提交表单 */
      formObj: {
        name: '',
        type: '',
        switch: false,
        rate: '',
        ids: ''
      },
      /** 校验规则 */
      rules: {
        name: [{ required: true, message: '请输入卡片名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        ids: [{ required: true, message: '请选择活动内容', trigger: 'change' }],
        switch: [{ required: true }],
        rate: [
          { required: true, message: '请输入切换频率' },
          { validator: validateInt, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    options() {
      const { type } = this.formObj
      if (type === '1') {
        return this.supplyList
      } else if (type === '2') {
        return this.investList
      } else if (type === '3') {
        return this.articleList
      } else {
        return []
      }
    },
    tableColumn() {
      return this.formObj.type === '1' ? tableColumn2 : tableColumn3
    },
    isDisable() {
      return this.formObj.type === ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('edit', data => {
        this.handleEdit(data)
      })
    })
  },
  methods: {
    /** 获取内容列表  */
    async fetchData() {
      const pageData = { pageSize: 100, page: 1 }
      const [res1, res2] = await Promise.all([
        getManagerList({
          status: 1,
          contentModuleId: 1,
          publishTimeType: 0,
          title: '',
          ckey: '',
          contentColumn: '',
          order: '',
          ...pageData
        }),
        getinvesInfoList({ ...pageData })
      ])
      const fn = arr => {
        return arr.map(item => {
          item.label = item.id + ' ' + item.title
          return item
        })
      }
      this.articleList = fn(res1.data.data.list)
      this.investList = fn(res2.data.list)
      this.formObj.type = ''
      this.dialogLoading = false
    },

    /** 打开编辑弹窗 */
    handleEdit(data) {
      this.dialogVisible = true
      this.fetchData(data)
    },

    /** 关闭编辑弹窗 */
    handleClose() {
      this.dialogVisible = false
    },

    /** 选择推荐内容 */
    handleTypeChange() {
      this.formObj.ids = ''
    },

    handleChange() {},

    async submit() {
      this.$refs['formObj'].validate(async valid => {
        if (valid) {
          console.log('通过检验=>', this.formObj)
          const res = await Kingkong.saveKingkong()
          if (res.state !== 1) {
            this.$message.error(res.msg)
          } else {
            this.$message.success(res.msg)
            this.close()
            this.$emit('Refresh')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  margin-top: 8vh !important;
  min-height: 60vh !important;
}
</style>
