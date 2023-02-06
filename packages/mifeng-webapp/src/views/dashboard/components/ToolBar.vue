<template>
  <div class="tool-bar-wrap" :has-padding="false">
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">快捷工具栏</div>
        <a-button @click="onEdit">{{ isEdit ? '完成' : '编辑' }}</a-button>
      </div>

      <div class="grid-wrap">
        <grid-layout
          v-model:layout="layout"
          :col-num="3"
          :is-draggable="isEdit"
          :is-resizable="false"
          :vertical-compact="true"
          :use-css-transforms="true"
          :margin="[0, 0]"
        >
          <grid-item
            v-for="item in layout"
            :key="item.i"
            class="grid-item"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :min-w="1"
            :min-h="2.3"
            :i="item.i"
            :static="item.static"
            @moved="onMoved"
          >
            <div v-if="item.i === 'add'" class="content" @click="onAddItem">
              <div
                v-if="isEdit"
                class="content flex-x-center-center"
                style="color: rgba(0, 0, 0, 0.45); font-size: 16px; cursor: pointer"
              >
                <plus-outlined style="margin-right: 10px" />
                新增工具
              </div>
            </div>

            <div v-else class="content">
              <div class="item-header">
                <div class="icon">
                  <icon-font :type="item.icon" />
                </div>
                <div>{{ item.menuName }}</div>
              </div>
              <div class="item-body">
                <div
                  v-for="(childItem, index) in item.children"
                  :key="index"
                  :class="['body-item', isEdit ? 'body-item-edit' : 'body-item-hover']"
                  @click.stop="goTo(childItem)"
                >
                  <div class="item-name">{{ childItem.menuName }}</div>

                  <div
                    v-if="isEdit"
                    class="el-icon-close"
                    style="margin-right: 6px"
                    @click.stop="removeItem(childItem, 'second', item)"
                  >
                    <close-outlined />
                  </div>
                </div>
                <div v-if="showAddSecondBtn(item)" class="body-item body-item-add" @click.stop="onAddSecondItem(item)">
                  <plus-outlined />添加
                </div>
              </div>
              <div v-if="isEdit" class="item-footer" @click.stop="removeItem(item, 'first')">移除</div>
            </div>
          </grid-item>
        </grid-layout>
      </div>

      <MaterialModal
        ref="modal"
        v-model:visible="showModal"
        :form="formModel"
        :layout="layout"
        @success="fetchMenuList"
      />
    </div>
  </div>
</template>
<script>
import MaterialModal from './MaterialModal'
import { deleteMenuList, editToolBar, getMenuList, initAddToolBar } from '@/api/admin-user-menu'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { menus } from '@/router/menus'

