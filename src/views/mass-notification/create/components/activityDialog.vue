<template>
  <div style="margin-bottom: 20px">

    <el-dialog title="选择活动" :visible.sync="dialogVisible" width="75%" :before-close="submit">
      <el-form :inline="true" :model="form">
        <el-form-item v-if="(!ckey && activityType===2) || activityType===3" label="活动来源" prop="chamberName">
          <el-select v-model="origin" clearable filterable class="select" placeholder="请选择">
            <el-option v-for="item2 in chamberList" :key="item2.id" :label="item2.name" :value="activityType===2 ? item2.ckey :item2.invesKey" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动id" prop="id">
          <el-input v-model="form.id" clearable :placeholder="placeholder" />
        </el-form-item>

        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="form.activityName" clearable :placeholder="placeholder" />
        </el-form-item>

        <el-form-item label="活动状态" prop="status">
          <el-select v-model="form.status" class="select" placeholder="请选择">
            <el-option v-for="item2 in statusList" :key="item2.id" :label="item2.name" :value="item2.id" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="clickQuery">查询</el-button>
      </el-form>
      <!-- 表格 -->
      <div class="table">
        <kdTable ref="table" :column-config="columnConfig" :table-data="tableData" v-on="$listeners" @tableSelect="tableSelect" />
      </div>

      <!-- 分页  前期先不做分页-->
      <KdPagination
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
        @change="onPageChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="submit">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import kdTable from '../../components/common/kdTable.vue'
import { getActivityList } from '@/api/activity/activity'
import { getInvesActivityList } from '@/api/attract/index'
import { distributionChambers } from '@/api/mass-notification'
import { getInfoList } from '@/api/attract/index'
import dayjs from 'dayjs'
export default {
  name: 'ReceiveForm',
  components: {
    kdTable,
    KdPagination: () => import('@/components/common/KdPagination')
  },

  props: {
    // 2 普通活动 3招商活动
    activityType: {
      type: Number,
      default: 2
    },
    activityList: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {

      fullName: 'fullName',
      dialogVisible: false,
      ckey: '',
      form: {
        activityName: '',
        id: null,
        status: 0,
        chamberName: '',
        invesKey: '',
        ckey: ''
      },
      chamberList: [],
      // 表格配置
      columnConfig: [],
      // 表格数据
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,

      placeholder: '请输入',
      // 已选表格数据
      selectData: [],
      statusList: [
        { id: 0, name: '全部' },
        { id: 1, name: '待开始' },
        { id: 2, name: '进行中' },
        { id: 3, name: '已结束' },
        { id: 4, name: '报名中' }
      ]
    }
  },
  computed: {
    fullNameComputed() {
      return this.fullName + '123'
    },
    origin: {
      get() {
        return this.activityType === 2 ? this.form.ckey : this.form.invesKey
      },
      set(newValue) {
        if (this.activityType === 2) {
          this.form.ckey = newValue
        } else { this.form.invesKey = newValue }
      }

    }
  },
  watch: {
    activityType() {
      console.log('activityType', this.activityType)
      this.getChamberOptions()
    }
  },

  provide() {
    return {
      tableMsg: this
      // columnConfig: this.columnConfig,
      // tableData: this.tableData
    }
  },

  created() {
    const { ckey } = this.$store.getters
    this.ckey = ckey
    this.getChamberOptions()
    this.resetColumnConfig()
  },
  methods: {
    /** 请求 */
    // 拉取商协会数据
    async getChamberOptions() {
      let API = distributionChambers
      if (this.activityType === 3) { API = getInfoList }
      console.log('API', API)
      const { data } = await API()
      this.chamberList = data
    },
    async getActivityListFunc() {
      let api = getActivityList
      // console.log('this.activityType', this.activityType)
      if (this.activityType === 3) {
        api = getInvesActivityList
      }
      const { pageSize, pageNum: page, form } = this
      const params = { isPublish: 1,
        pageSize,
        page,
        ...form,
        isInves: false, }
      if (this.ckey && this.activityType === 2) { params.ckey = this.ckey }
      const { data } = await api(params)
      this.tableData = data.list
      this.total = data.totalRows
      this.$refs['table'].toggleSelection(this.activityList)
    },
    /** 行为操作 */
    // save() {
    //   // 点击确定按钮
    //   this.submit()
    // },
    // 点击查询
    clickQuery() {
      this.pageSize = 10
      this.pageNum = 1
      this.getActivityListFunc()
    },
    // 打开弹框
    open() {
      this.pageSize = 10
      this.pageNum = 1
      this.getActivityListFunc()
      this.dialogVisible = true
    },
    // 关闭弹框
    submit() {
      const selectData = this.$refs['table'].getSelect()
      if (selectData.length > 1) {
        this.$message.error('只能选一个活动')
      } else {
        this.dialogVisible = false
        this.$emit('addActivity', selectData)
      }
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
    onPageChange($event) {
      const { pageNum, pageSize } = $event
      this.pageNum = pageNum
      this.pageSize = pageSize || this.pageSize
      this.getActivityListFunc()
    },

    /** 工具 */
    resetColumnConfig() {
      this.columnConfig = [
        { type: 'selection', reserveSelection: true },
        {
          prop: 'id',
          label: '活动ID',
          type: 'general',
          width: 70
        },
        {
          prop: 'activeHead',
          label: '活动头图',
          width: 180,
          render: (h, scope) => {
            return (<img style="width:100px;height:80px" src={scope.row.headImage}/>)
          }
        },
        {
          prop: 'activityName',
          label: '活动名称',
          type: 'general',
          width: 180,
        },
        {
          prop: 'activeTime',
          label: '活动时间',
          width: 170,
          type: 'general',
          formatter: row => {
            return (
              dayjs(parseInt(this.activityType === 2 ? row.startTime : row.activityStartTime)).format(
                'YYYY-MM-DD HH:mm:ss'
              ) +
              '~' +
              dayjs(parseInt(this.activityType === 2 ? row.startTime : row.activityEndTime)).format(
                'YYYY-MM-DD HH:mm:ss'
              )
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
          formatter: row => {
            return this.activityType === 2 ? row.chamberName : row.invesName
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
            return row.status === 1 ? '未开始' : row.status === 2 ? '报名中' : '已结束'
          }
        }
      ]
      if (this.activityType === 2) {
        this.columnConfig.push({
          prop: 'createdTs',
          label: '创建时间',
          type: 'general',
          formatter: row => {
            return dayjs(parseInt(row.createdTs)).format('YYYY-MM-DD HH:mm:ss')
          }
        })
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
