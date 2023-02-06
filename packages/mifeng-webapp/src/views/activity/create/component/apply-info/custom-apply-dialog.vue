<template>
  <div>
    <a-modal
      :title="(editCol ? '编辑' : '新增') + '自定义信息'"
      :visible="dialogFormVisible"
      width="500px"
      :mask-closable="false"
      @cancel="onClose"
    >
      <a-form ref="formRef" :model="formData" :label-col="{ style: { width: '100px' } }">
        <a-form-item label="信息类型:" :rules="[{ required: true }]">
          <a-select v-model:value="infoData.info" disabled placeholder="请选择">
            <a-select-option :value="0">输入框</a-select-option>
            <a-select-option :value="1">下拉框</a-select-option>
            <a-select-option :value="2">文件上传</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 输入框 -->
        <div v-if="+infoData.info === 0">
          <a-form-item label="标题" name="title" :rules="[{ required: true, message: '不能为空' }]">
            <a-input v-model:value="formData.title" placeholder="标题，15字内" :maxlength="15" />
          </a-form-item>
          <a-form-item label="输入框提示" name="msgAlert" :rules="[{ required: true, message: '不能为空' }]">
            <a-input v-model:value="formData.msgAlert" placeholder="输入框提示文字，15字内" :maxlength="15" />
          </a-form-item>
          <a-form-item label="输入字数限制" name="lengthLimit">
            <a-input v-model:value="formData.lengthLimit" placeholder="不限制" type="number" />
            <br />不填写，则默认不限制
          </a-form-item>
        </div>
        <!-- 文件上传 -->
        <div v-else-if="+infoData.info === 2">
          <a-form-item label="标题" name="title" :rules="[{ required: true, message: '不能为空' }]">
            <a-input v-model:value="formData.title" autocomplete="off" placeholder="标题，15字内" :maxlength="15" />
          </a-form-item>
          <div style="margin-left: 116px">
            (支持文件类型：PDF、Word、Excel、PPT )大小限制30M
            <div>
              <a-upload class="avatar-uploader" action="/" :show-file-list="false" disabled>
                <div class="import-upload-content">
                  <plus-outlined class="a-icon-plus"></plus-outlined>
                </div>
              </a-upload>
            </div>
          </div>
        </div>
        <!-- 下拉框 -->
        <div v-else>
          <a-form-item label="标题" name="title" :rules="[{ required: true, message: '不能为空' }]">
            <a-input v-model:value="formData.title" placeholder="标题，15字内" :maxlength="15" />
          </a-form-item>
          <a-form-item
            v-for="(item, index) in formData.selects"
            :key="index"
            :label="`选项${index + 1}`"
            :rules="[{ required: true }]"
          >
            <a-input v-model:value="item.value" placeholder="选项，10字内" :maxlength="10" />
          </a-form-item>
          <div class="add-option" @click="addOptions">+添加选项</div>
        </div>

        <a-form-item label="是否必填" name="check">
          <a-radio-group v-model:value="formData.check">
            <a-radio :value="1">必填</a-radio>
            <a-radio :value="0">选填</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="onClose">取 消</a-button>
          <a-button type="primary" @click="onAdd">确 定</a-button>
        </div>
      </template>
    </a-modal>

    <a-modal title="新增自定义信息" :visible="iscustom" width="40%" :mask-closable="false" @cancel="onCancelData">
      <a-form :model="infoData" :label-col="{ style: { width: '100px' } }" style="height: 100px">
        <a-form-item label="信息类型:" :rules="[{ required: true }]">
          <a-select v-model:value="infoData.info" placeholder="请选择">
            <a-select-option :value="0">输入框</a-select-option>
            <a-select-option :value="1">下拉框</a-select-option>
            <a-select-option :value="2">文件上传</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="onCancelData">取 消</a-button>
          <a-button type="primary" @click="onInfoData">保存</a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import useVModel from '@/use/use-vmodel'

export default defineComponent({
  name: 'CustomApplyDialog',
  props: {
    editCol: {
      type: Boolean,
      default: false
    },
    iscustom: {
      type: Boolean,
      default: false
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const formRef = ref()

    const infoData = reactive({
      info: null // 信息类型
    })

    const formData = useVModel(props, 'editData')

    const onClose = () => {
      formData.value.title = ''
      formData.value.msgAlert = ''
      formData.value.lengthLimit = ''
      formData.value.check = 1
      formData.value.selects = [{ value: '' }, { value: '' }]

      emit('update:dialogFormVisible', false)
      emit('update:editCol', false)
      infoData.info = null
      formRef.value.resetFields()
    }

    const addOptions = () => {
      const obj = {
        value: ''
      }
      if (formData.value.selects.length >= 10) return message.error('最多只能添加10个')
      formData.value.selects.push(obj)
    }

    const onCancelData = () => {
      infoData.info = null
      emit('update:iscustom', false)
    }

    const onInfoData = () => {
      if (infoData.info === null) return message.error('请选择类型')
      if (+infoData.info === 0 || +infoData.info === 1 || +infoData.info === 2) emit('update:dialogFormVisible', true)

      emit('update:iscustom', false)
    }

    const onAdd = () => {
      let completely = false

      if (+infoData.info === 1) {
        formData.value.selects.forEach(v => {
          if (v.value === '') completely = true
        })
      }
      if (completely) return message.error('请填写选项标题')

      if (formData.value.lengthLimit !== '' && +infoData.info === 0) {
        if (formData.value.lengthLimit < 0) {
          return message.warning('字数限制必须大于0')
        } else if (formData.value.lengthLimit > 200 && +infoData.info === 0) {
          return message.warning('字数限制必须小于200')
        }
      }
      const key = []
      if (formData.value.selects) {
        formData.value.selects.forEach(v => {
          key.push(v.value)
        })
      }

      formData.value.key = key.join(';')

      formRef.value.validate().then(() => {
        formData.value.type = +infoData.info

        emit(props.editCol ? 'edit' : 'add', { ...formData.value })

        onClose()
      })
    }

    return {
      formRef,
      infoData,
      formData,

      onClose,
      addOptions,
      onCancelData,
      onInfoData,
      onAdd
    }
  }
})
</script>

<style scoped lang="scss">
.add-option {
  color: #409eff;
  margin-left: 100px;
  font-weight: 700;
  cursor: pointer;
  padding-bottom: 20px;
}
.import-upload-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100px;
  height: 100px;
  border: 1px dashed #e3e3e3;
  border-radius: 10px;
  .a-icon-plus {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .import-upload-text {
    font-size: 20px;
    color: #999;
  }
}
</style>
