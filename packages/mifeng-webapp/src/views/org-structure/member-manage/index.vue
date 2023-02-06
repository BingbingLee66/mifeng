<template>
  <Panel>
    <div class="member_manager_container">
      <div class="menu_tree">
        <div class="search_wrap">
          <a-input v-model:value="filterInfo.memberName" placeholder="搜索人员用户名、姓名、联系人姓名、企业名称">
            <template #prefix> <search-outlined /> </template
          ></a-input>
        </div>
        <div v-show="showFlag" ref="searchBox" class="search-result">
          <div class="member-list">
            <div v-if="searchResult.length > 0">
              <div v-for="item in searchResult" :key="item.id" class="member-item" @click="goDetail(item)">
                <user-outlined />
                <div class="name">{{ isPersonal(item.type) ? item.name : item.contactName }}</div>
              </div>
              <div v-show="showMore" style="text-align: center">
                <a-button type="link" size="small" @click="loadMore">查看更多</a-button>
              </div>
            </div>
            <div v-else>未搜索到相关成员，换个词试试。</div>
          </div>
        </div>
        <div v-show="!showFlag" class="department-list">
          <a-tree :tree-data="departmentTree" :fieldNames="replaceFields" @select="handleNodeClick">
            <template #title="{ departmentName, peopleCount }">
              <span class="department-text"> {{ departmentName }}({{ peopleCount }}) </span>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="content_wrap">
        <div class="name">{{ departmentName }}</div>
        <div class="content_item operation">
          <div class="ico"><user-outlined />成员</div>
          <div class="content_button">
            <a-button type="primary" @click="add"><plus-outlined />添加成员</a-button>
            <a-button @click="handleOpenAdjustDialog">调整部门</a-button>
            <a-button @click="invite">邀请成员加入</a-button>
          </div>
        </div>
        <div class="content_item table_wrap">
          <a-table
            :loading="loading"
            :dataSource="tableData"
            :columns="cols"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="{ x: 'max-content' }"
            rowKey="id"
            :row-selection="{ selectedRowKeys, onChange, preserveSelectedRowKeys: true }"
          >
          </a-table>
        </div>
      </div>
    </div>
  </Panel>
  <a-modal v-model:visible="showDialog" title="调整部门" okText="保存" @ok="save">
    <a-form-item name="选择部门：">
      <a-cascader
        v-model:value="filterInfo.departmentCas"
        :options="departmentOptions"
        allowClear
        expand-trigger="hover"
        placeholder="请选择部门"
        change-on-select
        :field-names="{ value: 'id', label: 'departmentName', children: 'departmentRespList' }"
      />
    </a-form-item>
  </a-modal>
