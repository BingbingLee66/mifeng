<template>
  <div>
    <el-tabs v-model="dataSource" @tab-click="handleTabsChange">
      <el-tab-pane label="平台推荐" name="0" />
      <el-tab-pane label="商协会创建" name="1" />
      <el-tab-pane label="招商办创建" name="2" />
    </el-tabs>
    <ys-form
      :form-config="formConfig"
      :form-item="formItem"
      :form-obj="formObj"
      @query="queryData"
      @reset="resetData"
    />
    <el-row v-if="dataSource == 0">
      <el-button
        icon="el-icon-folder-add"
        size="small"
        type="success"
        @click="handleShowAdd"
      >
        创建标签组
      </el-button>
    </el-row>
    <ys-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      :page-data="pageData"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      @handleLevelCallback="handleLevelCallback"
      @handleSortChange="handleSortChange"
    >
      <template v-slot:labels="row">
        <el-tag
          v-for="item in row.data.labelList"
          :key="item.name"
          type="info"
          effect="plain"
          style="margin: 0 6px 6px 0"
        >
          {{ item.name }}
        </el-tag>
        <span
          v-if="row.data.memberLabelVOList.length > 3"
          class="text-blue"
          @click="handleMoreLabel(row.data)"
        >查看更多</span>
      </template>
      <template v-slot:operate="row">
        <div v-if="dataSource == 0">
          <span class="text-blue ml-10" @click="handleEdit(row.data)">
            编辑
          </span>
          <span class="text-red-cur" @click="handleDel(row.data)">删除</span>
          <span v-if="row.data.freeze === 0" class="text-gray">平台冻结</span>
        </div>
        <div v-if="dataSource == 1">
          <span
            v-if="row.data.collectStatus == 0 && row.data.status == 1"
            class="text-blue ml-10"
            @click="handleCollect(row.data)"
          >
            采集标签组
          </span>
          <span
            v-if="row.data.status == 1"
            class="text-red-cur ml-10"
            @click="handleFreeze('freeze', row.data)"
          >
            冻结
          </span>
          <span
            v-if="row.data.status == 2"
            class="text-green-cur ml-10"
            @click="handleFreeze('unfreeze', row.data)"
          >
            解冻
          </span>
          <el-tooltip
            v-if="row.data.status == 2"
            class="item"
            effect="dark"
            :content="row.data.frozenReasons"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div v-if="dataSource == 2">
          <span
            class="text-red-cur ml-10"
            @click="handleDel(row.data)"
          >
            删除
          </span>
          <!--           <el-tooltip
            class="item"
            effect="dark"
            content="内容不良"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip> -->
        </div>
      </template>
    </ys-table>

    <!-- 冻结 | 解冻 -->
    <el-dialog
      :title="freezeType === 'unfreeze' ? '解冻标签组' : '冻结标签组'"
      :visible.sync="freezeVisible"
      width="520px"
    >
      <div v-if="freezeType === 'unfreeze'">确定解冻该标签组吗？</div>
      <div v-else>
        <p>确定冻结该标签组吗？</p>
        <p>冻结后，会员将自动卸下标签，也无法给会员打上标签；</p>
        <p>解冻标签后会员也不会恢复原有标签；</p>
        <el-row>
          <el-input
            v-model.trim="frozenReasons"
            type="textarea"
            maxlength="30"
            show-word-limit
            rows="4"
            resize="none"
          />
        </el-row>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="freezeVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleFreezeConfirm">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 查看更多标签 -->
    <more-label
      :more-visible.sync="moreVisible"
      :label-data="moreData"
      :show-group-name="true"
      @close="handleCloseMore"
    />
    <!-- 新建标签组 -->
    <add-label-group
      ref="eleAdd"
      :add-visible.sync="addVisible"
      @close="handleCloseAdd"
      @confirm="handleConfirmAdd"
    />
    <!-- 编辑标签组 -->
    <edit-label-group
      ref="eleEdit"
      :edit-visible.sync="editVisible"
      @close="handleCloseEdit"
      @confirm="handleConfirmEdit"
    />
  </div>
</template>

