<template>
  <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
    <a-form-item label="报名方式：">
      <a-radio-group v-model:value="formState.signType">
        <a-radio :disabled="status === 2 || status === 3" :value="0">自定义报名表</a-radio>
        <a-radio :disabled="status === 2 || status === 3" :value="1">一键报名</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="报名资料：">
      <a-radio-group v-model:value="formState.signNeedCard" :disabled="status === 2 || status === 3">
        <a-radio :value="1">需上传IP名片</a-radio>
        <a-radio :value="0">无需上传IP名片</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item v-if="formState.signNeedCard === 1" label="参与人与名片墙可见性设置：">
      <div style="display: flex; flex-direction: column" class="pt5 pb5">
        <a-radio-group
          v-model:value="formState.cardShow"
          style="margin-bottom: 10px"
          :disabled="status === 2 || status === 3"
        >
          <a-radio :value="1">展示</a-radio>
          <a-radio :value="0">隐藏</a-radio>
        </a-radio-group>

        <a-radio-group
          v-if="formState.cardShow === 1"
          v-model:value="formState.cardShowType"
          :disabled="status === 2 || status === 3"
        >
          <a-radio :value="1">不限</a-radio>
          <a-radio :value="2">{{ ckey ? '限本商会会员可见' : '限商会会员可见' }}</a-radio>
          <a-radio :value="3">限符合报名条件的用户可见</a-radio>
          <a-radio :value="4">限报名成功的用户可见 (若需审核，指审核通过的用户)</a-radio>
        </a-radio-group>
      </div>
    </a-form-item>

    <a-form-item v-if="formState.signNeedCard === 1 && formState.cardShow === 1" label="名片墙信息设置：">
      <a-radio-group v-model:value="formState.cardInfoType" :disabled="status === 2 || status === 3">
        <a-radio :value="0">不隐藏任何信息</a-radio>
        <a-radio :value="1">隐藏手机号、邮箱、地址</a-radio>
        <a-radio :value="2">隐藏手机号、邮箱</a-radio>
        <a-radio :value="3">隐藏手机号</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="是否支持代报名">
      <a-radio-group v-model:value="formState.canReplaceApply" :disabled="status === 2 || status === 3">
        <a-radio :value="2">不支持</a-radio>
        <a-radio :value="1">支持</a-radio>
      </a-radio-group>
      <a-tooltip placement="top">
        <template #title>
          <span>报名时将不需要上传IP名片，实际参加活动的人可上传IP名片；</span>
        </template>
        <question-circle-outlined style="margin-left: -10px; margin-top: 5px" />
      </a-tooltip>
    </a-form-item>

    <div class="sgin-up">
      <a-col :span="4" style="text-align: center">
        <div class="sgin-surface">报名表</div>
      </a-col>

      <div class="sgin-way">
        <a-col :span="4" style="text-align: right" class="pr10">
          到场人数 <question-circle-outlined @click="isPresent = true" />
        </a-col>

        <a-radio-group v-model:value="formState.arriveType">
          <a-radio :disabled="status === 2 || status === 3" :value="1">需填写</a-radio>
          <a-radio :disabled="status === 2 || status === 3" :value="0">无需填写</a-radio>
        </a-radio-group>
      </div>
    </div>

    <div v-show="+formState.signType === 0" class="mt20">
      <div style="display: flex">
        <a-col :span="4"></a-col>

        <a-button
          type="primary"
          :disabled="arrayData.length >= 20 || status === 2 || status === 3"
          @click="iscustom = true"
        >
          +自定义报名信息
        </a-button>
      </div>
      <div v-for="(item, index) in arrayData" :key="item.id" class="ml30">
        <a-form-item :name="'col' + index" :required="item.check === 1">
          <div class="sign">
            <span v-if="item.check === 1" class="sign-star">*</span>
            {{ item.title }}
          </div>
          <div class="flex flex-x-start-center">
            <a-input v-if="+item.type === 0" :placeholder="item.msgAlert" :disabled="true" style="width: 400px" />
            <a-input v-if="+item.type === 1" :placeholder="item.selects[0].value" :disabled="true" style="width: 400px">
              <template #suffix><down-outlined /></template>
            </a-input>
            <div class="sign-right" v-if="index > 1 || formState.canReplaceApply !== 1">
              <a-button type="link" @click="edit(index, item.type)">编辑</a-button>
              <a-button type="link" @click="up(index)">上移</a-button>
              <a-button type="link" @click="down(index)">下移</a-button>
              <a-button type="link" @click="del(index)">删除</a-button>
            </div>
          </div>
        </a-form-item>
      </div>
    </div>

    <!-- 自定义信息 -->
    <CustomApplyDialog
      ref="customDialogRef"
      v-model:edit-col="editCol"
      v-model:dialog-form-visible="dialogFormVisible"
      v-model:iscustom="iscustom"
      :edit-data="formData"
      :array-data="arrayData"
      @edit="val => (arrayData[editIndex] = val)"
      @add="val => arrayData.push(val)"
    />
  </a-form>
</template>

<script>
import { defineComponent, ref } from 'vue'
import CustomApplyDialog from './custom-apply-dialog'

import useVModel from '@/use/use-vmodel'

export default defineComponent({
  name: 'ApplyInfo',
  components: { CustomApplyDialog },
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    applyArray: {
      type: Array,
      default: () => []
    },
    status: {
      type: Number,
      default: 1
    }
  },

  setup(props) {
    const formState = useVModel(props, 'form')
    const arrayData = useVModel(props, 'applyArray')
    const customDialogRef = ref()
    const dialogFormVisible = ref(false)
    const editCol = ref(false) // 是否编辑
    const editIndex = ref(0) // 编辑索引
    const iscustom = ref(false) // 自定义信息弹窗
    const formData = ref({
      title: '', // 标题
      msgAlert: '', // 输入框提示
      lengthLimit: '', // 输入字数限制
      check: 1, // 是否 必填 选填
      // 下拉框
      selects: [
        { value: '' }, // 选项1
        { value: '' } // 选项2
      ],
      key: '', // 参数名称，下拉框情况下多个参数请;拼接
      type: '' // 0: 输入框  1：下拉框
    }) // 自定义信息编辑的数据

    const del = index => {
      arrayData.value.splice(index, 1)
    }

    const edit = (index, type) => {
      customDialogRef.value.infoData.info = type
      formData.value = { ...arrayData.value[index] }

      dialogFormVisible.value = true
      editCol.value = true
      editIndex.value = index
    }

    const up = index => {
      if (index === 0 || index === 2) return
      const data = arrayData.value[index]
      arrayData.value[index] = arrayData.value[index - 1]
      arrayData.value[index - 1] = data
    }

    const down = index => {
      if (index !== arrayData.value.length - 1) {
        const data = arrayData.value[index]
        arrayData.value[index] = arrayData.value[index + 1]
        arrayData.value[index + 1] = data
      }
    }

    return {
      formState,
      customDialogRef,
      dialogFormVisible,
      editCol,
      editIndex,
      iscustom,
      arrayData,
      formData,

      del,
      edit,
      up,
      down
    }
  }
})
</script>

<style scoped lang="scss">
.sgin-up {
  .sgin-way {
    display: flex;
    font-size: 14px;
    color: #606266;
  }
  .sgin-surface {
    font-weight: 700;
    font-size: 23px;
    margin: 20px 0;
  }
}
</style>
