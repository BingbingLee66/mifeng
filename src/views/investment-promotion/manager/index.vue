<template>
  <div class="app-container">
    <div class="query-form">
      <el-form
        ref="query"
        :inline="true"
        :model="query"
        label-width="100px"
        label-position="right"
        size="small"
      >
        <el-form-item label="招商办名称">
          <el-input v-model.trim="query.name" clearable maxlength="16" placeholder="请输入招商办名称" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="请选择招商办状态">
            <el-option label="全部" :value="0" />
            <el-option label="正常" :value="1" />
            <el-option label="已冻结" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="地区">
          <el-cascader
            v-model="query.area"
            :options="areaOptions"
            separator="-"
            collapse-tags
            :props="{ expandTrigger: 'hover', value: 'code', label: 'name', multiple: true }"
          />
        </el-form-item>

        <el-form-item label="招商办ID">
          <el-input v-model="query.id" clearable placeholder="请输入招商办ID" />
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="query.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="small" @click.native="fetchData(true)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" @click.native="add($event)">
            新增招商办
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="id" label="招商办ID" width="120px" />
      <el-table-column label="招商办LOGO" width="140px">
        <template slot-scope="scope">
          <img
            style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              object-fit: cover;
            "
            :src="
              scope.row.systemLogo
                ? scope.row.systemLogo
                : 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/default_avatar.png'
            "
            alt=""
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="招商办名称" />
      <el-table-column label="地区">
        <template slot-scope="scope">
          {{ scope.row.province }}{{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px">
        <template slot-scope="scope">
          {{ statusMap.get(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)">详情</el-button>
          <el-button type="text" @click="edit($event, scope.row)">编辑</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)">冻结账号</el-button>
          <el-button type="text" @click="updateStatus($event, scope.row)">解冻账号</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <FormDialog
      :id="editId"
      :visible.sync="formDialogVisible"
      :area-options="areaOptions"
    />

    <DetailDialog :id="detailId" :visible.sync="detailDialogVisible" />
  </div>
</template>

<script >
import TableMixins from '@/mixins/table'
import FormDialog from '@/views/investment-promotion/manager/components/form-dialog'
import DetailDialog from '@/views/member/manager/reaudit/component/detailDialog'
import getAreaList from '@/utils/get-area-list'
import { getList, updateStatus } from '@/api/chamber/manager'

export default {
  components: { FormDialog, DetailDialog },
  mixins: [TableMixins],
  data() {
    return {
      formDialogVisible: false,
      detailDialogVisible: false,
      editId: '',
      detailId: '',

      statusMap: new Map([
        [0, '已冻结'],
        [1, '正常'],
        [3, '待邀请'],
      ]),
      areaOptions: [], // 地址选项
      // 搜索表单
      query: {
        name: null,
        status: null,
        area: [],
        id: null,
        date: null,
      },

      tableData: [],
    }
  },
  async mounted() {
    this.areaOptions = await getAreaList(3)
  },
  methods: {
    fetchData(reset) {
      if (reset) this.currentPage = 1
      this.loading = true
      // TODO 获取招商办列表
      // let {
      //   name,
      //   status,
      //   area,
      //   id,
      //   date,
      // } = this.query
      // let params = {
      //   'pageSize': this.limit,
      //   'page': this.currentPage,
      //   name,
      //   status,
      //   startTime: date ? date[0] : '',
      //   endTime: date ? date[1] : '',
      //   id,
      //   // province: area.map(v => v[0]).join(','),
      //   city: area.map(v => v[1]).join(','),
      // }
      // console.log('query', this.query)
      // getList(params).then(response => {
      //   this.tableData = response.data.data.list
      //   this.total = response.data.data.totalRows
      //   this.loading = false
      // })
    },

    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.editId = row.id
      this.formDialogVisible = true
    },

    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.detailId = row.id
      this.detailDialogVisible = true
    },

    updateStatus(e, row) {
      console.log('row', row)
      const h = this.$createElement
      let self = this
      if (row.status === 1) {
        this.$msgbox({
          title: '冻结账号',
          message: h('p', null, [
            h('div', null, '是否确定冻结该招商办的账号？'),
            h('div', null, '冻结后，该商会无法登录商会后台，但是不会影响商会在前台的显示'),
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              self.updateStatusFunc(row)
              done()
            } else {
              done()
            }
          }
        }).then(action => {
        })
      } else {
        this.updateStatusFunc(row)
      }
    },

    updateStatusFunc(row) {
      // TODO 更新招商办账号状态
      // let params = {
      //   'chamberId': row.id,
      //   'action': row.status === 0 ? 'active' : 'notactive'
      // }
      // updateStatus(params).then(response => {
      //   if (row.status === 0) {
      //     this.$message({
      //       message: '解冻成功',
      //       type: 'success'
      //     })
      //   } else {
      //     this.$message({
      //       message: '冻结成功',
      //       type: 'success'
      //     })
      //   }
      //   this.fetchData()
      // })
    },

    add() {
      this.editId = ''
      this.formDialogVisible = true
    },

  }
}
</script>

<style scoped lang="scss">

</style>
