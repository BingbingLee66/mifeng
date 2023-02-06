<!-- MoreLabel -->
<template>
  <a-modal v-model:visible="visible" @cancel="cancel" title="查看标签" width="60%">
    <a-row class="mb20">
      <a-col span="2">会员：</a-col>
      <a-col :span="22">{{ memberName }}</a-col>
    </a-row>
    <a-row class="mb20">
      <a-col span="2">标签：</a-col>
      <a-col :span="22">
        <a-tag v-for="(item, index) in labelList" :key="index">
          {{ item.tagName }}
        </a-tag>
      </a-col>
    </a-row>
    <template #footer>
      <a-button type="primary" @click="cancel">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, watchEffect, toRefs, reactive } from 'vue'
import { closeModal } from '@/hooks/useModal'

export default defineComponent({
  props: {
    recordData: Object,
    labelType: String
  },
  setup(props) {
    const { visible, cancel } = closeModal('MoreLabel')
    const modalState = reactive({
      labelList: [],
      memberName: ''
    })
    watchEffect(() => {
      if (props.labelType && props.recordData) {
        modalState.memberName = props.recordData.uname
        switch (props.labelType) {
          case 'memberLabelList':
            modalState.labelList = props.recordData.memberLabelList || []
            break
          case 'bridgeLabels':
            modalState.labelList = props.recordData.bridgeLabels || []
            modalState.labelList.forEach(i => {
              i.tagId = i.id
              i.tagName = i.name
            })
            break
          case 'tradeBridges':
            modalState.labelList = props.recordData.tradeBridges || []
            modalState.labelList.forEach(i => {
              i.tagId = i.id
              i.tagName = i.name
            })
            break
        }
      }
    })
    return {
      visible,
      cancel,
      ...toRefs(modalState)
    }
  }
})
</script>
