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
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="0" />
            <el-option label="已冻结" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="地区">
          <el-cascader
            v-model="query.area"
            :options="areaOptions"
            separator="-"
            collapse-tags
            clearable 
            :props="{ expandTrigger: 'hover', value: 'code', label: 'name', multiple: true }"
          />
        </el-form-item>

        <el-form-item label="招商办ID">
          <el-input v-model="query.invesKey" clearable placeholder="请输入招商办ID" />
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="query.date"
            format="yyyy-MM-dd"
            value-format="timestamp"
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
      <el-table-column align="center" center prop="id" label="招商办ID" width="120px" />
      <el-table-column align="center" label="招商办LOGO" width="140px">
        <template slot-scope="scope">
          <img
            style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              object-fit: cover;
            "
            :src="
              scope.row.logoUrl
                ? scope.row.logoUrl
                : 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/default_avatar.png'
            "
            alt=""
          >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="招商办名称" />
      <el-table-column align="center" prop="contactUser" label="联系人姓名" />
      <el-table-column align="center" prop="contactPhone" label="联系人手机" />
      <el-table-column align="center" label="地区">
        <template slot-scope="scope">
          {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="150px">
        <template slot-scope="scope">
          {{ statusMap.get(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)">详情</el-button>
          <el-button type="text" @click="edit($event, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 0"  type="text" @click="updateStatus($event, scope.row)">冻结</el-button>
          <el-button v-else type="text" @click="updateStatus($event, scope.row)">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top:20px"
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
      ref="FormDialog"
      :area-options="areaOptions"
      @fetchData="fetchData(true)"
    />

    <DetailDialog :id="detailId" :visible.sync="detailDialogVisible" />
  </div>
</template>

<script >
import TableMixins from '@/mixins/table'
import FormDialog from '@/views/zhaoshang/investment-promotion/manager/components/form-dialog'
import DetailDialog from '@/views/zhaoshang/investment-promotion/manager/components/detail-dialog'
import getAreaList from '@/utils/get-area-list'
import { getPageList,getInfoFreeze,getInfoUnFreeze } from '@/api/attract'

export default {
  components: { FormDialog, DetailDialog },
  mixins: [TableMixins],
  data() {
    return {
      detailDialogVisible: false,
      detailId: null,

      statusMap: new Map([
        [0, '正常'],
        [1, '已冻结'],
      ]),
      areaOptions: [], // 地址选项
      // 搜索表单
      query: {
        name: null, // 招商办名称
        status: null, // 状态 -1全部 0正常 1冻结
        area: [],
        invesKey: null, // 招商办id
        date: null, 
      },
      currentpage: 1,
      limit: 10,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      loading:false,
      tableData: [], // 列表数据
    }
  },
  async mounted() {
    this.areaOptions = await getAreaList(3)
    this.fetchData()
  },
  methods: {
    // 获取列表接口数据
    fetchData(reset) {
      if (reset) this.currentPage = 1
      this.loading = true
      // TODO 获取招商办列表
      let {
        name,
        status,
        area,
        invesKey,
        date,
      } = this.query
    
      let arr = []
      arr = area.map(v=> v)
      
      let params = {
        'pageSize': this.limit,
        'page': this.currentPage,
        name,
        status,
        startCreatedTs: date ? date[0] : '',
        endCreatedTs: date ? date[1] : '',
        invesKey,  // 招商办id
        areaCode: [...new Set(arr)].join(','),
      }
  
      getPageList(params).then(response => {
        this.tableData = response.data.list
        this.total = response.data.totalRows
        this.loading = false
      })
    },
    //  编辑
    edit(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$refs.FormDialog.show(row.id)
    },
    // 详情
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.detailId = row.id
      this.detailDialogVisible = true
    },

    updateStatus(e, row) {
      const h = this.$createElement
      let self = this
      if (row.status === 0) {
        this.$msgbox({
          title: '冻结账号',
          message: h('p', null, [
            h('div', null, '是否确定冻结该招商办的账号？'),
            h('div', null, '冻结后，该招商办无法登录招商办后台，但是不会影响招商办在前台的显示'),
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
        getInfoUnFreeze(row.id).then((res)=>{
          this.$message({
            message: '解冻成功',
            type: 'success'
          })
          this.fetchData()
        })

      }
    },

    updateStatusFunc(row) {
      // TODO 更新招商办账号状态
      getInfoFreeze(row.id).then(response => {
        this.$message({
          message: '冻结成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    //  新增招商办
    add() {
      this.$refs.FormDialog.show()
    },

    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
        this.currentpage = val
        this.fetchData()
    },

  },
  watch:{
    //  监听多选地区
    'query.area':function(newData, oldData){
      if (newData.length > 5) {
        this.$message({
          message: '最多只支持选择3项',
          duration: 1500,
          type: 'warning'
        })
        this.$nextTick(() => {
          this.query.area= newData.slice(0,3);
        })
      }

    }
  }

}
</script>

<style scoped lang="scss">

</style>