export default {
  components: {
    MaterialModal
  },
  setup() {
    const { ...menuInfo } = useTool()
    return { ...menuInfo }
  }
}
function useTool() {
  const fetchMenuList = async () => {
    const { data } = await getMenuList()
    if (!data.length) initAddData()
    handleMenuList(data, 'fetch')
  }
  fetchMenuList()
  const allMenuList = computed(() => {
    return menus.value || []
  })
  const initAddData = async () => {
    try {
      const defaultMenu = ['会员管理', '内容管理', '活动管理']
      const initIds = allMenuList.value.filter(v => defaultMenu.includes(v.name)).map(v => v.id)
      if (!initIds.length) return

      const { state } = await initAddToolBar(initIds)
      if (!state) return
      fetchMenuList()
    } catch (e) {
      console.error(e)
    }
  }
  const isEdit = ref(false)
  const onEdit = () => {
    isEdit.value = !isEdit.value
    handleMenuList(layout.value, 'edit')
  }
  const layout = ref([])
  const itemHeight = 2.3
  const handleMenuList = (data, type) => {
    if (isEdit.value) {
      const addItem = {
        x: 0,
        y: 0,
        w: 1,
        h: itemHeight,
        i: 'add',
        static: true,
        id: 'add',
        children: []
      }
      type === 'edit' ? layout.value.unshift(addItem) : data.unshift(addItem)
    } else {
      layout.value.shift()
    }
    layout.value = data.map((v, i) => {
      if (v.i === 'add') return { ...v }
      else {
        return {
          ...v,
          x: i % 3,
          y: Math.floor(i / 3) * itemHeight,
          w: 1,
          h: itemHeight,
          i
        }
      }
    })
  }
  const formModel = reactive({})
  const showModal = ref(false)
  const onAddItem = () => {
    if (!isEdit.value) return
    formModel.firstMenu = ''
    formModel.secondMenu = [{ value: null }]
    showModal.value = true
    modal.value.onDialogShow()
  }
  const router = useRouter()
  const goTo = item => {
    router.push({
      path: item.menuUrl
    })
  }
  const removeItem = async (item, type, parentItem) => {
    try {
      const { state } = await deleteMenuList(item.id)

      // 假如二级菜单只有一个的时候，同步要把父亲给删除
      if (type === 'second' && parentItem.children.length === 1) {
        await deleteMenuList(parentItem.id)
      }

      if (!state) return
      fetchMenuList()
    } catch (e) {
      console.error(e)
    }
  }
  const modal = ref()
  const onAddSecondItem = item => {
    console.log(item)
    formModel.firstMenu = item.menuId
    formModel.secondMenu = item.children.map((v, i) => {
      return {
        label: v.menuName,
        value: {
          label: v.menuName,
          value: v.menuId
        },
        key: i,
        id: v.id
      }
    })
    showModal.value = true
    modal.value.onDialogShow()
  }
  const showAddSecondBtn = item => {
    const currMenu = allMenuList.value.find(v => v.id === item.menuId) || {}
    return isEdit.value && currMenu.children?.length > item.children.length
  }
  // 两个坐标比较大小
  const setSortRule = (p1, p2) => {
    if (p1.y > p2.y) {
      return true
    } else if (p1.y === p2.y) {
      return p1.x > p2.x
    } else {
      return false
    }
  }

  const onMoved = async () => {
    for (let i = 0; i < layout.value.length - 1; i++) {
      for (let j = 0; j < layout.value.length - 1 - i; j++) {
        if (setSortRule(layout.value[j], layout.value[j + 1])) {
          const tmp = layout.value[j]
          layout.value[j] = layout.value[j + 1]
          layout.value[j + 1] = tmp
        }
      }
    }
    isEdit.value ? layout.value.slice(1).forEach((v, i) => (v.sort = i)) : layout.value.forEach((v, i) => (v.sort = i))
    try {
      const { state } = await editToolBar(isEdit.value ? layout.value.slice(1) : layout.value)
      if (!state) return
    } catch (e) {
      console.error(e)
    }
  }
  return {
    formModel,
    layout,
    onAddItem,
    showModal,
    onEdit,
    isEdit,
    goTo,
    removeItem,
    onAddSecondItem,
    showAddSecondBtn,
    onMoved,
    modal,
    fetchMenuList
  }
}
</script>
<style lang="scss" scoped>
.tool-bar-wrap {
  padding: 20px 24px 0;
  .panel {
    background: #fff;
  }
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    padding: 0 24px;
    box-sizing: border-box;
  }

  .panel-title {
    font-size: 16px;
    font-weight: bolder;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
  }

  .el-icon-edit-outline {
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
  }

  .grid-item {
    background-color: #fff;
    border: 1px solid #e9e9e9;
    box-sizing: content-box;

    .content {
      position: relative;
      height: 100%;
    }

    .item-header {
      display: flex;
      align-items: center;
      padding: 20px;
      font-size: 14px;
      font-weight: bolder;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;

      .icon {
        font-size: 20px;
        background: #ffcf5b;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        margin-right: 8px;
        color: #fff;
      }
    }

    .item-body {
      display: flex;
      flex-wrap: wrap;
      padding: 0 20px;

      .body-item {
        text-align: center;
        cursor: pointer;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 12px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 10px;
        margin: 0 10px 10px 0;

        &.body-item-hover:hover {
          background: linear-gradient(180deg, #ffe39b 0%, #ffb12a 100%);
          border-radius: 4px;
        }

        &.body-item-edit {
          border-radius: 4px;
          border: 1px solid #d9d9d9;
          background: #f3f3f3;
          align-items: center;
          min-height: 30px;
          padding: 0;

          .item-name {
            padding: 0 10px;
          }
        }

        &.body-item-add {
          justify-content: center;
          border: 1px dashed #2999ff;
          color: #2999ff;

          .el-icon-plus {
            margin-right: 10px;
          }
        }
      }
    }

    .item-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 32px;
      background: #f7f9fa;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      text-align: center;
      cursor: pointer;

      &:hover {
        color: #2d8dfd;
      }
    }
  }
}
</style>
