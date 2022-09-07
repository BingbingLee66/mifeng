<template>
  <div style="margin-bottom: 20px">
    <el-dialog title="选择活动" :visible.sync="dialogVisible" width="65%" :before-close="handleClose">
      <el-form :inline="true" :model="form">
        <el-form-item label="活动来源" prop="chamberName">
          <el-select v-model="form.chamberName" class="select" placeholder="请选择">
            <el-option v-for="item2 in chamberList" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动id" prop="id">
          <el-input clearable v-model="form.id" :placeholder="placeholder"></el-input>
        </el-form-item>

        <el-form-item label="活动名称" prop="activityName">
          <el-input clearable v-model="form.activityName" :placeholder="placeholder"></el-input>
        </el-form-item>

        <el-form-item label="活动状态" prop="status">
          <el-select v-model="form.status" class="select" placeholder="请选择">
            <el-option v-for="item2 in statusList" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getActivityListFunc">查询</el-button>
      </el-form>
      <!-- 表格 -->
      <div class="table">
        <kdTable ref="table" @tableSelect="tableSelect" />
      </div>

      <!-- 分页  前期先不做分页-->
      <!-- <KdPagination
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
        @change="onPageChange($event, item, i)"
      /> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import kdTable from '../../components/common/kdTable.vue'
import { getActivityList } from '@/api/activity/activity'
import { getInvesActivityList } from '@/api/attract/index'
import dayjs from 'dayjs'
export default {
  name: 'ReceiveForm',
  components: { kdTable, KdPagination: () => import('@/components/common/KdPagination') },
  props: {
    activityType: {
      type: Number,
      default: 2
    },
    activityList:{
      type:Array,
      default:[]
    }
  },
  provide() {
    return {
      tableMsg: this
      // columnConfig: this.columnConfig,
      // tableData: this.tableData
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        activityName: '',
        id: null,
        status: 0,
        chamberName: ''
      },
      chamberList: [],
      // 表格配置
      columnConfig: [],
      //表格数据
      tableData: [],
      pageSize: 100000,
      pageNum: 1,
      total: 0,

      placeholder: '请输入',
      // 已选表格数据
      selectData: [],
      statusList: [
        { id: 0, name: '全部' },
        { id: 1, name: '未开始' },
        { id: 2, name: '报名中' },
        { id: 3, name: '已结束' },
        { id: 4, name: '报名中' }
      ]
    }
  },

  created() {
 this.resetColumnConfig()
      
   
  },
  methods: {
    /** 请求 */
    async getActivityListFunc() {
      let api=getActivityList;
      if(this.activityType === 3){
        api=getInvesActivityList
      }
      const { pageSize, pageNum: page, form } = this
      const { data } = await api({
        isPublish: 1,
        pageSize,
        page,
        ...form,
        isInves: false
      })
      this.tableData = data.list
      this.total = data.totalRows
      this.$refs['table'].toggleSelection(this.activityList)
    },
    /** 行为操作 */
    // save() {
    //   // 点击确定按钮
    //   this.submit()
    // },
    //打开弹框
    open() {
      this.getActivityListFunc()
      this.dialogVisible = true
    },
    //关闭弹框
    submit() {
      this.dialogVisible = false
      this.$emit('addActivity', this.selectData)
    },
    handleClose() {
      this.dialogVisible = false
    },

    /** 与子组件交互 */
    tableSelect(val) {
      // console.log(val)
      this.selectData = val
    },
    // 分页改变
    // onPageChange($event) {
    //   const { pageNum, pageSize } = $event
    //   this.pageNum = pageNum
    //   this.pageSize = pageSize ? pageSize : this.pageSize
    //   this.getActivityListFunc()
    // }

    /**工具 */
    resetColumnConfig() {
      this.columnConfig = [
        { type: 'select' },
        {
          prop: 'id',
          label: '活动ID',
          type: 'general',
          width: 70
        },
        {
          prop: 'activeHead',
          label: '活动列表图',
          type: 'img',
          width: 180
        },
        {
          prop: 'activityName',
          label: '活动名称',
          type: 'general'
        },
        {
          prop: 'activeTime',
          label: '活动时间',
          width: 180,
          type: 'general',
          formatter: row => {
            return (
              dayjs(parseInt(this.activityType===2 ? row.startTime : row.activityStartTime)).format('YYYY-MM-DD HH:mm:ss') +
              '~' +
              dayjs(parseInt(this.activityType===2 ? row.startTime :row.activityEndTime)).format('YYYY-MM-DD HH:mm:ss')
            )
          }
        },
        {
          prop: 'address',
          label: '活动地点',
          width: 180,
          type: 'general',
          formatter: row => {
            return row.province + row.city + row.area + row.addressInfo
          }
        },
        {
          prop: 'chamberName',
          label: '活动来源',
          type: 'general',
          formatter:row=>{
            return this.activityType===2 ? row.chamberName :row.invesName
            
          }
        },
        {
          prop: 'applyObject',
          label: '报名对象',
          type: 'general',

          formatter: row => {
            return row.applyObject === 0 ? '不限' : '商会会员'
          }
        },
        {
          prop: 'chamberName',
          label: '发布状态',
          type: 'general',
          width: 80,
          formatter: row => {
            return row.isPublish ? '已发布' : '未发布'
          }
        },
        {
          prop: 'status',
          label: '活动状态',
          type: 'general',

          formatter: row => {
            return row.status === 1 ? '未开发' : row.status === 2 ? '报名中' : '已结束'
          }
        },

      ]
      if(this.activityType===2){
        this.columnConfig.push(
          {
          prop: 'createdTs',
          label: '创建时间',
          type: 'general',
          formatter: row => {
            return dayjs(parseInt(row.createdTs)).format('YYYY-MM-DD HH:mm:ss')
          }
        }
        )
      }
              
    }
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
.table {
  overflow-y: scroll;
  height: 600px;
  margin-top: 16px;
}
</style>
