<template>
  <Panel class="tool-bar-wrap">
    <div class="panel-header">
      <div class="panel-title">快捷工具栏</div>
      <div>
        <el-button v-if="isEdit" type="primary" @click="showModal = true">添加</el-button>
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
      >
        <GridItem
          v-for="item in layout"
          :key="item.i"
          class="grid-item"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :min-w="2"
          :min-h="2"
          :i="item.i"
          :margin="[20, 20]"
          @moved="onMoved"
        >
          <div class="content">
            <div class="item-header">
              <div>{{ item.menuName }}</div>
              <div v-if="isEdit" class="el-icon-close" @click="removeItem(item)" />
            </div>
            <div class="item-body">
              <div v-for="childItem in item.children" :key="childItem.index" class="body-item">
                {{ childItem.menuName }}
              </div>
            </div>
          </div>
        </GridItem>
      </GridLayout>
    </div>

    <MaterialModal :visible.sync="showModal" @success="fetchMenuList" />
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
      layout: []
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
        const initIds = this.allMenuList.filter(v => ['会员管理', '内容管理', '活动管理'].includes(v.name)).map(v => v.id)
        if (!initIds.length) return

        const { state } = await initAddToolBar()
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
        if (!data.length) return this.initAddData()

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
    position: relative;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
  }

  .panel-title {
    padding: 0 20px;
    display: flex;
    align-items: center;
  }

  .el-icon-edit-outline {
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
  }
  .grid-item {
    padding: 20px;
    background-color: #ebebeb;

    .content {
      height: 100%;
    }

    .el-icon-close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
      cursor: pointer;
    }

    .item-header {
    }

    .item-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 50px;
      grid-row-gap: 50px;
      .body-item {
        text-align: center;
      }
    }
  }

}
</style>
