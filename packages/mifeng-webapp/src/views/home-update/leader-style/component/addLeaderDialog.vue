<template>
  <a-modal title="新增领导" width="700px" :footer="null" @cancel="cancelModal">
    <a-form
      ref="addLeaderForm"
      :rules="rules"
      :model="leaderFormObj"
      :label-col="{ span: 4 }"
      @finish="handleAddLeaderOk"
    >
      <a-form-item label="上传图片" name="leaderImg" :rule="rules.leaderImg">
        <ImageUploader v-model:value="imgList" :limit="1" />
        <div class="input-item">建议尺寸：210x210 支持jpg、png</div>
      </a-form-item>
      <a-form-item label="领导名字" name="leaderName">
        <a-input
          v-model:value="leaderFormObj.leaderName"
          placeholder="请输入领导名字，不超过50个字符"
          show-count
          :maxlength="50"
        />
      </a-form-item>
      <a-form-item label="会内职务" name="postName">
        <a-input
          v-model:value="leaderFormObj.postName"
          placeholder="请输入会内职务，不超过15个字符"
          show-count
          :maxlength="15"
        />
      </a-form-item>
      <a-form-item label="其他身份" name="otherIdentities">
        <a-input v-model:value="leaderFormObj.otherIdentities" placeholder="请输入，多个身份请用英文逗号隔开" />
      </a-form-item>
      <a-form-item label="领导简介" name="leaderIntroduce">
        <a-textarea
          v-model:value="leaderFormObj.leaderIntroduce"
          show-count
          :maxlength="2000"
          placeholder="请输入"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="相关报道">
        <a @click="showSelectModal">请选择</a>
        <div class="article-label mt5">
          <div v-for="article in articleList" :key="article.id">
            <a-tag closable @close="removeArticle(article.id)"> {{ article.id }} {{ article.title }} </a-tag>
          </div>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
        <a-button type="primary" html-type="submit">确定</a-button>
      </a-form-item>
    </a-form>
    <a-modal v-model:visible="selectVisible" width="700px" title="内容资源" @ok="handleOkSelect">
      <div class="search-bar">
        <a-input
          allowClear
          v-model:value="keyword"
          style="width: 500px; margin-right: 20px"
          placeholder="请输入ID/标题"
        />
        <a-button type="primary" @click="onSubmit">查询</a-button>
      </div>
      <PlusTable
        class="p0"
        :row-selection="{ onChange: onSelectChange, selectedRowKeys: selectedTableRow, preserveSelectedRowKeys: true }"
        :columns="columns"
        :data-source="tableData"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      />
    </a-modal>
  </a-modal>
</template>
<script>
import { computed, watch, reactive, getCurrentInstance, defineComponent, ref, defineAsyncComponent, inject } from 'vue'
import { getChamberContentList } from '@/api/content/article'
import { useAntTable } from '@/use/useAntTable'
// import { useRowSelection } from '@/use'
import Home from '@/api/home-config/Home'

export default defineComponent({
  components: {
    PlusTable: defineAsyncComponent(() => import('@/components/plusTable/PlusTable.vue'))
  },
  props: {
    editLeader: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const ckey = inject('ckey')
    // const rowSelection = useRowSelection()
    const leaderFormObj = reactive({
      id: '',
      leaderImg: '', // 领导照片
      leaderName: '', // 领导名字
      postName: '', // 会内职务
      otherIdentities: '', // 其他身份
      leaderIntroduce: '' // 领导简介
    })
    const articleList = ref([])
    const selectedTableRow = ref([])
    const chooseTableData = ref([])
    const keyword = ref('')
    watch(
      () => props.editLeader,
      editLeader => {
        selectedTableRow.value = []
        Object.assign(leaderFormObj, {
          id: editLeader.id || '',
          leaderImg: editLeader.leaderImg || '', // 领导照片
          leaderName: editLeader.leaderName || '', // 领导名字
          postName: editLeader.postName || '', // 会内职务
          otherIdentities: editLeader.otherIdentities || '', // 其他身份
          leaderIntroduce: editLeader.leaderIntroduce || '' // 领导简介
        })
        if (!editLeader.id) articleList.value = []
        if (editLeader.yshLeaderStyleRelationVOList) {
          articleList.value = editLeader.yshLeaderStyleRelationVOList.map(i => {
            return {
              id: i.businessId,
              title: i.businessName
            }
          })
        }
      },
      { immediate: true }
    )

    const rules = reactive({
      leaderImg: [{ required: true, message: '请上传图片', trigger: 'blur' }],
      leaderName: [
        { min: 1, max: 50, message: '只限50个字以内哦', trigger: 'blur' },
        { required: true, message: '请输入领导名字', trigger: 'blur' }
      ],
      postName: [
        { min: 1, max: 15, message: '只限15个字以内哦', trigger: 'blur' },
        { required: true, message: '请输入会内职务', trigger: 'blur' }
      ]
    })
    const selectVisible = ref(false)
    const imgList = computed({
      get() {
        return leaderFormObj.leaderImg ? [{ url: leaderFormObj.leaderImg }] : []
      },
      set(imgList) {
        leaderFormObj.leaderImg = imgList.length ? imgList[0].url : ''
      }
    })
    const { proxy } = getCurrentInstance()
    const cancelModal = () => {
      proxy.$refs.addLeaderForm.resetFields()
    }
    const handleAddLeaderOk = async () => {
      const relationIds = articleList.value.map(i => i.id)
      await Home.saveLeader({
        ...leaderFormObj,
        leaderStyleRelationIdsDTOS: [{ relationIds, type: 2 }],
        ckey: ckey.value
      })
      emit('close')
    }

    const tableData = ref([])
    const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
      async fetchFn({ current, pageSize }) {
        const {
          data: { data }
        } = await getChamberContentList({
          page: current,
          pageSize,
          ckey: ckey.value,
          title: '',
          contentModuleId: 5,
          contentColumnId: -1,
          status: 1,
          column: '',
          orderType: 1,
          keyword: keyword.value
        })
        tableData.value = data.list || []
        return { total: data.totalRows || 0 }
      }
    })
    fetchTableData()
    const showSelectModal = () => {
      selectVisible.value = true
      fetchTableData()
    }
    const handleOkSelect = () => {
      articleList.value = chooseTableData.value
      selectVisible.value = false
    }
    const removeArticle = id => {
      const index = articleList.value.findIndex(i => i.id === id)
      articleList.value.splice(index, 1)
    }

    // 选中表格
    const onSelectChange = (index, row) => {
      selectedTableRow.value = index
      chooseTableData.value = row.filter(item => item !== undefined)
    }

    const onSubmit = () => {
      fetchTableData(true)
    }
    return {
      leaderFormObj,
      rules,
      cancelModal,
      handleAddLeaderOk,
      imgList,
      selectVisible,
      columns: [
        { title: '文章ID', dataIndex: 'id', width: '200px' },
        { title: '文章标题', dataIndex: 'title' }
      ],
      tableData,
      fetchTableData,
      pagination,
      handleTableChange,
      loading,
      showSelectModal,
      handleOkSelect,
      articleList,
      removeArticle,
      onSelectChange,
      selectedTableRow,
      keyword,
      onSubmit
    }
  }
})
</script>
<style lang="scss" scoped>
.article-label {
  font-size: 12px;
  max-height: 100px;
  overflow: auto;
}
.target {
  display: block;
  width: auto;
  margin-top: 5px;
}
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>
