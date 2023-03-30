<template>
  <a-tabs v-model:activeKey="tableFilter.queryType" class="bg-white pl-8">
    <a-tab-pane :key="TAB_MENUS.YSH" tab="云商会" />
    <a-tab-pane :key="TAB_MENUS.CHAMBER" tab="商协会" />
    <a-tab-pane :key="TAB_MENUS.USER" tab="用户" />
  </a-tabs>
  <AlbumList
    :tableFilter="tableFilter"
    ref="AlbumListRef"
    :tableOperations="tableOperations"
    :inheritedColumns="inheritedColumns"
  >
    <template #filterItem>
      <div class="flex-x" style="width: 1000px">
        <a-input
          v-model:value="tableFilter.albumName"
          allowClear
          style="width: 300px"
          :placeholder="isUser ? '相册名称、用户名、手机号' : `相册名称${isPlatform ? '' : '、商协会名称'}`"
        >
          <template #prefix>
            <search-outlined />
          </template>
        </a-input>
        <template v-if="!isPlatform">
          <div class="flex-x-center-center ml20">
            相册状态
            <a-select
              v-model:value="tableFilter.status"
              :options="ALBUM_TYPES_LIST"
              style="width: 300px; margin-left: 10px"
            />
          </div>
        </template>
      </div>
    </template>
  </AlbumList>
  <a-modal v-model:visible="modalData.visible" width="40%" :footer="null" title="修改数据">
    <AForm
      ref="formRef"
      :model="modalData"
      name="basic"
      :label-col="{ span: 4 }"
      autocomplete="off"
      @finish="onModifyData"
    >
      <AFormItem
        label="修改类型"
        name="updateType"
        :rules="[{ required: true, message: '修改类型不能为空', trigger: 'change' }]"
      >
        <a-select
          size="large"
          v-model:value="modalData.updateType"
          placeholder="请选择"
          :options="UPDATE_TYPE_OPTIONS"
          style="width: 200px"
        />
      </AFormItem>
      <AFormItem label="原数值" name="updateType">
        <a-button size="large" type="text" disabled>{{ sourceValue }}</a-button>
      </AFormItem>
      <AFormItem
        label="修改数值"
        name="num"
        :rules="[
          { required: true, message: '修改数值不能为空' },
          {
            validator: async (rule, value) => {
              if (sourceValue && value < sourceValue) throw '修改数值不能小于原数值'
            },
            trigger: 'change'
          }
        ]"
      >
        <a-input
          v-model:value="modalData.num"
          placeholder="请输入"
          size="large"
          :maxlength="9"
          @input="() => (modalData.num = modalData.num.replace(/[^\d]/g, ''))"
        />
      </AFormItem>
      <AFormItem :wrapper-col="{ offset: 2 }">
        <AButton size="large" @click="modalData.visible = false" class="mr10">返回</AButton>
        <AButton size="large" type="primary" html-type="submit">完成</AButton>
      </AFormItem>
    </AForm>
  </a-modal>
</template>
<script setup>
import AlbumList from '@business/components/src/album/AlbumList.vue'
import { ALBUM_TYPES_LIST, ALBUM_TYPES, UPDATE_TYPE_OPTIONS } from '@business/common/src/album/constant'
import { modifyAlbumData, changeAlbumFreezeStatus, deleteAlbum, auditAlbum } from '@business/common/src/album/api'
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Modal, Tooltip } from 'ant-design-vue'
const AlbumListRef = ref()
const TAB_MENUS = {
  YSH: '0',
  CHAMBER: '1',
  USER: '2'
}
// 记录修改数据modal
const modalData = reactive({
  visible: false,
  updateType: null, // 0-浏览数 1-浏览人数 2-下载数 3-分享数
  num: null, // 要修改的数据
  sourceData: {} // 源数据
})
const sourceValue = computed(() => {
  const { sourceData, updateType } = modalData
  const curUpdate = UPDATE_TYPE_OPTIONS[updateType] || {}
  return sourceData[curUpdate.realy]
})
const changeDialog = row => {
  modalData.visible = true
  modalData.sourceData = row
  modalData.num = null
  modalData.updateType = null
}

