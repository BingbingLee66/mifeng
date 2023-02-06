<template>
  <div v-if="visible">
    <a-modal v-model:visible="visible" @cancel="cancel" title="打标签" width="80%">
      <a-form :model="labelObj" label-width="100px" layout="inline">
        <a-form-item name="labelGroupName" label="标签组">
          <a-input v-model:value="labelObj.labelGroupName" style="width: 200px"></a-input>
        </a-form-item>
        <a-form-item name="labelName" label="标签">
          <a-input v-model:value="labelObj.labelName" style="width: 200px" />
        </a-form-item>
        <a-form-item label="">
          <a-button type="primary" @click="getLabelData(1)">搜索</a-button>
        </a-form-item>
      </a-form>
      <a-tabs v-model:activeKey="labelObj.selectType" @change="getLabelData(1)">
        <a-tab-pane tab="平台推荐" key="1"></a-tab-pane>
        <a-tab-pane tab="本会创建" key="3"></a-tab-pane>
      </a-tabs>
      <div style="width: 100%; max-height: 50vh; overflow-y: auto">
        <div v-if="lableList.length > 0">
          <a-checkbox-group v-model:value="checkValue">
            <a-row v-for="item in lableList" :key="item.id" style="width: 100%">
              <a-col :span="24" class="mt10">{{ item.name }}</a-col>
              <a-col :span="24" style="display: flex; flex-wrap: wrap">
                <label
                  :for="i.id"
                  v-for="i in item.memberLabelVOList"
                  :key="i.id"
                  class="checkbox-button"
                  :class="{ bgcolor: checkValue.indexOf(i.id) > -1 }"
                >
                  <a-checkbox :value="i.id" :id="i.id">
                    {{ i.name }}
                  </a-checkbox>
                </label>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
        <div v-else class="text-center">
          <div class="mb40 mt40">暂无数据</div>
          <a-button
            v-if="labelObj.selectType === '3'"
            @click="
              () => {
                $router.push({ path: '/member/member-tab' })
              }
            "
            >去创建</a-button
          >
        </div>
      </div>
      <div v-if="lableList.length > 0" class="mt20">
        <a-pagination
          v-model:current="pageData.currentpage"
          :total="pageData.total"
          show-less-items
          @change="handlePageChange"
        />
      </div>
      <template #footer>
        <a-button type="default" @click="cancel">取消</a-button>
        <a-button type="primary" @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { closeModal } from '@/hooks/useModal'
import Labels from '@/api/labels/labels'
import { message } from 'ant-design-vue'
export default defineComponent({
  props: {
    recordData: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    const { visible, cancel } = closeModal('AttachLabel')
    const modalState = reactive({
      labelObj: {
        labelGroupName: '',
        labelName: '',
        selectType: '1'
      },
      pageData: {
        currentpage: 1,
        limit: 10,
        total: 0
      },
      lableList: [],
      checkValue: []
    })
    const getLabelData = async page => {
      const { data } = await Labels.getLabelGroupLst({
        weightZero: false,
        freeze: 0,
        selectType: modalState.labelObj.selectType,
        labelGroupName: modalState.labelObj.labelGroupName,
        labelName: modalState.labelObj.labelName,
        pageNum: page || modalState.pageData.currentpage,
        pageSize: modalState.pageData.limit
      })
      modalState.lableList = data.list
      modalState.pageData.total = data.totalRows
    }
    const handlePageChange = (page, pageSize) => {
      modalState.pageData.currentpage = page
      modalState.pageData.limit = pageSize
      getLabelData()
    }
    const handleOk = () => {
      if (!modalState.checkValue.length) {
        message.warning('请至少选择一个标签')
      }
      emit('comfirm', modalState.checkValue)
      cancel()
    }
    watch(visible, value => {
      if (value) {
        getLabelData()
      }
    })
    return { visible, cancel, ...toRefs(modalState), getLabelData, handlePageChange, handleOk }
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
    width: max-content;
    height: 26px;
    padding: 0 7px;
    background: #fafafa;
    border: 1px solid #d9d9d9;
    flex-shrink: 0;
    margin: 10px 10px 10px 0;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.65);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    flex-shrink: 0;
  }

  .bgcolor {
    background: #ffca00;
    // border: none;
    :deep(.ant-checkbox-wrapper) {
      color: #fff;
    }
  }
}
</style>
