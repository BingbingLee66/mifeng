<template>
  <div style="margin-bottom: 20px">
    <el-dialog title="选择活动" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :inline="true" :model="form">
        <el-form-item label="活动来源" prop="chamberName">
         <el-select v-model="form.chamberName" class="select" placeholder="选择模板">
                <el-option
                  v-for="item2 in chamberList"
                  :key="item2.id"
                  :label="item2.name"
                  :value="item2.id"
                ></el-option>
              </el-select>
        </el-form-item>

        <el-form-item label="活动id" prop="id">
          <el-input v-model="form.id" :placeholder="placeholder"></el-input>
        </el-form-item>

        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="form.activityName" :placeholder="placeholder"></el-input>
        </el-form-item>

        <el-form-item label="活动状态" prop="status">
          <el-input v-model="form.status" :placeholder="placeholder"></el-input>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <kdTable @tableSelect="tableSelect" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import kdTable from '../../components/common/kdTable.vue'
import { getActivityList } from '@/api/activity/activity'
export default {
  name: 'ReceiveForm',
  components: { kdTable },
  props: ['receiveList', 'ckey'],
  provide() {
    return {
      columnConfig: this.columnConfig,
      tableData: this.tableData
    }
  },
  data() {
    return {
      dialogVisible: true,
      form: {
        activityName: 6,
        id: null,
        status: null,
        chamberName: ''
      },
      chamberList: [],
      // 表格配置
      columnConfig: [],
      tableData: [],
      // 会内职位
      options: [
        { name: '会长', count: 33 },
        { name: '学生', count: 93 }
      ],
      treeList: [],
      defaultProps: {
        children: 'departmentRespList',
        label: 'departmentName'
      },
      // 显示部门树结构
      showTree: false,
      // 本商会会员数
      memberNum: 0,
      // 指定会员数
      selectMember: 0,
      // 操作type 1 查看 2选择
      commitType: 1,
      name: '',
      placeholder: '请输入',
      // 已选表格数据
      selectData: []
    }
  },

  created() {
    this.getActivityListFunc()
   
    this.columnConfig = [
      { type: 'select' },
      {
        prop: 'name',
        label: '活动ID/名称',
        width: 180,
        formatter: row => {
          return row.id + row.name
        }
      },
    ]
    // this.form.receive = this.receiveList[0].type
    // this.getDepartmentListFunc()
    // this.listFunc()
  },
  methods: {
    /** 请求 */
    async getActivityListFunc(){
      const { data: { list } } = await getActivityList({
        isPublish: 1,
        pageSize: 10,
        page: 1
      })
      this.tableData = list
      console.log('data', list)
    },
    /** 行为操作 */
    save() {
      // 点击确定按钮
      console.log('this.selectData', this.selectData)
    },
    handleClose(){},

    /** 与子组件交互 */
    tableSelect(){}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px;
}
.btn {
  height: 30px;
}

.text {
  color: #c0c4cc;
}
.my-input {
  width: 500px;
  display: flex;
}
.department {
  min-height: 100px;
  border: 1px solid #dcdfe6;
  max-width: 500px;
  margin-bottom: 10px;
}
.el-tag {
  margin: 5px;
}
.tree {
  width: 500px;
  border: 1px solid #dcdfe6;
  margin-top: 10px;
  max-height: 200px;
  overflow-y: scroll;
}
.tips {
  display: flex;
  flex-direction: column;
  color: #7f7f7f;
  line-height: 22px;
}
</style>
