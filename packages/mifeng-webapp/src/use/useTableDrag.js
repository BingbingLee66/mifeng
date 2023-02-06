import { ref } from 'vue'
export function useDrag(tableData, callback) {
  // 拖动排序
  const sourceObj = ref({})
  const targetObj = ref({})
  let sourceIndex
  let targetIndex
  let MouseY = 0
  let ChangeY = 0
  let isUp = false
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
      const ev = event || window.event
      ev.stopPropagation()
      // 得到源目标数据
      sourceObj.value = record
      sourceIndex = index
      MouseY = ev.clientY
    }
    // 拖动元素经过的元素
    const onDragover = event => {
      const ev = event || window.event
      ev.preventDefault()
      ev.dataTransfer.dropEffect = 'move'
      ev.dataTransfer.effectAllowed = 'move'
      targetIndex = index
      // 判断向上向下
      ChangeY = ev.clientY - MouseY
      MouseY = ev.clientY
      if (ChangeY === 0) return
      onDragleave()
      const list = document.getElementsByClassName('ant-table-row')
      if (ChangeY > 0) {
        // 下移动
        isUp = false
        list[index].classList.add('target-bottom')
      } else {
        isUp = true
        list[index].classList.add('target-top')
      }
    }
    // 拖动到达目标元素
    const onDragenter = event => {
      const ev = event || window.event
      ev.preventDefault()
    }
    const onDragleave = () => {
      const list = document.getElementsByClassName('ant-table-row')
      list[index].classList.remove('target-top', 'target-bottom')
    }
    // 鼠标松开
    const onDrop = event => {
      const ev = event || window.event
      ev.stopPropagation()
      // 得到目标数据
      targetObj.value = record
      targetIndex = index
      MouseY = 0
      ChangeY = 0
      onDragleave()
      if (
        targetIndex === sourceIndex ||
        (!isUp && targetIndex + 1 === sourceIndex) ||
        (isUp && targetIndex - 1 === sourceIndex)
      )
        return
      // 共4种情况 从下向上（目标上/下）插入  从上向下（目标上/下）插入
      if (targetIndex < sourceIndex) sourceIndex++
      if (!isUp) targetIndex++

      tableData.value.splice(targetIndex, 0, sourceObj.value)
      tableData.value.splice(sourceIndex, 1)
      //  回调
      callback && callback(tableData.value)
    }

    return {
      style,
      onMouseenter,
      onDragstart,
      onDragover,
      onDrop,
      onDragenter,
      onDragleave
    }
  }
  return { customRow }
}