</template>
<script>
import { inject, reactive, ref, getCurrentInstance, watch } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { getDepartmentList, getMemberList, updateDepartment } from '@/api/org-structure/org'
import { useRouter } from 'vue-router'
export default {
  components: {},
  setup() {
    const menuData = menu()
    return {
      ...menuData,
      replaceFields: { key: 'id', children: 'departmentRespList', title: 'departmentName' }
    }
  }
}
function menu() {
  const showFlag = ref(false)
  const ckey = inject('ckey')
  const departmentOptions = ref([])
  const departmentTree = ref([])
  const departmentName = ref('')
  const isPersonal = type => {
    return type === 0
  }
  const getList = async () => {
    const params = {
      ckey: ckey.value,
      parentId: 0
    }
    const {
      data: { data }
    } = await getDepartmentList(params)
    // 深拷贝数组
    if (data) {
      // const { data } = res.data
      departmentOptions.value = data
      departmentTree.value = data
      const firstDepartment = departmentTree.value[0]
      const data2 = {
        departmentName: firstDepartment.name,
        peopleCount: firstDepartment.count,
        id: '0'
      }
      departmentTree.value[0] = { ...firstDepartment, ...data2 }
      departmentName.value = firstDepartment.name
      fetchTableData()
    }
  }
  getList()
  const handleNodeClick = (selectedKeys, e) => {
    const { node } = e
    filterInfo.departmentId = node.id
    filterInfo.isTopStructure = filterInfo.departmentId === '0'
    departmentName.value = node.departmentName
    filterInfo.allParentId = node.allParentId ? (node.parentId !== 0 ? node.allParentId : node.id) : ''
    // 点击更换部门时将之前选择的都情况
    selectedRowKeys.value = []
    fetchTableData()
  }
  const filterInfo = reactive({
    departmentId: '0',
    memberName: '',
    allParentId: '',
    page: 1,
    totalPages: 1,
    departmentCas: [],
    isTopStructure: true
  })
  watch(
    () => filterInfo.memberName,
    () => {
      if (filterInfo.memberName.length > 0) {
        search()
        showFlag.value = true
      } else {
        showFlag.value = false
      }
    }
  )
  const searchResult = ref([])
  const showMore = ref(false)
  const search = async () => {
    const params = {
      ckey: ckey.value,
      departmentId: 0,
      memberName: filterInfo.memberName,
      page: filterInfo.page,
      pageSize: 20
    }
    const { data } = await getMemberList(params)
    if (Object.keys(data).length) {
      const { page: listData } = data
      filterInfo.totalPages = listData.totalPages || 0
      if (filterInfo.totalPages === 1) {
        showMore.value = false
      } else {
        showMore.value = true
      }
      if (filterInfo.page === 1) {
        searchResult.value = listData.list
      } else {
        searchResult.value.push(...listData.list)
      }
    }
  }
  const loadMore = () => {
    filterInfo.page += 1
    if (filterInfo.page === filterInfo.totalPages) {
      showMore.value = false
    } else {
      showMore.value = true
    }
    search()
  }
  const router = useRouter()
  const goDetail = item => {
    const { id: memberId, wxUserId: userId } = item
    router.push({
      name: '会员详情',
      params: { memberId, userId }
    })
  }
  const add = () => {
    router.push({
      path: '/member/add',
      query: {
        sign: 'org-member',
        allParentId: filterInfo.allParentId
      }
    })
  }
  const { proxy } = getCurrentInstance()
  const showDialog = ref(false)
  const handleOpenAdjustDialog = () => {
    if (selectedRowKeys.value.length === 0) return proxy.$message.error('请先选择部门成员')
    let casData = [filterInfo.departmentId]
    if (filterInfo.allParentId) {
      casData = filterInfo.allParentId.split(',')
      if (casData.indexOf(filterInfo.departmentId) === -1) {
        casData.push(filterInfo.departmentId)
      }
    }
    filterInfo.departmentCas = casData
    showDialog.value = true
  }
  const save = async () => {
    const params = {
      finalDepartmentId: filterInfo.departmentCas[filterInfo.departmentCas.length - 1], // 调整后的部门
      firstDepartmentId: filterInfo.departmentId, // 调整前的部门
      memberIds: selectedRowKeys.value.join(',')
    }
    const { state } = await updateDepartment(params)
    if (state === 1) {
      showDialog.value = false
      fetchTableData()
      getList()
    }
  }
  const invite = () => {
    if (filterInfo.isTopStructure) {
      router.push({
        path: '/sys/member/qrcode'
      })
    } else {
      router.push({
        path: '/org-structure/invite-member',
        query: {
          departmentId: filterInfo.departmentId
        }
      })
    }
  }
  const tableData = ref([])
  const cols = [
    {
      title: '用户名',
      dataIndex: 'uname',
      customRender: ({ record }) => {
        return record.uname || '-'
      }
    },
    {
      title: '姓名/联系人姓名',
      dataIndex: 'type',
      customRender: ({ record }) => {
        return isPersonal(record.type) ? record.name : record.contactName
      }
    },
    {
      title: '企业/团体名称',
      dataIndex: 'companyName',
      customRender: ({ record }) => {
        return record.companyName || '-'
      }
    },
    {
      title: '入会类型',
      dataIndex: 'type',
      customRender: ({ record }) => {
        return isPersonal(record.type) ? '个人入会' : '企业/团体入会'
      }
    },
    {
      title: '会内职位',
      dataIndex: 'postName',
      customRender: ({ record }) => {
        return record.postName || '-'
      }
    },
    {
      title: '手机号/联系人电话',
      dataIndex: 'phone',
      customRender: ({ record }) => {
        let phone = '-'
        if (isPersonal(record.type) && record.phone) {
          phone = record.phone
        } else if (!isPersonal(record.type) && record.contactPhone) {
          phone = record.contactPhone
        }
        return phone
      }
    }
  ]
  const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
    fetchFn: async pageOption => {
      const condition = {
        pageSize: pageOption.pageSize,
        page: pageOption.current,
        ckey: ckey.value,
        departmentId: filterInfo.departmentId,
        memberName: filterInfo.memberName
      }
      const { data, state } = await getMemberList(condition)
      let total = 0
      if (state === 1 && Object.keys(data).length) {
        total = data.page.totalRows
        tableData.value = data.page.list
      } else {
        tableData.value = []
      }
      // selectedRowKeys.value = []
      return {
        total
      }
    }
  })
  const selectedRowKeys = ref([])
  const onChange = selected => {
    selectedRowKeys.value = selected
  }
  return {
    filterInfo,
    cols,
    loading,
    handleTableChange,
    pagination,
    showFlag,
    tableData,
    departmentTree,
    departmentName,
    handleNodeClick,
    onChange,
    selectedRowKeys,
    searchResult,
    showMore,
    loadMore,
    goDetail,
    add,
    invite,
    handleOpenAdjustDialog,
    showDialog,
    departmentOptions,
    save,
    isPersonal
  }
}
</script>

<style lang="scss">
.member_manager_container {
  width: 100%;
  display: flex;
  background: #fff;
  .menu_tree {
    width: 30%;
    .search_wrap {
      padding: 20px 10px;
      background: rgba(245, 245, 245, 0.5);
    }
    .department-list {
      height: calc(100vh - 165px);
      overflow-y: auto;
      .department-text {
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .search-result {
      height: calc(100vh - 170px);
      overflow-y: auto;
      background: rgba(245, 245, 245, 0.5);
      .member-list {
        padding: 0 20px;
        .member-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 10px 0;
          cursor: pointer;
          border-bottom: 1px solid #ebeef5;

          &:hover {
            background: rgba(245, 245, 245, 0.8);
          }

          .name {
            margin-left: 5px;
          }

          .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #fcc;
            margin-right: 20px;
          }
        }
      }
    }
    .ant-tree-list-holder-inner {
      background: rgba(245, 245, 245, 0.5);
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      font-size: 24px;
      color: #000;
    }
  }

  .content_wrap {
    width: 70%;
    padding: 20px;
    .name {
      font-size: 22px;
      color: #000;
    }

    .ico {
      font-size: 18px;
    }

    .operation {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .content_item {
      margin-top: 30px;
    }
  }

  .adjust_dialog {
    .from_wrap {
      .from_item {
        display: flex;
        align-items: center;
        margin-bottom: 40px;

        .from_item_label {
          width: 80px;
        }
      }
    }
  }
  .ant-btn {
    margin-left: 20px;
  }
}
.content_button {
  .ant-btn {
    color: #fff;
    &:nth-child(2) {
      background: #e6a234;
    }
    &:nth-child(3) {
      background: #67c43a;
    }
  }
}
</style>
