<!-- RemoveLabel -->
<template>
  <a-modal v-model:visible="visible" @cancel="cancel" title="移除标签" width="60%">
    <a-row class="mb20">
      <a-col :span="2">会员：</a-col>
      <a-col :span="22">{{ memberName }}</a-col>
    </a-row>
    <a-row class="mb20">
      <a-col :span="2">标签：</a-col>
      <a-col :span="22">
        <a-checkbox-group v-model:value="checkValue" style="width: 100%">
          <label
            :for="item.tagId"
            v-for="(item, index) in memberLabelList"
            :key="index"
            class="checkbox-button"
            :class="{ bgcolor: checkValue.indexOf(item.tagId) > -1 }"
          >
            <a-checkbox :value="item.tagId" :id="item.tagId">
              {{ item.tagName }}
            </a-checkbox>
          </label>
        </a-checkbox-group>
      </a-col>
    </a-row>
    <template #footer>
      <a-button type="default" @click="cancel">取消</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, watchEffect, toRefs, reactive } from 'vue'
import { closeModal } from '@/hooks/useModal'
import Labels from '@/api/labels/labels'

export default defineComponent({
  props: {
    recordData: Object
  },
  setup(props, { emit }) {
    const { visible, cancel } = closeModal('RemoveLabel')
    const modalState = reactive({
      wxUserId: '',
      checkValue: [],
      memberLabelList: [],
      memberName: ''
    })
    watchEffect(() => {
      if (props.recordData) {
        modalState.memberLabelList = props.recordData.memberLabelList || []
        modalState.memberName = props.recordData.uname
        modalState.wxUserId = props.recordData.wxUserId
      }
    })
    const handleOk = () => {
      Labels.removeLabel(modalState.wxUserId, modalState.checkValue.join(',')).then(() => {
        cancel()
        emit('comfirm')
      })
    }
    return {
      visible,
      cancel,
      ...toRefs(modalState),
      handleOk
    }
  }
})
</script>

<style lang="scss" scoped>
.ant-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  :deep(.ant-checkbox) {
    display: none;
  }
  .checkbox-button {
    width: auto;
    height: 26px;
    padding: 0 7px;
    background: #fafafa;
    border: 1px solid #d9d9d9;
    flex-shrink: 0;
    margin: 0 10px 10px 0;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.65);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  }

  .bgcolor {
    background: #ffca00;
    border: none;
    :deep(.ant-checkbox-wrapper) {
      color: #fff;
    }
  }
}
</style>
