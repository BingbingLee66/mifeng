<template>
  <PlusTable :columns="columns" :data-source="tableData" :loading="loading" :customRow="customRow">
    <template #toolBar>
      <a-button type="primary" @click="goAddBanner" v-action="'添加轮播图'"><plus-outlined />添加轮播图</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'sort'">
        <a-tooltip placement="bottomLeft" title="拖动排序" arrow-point-at-center>
          <menu-outlined />
        </a-tooltip>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <a-button class="p0" type="link" @click="goEditBanner(record)"> 编辑 </a-button>
        <a-button class="p0 pl10" type="link" @click="onDel(record)" danger> 删除 </a-button>
      </template>
    </template>
  </PlusTable>
</template>

<script>
import { defineComponent, inject, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
import { getBannerImgList, delBanner, dragBannerImg } from '@/api/content/bannerImg'
import { useRouter } from 'vue-router'
import { BANNER_DETAIL } from '@/constant'
import PlusTable from '@/components/plusTable/PlusTable.vue'
// 表格相关
function useTable() {
  const ckey = inject('ckey')
  const tableData = ref([])
  const { fetchTableData, loading } = useAntTable({
    async fetchFn() {
      const {
        data: { data }
      } = await getBannerImgList({
        ckey: ckey.value,
        type: 1,
        pageNum: 1,
        pageSize: 10,
        clientType: 0
      })
      tableData.value = data.list
      return { total: data.totalRows }
    }
  })
  fetchTableData()
  return {
    tableData,
    loading,
    fetchTableData
  }
}

export default defineComponent({
  components: {
    PlusTable
  },
  setup() {
    const router = useRouter()
    const table = useTable()
    const columns = [
      { title: '排序', dataIndex: 'sort', width: 120 },
      { title: '序号', customRender: ({ index }) => index + 1, width: 80 },
      {
        title: '关联内容',
        customRender: ({ record }) => ({ 1: '文章', 2: '商品', 3: '邀请有礼' }[record.type] || '- -'),
        width: 120
      },
      {
        title: '标题/ID',
        width: 120,
        customRender: ({ record }) => (
          <div>
            <div style="color:red">{record.articleId}</div>
            <div>{record.title || '- -'}</div>
          </div>
        )
      },
      {
        title: '图片',
        customRender: ({ record }) => <img style="width: 153px; height: 60px; object-fit: cover" src={record.img} />
      },
      { title: '更新时间', dataIndex: 'updatedTs' },
      { title: '操作人', dataIndex: 'operator', width: 80 },
      { title: '操作', fixed: 'right', width: 150, dataIndex: 'action' }
    ]

    // 拖动排序
    const sourceObj = ref({})
    const targetObj = ref({})
    let sourceIndex
    let targetIndex
    const customRow = (record, index) => {
      const style = {
        cursor: 'pointer'
      }
      // 鼠标移入
      const onMouseenter = event => {
        // 兼容IE
        const ev = event || window.event
        ev.target.draggable = true
      }
      // 开始拖拽
      const onDragstart = event => {
        // 兼容IE
        const ev = event || window.event
        ev.stopPropagation()
        // 得到源目标数据
        sourceObj.value = record
        sourceIndex = index
      }
      // 拖动元素经过的元素
      const onDragover = event => {
        // 兼容 IE
        const ev = event || window.event
        // 阻止默认行为
        ev.preventDefault()
        const list = document.getElementsByClassName('ant-table-row')
        const node = document.getElementsByClassName('target')
        if (node.length) {
          node[0].classList.remove('target')
        }
        list[index].classList.add('target')

        ev.dataTransfer.dropEffect = 'move'
        targetIndex = index
      }

      const onDragenter = event => {
        // 兼容 IE
        const ev = event || window.event
        // 阻止默认行为
        ev.preventDefault()
      }
      // 鼠标松开
      const onDrop = async event => {
        // 兼容IE
        const ev = event || window.event
        // 阻止冒泡
        ev.stopPropagation()
        // 得到目标数据
        targetObj.value = record
        targetIndex = index
        const node = document.getElementsByClassName('target')
        if (node.length) {
          node[0].classList.remove('target')
        }
        if (targetIndex === sourceIndex) return
        table.tableData.value.splice(sourceIndex, 1)
        table.tableData.value.splice(targetIndex, 0, sourceObj.value)
        const ids = table.tableData.value.map(item => {
          return item.id
        })
        const { state, msg } = await dragBannerImg(ids)
        if (state === 1) {
          message.success('操作成功')
        } else {
          message.error(msg)
        }
        table.fetchTableData()
      }
      return {
        style,
        onMouseenter,
        onDragstart,
        onDragover,
        onDragenter,
        onDrop
      }
    }
    return {
      ...table,
      columns,
      onDel(record) {
        Modal.confirm({
          title: '确定删除？',
          async onOk() {
            const { state, msg } = await delBanner({ id: record.id })
            if (state !== 1) throw msg
            table.fetchTableData()
          }
        })
      },
      goAddBanner() {
        localStorage.setItem(BANNER_DETAIL, '')
        router.push('/add-carousel')
      },
      goEditBanner(record) {
        localStorage.setItem(BANNER_DETAIL, JSON.stringify(record))
        router.push('/edit-carousel')
      },
      customRow
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.ant-table-tbody > tr.target > td) {
  border-top: 2px #f4c820 dashed;
}
</style>
