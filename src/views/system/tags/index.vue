<template>
  <div class="p-tags-index app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="标签设置" name="first">
        <el-form :inline="true" :model="tagForm">
          <el-form-item label="标签名称" label-width="80px">
            <el-input v-model="tagForm.keyword" clearable placeholder="关键词" />
          </el-form-item>
          <el-form-item label="来源" label-width="60px">
            <el-select v-model="tagForm.from" placeholder="来源">
              <el-option label="全部" value="all" />
              <el-option label="后台" value="background" />
              <el-option label="采集" value="cj" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" label-width="60px">
            <el-select v-model="tagForm.status" placeholder="状态">
              <el-option label="全部" value="all" />
              <el-option label="使用中" value="using" />
              <el-option label="已冻结" value="freeze" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="dialogVisible = true">新增标签</el-button>
        <div style="margin:10px 0;">标签 共 20 个</div>

        <el-table :data="list" border fit highlight-current-row>
          <el-table-column width="40px" label="id">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="标签名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="来源">
            <template slot-scope="scope">
              {{ scope.row.from }}
            </template>
          </el-table-column>

          <el-table-column label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.status == 0">使用者</div>
              <div v-if="scope.row.status == 1">已冻结</div>
            </template>
          </el-table-column>
          <el-table-column label="权重" width="60px">
            <template slot-scope="scope">
              {{ scope.row.sort }}
            </template>
          </el-table-column>
          <el-table-column label="创建信息">
            <template slot-scope="scope">
              <div>创建人：{{ scope.row.create_user }}</div>
              <div>创建时间：{{ scope.row.create_time }}</div>
            </template>
          </el-table-column>
          <el-table-column label="更新信息">
            <template slot-scope="scope">
              <div>更新人：{{ scope.row.update_user }}</div>
              <div>更新时间：{{ scope.row.update_time }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
              <el-button
                v-if="scope.row.status == 0"
                type="text"
                size="small"
                @click="handleFreeze(scope.row)"
              >冻结</el-button>
              <el-button
                v-if="scope.row.status == 1"
                type="text"
                size="small"
                @click="handleUnfreeze(scope.row)"
              >解冻</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top:20px;"
          :hide-on-single-page="false"
          background
          :current-page.sync="page"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPages"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

      </el-tab-pane>
      <el-tab-pane label="用户自定义" name="second">用户自定义</el-tab-pane>
    </el-tabs>

    <el-dialog :title="`${isAddDialog ? '添加' : '编辑'}标签`" :visible.sync="dialogVisible" width="30%">
      <el-form ref="dialog" :model="dialogForm" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-form-item label="标签名称" prop="name">
            <el-input v-model.trim="dialogForm.name" max-length="6" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="权重：" prop="level">
            <el-input v-model.number="dialogForm.level" maxlength="3" min="1" />
          </el-form-item>
        </el-row>
      </el-form>
      <div style="margin-left:100px">权重区间 0-999，权重越大，排序越靠前</div>
      <div style="margin-left:100px">权重为0不在前台展示</div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isAddDialog" v-dbClick type="primary" @click="addTag">添加</el-button>
        <el-button v-else v-dbClick type="primary" @click="editTag">修改</el-button>
        <el-button @click.native="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 冻结弹窗 -->
    <el-dialog title="冻结标签" :visible.sync="freezeVisible" width="30%">
      <p>确认冻结标签: ${'标签名称'} ？</p>
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
        v-model="freezeInfo.reason"
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
export default {
  data() {
    return {
      activeName: 'first',
      dialogVisible: false,
      dialogType: 'add',
      freezeVisible: false,
      freezeInfo: {},
      tagForm: {
        keyword: '',
        from: 'all',
        status: 'all'
      },
      list: [
        {
          id: 1,
          name: '标签1',
          from: '后台',
          status: 0,
          sort: 1,
          create_user: 'admin',
          create_time: '2018-01-01',
          update_user: 'admin',
          update_time: '2018-01-01',
          level: 1
        },
        {
          id: 2,
          name: '标签2',
          from: '后台',
          status: 1,
          sort: 2,
          create_user: 'admin',
          create_time: '2018-01-01',
          update_user: 'admin',
          update_time: '2018-01-01',
          level: 2
        },
        {
          id: 3,
          name: '标签3',
          from: '后台',
          status: 0,
          sort: 3,
          create_user: 'admin',
          create_time: '2018-01-01',
          update_user: 'admin',
          update_time: '2018-01-01',
          level: 3
        },
        {
          id: 4,
          name: '标签4',
          from: '后台',
          status: 1,
          sort: 4,
          create_user: 'admin',
          create_time: '2018-01-01',
          update_user: 'admin',
          update_time: '2018-01-01',
          level: 4
        },
        {
          id: 5,
          name: '标签5',
          from: '后台',
          status: 0,
          sort: 5,
          create_user: 'admin',
          create_time: '2018-01-01',
          update_user: 'admin',
          update_time: '2018-01-01',
          level: 5
        },
        {
          id: 6,
          name: '标签6',
          from: '后台',
          status: 1,
          sort: 6,
          create_user: 'admin',
          create_time: '2018-01-01',
          update_user: 'admin',
          update_time: '2018-01-01',
          level: 6
        }
      ],
      page: 1,
      pageSize: 10,
      totalPages: 0,
      total: 0,
      dialogForm: {
        name: '',
        level: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '只能输入中英文', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入权重', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '只能输入数字', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isAddDialog() {
      return this.dialogType === 'add'
    },
  },
  methods: {
    editTag(row) {

    },
    addTag() {
      this.$refs.dialogForm.validate(async(valid) => {
        if (valid) {
          this.$message({ message: '添加成功', type: 'success' })
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    getList() {},
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      this.dialogForm = row
      this.dialogVisible = true
    },
    async handleDelete(row) {
      await this.$confirm(
        `
        <p>确认删除标签: ${'标签名称'} ？</p>
        <p>若删除该标签，前台将不能使用该标签，已使用该标签的供需不受影响，删除后将无法恢复，请谨慎操作</p>
      `,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true
        }
      )
    },
    freezeTag() {
      if (!this.freezeInfo.reason) {
        this.$message({ message: '请输入冻结原因', type: 'warning' })
        return false
      }
    },
    async handleFreeze(row) {
      this.freezeVisible = true
      this.freezeInfo = row
    },
    async handleUnfreeze(row) {
      await this.$confirm(
        `
        <p> [标签名称] 由于${'原因'}被冻结，您确定要解冻吗？</p>
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
    }
  }
}
</script>

<style></style>
