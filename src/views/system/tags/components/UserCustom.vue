<template>
  <div>
    <el-form :inline="true" :model="query">
      <el-form-item label="标签名称" label-width="80px">
        <el-input v-model="query.name" clearable placeholder="关键词" />
      </el-form-item>
      <el-form-item label="采集状态" label-width="80px">
        <el-select v-model="query.gatherType" placeholder="采集状态">
          <el-option label="全部" :value="-1" />
          <el-option label="采集" :value="1" />
          <el-option label="未采集" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column width="120px" label="标签ID" prop="id" />
      <el-table-column label="标签名称" prop="name" />
      <el-table-column label="采集状态">
        <template slot-scope="{row:{gatherType}}">
          <div v-if="gatherType == 1">已采集</div>
          <div v-if="gatherType == 2">未采集</div>
        </template>
      </el-table-column>
      <el-table-column label="使用次数" prop="usageCount" />
      <el-table-column label="使用人数">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="showUsers(row)">{{ row.userCount }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="最近使用时间">
        <template slot-scope="{row:{time}}">
          {{ +time | dateFormat }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button :disabled="row.gatherType==1" type="text" size="small" @click="handleGather(row)">采集标签</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px;"
      :hide-on-single-page="false"
      background
      :page-size="query.pageSize"
      :page-sizes="[10, 20, 50, 100, 500]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="编辑标签" :visible.sync="dialogVisible" width="30%">
      <el-form ref="dialogForm" :model="dialogFormData" label-position="right" label-width="100px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model.trim="dialogFormData.name" :maxlength="6" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-dbClick type="primary" @click="editTag">修改</el-button>
        <el-button @click.native="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="采集标签" :visible.sync="gatherVisible" width="30%">
      <el-form ref="gatherForm" :model="gatherFormData" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-form-item label="标签名称" prop="name">
            <el-input v-model.trim="gatherFormData.name" maxlength="6" show-word-limit />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="权重" prop="weight">
            <el-input v-model.number="gatherFormData.weight" maxlength="3" min="1" />
          </el-form-item>
        </el-row>
      </el-form>
      <div style="margin-left:100px">权重区间 0-999，权重越大，排序越靠前</div>
      <div style="margin-left:100px">权重为0不在前台展示</div>
      <div style="margin-top:20px">
        <span style="color:red;">温馨提示：</span>采集时，若重新编辑了标签，则原标签将替换成新标签，用户在前端看到的标签也将覆盖为新标签
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-dbClick type="primary" @click="gatherTag">确定</el-button>
        <el-button @click.native="gatherVisible = false">取消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getCustomLabelList, updateCustomLabel, gatherCustomLabel, getCustomLabelUsers } from '@/api/label'

export default {
  components: {},
  props: [],
  data() {
    return {
      query: {
        name: '',
        gatherType: -1,
        pageSize: 10,
        page: 1
      },
      list: [],
      total: 0,
      dialogVisible: false,
      dialogFormData: {
        name: ''
      },

      gatherVisible: false,
      gatherFormData: {
        name: '',
        weight: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '只能输入中英文', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入权重', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '只能输入数字', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {},
  watch: {
    dialogVisible(newVal) {
      if (!newVal) {
        this.dialogFormData.name = ''
      }
    },
    gatherType(newVal) {
      if (!newVal) {
        this.$refs.gatherForm.resetFields()
      }
    },
  },
  beforeDestroy() {},
  created() {
    this.getLabelList()
  },
  methods: {
    async getLabelList() {
      const params = { ...this.query }
      if (!params.name) delete params.name
      const { data: { list = [], totalRows }} = await getCustomLabelList(params)
      this.total = totalRows
      this.list = list
    },
    handleSizeChange(val) {
      this.query.pageSize = val
      this.getLabelList()
    },
    handleCurrentChange(val) {
      this.query.page = val
      this.getLabelList()
    },

    handleEdit(row) {
      this.dialogFormData = { ...row }
      this.dialogVisible = true
    },

    async editTag() {
      const { name, id } = this.dialogFormData
      if (!name) return this.$message({ message: '请输入标签名称', type: 'warning' })
      try {
        const { state } = await updateCustomLabel({ name, id })
        if (state === 1) {
          this.getLabelList()
          this.dialogVisible = false
          this.$message({ message: '采集成功，请在标签设置查看', type: 'success' })
          return
        }
      } catch (error) {
        //
      }
      this.$message({ message: '采集失败，请重新操作', type: 'error' })
    },

    handleGather(row) {
      this.gatherFormData = { ...row }
      this.gatherVisible = true
    },

    gatherTag() {
      this.$refs.gatherForm.validate(async valid => {
        if (!valid) return false
        const { id, name, weight } = this.gatherFormData
        const { state, msg } = await gatherCustomLabel({ id, name, weight })
        if (state === 1) {
          this.gatherVisible = false
          this.getLabelList()
        }
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      })
    },

    async showUsers(row) {
      const { data } = await getCustomLabelUsers(row.id)
      this.$confirm(data, '使用人', {
        confirmButtonText: '我知道了',
        showCancelButton: false,
        dangerouslyUseHTMLString: true
      })
    }
  },
}
</script>

<style  scoped>
</style>
