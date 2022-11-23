<template>
  <div>
    <!-- 编辑内容推荐 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      title="编辑内容推荐"
      width="800px"
      :close-on-click-modal="false"
      @closed="close"
    >
      <div v-loading="dialogLoading">
        <el-form ref="formObj" :model="formObj" :rules="rules" label-width="120px">
          <el-form-item label="推荐位名称：" prop="title">
            <el-input
              v-model.trim="formObj.title"
              style="width: 50%"
              placeholder="不多于6个字符"
              maxlength="6"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item label="内容类型：" prop="contentType">
            <el-select
              v-model="formObj.contentType"
              style="width: 50%"
              placeholder="请选择内容类型"
              @change="handleTypeChange"
            >
              <el-option label="平台供需" value="3" />
              <el-option label="招商资讯" value="5" />
              <el-option label="平台资讯" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="推荐内容：" prop="contentIds">
            <el-select
              v-model="formObj.contentIds"
              style="width: 50%"
              multiple
              collapse-tags
              placeholder="请选择"
              :disabled="isDisable"
              @change="handleChange"
            >
              <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formObj.contentIds.length > 0" label="">
            <ysh-table
              :table-config="tableConfig"
              :table-column="tableColumn"
              :table-data="tableData"
              @handleOrder="handleOrder"
            >
              <template v-slot:operate="row">
                <span class="text-red cur ml-10" @click="handleRemove(row.data)">移除</span>
              </template>
            </ysh-table>
          </el-form-item>
          <el-form-item label="">
            <div class="mt-20">
              <el-button class="mr-20" @click="close">取消</el-button>
              <el-button type="primary" @click="submit">保存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { changeOrder, removeItem } from '@/utils/utils'
import { tableColumn2, tableColumn3 } from './data'
import Home from '@/api/home-config/Home'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogLoading: true,
      /** 提交表单 */
      formObj: {
        title: '', // 推荐位名称
        contentType: '', // 推荐位内容类型
        contentIds: []
      },
      /** 校验规则 */
      rules: {
        title: [{ required: true, message: '请输入推荐位名称', trigger: 'blur' }],
        contentType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        contentIds: [{ required: true, message: '请选择活动内容', trigger: 'change' }]
      },
      /** 表格配置 */
      tableConfig: {
        loading: false,
        headerCellStyle: { padding: 0 },
        maxHeight: window.innerHeight - 600 + 'px'
      },
      options: [],
      rowData: []
    }
  },
  computed: {
    tableColumn() {
      return this.formObj.contentType === '3' ? tableColumn2 : tableColumn3
    },
    isDisable() {
      return this.formObj.contentType === ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$on('edit', data => {
        this.rowData = data
        this.edit(data)
      })
    })
  },
  methods: {
    /** 打开编辑弹窗 */
    async edit(data) {
      this.dialogVisible = true
      await this.getContent(data.position)
      await this.getOptions(data.contentType)
      this.formObj.contentType = data.contentType + ''
      this.dialogLoading = false
    },

    /** 关闭编辑弹窗 */
    close() {
      this.formObj = {
        title: '',
        contentType: '',
        contentIds: []
      }
      this.$refs['formObj'].clearValidate()
      this.dialogVisible = false
    },

    /** 获取推荐位展示内容 */
    async getContent(recommendPosId) {
      const { data: content } = await Home.getRecommendContent({ recommendPosId })
      console.log('content data', content)
      if (content && content.length > 0) {
        this.formObj.contentIds = content.map(i => i.contentId)
        this.formObj.title = content[0].title
        this.tableData = content
        this.tableData.forEach(i => {
          i.id = i.contentId
          i.label = i.contentId + ' ' + i.contentTitle
        })
      }
    },

    /** 获取推荐内容选择列表（根据类容类型） */
    async getOptions(contentType) {
      console.log('contentType', contentType)
      const { data: list } = await Home.getContentList({ contentType })
      console.log('options data', list)
      if (list && list.length > 0) {
        list.forEach(i => {
          i.id = i.contentId
          i.label = i.contentId + ' ' + i.contentTitle
        })
        this.options = list
      }
    },

    /** 选择推荐内容类型 */
    handleTypeChange(contentType) {
      this.formObj.contentIds = []
      this.tableData = []
      this.getOptions(contentType)
    },

    handleChange(data) {
      const result = this.options.filter(item => {
        return data.includes(item.id)
      })
      this.tableData = result
    },

    /** 移除活动内容 */
    handleRemove(data) {
      removeItem(this.tableData, data.id)
      removeItem(this.formObj.contentIds, data.id)
    },

    /** 调整上下顺序 */
    handleOrder(event, data) {
      changeOrder(this.tableData, data.id, event)
    },

    async submit() {
      this.$refs['formObj'].validate(async valid => {
        if (valid) {
          const params = this.tableData.map(item => {
            return {
              recommendId: this.rowData.position, // 推荐位id
              id: this.rowData.id, // 推荐位内容id
              type: this.formObj.contentType, // 推荐位内容类型
              contentId: item.contentId, // 活动内容id
              contentImg: item.contentImg, // 活动内容图片
              contentTitle: item.contentTitle, // 活动内容标题
              title: this.formObj.title, // 推荐位名称
            }
          })
          console.log('submit params', params)
          const res = await Home.updateRecommendContent(params)
          if (res.state !== 1) {
            this.$message.error(res.msg)
          } else {
            this.$message.success(res.msg)
            this.close()
            this.$emit('refresh')
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

/deep/ .el-select__tags .el-tag--info:nth-child(1) {
  width: 80% !important;
}
</style>
