<template>
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8" @change="fetchTableData(true)">
    <a-tab-pane key="1" tab="文本库" />
    <a-tab-pane key="2" tab="图片库" force-render />
  </a-tabs>

  <PlusTable
    class="p-main-padding"
    row-key="edge_device_id"
    :loading="loading"
    :scroll="{ x: 'max-content' }"
    :columns="activeName === '1' ? textColumn : imgColum"
    :data-source="tableData"
    :pagination="pagination"
    @change="handleTableChange"
    bordered
  >
    <template #toolBar>
      <a-button style="margin-right: 25px" type="primary" @click="addColumn" size="large">
        {{ activeName === '1' ? '添加文本' : '添加图片' }}
      </a-button>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'id'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'img'">
        <img style="width: 70px; height: 70px; object-fit: cover" src="{{ record.content }}" />
      </template>
      <template v-if="column.key === 'createdTs'">
        <div>{{ record.creatorName }}</div>
        <div>{{ record.createdTs }}</div>
      </template>
    </template>
    <template v-if="column.key === 'handle'">
      <a-button type="link" @click="delAlbum(record)" danger> 删除 </a-button>
    </template>
  </PlusTable>
  <!-- 新增 -->
  <a-modal
    v-model:visible="visible"
    :maskClosable="false"
    :title="activeName === '1' ? '添加文本' : '添加图片'"
    @ok="handleOk"
    @cancel="onCancel"
    width="33%"
  >
    <a-input
      v-if="activeName === '1'"
      style="width: 70%; margin: 20px 0"
      v-model:value="contents"
      show-count
      :maxlength="30"
      placeholder="请输入30字内的文本"
    />

    <div class="add-img" v-if="activeName === '2'">
      <a-upload
        accept="image/*"
        :file-list="fileList"
        list-type="picture-card"
        :before-upload="handleBeforeUpload"
        class="upload-list-inline"
        @change="handleChange"
        :customRequest="customRequest"
        @preview="handlePreview"
      >
        <div v-if="fileList.length < maximum">
          <plus-outlined />
          <div class="ant-upload-text">上传图片</div>
          <div class="ant-upload-text">({{ fileList.length }}/{{ maximum }})</div>
        </div>
      </a-upload>
    </div>

    <!-- 图片预览 -->
    <a-modal width="50%" :visible="previewVisible" title="图片预览" :footer="null" @cancel="handleCancel">
      <div class="preview-box">
        <img class="previewImg" alt="example" :src="previewImage" />
      </div>
    </a-modal>
  </a-modal>
</template>

<script>
import { yshCheckInTextList, yshCheckInTextInsert, yshCheckInTextDelBatch } from '@/api/content/signIn'
import { message, Modal } from 'ant-design-vue'
import { defineComponent, ref, onMounted } from 'vue'
import { useAntTable } from './useAntTable'
import uploadRequest from './upload-request'
import { useHandleUpload } from './use-handle-upload'
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { PlusOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    PlusTable,
    PlusOutlined
  },
  setup(props) {
    const activeName = ref('1')
    const visible = ref(false)
    const contents = ref('') // 文本内容
    const maximum = ref(10) // 最多上传图片数
    const customRequest = uploadRequest
    const previewVisible = ref(false)
    const previewImage = ref('')
    const textColumn = [
      { title: '序号', key: 'id', width: 120, align: 'center' },
      { title: '文本', dataIndex: 'content', key: 'content', width: 250, align: 'center' },
      { title: '添加人 - 时间', key: 'createdTs', width: 150, align: 'center' },
      { title: '操作', key: 'handle', width: 150, align: 'center' }
    ]
    const imgColum = [
      { title: '序号', key: 'id', width: 120, align: 'center' },
      { title: '图片', key: 'img', width: 200, align: 'center' },
      { title: '添加人 - 时间', key: 'createdTs', width: 150, align: 'center' },
      { title: '操作', key: 'handle', width: 150, align: 'center' }
    ]
    const tableData = ref([]) // 表格数据

    onMounted(() => {
      fetchTableData(true)
    })

    const fetchFn = async pageOption => {
      const conditionQuery = {
        pageSize: pageOption.pageSize,
        page: pageOption.current,
        type: activeName.value // 1文本库 2图片库
      }

      const res = await yshCheckInTextList(conditionQuery)

      tableData.value = res.data ? res.data.list : []
      return {
        total: res.data ? res.data.totalRows : 0
      }
    }

    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({ fetchFn })

    const { fileList, handleChange } = useHandleUpload(props)

    const addColumn = () => {
      visible.value = true
    }

    const handleOk = async () => {
      if (activeName.value === '1' && !contents.value) return message.warning('请输入文本内容')
      if (activeName.value === '2' && !fileList.value.length) return message.warning('请上传图片')

      const params = {
        type: activeName.value, // 类型 0 未知 1文本库 2图片库
        contents: activeName.value === '1' ? contents.value : fileList.value.map(v => v.url)
      }
      const { state, msg } = await yshCheckInTextInsert(params)
      if (state === 1) {
        message.success('操作成功')
        fetchTableData(true)
        onCancel()
      } else {
        message.error(msg)
      }
    }

    // 删除
    const delAlbum = async row => {
      console.log(row)
      const ids = []
      ids.push(row.id)
      Modal.confirm({
        title: activeName.value === '1' ? '是否删除该文本' : '是否删除该图片',
        // content: '确定删除？',
        onOk: async () => {
          const { state, msg } = await yshCheckInTextDelBatch({ ids })
          if (state !== 1) return message.error(msg)
          message.success('删除成功')
          fetchTableData(true)
        }
      })
    }
    // 关闭
    const onCancel = () => {
      contents.value = ''
      fileList.value = []
      visible.value = false
    }

    /**
     * 文件上传前
     * @param file 上传的文件
     */
    const handleBeforeUpload = file => {
      const pattern = /\.(?:png|jpg|jpeg|gif)$/i
      // 判断数量
      if (fileList.value.length === maximum.value) {
        message.error(`${file.name}上传失败。最多上传2张`)
        return false
      }
      // 导入文件类型不合法
      if (!pattern.test(file.name) || !file.size) {
        message.error('请上传正确的图片文件')
        return false
      }

      if (file && file.size > 2 * 1024 * 1024) {
        message.error(`图片不能超过2M`)
        return false
      }
      return true
    }

    const handlePreview = async file => {
      previewImage.value = file.response.url
      previewVisible.value = true
    }
    const handleCancel = () => {
      previewVisible.value = false
      previewImage.value = ''
    }

    return {
      activeName,
      textColumn,
      imgColum,
      tableData,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      visible,
      contents,
      fileList,
      maximum,
      previewImage,
      previewVisible,
      customRequest,
      fetchFn,
      addColumn,
      delAlbum,
      handleOk,
      onCancel,
      handleBeforeUpload,
      handleChange,
      handlePreview,
      handleCancel
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
.add-img {
  display: flex;
  flex-wrap: wrap;
}
.upload-list-inline {
  >>> .ant-upload-list-item {
    float: left;
    width: 100%;
    height: 100%;
    margin-right: 8px;
  }
  >>> .ant-upload-animate-enter {
    animation-name: uploadAnimateInlineIn;
  }
  >>> .ant-upload-animate-leave {
    animation-name: uploadAnimateInlineOut;
  }
}
.preview-box {
  width: 100%;
  text-align: center;
  overflow-y: auto;
  object-fit: contain;
  margin-top: 10px;
  max-height: 600px;
  padding: 0 20px 20px;
}
.previewImg {
  height: 100%;
  max-width: 100%;
}
</style>