<script>
import ysTable from '@/components/ys-table'
import ysForm from '@/components/ys-form'
import addLabelGroup from '@/components/Label/add-label-group'
import editLabelGroup from '@/components/Label/edit-label-group'
import moreLabel from '@/components/Label/more-label'
import data from './data'
import Labels from '@/api/labels/labels'
import { getChamberAllList } from '@/api/goods/goods'
export default {
  components: {
    'ys-table': ysTable,
    'ys-form': ysForm,
    'add-label-group': addLabelGroup,
    'edit-label-group': editLabelGroup,
    'more-label': moreLabel,
  },
  data() {
    return {
      dataSource: '0',
      // 签到设置
      formConfig: {
        labelWidth: 'auto',
        type: 'query',
        inline: true,
      },
      formObj: data.formData,
      formItem: data.formItem,
      tableConfig: {
        loading: false,
      },
      tableColumn: data.tableColumn,
      tableData: [],
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
      },
      freezeVisible: false,
      freezeType: '',
      frozenReasons: '',
      rowData: [],
      moreData: {},
      moreVisible: false,
      addVisible: false,
      editVisible: false,
      chamberList: [],
      orderByUserNum: '',
    }
  },

  watch: {
    formItem(value) {
      console.log(value)
      value[2] = value[2] ? value[2] : {}
      if (value[2].prop === 'sourceCkeyList') {
        this.formItem[2].options = this.chamberList
      }
    },
  },

  async created() {
    await this.getAllChamberList()
    this.fetchData(1)
  },
  methods: {
    async fetchData(e) {
      this.tableConfig.loading = true
      const {
        labelGroupName,
        labelName,
        collectStatus,
        sourceCkeyList,
        weightZero,
      } = this.formObj
      console.log('weightZero...', weightZero)
      this.pageData.currentpage = e === 1 ? 1 : this.pageData.currentpage
      const { currentpage, limit } = this.pageData
      const params = {
        orderByUserNum: this.orderByUserNum,
        dataSource: this.dataSource,
        selectType: this.dataSource === '0' ? 1 : this.dataSource === '1' ? 2 : 4,
        labelGroupName,
        labelName,
        collectStatus:
          collectStatus === '-1' || !collectStatus ? '' : collectStatus,
        sourceCkeyList:
          sourceCkeyList === -1 || !sourceCkeyList ? '' : sourceCkeyList,
        weightZero: weightZero === 1 ? true : weightZero === 0 ? 'false' : '',
        pageNum: currentpage,
        pageSize: limit,
      }
      const res = await Labels.getLabelGroupLst(params)
      if (res.state !== 1) return
      res.data.list.forEach(item => {
        if (item.memberLabelVOList) {
          item.labelList = item.memberLabelVOList.slice(0, 3)
        }
      })
      this.tableData = res.data.list
      this.pageData.total = res.data.totalRows
      this.tableConfig.loading = false
    },

    queryData(data) {
      this.formObj = { ...data }
      this.fetchData(1)
    },

    resetData() {
      if (this.dataSource === '0') {
        this.formObj = { ...data.formData }
      } else if (this.dataSource === '1') {
        this.formObj = { ...data.formData1 }
      } else {
        this.formObj = { ...data.formData2 }
      }
      this.fetchData(1)
    },

    handleSizeChange(val) {
      this.pageData.limit = val
      this.fetchData(1)
    },

    handleCurrentChange(val) {
      this.pageData.currentpage = val
      this.fetchData()
    },

    handleSortChange(e) {
      if (e.order === 'ascending') {
        this.orderByUserNum = 'ASC'
        this.fetchData(1)
        return
      }
      if (e.order === 'descending') {
        this.orderByUserNum = 'DESC'
        this.fetchData(1)
        return
      }
    },

    handleTabsChange() {
      if (this.dataSource === '0') {
        this.formObj = data.formData
        this.formItem = data.formItem
        this.tableColumn = data.tableColumn
      } else if (this.dataSource === '1') {
        this.formObj = data.formData1
        this.formItem = data.formItem1
        this.tableColumn = data.tableColumn1
      } else {
        this.formObj = data.formData2
        this.formItem = data.formItem2
        this.tableColumn = data.tableColumn2
      }
      this.fetchData(1)
    },

    /** 更新权重 */
    async handleLevelCallback(data, row) {
      console.log(data)
      console.log('row', row)
      const res = await Labels.updateLabelGroupWeight({
        id: row.id,
        weight: data.level,
      })
      if (res.state !== 1) return
      this.fetchData(1)
    },

    /** 查看更多标签 */
    handleMoreLabel(rowData) {
      const moreData = {
        name: rowData.name,
        labeList: [],
      }
      moreData.labeList = rowData.memberLabelVOList.map(item => {
        return {
          id: item.id,
          name: item.name,
        }
      })
      this.moreData = moreData
      this.moreVisible = true
    },

    handleCloseMore() {
      this.moreVisible = false
    },

    /** 新建标签组 */
    handleShowAdd() {
      this.$refs.eleAdd.reset()
      this.addVisible = true
    },

    handleCloseAdd() {
      this.addVisible = false
    },

    handleConfirmAdd() {
      this.addVisible = false
      this.fetchData(1)
    },

    /** 编辑标签组 */
    handleEdit(rowData) {
      this.$refs.eleEdit.setData(rowData)
      this.editVisible = true
    },

    handleCloseEdit() {
      this.editVisible = false
    },

    handleConfirmEdit() {
      this.editVisible = false
      this.fetchData(1)
    },

    /** 移除标签 */
    handleDel(rowData) {
      this.$confirm(
        '确定删除该标签组吗？删除后，会员将自动卸下标签；',
        '删除标签组',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        }
      )
        .then(async () => {
          const res = await Labels.delLabelGroup({
            ids: [rowData.id],
          })
          if (res.state === 1) {
            this.$message.success(res.msg)
            this.fetchData(1)
          }
        })
        .catch(() => {})
    },

    /** 采集标签 */
    async handleCollect(rowData) {
      const res = await Labels.labelGroupCollect({
        id: rowData.id,
        weight: rowData.weight,
      })
      if (res.state !== 1) return this.$message.error(res.msg)
      this.$message.success('采集成功，请在 平台推荐处 查看')
      this.fetchData(1)
    },

    /** 解冻|冻结标签 */
    handleFreeze(type, rowData) {
      this.frozenReasons = ''
      this.freezeType = type
      this.rowData = rowData
      this.freezeVisible = true
    },

    async handleFreezeConfirm() {
      let res
      if (this.freezeType === 'unfreeze') {
        res = await Labels.unfreezeLabelGroup({
          id: this.rowData.id,
        })
      } else {
        if (!this.frozenReasons) return this.$message.error('请输入原因')
        res = await Labels.freezeLabelGroup({
          id: this.rowData.id,
          frozenReasons: this.frozenReasons,
        })
      }
      if (res.state !== 1) return
      this.freezeVisible = false
      this.$message.success(res.msg)
      this.fetchData(1)
    },

    async getAllChamberList() {
      const res = await getChamberAllList()
      if (res.state !== 1) return
      const list = res.data.data.map(item => {
        return {
          label: item.name,
          value: item.ckey,
        }
      })
      list.unshift({ label: '全部', value: -1 })
      this.chamberList = list
    },
  },
}
</script>
