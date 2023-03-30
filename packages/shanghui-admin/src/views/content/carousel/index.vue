<template>
  <Carousel :tableColumns="tableColumns" ref="carouselTable" />
  <InputModal
    v-model:visible="visible"
    title="编辑权重"
    label="权重"
    :defaultValue="defaultValue"
    :confirmLoading="confirmLoading"
    :rules="inputModalRules"
    @ok="handleOk"
  >
    <template v-slot:desc>
      <div>权重请控制在0-999，权重为0不在前台展示</div>
    </template>
  </InputModal>
</template>
<script setup>
import { defineAsyncComponent, ref } from 'vue'
import Carousel from '@business/components/src/carousel/index.vue'
import { useInputModal } from '@business/components/src/input-modal/hook'
import { editBannerLevel } from '@business/common/src/content/api/bannerImg'
const InputModal = defineAsyncComponent(() => import('@business/components/src/input-modal'))
const carouselTable = ref()
const { openInputModal, visible, confirmLoading, handleOk, defaultValue, inputModalRules } = useInputModal({
  async handleOk(level, { id }) {
    await editBannerLevel({ id, level })
    carouselTable.value.fetchTableData()
  },
  inputModalRules: [
    { required: true, message: '请输入权重', trigger: 'blur' },
    { pattern: /^[\d]{0,3}$/, message: '请输入0-999数字', trigger: ['blur', 'change'] }
  ]
})
const tableColumns = [
  {
    title: '权重',
    dataIndex: 'level',
    customRender: ({ record }) => {
      return (
        <div>
          <a-button type="link" onclick={() => openInputModal({ defaultValue: record.level, payload: record })}>
            {record.level}
          </a-button>
          <br />
        </div>
      )
    }
  }
]
</script>
