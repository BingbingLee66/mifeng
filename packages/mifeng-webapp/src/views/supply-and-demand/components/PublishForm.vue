<template>
  <Panel class="publish-form">
    <AForm ref="formRef" :model="formState" name="basic" :label-col="{ span: 3 }" autocomplete="off">
      <AFormItem label="发布者:" required>
        <a-button :disabled="isEdit" size="large" class="warningBtn" @click="showModal('Publisher')">
          <template #icon><edit-outlined /></template>选择发布者
        </a-button>
        <span class="tips">仅可选择一位发布者，重选后，新选择的发布者将会替换已选发布者</span>
      </AFormItem>
      <ATable
        :dataSource="formState.publisherList"
        :columns="tableCols"
        style="width: 846px; margin-left: 20px; margin-bottom: 10px"
        :scroll="{ x: 'max-content' }"
        bordered
        :pagination="false"
      >
        <template #emptyText> 请选择发布者 </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <div v-if="isEdit">--</div>
            <a-button v-else type="link" size="small" @click.prevent="deleteRow(record)"> 移除 </a-button>
          </template>
        </template>
      </ATable>

      <AFormItem label="供需类型:" required>
        <a-radio-group v-model:value="formState.tarType">
          <a-radio :value="1">供应</a-radio>
          <a-radio :value="2">需求</a-radio>
        </a-radio-group>
      </AFormItem>

      <AFormItem label="供需标签:" required>
        <LableList
          :list="formState.supplyLableList"
          limit="5"
          @click="showModal('SupplyLable')"
          @delete="handleLableDelete"
        >
          <shopping-outlined />
          请选择标签
        </LableList>
      </AFormItem>

      <AFormItem label="行业标签:" required>
        <a-spin :spinning="!industryTreeData">
          <a-tree-select
            v-model:value="formState.industryLableList"
            size="large"
            show-search
            style="width: 60%"
            placeholder="请选择行业"
            multiple
            allow-clear
            treeCheckable
            :dropdown-style="{ maxHeight: '600px', overflow: 'auto' }"
            :tree-data="industryTreeData"
            :field-names="{
              children: 'subList',
              label: 'typeName',
              value: 'id'
            }"
            @change="industrySelectChange"
            :filterTreeNode="
              (input, option) => {
                return option.typeName.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            "
          ></a-tree-select>
        </a-spin>

        <span class="tips">(提示最多选择3个，已选{{ formState.industryLableList.length }}个)</span>
      </AFormItem>
      <AFormItem label="发布者常驻地:" required>
        <a-spin :spinning="!areaTreeData">
          <a-tree-select
            v-model:value="formState.publisherStationList"
            size="large"
            show-search
            style="width: 60%"
            placeholder="请选择常驻地"
            allow-clear
            :dropdown-style="{ maxHeight: '600px', overflow: 'auto' }"
            :tree-data="areaTreeData"
            :field-names="{
              children: 'children',
              label: 'name',
              value: 'fullCode'
            }"
            treeCheckable
            @change="stationSelectChange"
            :filterTreeNode="
              (input, option) => {
                return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            "
          ></a-tree-select>
        </a-spin>

        <span class="tips">(提示最多选择1个)</span>
      </AFormItem>
      <AFormItem label="有效时间:" required>
        <a-radio-group v-model:value="formState.validType">
          <a-radio :value="1">长期有效</a-radio>
          <a-radio :value="2">自定义时间</a-radio>
        </a-radio-group>
        <a-date-picker
          v-model:value="formState.date"
          placeholder="请选择日期时间"
          v-if="formState.validType === 2"
          show-time
          valueFormat="YYYY-MM-DDTHH:mm:ss"
          :disabledDate="disabledDate"
        />
      </AFormItem>
      <AFormItem label="供需标题:" required>
        <a-input v-model:value="formState.title" clearable show-count :maxlength="40" style="width: 60%" />
      </AFormItem>
      <AFormItem label="供需内容:" required>
        <WangEditor
          :hidden-menu="true"
          :height="200"
          v-model:content="formState.content"
          :contentNumber="2000"
          placeholder="请勿发布违法违规、泄露隐私、恶意竞争等信息，详细描述需求，获得更多牛人的意向合作"
          @textNumber="contentNumber = $event"
        />
        <div class="textNumber" :class="{ red: contentNumber > 2000 }">{{ contentNumber }} / 2000</div>
      </AFormItem>
      <!-- 图片视频上传插入位 -->
      <slot />
      <AFormItem :wrapper-col="{ offset: 2 }">
        <AButton size="large" @click="$router.push('/management')" style="margin-right: 20px">取消</AButton>
        <AButton size="large" :loading="submitLoading" type="primary" @click="onSubmit">{{
          isEdit ? '确定' : '发布'
        }}</AButton>
      </AFormItem>
    </AForm>
    <a-modal v-model:visible="modalData.visible" :title="modalData.title" width="60%" forceRender>
      <template #footer>
        <div v-if="modalData.showFooter">
          <a-button key="back" @click="modalData.visible = false">取消</a-button>
          <a-button key="submit" type="primary" @click="$refs.modalCRef.handleConfirm()">确认</a-button>
        </div>
      </template>
      <component
        :is="modalData.type"
        ref="modalCRef"
        :data="modalData.data"
        @confirm="onModalConfirm"
        @close="modalData.visible = false"
      />
    </a-modal>
  </Panel>
</template>
<script>
import { defineComponent, inject, watch, reactive, ref } from 'vue'
import { useFetchDetail } from '../use/useFetchDetail'
import { useSubmitInfoForm } from '../use/useSubmit'
import dayjs from 'dayjs'
import { Modal, Message } from 'ant-design-vue'

import Publisher from /* webpackChunkName: "Publisher" */ './Publisher.vue'
import SupplyLable from /* webpackChunkName: 'SupplyLable' */ './SupplyLable.vue'
import LableList from /* webpackChunkName: 'LableList' */ './LableList.vue'
import WangEditor from '@/components/WangEditor/index'
import { getTradeLabelList } from '@/api/lable'
import { getAreaTree } from '@/api/area'
import { getChamberList } from '@/api/content/article'
const modalTitleMap = {
  Publisher: '添加发布者',
  SupplyLable: '供需标签'
}
export default defineComponent({
  name: 'PublishForm',
  components: {
    Publisher,
    SupplyLable,
    LableList,
    WangEditor
  },

  props: {
    detail: {
      type: Object,
      default: null
    }
  },

  setup(props) {
    const modalCRef = ref()
    const ckey = inject('ckey')
    const formState = ref({
      content: '',
      tarType: null,
      validType: 1,
      title: '',
      publisherList: [],
      supplyLableList: [],
      industryLableList: [],
      publisherStationList: [],
      date: null
    })
    const { isEdit } = useFetchDetail(formState, props.detail)
    const { handleSubmit, submitLoading } = useSubmitInfoForm(formState)
    const modalData = reactive({
      visible: false,
      title: '',
      showFooter: true,
      type: 'Publisher',
      data: []
    })
    const industryTreeData = ref()
    const areaTreeData = ref()
    const contentNumber = ref(0)
    const tableCols = [
      {
        title: '用户ID',
        dataIndex: 'wxUserId',
        width: 100
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 100
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: 100
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 80
      }
    ]
    // 序列化字段
    const normalizeField = type => {
      return type[0].toLocaleLowerCase() + type.slice(1) + 'List'
    }

    const getIndustryTreeData = async () => {
      try {
        const { data = [] } = await getTradeLabelList()
        industryTreeData.value = data
      } catch (error) {
        /*  */
        Message.error('获取行业数据失败，请刷新重试')
      }
    }
    const getAreaTreeData = async () => {
      try {
        const { data = [] } = await getAreaTree()
        data.forEach(province => {
          province.fullCode = province.code
          province.children &&
            province.children.forEach(city => {
              city.fullCode = `${city.code}-${province.code}`
              delete city.children
            })
        })
        areaTreeData.value = data
      } catch (error) {
        /*  */
        Message.error('获取地区数据失败，请刷新重试')
      }
    }

    const deleteRow = row => {
      Modal.confirm({
        content: '确认移除所选发布者吗？',
        title: '提示',
        onOk() {
          const index = formState.value.publisherList.findIndex(v => v.id === row.id)
          formState.value.publisherList.splice(index, 1)
        }
      })
    }
    // 弹窗显示
    const showModal = type => {
      modalData.title = modalTitleMap[type]
      modalData.showFooter = true
      modalData.visible = true
      modalData.data = formState.value[normalizeField(type)]
      if (modalData.type !== type) {
        modalData.type = type
      }
      modalCRef.value.initData && modalCRef.value.initData()
    }

    // 弹窗确认
    const onModalConfirm = ({ type, data }) => {
      modalData.visible = false
      modalData.data = formState.value[normalizeField(type)] = data
    }

    // 移除标签
    const handleLableDelete = ({ list, index }) => {
      list.splice(index, 1)
    }
    const disabledDate = current => {
      return current.diff(dayjs(), 'days') < 0
    }
    // 行业标签选择
    const industrySelectChange = () => {
      if (formState.value.industryLableList.length > 3) {
        Message.error('行业标签最多选3个')
        formState.value.industryLableList = formState.value.industryLableList.slice(0, 3)
      }
    }
    // 常住地标签选择
    const stationSelectChange = () => {
      const n = formState.value.publisherStationList.length
      if (n > 1) {
        Message.error('常住地最多选1个')
        formState.value.publisherStationList = formState.value.publisherStationList.slice(n - 1)
      }
    }

    const onSubmit = () => {
      if (!formState.value.publisherList.length) return Message.warning('请选择发布者')
      if (!formState.value.tarType) return Message.warning('请选择类型')
      if (!formState.value.supplyLableList.length) return Message.warning('请选择供需标签')
      if (!formState.value.industryLableList.length) return Message.warning('请选择行业标签')
      if (!formState.value.publisherStationList.length) return Message.warning('请选择发布者常驻地')
      if (formState.value.validType === 2 && !formState.value.date) return Message.warning('请选择自定义时间')
      if (!formState.value.title) return Message.warning('请填写标题')
      if (!formState.value.content) return Message.warning('请填写内容')
      if (contentNumber.value > 2000) return Message.warning('内容超出2000字')
      handleSubmit(isEdit.value)
    }
    // 获取商会列表
    const getChamberListData = async wxUserId => {
      const { data = [] } = await getChamberList(wxUserId)
      formState.value.chamberIds = data.filter(v => v.ckey === ckey.value).map(item => item.id)
    }
    watch(
      () => formState.value.publisherList,
      ([publisher]) => {
        if (publisher) {
          getChamberListData(publisher.wxUserId)
        }
      }
    )
    getAreaTreeData()
    getIndustryTreeData()
    return {
      formState,
      tableCols,
      deleteRow,
      showModal,
      modalData,
      isEdit,
      onModalConfirm,
      modalCRef,
      disabledDate,
      handleLableDelete,
      industryTreeData,
      areaTreeData,
      industrySelectChange,
      stationSelectChange,
      contentNumber,
      onSubmit,
      submitLoading
    }
  }
})
</script>

<style lang="scss" scoped>
.publish-form {
  min-width: 1000px;

  .margin-bottom {
    margin-bottom: 20px;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #f2f2f2;
    text-indent: 20px;
  }
  .tips {
    color: #bbb;
    margin-left: 10px;
  }

  .association-sync {
    margin-top: 40px;
    width: 80%;
    border: 1px solid #d7d7d7;
    padding: 10px;
    line-height: 1.15;
    .association-sync-title {
      padding: 10px 0;
    }

    .lable-icon {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 16px;
      color: #14c468;
    }
    .lable-icon:hover {
      font-size: 18px;
    }

    .association-selected {
      color: #409eff;

      &.disable {
        color: #666;
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    padding: 20px 0;
    margin-bottom: 20px;
  }

  .textNumber {
    width: 900px;
    text-align: right;
    margin-top: 4px;
  }
}
.red {
  color: red;
}
.warningBtn {
  color: #e6a23c;
  background: #fdf6ec;
  border-color: #f5dab1;
}
.warningBtn:hover {
  background: #e6a23c;
  border-color: #e6a23c;
  color: #fff;
}
</style>
