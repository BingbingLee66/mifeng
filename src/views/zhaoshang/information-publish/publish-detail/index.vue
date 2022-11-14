<template>
  <div style="margin:20px">
    <ys-form
      :form-config="formConfig"
      :form-item="formItem"
      :form-obj="formObj"
      @query="queryData"
      @reset="resetData"
    />
    <ys-table
      :table-config="tableConfig"
      :table-column="tableColumn"
      :table-data="tableData"
      :page-data="pageData"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      @handleSortChange="handleSortChange"
    >
      <template v-slot:platformTag="row">
        <div v-if="row.data.platformTag">
          <el-tag
            v-for="item in row.data.platformTag.slice(0, 3)"
            :key="item.id"
            type="info"
            effect="plain"
            style="margin: 0 6px 6px 0"
          >
            {{ item }}
          </el-tag>
          <span
            v-if="row.data.platformTag.length > 3"
            class="text-blue"
            @click="handleMoreLabel(row.data)"
          >查看更多</span>
        </div>
      </template>
    </ys-table>
    <!-- 查看更多标签 -->
    <more-label
      :more-visible.sync="moreVisible"
      :label-data="moreData"
      :show-group-name="false"
      @close="handleCloseMore"
    />
  </div>
</template>

<script>
import { getReadDataDetail, getMemberLabelList } from '@/api/zhaoshang/statistics/activity-statistics'
import ysTable from '@/components/ys-table'
import ysForm from '@/components/ys-form'
import moreLabel from '@/components/Label/more-label'

import data from './data'
export default {
  components: {
    'ys-table': ysTable,
    'ys-form': ysForm,
    'more-label': moreLabel
  },
  data() {
    return {
      formConfig: {
        type: 'query',
        inline: true,
      },
      formObj: data.formData,
      formItem: data.formItem,
      tableColumn: data.tableColumn,
      tableData: [],
      tableConfig: {
        loading: false,
      },
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
      },
      readOrderByType: '',
      PlatformOptions: [],
      moreVisible: false,
      moreData: {}
    }
  },
  computed: {
    // eslint-disable-next-line vue/no-dupe-keys
    chamberId() {
      return this.$route.params.chamberId || ''
    }
  },
  mounted() {
    console.log('chamberId', this.chamberId)
    getMemberLabelList().then(res => {
      const memberLabelList = res.data || []
      const _memberLabelList = memberLabelList.map(item => {
        const obj = {
          value: item.id,
          label: item.name
        }
        return obj
      })
      data.formItem[1].options = _memberLabelList
    })
    this.fetchData(1)
  },
  methods: {
    async fetchData(e) {
      // 请求数据
      console.log(e)
      const params = {
        contentId: this.chamberId,
        memberStatus: this.formObj.memberStatus,
        pageSize: this.pageData.limit,
        page: e === 1 ? e : this.pageData.currentpage,
        platformTag: this.formObj.platformTag,
        readOrderByType: this.readOrderByType
      }
      const res = await getReadDataDetail(params)
      this.tableData = res.data.list
      this.pageData.total = res.data.totalRows
    },
    queryData(data) {
      this.formObj = { ...data }
      console.log(this.formObj)
      this.fetchData(1)
    },

    resetData() {
      this.formObj = { ...data.formData }
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
    // 排序
    handleSortChange(e) {
      if (e.order === 'ascending') {
        this.readOrderByType = '0'
        this.fetchData(1)
        return
      }
      if (e.order === 'descending') {
        this.readOrderByType = '1'
        this.fetchData(1)
        return
      }
    },
    handleMoreLabel(rowData) {
      const moreData = {
        name: rowData.name,
        labeList: [],
      }
      moreData.labeList = rowData.platformTag.map(item => {
        return {
          id: Math.random(),
          name: item,
        }
      })
      this.moreData = moreData
      this.moreVisible = true
    },

    handleCloseMore() {
      this.moreVisible = false
    },
  }
}
</script>

<style>

</style>