const router = useRouter()
const tableFilter = reactive({
  queryType: TAB_MENUS.YSH,
  albumName: '',
  status: ALBUM_TYPES.ALL
})
const isPlatform = computed(() => tableFilter.queryType === TAB_MENUS.YSH)
const isUser = computed(() => tableFilter.queryType === TAB_MENUS.USER)
const inheritedColumns = reactive([
  {
    title: '关联业务',
    width: 200,
    dataIndex: 'businessId',
    hideInTable: computed(() => isUser.value),
    customRender: ({ record }) =>
      +record.type === 2 ? (
        <div>
          活动<div style="color:#66b1ff">{record.businessId}</div>
          {record.businessName}
        </div>
      ) : (
        '-'
      )
  },
  { title: '商协会', hideInTable: computed(() => isUser.value || isPlatform.value), dataIndex: 'chamberName' },
  {
    title: '用户信息',
    hideInTable: computed(() => !isUser.value),
    customRender: ({ record: { businessImg, businessName, number } }) => (
      <div>
        <img src={businessImg} alt="" width="50" height="50" />
        <div>{businessName}</div>
        <div>{number}</div>
      </div>
    )
  },
  {
    title: '浏览量',
    dataIndex: 'browseNum',
    width: 80,
    customRender: ({ record }) => generateModifiedData(record, '0')
  },
  {
    title: '浏览人数',
    dataIndex: 'visitorsNum',
    width: 100,
    customRender: ({ record }) => generateModifiedData(record, '1')
  },
  {
    title: '下载数',
    dataIndex: 'downloadNum',
    width: 80,
    customRender: ({ record }) => generateModifiedData(record, '2')
  },
  {
    title: '分享数',
    dataIndex: 'shareNum',
    width: 80,
    customRender: ({ record }) => generateModifiedData(record, '3')
  }
])
const tableOperations = row => {
  return (
    <div>
      {isPlatform.value ? (
        <div>
          <a-button type="link" onClick={() => router.push({ path: '/album/edit', query: { id: row.id } })}>
            编辑
          </a-button>
          <a-button
            type="link"
            onClick={() => router.push({ path: '/album/detail', query: { id: row.id, type: tableFilter.queryType } })}
          >
            进入相册
          </a-button>
          <a-button style="margin-left:0" type="link" onClick={() => hideAlbum(row)}>
            {+row.auditStatus === 1 ? '隐藏' : '公开'}
          </a-button>
          <a-button type="link" danger onClick={() => delAlbum(row)}>
            删除
          </a-button>
        </div>
      ) : (
        <div>
          <a-button
            type="link"
            onClick={() => router.push({ path: '/album/detail', query: { id: row.id, type: tableFilter.queryType } })}
          >
            查看
          </a-button>
          <a-button type="link" onClick={() => toggleFreeze(row)}>
            {+row.status === 1 ? '冻结' : '解冻'}
          </a-button>
        </div>
      )}
      <a-button type="link" onClick={() => changeDialog(row)}>
        修改数据
      </a-button>
    </div>
  )
}
const generateModifiedData = (row, updateType) => {
  const { realy, fake } = UPDATE_TYPE_OPTIONS[updateType]
  if (row[realy] >= row[fake]) return row[fake]
  return (
    <div>
      <Tooltip title={`${row[realy]}`} placement="top" color="red">
        <span style="color:red;margin-right:8px;">改</span>
      </Tooltip>
      {row[fake]}
    </div>
  )
}
// 切换冻结状态
const toggleFreeze = async row => {
  const { status, id } = row
  Modal.confirm({
    title: '',
    content: status ? '是否冻结？' : '是否解冻？',
    async onOk() {
      await changeAlbumFreezeStatus({ id, status: +!status })
      row.status = +!status
    }
  })
}
const hideAlbum = async row => {
  Modal.confirm({
    title: '',
    content: row.auditStatus ? '是否隐藏？' : '是否公开？',
    async onOk() {
      await auditAlbum({ albumId: row.id, type: row.auditStatus ? 0 : 1 })
      AlbumListRef.value.fetchTableData()
    }
  })
}
const delAlbum = row => {
  Modal.confirm({
    title: '',
    content: '删除相册会一并删除里面的图片，是否删除？',
    async onOk() {
      await deleteAlbum({ albumId: row.id })
      AlbumListRef.value.fetchTableData()
    }
  })
}

// 修改数据
const onModifyData = async () => {
  const { updateType, num, sourceData } = modalData
  await modifyAlbumData({ updateType, num: +num, albumCkey: sourceData.albumCkey })
  modalData.visible = false
  modalData.sourceData[UPDATE_TYPE_OPTIONS[updateType].fake] = num
}
</script>
<style lang="scss" scoped></style>
