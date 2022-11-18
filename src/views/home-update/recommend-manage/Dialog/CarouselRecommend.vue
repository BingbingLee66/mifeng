<template>
  <div>
    <!-- 编辑轮播推荐 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="编辑轮播推荐"
      width="800px"
      :close-on-click-modal="false"
      @closed="handleClose"
    >
      <div v-loading="dialogLoading">
        <el-form ref="formObj" :model="formObj" :rules="rules" label-width="100px">
          <el-form-item style="width: 50%" label="活动类型：" prop="type">
            <el-select v-model="formObj.type" placeholder="请选择活动类型">
              <el-option label="平台活动" value="1" />
              <el-option label="招商活动" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item style="width: 50%" label="活动内容：" prop="activityIds">
            <el-select v-model="formObj.activityIds" multiple collapse-tags placeholder="请选择" @change="handleChange">
              <el-option v-for="item in activityOptions" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formObj.activityIds.length > 0" label="">
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
          <el-form-item label="切换频率：" prop="switch">
            <el-switch v-model="formObj.switch" />
          </el-form-item>
          <el-form-item v-if="formObj.switch" label="" prop="rate">
            <el-input v-model="formObj.rate" style="width: 200px" placeholder="">
              <template slot="append">毫秒</template>
            </el-input>
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
import { changeOrder, removeItem } from '@/utils/utils'
import { getActivityList } from '@/api/activity/activity'
import { getInvesActivityList } from '@/api/attract'
import Kingkong from '@/api/home-config/KingKong'
import { tableColumn } from './data'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogLoading: true,
      /** 平台活动列表 */
      activityList: [],
      /** 招商活动列表 */
      investActivityList: [],
      /** 提交表单 */
      formObj: {
        type: '',
        switch: false,
        rate: '',
        activityIds: []
      },
      /** 校验规则 */
      rules: {
        type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        activityIds: [{ required: true, message: '请选择活动内容', trigger: 'change' }],
        switch: [{ required: true }],
        rate: [
          { required: true, message: '请输入切换频率' },
          { validator: validateInt, trigger: 'blur' }
        ]
      },
      /** 表格配置 */
      tableConfig: {
        loading: false,
        headerCellStyle: { padding: 0 },
        maxHeight: window.innerHeight - 600 + 'px'
      },
      tableColumn,
      tableData: []
    }
  },
  computed: {
    activityOptions() {
      return this.formObj.type === '1' ? this.activityList : this.investActivityList
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
    /** 获取活动列表  */
    async fetchData(data) {
      const pageData = { pageSize: 100, page: 1 }
      const [res1, res2] = await Promise.all([
        getActivityList({ isPublish: 1, ...pageData }),
        getInvesActivityList({ isInves: false, ...pageData })
      ])
      const fn = arr => {
        return arr.map((item, index) => {
          item.label = item.id + ' ' + item.activityName
          item.serialNumber = index + 1
          return item
        })
      }
      this.activityList = fn(res1.data.list)
      this.investActivityList = fn(res2.data.list)
      this.formObj.type = data.content + ''
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

    /** 选择活动内容 */
    handleChange(data) {
      const result = this.activityOptions.filter(item => {
        return data.includes(item.id)
      })
      this.tableData = result
    },

    /** 移除活动内容 */
    handleRemove(data) {
      removeItem(this.tableData, data.id)
      removeItem(this.formObj.activityIds, data.id)
    },

    /** 调整上下顺序 */
    handleOrder(event, data) {
      changeOrder(this.tableData, data.id, event)
    },

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
