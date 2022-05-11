<template>
  <div>
    <el-form :inline="true" :model="query">
      <el-form-item label="标签名称" label-width="80px">
        <el-input v-model="query.name" clearable placeholder="关键词" />
      </el-form-item>
      <el-form-item label="来源" label-width="60px">
        <el-select v-model="query.source" placeholder="来源">
          <el-option label="全部" :value="-1" />
          <el-option label="后台创建" :value="0" />
          <el-option label="采集" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" label-width="60px">
        <el-select v-model="query.status" placeholder="状态">
          <el-option label="全部" :value="-1" />
          <el-option label="使用中" :value="1" />
          <el-option label="已冻结" :value="0" />
          <el-option label="已删除" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="权重是否为0" label-width="120px">
        <el-select v-model="query.weightIsZero" placeholder="状态">
          <el-option label="全部" :value="-1" />
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-button style="margin-bottom:10px;" type="primary" @click="dialogVisible = true">新增标签</el-button>

    <el-table :data="list" border fit highlight-current-row>
      <el-table-column width="120px" label="标签ID" prop="id" />
      <el-table-column label="标签名称" prop="name" />
      <el-table-column label="来源">
        <template slot-scope="{row:{source}}">
          <span v-if="source == 0">后台创建</span>
          <span v-if="source == 1">采集</span>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="{row:{status}}">
          <div v-if="status == 0">已冻结</div>
          <div v-if="status == 1">使用中</div>
          <div v-if="status == 2">已删除</div>
        </template>
      </el-table-column>

      <el-table-column label="权重" width="60px" prop="weight">
        <template slot-scope="{row}">
          <el-button :disabled="row.status==2" type="text" size="small" @click="handleEditWeight(row)">{{ row.weight }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建信息">
        <template slot-scope="{row:{creatorName,createdTs}}">
          <div>创建人：{{ creatorName }}</div>
          <div>创建时间：{{ +createdTs | dateFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column label="更新信息">
        <template slot-scope="{row:{operatorName,updatedTs}}">
          <div>更新人：{{ operatorName }}</div>
          <div>更新时间：{{ +updatedTs | dateFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button :disabled="row.status==2" type="text" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button :disabled="row.status==2" type="text" size="small" @click="handleDelete(row)">删除</el-button>
          <el-button v-if="row.status == 0" :disabled="row.status==2" type="text" size="small" @click="handleUnfreeze(row)">解冻</el-button>
          <el-button v-else :disabled="row.status==2" type="text" size="small" @click="handleFreeze(row)">冻结</el-button>
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

    <el-dialog :title="`${dialogFormData.id ? '编辑' : '添加'}标签`" :visible.sync="dialogVisible" width="30%">
      <el-form ref="dialogForm" :model="dialogFormData" :rules="rules" label-position="right" label-width="100px">
        <el-row v-show="!isEditWeight">
          <el-form-item label="标签名称" prop="name">
            <el-input v-model.trim="dialogFormData.name" maxlength="6" show-word-limit />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="权重" prop="weight">
            <el-input v-model.number="dialogFormData.weight" maxlength="3" min="1" />
          </el-form-item>
        </el-row>
      </el-form>
      <div style="margin-left:100px">权重区间 0-999，权重越大，排序越靠前</div>
      <div style="margin-left:100px">权重为0不在前台展示</div>
      <span slot="footer" class="dialog-footer">
        <el-button v-dbClick type="primary" @click="isEditWeight?modifyWeight():modifyTag()">{{ dialogFormData.id ? '修改':'添加' }}</el-button>
        <el-button @click.native="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 冻结弹窗 -->
    <el-dialog title="冻结标签" :visible.sync="freezeVisible" width="30%">
      <p>确认冻结标签: {{ freezeInfo.name }} ？</p>
      <div style="padding:10px;">
        <div>标签冻结后：</div>
        <p>• 前台将不在展示该标签</p>
        <p>• 无法使用该标签进行筛选</p>
        <p>• 已使用该标签的供需不会受到影响</p>
      </div>
      <div>
        <i style="color:red">*</i>
        原因
      </div>
      <el-input
        v-model="freezeInfo.frozenReasons"
        style="margin-top:10px;"
        type="textarea"
        :rows="2"
        resize="none"
        placeholder="请输入内容"
      />
      <span slot="footer" class="dialog-footer">
        <el-button v-dbClick type="primary" @click="freezeTag">确认</el-button>
        <el-button @click.native="freezeVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addLabel, getLabelList, updateLabel, deleteLabel, updateLabelWeight, freezeLabel, unFreezeLabel, getFreezeReasons } from '@/api/label'

export default {
  data() {
    return {
      dialogVisible: false,
      freezeVisible: false,
      freezeInfo: {},
      query: {
        name: '',
        source: -1,
        status: -1,
        weightIsZero: -1,
        page: 1,
        pageSize: 10
      },
      list: [],
      total: 0,
      dialogFormData: {
        name: '',
        weight: ''
      },
      isEditWeight: false,
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
  watch: {
    dialogVisible(newVal) {
      if (!newVal) {
        this.isEditWeight = false
        this.$refs.dialogForm.resetFields()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    modifyTag() {
      this.$refs.dialogForm.validate(async valid => {
        if (!valid) return false
        const { dialogFormData: { id, name, weight }} = this
        const { state, msg } = await (id ? updateLabel({ id, name, weight }) : addLabel({ name, weight }))
        if (state === 1) {
          this.dialogVisible = false
          this.getList()
        }
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      })
    },
    handleCurrentChange(val) {
      this.query.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.query.pageSize = val
      this.getList()
    },
    async getList() {
      const params = { ...this.query }
      if (!params.name) delete params.name
      const { data: { list = [], totalRows }} = await getLabelList(params)
      this.total = totalRows
      this.list = list
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleEdit(row) {
      this.dialogFormData = row
      this.dialogVisible = true
    },
    handleEditWeight(row) {
      this.isEditWeight = true
      this.dialogVisible = true
      this.dialogFormData = { ...row }
    },
    modifyWeight() {
      this.$refs.dialogForm.validateField(['weight'], async errMsg => {
        if (errMsg) return false
        const { dialogFormData: { id, weight }} = this
        const { state, msg } = await updateLabelWeight({ id, weight })
        if (state === 1) {
          this.dialogVisible = false
          this.getList()
        }
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      })
    },
    async handleDelete(row) {
      try {
        await this.$confirm(
          `
        <p>确认删除标签: ${row.name} ？</p>
        <p>若删除该标签，前台将不能使用该标签，已使用该标签的供需不受影响，删除后将无法恢复，请谨慎操作</p>
        `,
          '删除',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true
          }
        )
        const { msg, state } = await deleteLabel(row.id)
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
        state === 1 && this.getList()
      } catch (error) {
        //
      }
    },
    async freezeTag() {
      const { frozenReasons, id } = this.freezeInfo
      if (!frozenReasons) return this.$message({ message: '请输入冻结原因', type: 'warning' })
      const { state, msg } = await freezeLabel({ frozenReasons, id })
      if (state === 1) {
        this.freezeVisible = false
        this.getList()
      }
      this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
    },
    async handleFreeze(row) {
      this.freezeVisible = true
      this.freezeInfo = row
    },
    async handleUnfreeze(row) {
      try {
        const { data } = await getFreezeReasons(row.id)

        await this.$confirm(
          `
        <p> ${row.name} 由于<span style="color:red;">${data}</span>被冻结，您确定要解冻吗？</p>
        <div style="padding:20px;">
          <p>标签解冻后：</p>
          <p>• 前端恢复显示该标签</p>
          <p>• 可使用该标签进行筛选</p>
        </div>
      `,
          '解冻',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true
          }
        )
        const { state, msg } = await unFreezeLabel({ id: row.id })
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      } catch (error) {
        //
      }
    }
  }
}
</script>

<style></style>
