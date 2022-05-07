<template>
  <!-- 无任何数据 -->
  <div v-if="isUserEmpty" class="empty-user">
    <span class="empty-user-text">无符合条件的用户</span>
    <el-button type="primary" @click="handleClose">我知道了</el-button>
  </div>
  <div v-else>
    <!-- 搜索表单区域 -->
    <el-form
      ref="query"
      :inline="true"
      :model="query"
      label-width="80px"
      label-position="right"
      size="small"
    >
      <el-form-item label="用户ID">
        <el-input v-model="query.id" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="query.username" clearable placeholder="关键词" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="query.phone" clearable maxlength="11" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="所属商会">
        <el-select v-model="query.business" placeholder="请选择">
          <el-option label="江西商会" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索结果区域 -->
    <el-table
      class="margin-bottom"
      :data="filterTableData"
      style="width:100%;"
      stripe
      border
      header-row-class-name="tableheader"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55px" />
      <el-table-column v-for="it in tableRows" :key="it.prop" :prop="it.prop" :label="it.lable" min-width="100px" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PublisherDialog',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      query: {
        id: '',
        username: '',
        phone: '',
        business: ''
      },
      isUserEmpty: false,
      tableData: [
        // {
        //   id: 1,
        //   username: 'zs',
        //   phone: '188888',
        //   business: '云商会'
        // }
      ],
      tableRows: [ // 表格行的初始化
        { prop: 'id', lable: '用户ID' },
        { prop: 'username', lable: '用户名' },
        { prop: 'phone', lable: '手机号' },
        { prop: 'business', lable: '所属商会' }
      ],
      selectedData: []
    }
  },
  computed: {
    filterTableData() {
      const { data, tableData } = this
      if (!data.length) return tableData
      const selectedIds = data.map(v => v.id)
      return tableData.filter(v => !selectedIds.includes(v.id))
    }
  },
  created() {
    this.getData().then(() => {
      this.$emit('hideFooter', true)
      this.isUserEmpty = !this.tableData.length
    })
  },
  methods: {
    getData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.tableData = [
            { id: 1, username: 'zs', phone: '188888', business: '云商会' },
            { id: 2, username: 'zs2', phone: '1888882', business: '云商会2' }
          ]
          resolve()
        }, 100)
      })
    },
    handleConfirm() {
      const { selectedData } = this
      if (!selectedData.length) return this.$message({ message: '请选择发布者', type: 'warning' })
      this.$emit('confirm', { type: 'Publisher', data: [...selectedData] })
    },
    handleSearch() {

    },
    handleSelectionChange(e) {
      this.selectedData = e
    }
  }
}
</script>

<style scoped lang="scss">
.publisher-dialog {
  .search {
    display: flex;
  }

  .empty-user {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    &-text {
      margin-bottom: 50px;
    }
  }
}
</style>
