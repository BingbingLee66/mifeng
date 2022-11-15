<template>
  <Panel class="tool-bar-wrap">
    <div class="panel-header">
      <div class="panel-title">快捷工具栏</div>
      <div class="el-icon-edit-outline" @click="onEdit" />
    </div>

    <div class="grid-wrap">
      <GridLayout
        :layout="layout"
        :col-num="12"
        :is-draggable="isEdit"
        :is-resizable="isEdit"
        :vertical-compact="true"
        :use-css-transforms="false"
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
          @resize="onResize"
          @move="onMove"
          @resized="onResized"
          @moved="onMoved"
        >
          <div class="content">
            <div v-if="isEdit" class="el-icon-close" @click="removeItem(item)" />
            <div class="item-header">
              <div class="el-icon-edit" />
              <div>{{ item.title }}</div>
            </div>
            <div class="item-body">
              <div v-for="childItem in item.childList" :key="childItem.index" class="body-item">
                {{ childItem.itemName }}
              </div>
            </div>
          </div>
        </GridItem>
        <GridItem :x="4" :y="2" :w="4" :h="2" class="grid-item wrap-add">
          <div class="el-icon-plus icon-add" />
          <div>添加工具箱</div>
        </GridItem>
      </GridLayout>
    </div>
  </Panel>
</template>

<script>
import Panel from '../../../components/panel'
import VueGridLayout from 'vue-grid-layout'

export default {
  name: 'ToolBar',
  components: {
    Panel,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      isEdit: false,
      layout: [
        {
          x: 0,
          y: 0,
          w: 4,
          h: 2,
          i: 0,
          title: '入会审核',
          childList: [
            {
              itemName: '添加会员'
            },
            {
              itemName: '资料修改'
            },
            {
              itemName: '添加会员'
            },
            {
              itemName: '缴费记录'
            }
          ]
        },
        {
          x: 4,
          y: 0,
          w: 4,
          h: 2,
          i: 1,
          title: '入会审核',
          childList: [
            {
              itemName: '添加会员'
            },
            {
              itemName: '资料修改'
            },
            {
              itemName: '添加会员'
            },
            {
              itemName: '缴费记录'
            }
          ]
        },
        {
          x: 8,
          y: 0,
          w: 4,
          h: 2,
          i: 2,
          title: '入会审核',
          childList: [
            {
              itemName: '添加会员'
            },
            {
              itemName: '资料修改'
            },
            {
              itemName: '添加会员'
            },
            {
              itemName: '缴费记录'
            }
          ]
        },
        {
          x: 0,
          y: 0,
          w: 2,
          h: 2,
          i: 3,
          title: '入会审核',
          childList: [
            {
              itemName: '添加会员'
            },
            {
              itemName: '资料修改'
            },
            {
              itemName: '添加会员'
            },
            {
              itemName: '缴费记录'
            }
          ]
        },
        {
          x: 0,
          y: 0,
          w: 12,
          h: 2,
          i: 4,
          title: '入会审核',
          childList: [
            {
              itemName: '添加会员'
            },
            {
              itemName: '资料修改'
            },
            {
              itemName: '添加会员'
            },
            {
              itemName: '缴费记录'
            },
            {
              itemName: '缴费记录'
            }
          ]
        }
      ]
    }
  },
  methods: {
    onEdit() {
      this.isEdit = !this.isEdit
    },

    /**
     * 移除项
     * @param  {Object} item 目标项
     */
    removeItem(item) {
      this.layout.splice(this.layout.indexOf(item), 1)
    },

    /**
     * 处理移动
     * @param  { Number | String } i 索引
     * @param  { Number } newX 新横坐标
     * @param  { Number } newY 新纵坐标
     */
    onMove(i, newX, newY) {
      console.log('MOVE i=' + i + ', X=' + newX + ', Y=' + newY)
    },

    /**
     * 处理尺寸改动
     * @param  { Number | String } i 索引
     * @param  { Number } newH 新高度
     * @param  { Number } newW 新宽度
     */
    onResize(i, newH, newW) {
      console.log('RESIZE i=' + i + ', H=' + newH + ', W=' + newW)
    },

    /**
     * 处理已移动
     * @param  { Number | String } i 索引
     * @param  { Number } newX 新横坐标
     * @param  { Number } newY 新纵坐标
     */
    onMoved(i, newX, newY) {
      console.log('## MOVED i=' + i + ', X=' + newX + ', Y=' + newY)
      this.$Notice.warning({
        title: '检测到区块位置改动',
        desc: `区块 ${i} 移动到坐标 [${newX}, ${newY}]`
      })
    },

    /**
     * 处理尺寸已改动
     * @param  { Number | String } i 索引
     * @param  { Number } newH 新高度
     * @param  { Number } newW 新宽度
     * @param  { Number } newHPx 新高度像数值
     * @param  { Number } newWPx 新宽度像数值
     */
    onResized(i, newH, newW, newHPx, newWPx) {
      console.log('## RESIZED i=' + i + ', H=' + newH + ', W=' + newW + ', H(px)=' + newHPx + ', W(px)=' + newWPx)
      this.$Notice.warning({
        title: '检测到区块尺寸改动',
        desc: `区块 ${i} 尺寸变成 [${newW}, ${newH}]，像素值为[${newWPx}, ${newHPx}]`
      })
    }
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
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
    .el-icon-close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
      cursor: pointer;
    }
    .item-header {
      display: flex;
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
  .wrap-add {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    color: #2c2c2c;
    .icon-add {
      font-size: 80px;
      color: #b7b7b7;
      margin-bottom: 10px;
    }
  }
}
</style>
