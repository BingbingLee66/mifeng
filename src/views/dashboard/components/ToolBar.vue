<template>
  <Panel class="tool-bar-wrap" :has-padding="false">
    <div class="panel-header">
      <div class="panel-title">快捷工具栏</div>
      <div>
        <el-button v-if="isEdit" type="text" @click="onAddItem"><i class="el-icon-plus ml-10" />添加</el-button>
        <div class="el-icon-edit-outline" @click="onEdit" />
      </div>
    </div>

    <div class="grid-wrap">
      <GridLayout
        :layout="layout"
        :col-num="3"
        :is-draggable="isEdit"
        :is-resizable="false"
        :vertical-compact="true"
        :use-css-transforms="true"
        :margin="[1, 1]"
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
          @moved="onMoved"
        >
          <div class="content">
            <div class="item-header">
              <div class="icon">
                <svg-icon width="50" height="50" :icon-class="item.icon" color="#fff" />
              </div>
              <div>{{ item.menuName }}</div>
              <div v-if="isEdit" class="el-icon-close" @click.stop="removeItem(item)" />
            </div>
            <div class="item-body">
              <div v-for="(childItem, index) in item.children" :key="index" class="body-item" @click="onClickItem(item, childItem)">
                {{ childItem.menuName }}
              </div>
            </div>
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

    async fetchMenuList() {
      try {
        const { state, data } = await getMenuList()
        if (!state) return
        if (!data.length) this.initAddData()

        this.layout = data.map((v, i) => {
          return {
            ...v,
            x: i % 3,
            y: Math.floor(i / 3) * 2,
            w: 1,
            h: 2,
            i,
          }
        })
      } catch (e) {
        console.error(e)
      }
    },

    onClickItem(item, childItem) {
      if (!this.isEdit) {
        this.$router.push({
          path: childItem.menuUrl,
        })
        return
      }

      this.formModel.firstMenu = item.menuId
      this.formModel.secondMenu = item.children.map((v, i) => {
        return {
          value: v.menuId,
          key: i
        }
      })

      this.showModal = true
    },

    onAddItem() {
      this.formModel = {
        firstMenu: '',
        secondMenu: [{ value: '' }]
      }
      this.showModal = true
    },

    onEdit() {
      this.isEdit = !this.isEdit
    },

    /**
     * 移除项
     * @param  {Object} item 目标项
     */
    async removeItem(item) {
      try {
        const { state, msg } = await deleteMenuList(item.id)
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
      this.layout.forEach((v, i) => v.sort = i)

      try {
        const { state, msg } = await editToolBar(this.layout)
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

      .el-icon-close {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        cursor: pointer;
      }
    }

    .item-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 50px;
      grid-row-gap: 12px;

      .body-item {
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 22px;
      }
    }
  }

}
</style>
