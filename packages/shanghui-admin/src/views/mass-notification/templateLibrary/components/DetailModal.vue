<template>
  <a-modal
    v-model:visible="visible"
    width="80%"
    title="详情"
    @ok="handleOk"
    @cancel="handleCancel"
    :cancel-button-props="{ style: { display: 'none' } }"
    okText="我知道了"
  >
    <div class="flex">
      <Preview :infoData="detail" :type="type" :active="active" class="w-2/4 flex-shrink-0"></Preview>
      <div>
        <DetailList :list="list" />
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import { computed, watch, ref } from 'vue'
import DetailList from './DetailList.vue'
import { DETAIL_TYPE, DETAIL_LIST_SHOW_DATA } from '@/constant/mass-Template'
import { SYNC_CHANNELS_TYPE } from '@/constant/mass-notification'
import Preview from '@business/components/src/mass-notification/templateLibrary/components/Preview.vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  detail: {
    type: Object,
    default: () => {}
  },
  active: {
    type: Number,
    default: DETAIL_TYPE.TEMPLATE_LIBRARY
  },
  type: {
    type: Number,
    default: SYNC_CHANNELS_TYPE.TEXT_MESSAGE
  }
})

const emit = defineEmits(['update:visible', 'handleOk', 'handleCancel'])

const visible = computed({
  get: () => props.visible,
  set: () => emit('update:visible')
})

const list = ref([])

watch(
  () => props.detail,
  newValue => {
    // 兼容
    if (props.type === SYNC_CHANNELS_TYPE.APP && props.active === DETAIL_TYPE.TEMPLATE_SETTING) {
      newValue.type = 'templateSet_APP'
    }
    list.value = DETAIL_LIST_SHOW_DATA.get(newValue.type).map(item => {
      let value = newValue[item.key]
      if (item.customRender && typeof item.customRender === 'function') {
        value = item.customRender(newValue[item.key])
      }
      return {
        label: item.label,
        value
      }
    })
  }
)

const handleOk = () => {
  emit('handleOk')
}

const handleCancel = () => {
  emit('handleCancel')
}
</script>
