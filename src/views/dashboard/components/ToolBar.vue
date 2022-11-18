<template>
  <Panel class="tool-bar-wrap" :has-padding="false">
    <div class="panel-header">
      <div class="panel-title">快捷工具栏</div>
      <el-button @click="onEdit">{{ isEdit ? '完成' : '编辑' }}</el-button>
    </div>

    <div class="grid-wrap">
      <GridLayout
        :layout="layout"
        :col-num="3"
        :is-draggable="isEdit"
        :is-resizable="false"
        :vertical-compact="true"
        :use-css-transforms="true"
        :margin="[0, 0]"
      >
        <GridItem
          v-for="item in layout"
          :key="item.i"
          class="grid-item"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :min-w="1"
          :min-h="2"
          :i="item.i"
          :static="item.static"
          @moved="onMoved"
        >
          <div v-if="item.i === 'add'" class="content" @click="onAddItem">
            <div
              v-if="isEdit && allMenuList.length > layout.length"
              class="content flex-x-center-center"
              style="color: rgba(0,0,0,0.45); font-size: 16px; cursor: pointer"
            >
              <div class="el-icon-plus" style="margin-right: 10px" />
              新增工具
            </div>
          </div>

          <div v-else class="content">
            <div class="item-header">
              <div class="icon">
                <svg-icon width="50" height="50" :icon-class="item.icon" color="#fff" />
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
                <div v-if="isEdit" class="el-icon-close" @click.stop="removeItem(childItem, 'second', item)" />
              </div>
              <div v-if="showAddSecondBtn(item)" class="body-item body-item-add" @click.stop="onAddSecondItem(item)"><i class="el-icon-plus" />添加</div>
            </div>
            <div v-if="isEdit" class="item-footer" @click.stop="removeItem(item, 'first')">移除</div>
          </div>
        </GridItem>
      </GridLayout>
    </div>

    <MaterialModal :visible.sync="showModal" :form="formModel" :layout="layout" @success="fetchMenuList" />
  </Panel>
</template>

<script>
import Panel from '../../../components/panel'
import VueGridLayout from 'vue-grid-layout'
import MaterialModal from './MaterialModal'
import { deleteMenuList, editToolBar, getMenuList, initAddToolBar } from '@/api/admin-user-menu'

export default {
  name: 'ToolBar',
  components: {
    Panel,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    MaterialModal
  },
  data() {
    return {
      showModal: false,
      isEdit: false,
      layout: [],
      formModel: {
        firstMenu: '',
        secondMenu: [{ value: '' }]
      }
    }
  },
  computed: {
    allMenuList() {
      return this.$store.state.menu?.addRoutes || []
    }
  },
  mounted() {
    this.fetchMenuList()
  },
  methods: {
    async initAddData() {
      try {
        const defaultMenu = ['会员管理', '内容管理', '活动管理']
        const initIds = this.allMenuList.filter(v => defaultMenu.includes(v.name)).map(v => v.id)
        if (!initIds.length) return

        const { state } = await initAddToolBar(initIds)
        if (!state) return
        this.fetchMenuList()
      } catch (e) {
        console.error(e)
      }
    },

    handleMenuList(data, type) {
      if (this.isEdit) {
        const addItem = {
          x: 0,
          y: 0,
          w: 1,
          h: 2,
          i: 'add',
          static: true,
          id: 'add',
          children: []
        }

        type === 'edit' ? this.layout.unshift(addItem) : data.unshift(addItem)
      } else {
        this.layout.shift()
      }

      this.layout = data.map((v, i) => {
        if (v.i === 'add') return { ...v }
        else {
          return {
            ...v,
            x: i % 3,
            y: Math.floor(i / 3) * 2,
            w: 1,
            h: 2,
            i,
          }
        }
      })
    },

    async fetchMenuList() {
      try {
        const { state, data } = await getMenuList()
        if (!state) return
        if (!data.length) this.initAddData()

        this.handleMenuList(data, 'fetch')
      } catch (e) {
        console.error(e)
      }
    },

    goTo(item) {
      this.$router.push({
        path: item.menuUrl,
      })
    },

    onAddSecondItem(item) {
      this.formModel.firstMenu = item.menuId
      this.formModel.secondMenu = item.children.map((v, i) => {
        return {
          // 为了修复编辑时select不显示label名称，故把label和value调转了
          value: v.menuName,
          label: v.menuId,
          key: i,
          id: v.id
        }
      })

      this.showModal = true
    },

    showAddSecondBtn(item) {
      const currMenu = this.allMenuList.find(v => v.id === item.menuId) || {}
      return this.isEdit && currMenu.children?.length > item.children.length
    },

    onAddItem() {
      if (!this.isEdit) return

      this.formModel = {
        firstMenu: '',
        secondMenu: [{ value: '' }]
      }
      this.showModal = true
    },

    onEdit() {
      this.isEdit = !this.isEdit
      this.handleMenuList(this.layout, 'edit')
    },

    async removeItem(item, type, parentItem) {
      try {
        const { state, msg } = await deleteMenuList(item.id)

        // 假如二级菜单只有一个的时候，同步要把父亲给删除
        if (type === 'second' && parentItem.children.length === 1) {
          await deleteMenuList(parentItem.id)
        }

        if (!state) return
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
        this.fetchMenuList()
      } catch (e) {
        console.error(e)
      }
    },

    async onMoved() {
      // 两个坐标比较大小
      function setSortRule(p1, p2) {
        if (p1.y > p2.y) {
          return true
        } else if (p1.y === p2.y) {
          return (p1.x > p2.x)
        } else {
          return false
        }
      }

      for (let i = 0; i < this.layout.length - 1; i++) {
        for (let j = 0; j < this.layout.length - 1 - i; j++) {
          if (setSortRule(this.layout[j], this.layout[j + 1])) {
            const tmp = this.layout[j]
            this.layout[j] = this.layout[j + 1]
            this.layout[j + 1] = tmp
          }
        }
      }

      // eslint-disable-next-line no-return-assign
      this.isEdit ? this.layout.slice(1).forEach((v, i) => v.sort = i) : this.layout.forEach((v, i) => v.sort = i)

      try {
        const { state, msg } = await editToolBar(this.isEdit ? this.layout.slice(1) : this.layout)
        if (!state) return
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
      } catch (e) {
        console.error(e)
      }
    },

  }
}
</script>

<style lang="scss" scoped>
.tool-bar-wrap {
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
    color: rgba(0,0,0,0.85);
    line-height: 24px;
  }

  .el-icon-edit-outline {
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
  }

  .grid-item {
    background-color: #fff;
    border: 1px solid #E9E9E9;
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
      color: rgba(0,0,0,0.85);
      line-height: 22px;

      .icon {
        background: #FFCF5B;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        margin-right: 8px;
      }
    }

    .item-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 50px;
      grid-row-gap: 12px;
      padding: 0 20px;

      .body-item {
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 30px;
        height: 30px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;

        &.body-item-hover:hover {
          background: linear-gradient(180deg, #FFE39B 0%, #FFB12A 100%);
          border-radius: 4px;
        }

        &.body-item-edit {
          border-radius: 4px;
          border: 1px solid #d9d9d9;
          background: #f3f3f3;

          .item-name {
            width: 90px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
      background: #F7F9FA;
      font-size: 14px;
      color: rgba(0,0,0,0.45);
      text-align: center;
      cursor: pointer;
    }
  }

}
</style>
