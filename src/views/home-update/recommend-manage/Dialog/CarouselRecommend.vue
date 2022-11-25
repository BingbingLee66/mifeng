<template>
  <div>
    <!-- 编辑轮播推荐 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      title="编辑轮播推荐"
      width="800px"
      :close-on-click-modal="false"
      @closed="close"
    >
      <div v-loading="dialogLoading">
        <el-form ref="formObj" :model="formObj" :rules="rules" label-width="100px">
          <el-form-item style="width: 50%" label="活动类型：" prop="contentType">
            <el-select v-model="formObj.contentType" placeholder="请选择活动类型" @change="handleTypeChange">
              <el-option label="平台活动" value="1" />
              <el-option label="招商活动" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item style="width: 50%" label="活动内容：" prop="contentIds">
            <el-row>
              <span class="text-blue cur" @click="handleSelect">请选择</span>
            </el-row>
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
          <el-form-item label="切换频率：" prop="shuffling">
            <el-switch v-model="formObj.shuffling" />
          </el-form-item>
          <el-form-item v-if="formObj.shuffling" label="" prop="shufflingSpeed">
            <el-input v-model="formObj.shufflingSpeed" style="width: 200px" placeholder="">
              <template slot="append">毫秒</template>
            </el-input>
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
    <select-recommend ref="selectRef" :content-type="formObj.contentType" @confirm="handleConfirm" />
  </div>
</template>

<script>
import { validateInt } from '@/utils/validate'
import { changeOrder, removeItem } from '@/utils/utils'
import SelectRecommend from './SelcetRecommend'
import { tableColumn } from './data'
import Home from '@/api/home-config/Home'

export default {
  components: { SelectRecommend },
  data() {
    return {
      dialogVisible: false,
      dialogLoading: true,
      /** 提交表单 */
      formObj: {
        contentType: '', // 推荐位内容类型
        shuffling: false, // 是否开启轮播，1开启，0关闭
        shufflingSpeed: '', // 轮播频率，单位毫秒
        contentIds: []
      },
      /** 校验规则 */
      rules: {
        contentType: [{ required: true, message: '请选择活动类型', trigger: 'blur' }],
        contentIds: [{ required: true, message: '请选择活动内容', trigger: 'blur' }],
        shuffling: [{ required: true }],
        shufflingSpeed: [
          { required: true, message: '请输入切换频率' },
          { validator: validateInt, trigger: 'blur' }
        ]
      },
      /** 表格配置 */
      tableConfig: {
        loading: false,
        headerCellStyle: { padding: 0 },
        maxHeight: '600px'
      },
      tableColumn,
      tableData: [],
      rowData: [],
      position: null,
    }
  },
  computed: {
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
    edit(data) {
      this.dialogVisible = true
      this.position = data.position
      this.formObj.contentType = data.contentType + ''
      this.getContent(data.position)
    },

    /** 关闭编辑弹窗 */
    close() {
      this.formObj = {
        contentType: '',
        shuffling: false,
        shufflingSpeed: '',
        contentIds: []
      }
      this.$refs['formObj'].clearValidate()
      this.dialogVisible = false
    },

    /** 获取推荐位展示内容 */
    async getContent(recommendPosId) {
      const { data: content } = await Home.getRecommendContent({ recommendPosId })
      if (content && content.length > 0) {
        this.formObj.contentIds = content.map(i => i.contentId)
        this.formObj.shuffling = content[0].shuffling === 1
        this.formObj.shufflingSpeed = content[0].shufflingSpeed
        this.tableData = content
        this.tableData.forEach(i => {
          i.id = i.contentId
          i.label = i.contentId + ' ' + i.contentTitle
        })
      }
      this.dialogLoading = false
    },

    /** 选择推荐内容类型 */
    handleTypeChange() {
      this.formObj.contentIds = []
      this.tableData = []
    },

    handleSelect() {
      this.$refs.selectRef.$emit('select', this.position)
    },

    handleConfirm(data) {
      if (data) {
        this.formObj.contentIds = data.map(i => i.contentId)
        this.tableData = data
      }
      this.$refs.formObj.validateField('contentIds')
    },

    /** 移除活动内容 */
    handleRemove(data) {
      removeItem(this.tableData, data.contentId)
      removeItem(this.formObj.contentIds, data.contentId)
    },

    /** 调整上下顺序 */
    handleOrder(event, data) {
      changeOrder(this.tableData, data.contentId, event)
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
              shuffling: this.formObj.shuffling ? 1 : 0, // 是否开启轮播 1开启，0关闭
              shufflingSpeed: this.formObj.shufflingSpeed // 轮播频率，
            }
          })
          const res = await Home.updateRecommendContent(params)
          if (res.state !== 1) {
            this.$message.error(res.msg)
          } else {
            this.$message.success(res.msg)
            this.close()
            this.$emit('refresh')
          }
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
