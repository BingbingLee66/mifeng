<template>
  <a-modal :title="`${isEdit ? '编辑' : '添加'}工具栏`" v-bind="$attrs" width="40%" @ok="onConfirm" @cancel="onClose">
    <a-form ref="formRef" :model="formModel" :labelCol="{ span: 6 }" :wrapperCol="{ span: 12 }">
      <a-form-item
        label="一级菜单"
        name="firstMenu"
        :rules="{
          required: true,
          message: '一级菜单不能为空',
          trigger: 'change'
        }"
      >
        <a-select
          placeholder="请选择"
          v-model:value="formModel.firstMenu"
          :disabled="isEdit"
          showSearch
          optionFilterProp="label"
        >
          <a-select-option
            v-for="itemFir in usableFirstMenuList"
            :key="itemFir.menuId"
            :value="itemFir.menuId + ''"
            :label="itemFir.menuName"
          >
            {{ itemFir.menuName }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        v-for="(menu, index) in formModel.secondMenu"
        :key="menu.key"
        :label="index === 0 ? '二级菜单' : ''"
        :wrapper-col="index && { offset: 6, span: 12 }"
        :name="['secondMenu', index, 'value']"
        :rules="{
          required: true,
          message: '二级菜单不能为空',
          trigger: 'change'
        }"
      >
        <a-select
          v-model:value="menu.value"
          placeholder="请选择"
          showSearch
          optionFilterProp="label"
          :labelInValue="true"
        >
          <a-select-option
            v-for="itemSec in usableSecondMenuList"
            :key="itemSec.menuId"
            :value="itemSec.menuId + ''"
            :label="itemSec.menuName"
          >
            {{ itemSec.menuName }}
          </a-select-option>
        </a-select>
        <a-button v-if="index || menu.length" style="margin-left: 10px" @click.prevent="removeSecondMenu(menu)">
          删除
        </a-button>
      </a-form-item>
      <a-form-item
        name="addMenu"
        :wrapper-col="{ offset: 6 }"
        v-if="curSecondMenuList.length > formModel.secondMenu.length"
      >
        <div class="btn-add-second" @click="addSecondMenu"><plus-outlined />添加二级菜单</div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { addToolBar, editToolBar, getMenuNoList, deleteMenuList } from '@/api/admin-user-menu'
import { uniq } from 'lodash'
import { computed, getCurrentInstance, reactive, watch, ref } from 'vue'
import { menus } from '@/router/menus'
// 递归处理菜单树
const recursionHandleMenu = (menuList, level) => {
  const tempMenuList = []

  menuList.forEach(menu => {
    if (menu.children && menu.children.length) {
      menu.children = recursionHandleMenu(menu.children, 2)
    }

    tempMenuList.push({
      ...menu,
      menuName: menu.name || menu.menuName,
      menuId: menu.id || menu.menuId,
      menuRank: level,
      menuUrl: menu.path || menu.menuUrl,
      icon: menu.meta?.icon || menu.icon
    })
  })

  return tempMenuList.filter(v => v.menuId !== 2)
}
const props = defineProps({
  layout: {
    type: Array,
    default: () => []
  },
  form: {
    type: Object,
    default: () => {}
  }
})
const { proxy } = getCurrentInstance()
const emit = defineEmits(['update:visible', 'success'])
const allMenuList = ref(recursionHandleMenu(menus.value, 1) || [])
const firstMenuList = ref([])
const secondMenuList = ref([])
const formModel = reactive({
  firstMenu: '',
  secondMenu: [{ value: null }]
})
const isEdit = computed(() => {
  return !!props.form.firstMenu
})
const curSecondMenuList = computed(() => {
  const index = allMenuList.value.findIndex(v => v.menuId === Number(formModel.firstMenu))
  return allMenuList.value[index]?.children || []
})

const usableSecondMenuList = computed(() => {
  const disableSecMenuList = formModel.secondMenu.map(v =>
    Number(v.value !== null && typeof v.value === 'object' ? v.value.value : v.value)
  )
  return curSecondMenuList.value.filter(v => !disableSecMenuList.includes(Number(v.menuId)))
})

const usableFirstMenuList = computed(() => {
  return isEdit.value ? allMenuList.value : allMenuList.value.filter(v => v.menuId !== formModel.firstMenu)
})

watch(
  () => formModel.firstMenu,
  () => {
    if (!isEdit.value) formModel.secondMenu = [{ value: null }]
  }
)
const onDialogShow = () => {
  const { firstMenu, secondMenu } = props.form
  formModel.firstMenu = firstMenu + ''
  formModel.secondMenu = secondMenu
  if (!isEdit.value) {
    fetchMenuNoList()
  }
}
defineExpose({
  onDialogShow
})
const fetchMenuNoList = async () => {
  try {
    const { data, state } = await getMenuNoList()
    if (!state) return
    allMenuList.value = recursionHandleMenu(data, 1)
  } catch (e) {
    console.error(e)
  }
}
const onConfirm = async () => {
  await proxy.$refs.formRef.validateFields()
  firstMenuList.value = allMenuList.value.find(v => v.menuId === Number(formModel.firstMenu))
  const tempMenuList = formModel.secondMenu.map(v => Number(typeof v.value === 'object' ? v.value.value : v.value))
  secondMenuList.value = firstMenuList.value.children.filter(v => tempMenuList.includes(v.menuId))
  if (hasDuplicates(tempMenuList)) return proxy.$message.error('二级菜单不能存在重复值')

  const params = {
    ...firstMenuList.value,
    sort: props.layout.length - 1,
    children: []
  }

  secondMenuList.value.forEach(item => {
    params.children.push({
      ...item,
      sort: tempMenuList.findIndex(v => v === item.menuId),
      id: formModel.secondMenu.find(v => +v.value?.value === +item.menuId)?.id
    })
  })

  try {
    const editItem = ref({})
    const editParams = ref([])

    if (isEdit.value) {
      editItem.value = props.layout.find(v => v.menuId === props.form.firstMenu) || {}
      editParams.value = [
        {
          ...editItem.value,
          children: params.children
        }
      ]
    }
    const { state } = isEdit.value ? await editToolBar(editParams.value) : await addToolBar(params)
    if (!state) return
    onClose()
    emit('success')
  } catch (e) {
    console.error(e)
  }
}
const hasDuplicates = val => {
  return uniq(val).length !== val.length
}
const formRef = ref()
const onClose = () => {
  emit('update:visible', false)
  allMenuList.value = recursionHandleMenu(menus.value, 1) || []
  firstMenuList.value = []
  secondMenuList.value = []
  formRef.value.resetFields()
}
const addSecondMenu = () => {
  formModel.secondMenu.push({
    value: null,
    key: Date.now()
  })
}
const removeSecondMenu = async item => {
  const index = formModel.secondMenu.indexOf(item)
  if (index === -1) return
  formModel.secondMenu.splice(index, 1)
  if (!item.id) return

  try {
    const { state } = await deleteMenuList(item.id)
    if (!state) return
    emit('success')
  } catch (e) {
    console.error(e)
  }
}
</script>
<style scoped lang="scss">
:deep(.ant-form-item-control-input-content) {
  display: flex;
}
.btn-add-second {
  color: #1890ff;
  cursor: pointer;
}
.modal-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
