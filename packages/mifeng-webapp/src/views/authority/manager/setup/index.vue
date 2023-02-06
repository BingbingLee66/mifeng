<template>
  <panel>
    <div>
      <a-checkbox :indeterminate="isIndeterminate" v-model:checked="checkAll" @change="onCheckAllChange"
        >全选</a-checkbox
      >
    </div>
    <div>
      <a-checkbox-group v-model:value="checkList">
        <a-table
          :dataSource="list"
          :loading="listLoading"
          :columns="columns"
          border
          :pagination="false"
          style="width: 100%"
        >
          <template #bodyCell="{ record, column }">
            <template v-if="column.dataIndex == 'level1'">
              <a-checkbox
                v-if="record[column.dataIndex] != '——'"
                :value="record.pMenuId + '@menu1'"
                @change="changeChecked(`${record.pMenuId}@menu1`, record)"
              >
                {{ record[column.dataIndex] }}
              </a-checkbox>
            </template>
            <template v-if="column.dataIndex == 'level2'">
              <a-checkbox
                v-if="record[column.dataIndex] != '——'"
                :value="record.cMenuId + '@menu2'"
                @change="changeChecked(`${record.cMenuId}@menu2`, record)"
              >
                {{ record[column.dataIndex] }}
              </a-checkbox>
            </template>
            <template v-if="column.dataIndex == 'level3'">
              <a-checkbox
                v-if="record[column.dataIndex] != '——'"
                :value="record.tabId + '@tab'"
                @change="changeChecked(`${record.tabId}@tab`, record)"
              >
                {{ record[column.dataIndex] }}
              </a-checkbox>
            </template>
            <template v-if="column.dataIndex == 'level4'">
              <a-checkbox
                v-if="record[column.dataIndex] != '——'"
                :value="record.id + '@auth'"
                @change="changeChecked(`${record.id}@auth`, record)"
              >
                {{ record[column.dataIndex] }}
              </a-checkbox>
            </template>
          </template>
        </a-table>
      </a-checkbox-group>
    </div>
    <br />
    <div>
      <a-button type="primary" @click="saveChoose">确定</a-button>
    </div>
  </panel>
</template>
<script>
import { ref } from 'vue'
import { getActionList, getRoleActions, save } from '@/api/authority/setup'
import { useRoute, useRouter } from 'vue-router'
export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { roleId } = route.query
    const { isIndeterminate, list, listLoading, checkAllCount, checkList, checkAll, columns } = fetchData(roleId)
    const { changeChecked } = toChangeChecked()

    const saveChoose = () => {
      const data = {
        roleId,
        actions: checkList.value
      }
      saveChooses()

      async function saveChooses() {
        await save(data)
        router.push('/authority/manager')
      }
    }

    const onCheckAllChange = () => {
      checkList.value = []
      if (checkAll.value) {
        // 全选中
        const cList = []
        for (const obj of list.value) {
          if (obj.pMenuId) {
            cList.push(obj.pMenuId + '@menu1')
          }
          if (obj.cMenuId) {
            cList.push(obj.cMenuId + '@menu2')
          }
          if (obj.tabId) {
            cList.push(obj.tabId + '@tab')
          }
          if (obj.id) {
            cList.push(obj.id + '@auth')
          }
        }
        for (const cobj of cList) {
          if (checkList.value.indexOf(cobj) === -1) {
            checkList.value.push(cobj)
          }
        }
        isIndeterminate.value = false
        checkAll.value = true
      } else {
        // 取消全选中
        isIndeterminate.value = false
        checkAll.value = false
      }
    }

    function fetchData(roleId) {
      const isIndeterminate = ref(false)
      const listLoading = ref(false)
      const list = ref([])
      const cList = []
      const checkList = ref([])
      const checkAllCount = ref(0)
      const checkAll = ref(false)
      const spanArr1 = ref([1])
      const spanArr2 = ref([1])
      const spanArr3 = ref([1])
      const spanArr4 = ref([1])

      async function getAction() {
        listLoading.value = true
        // 把表格按照一行一行划分，每一行有哪四个标签，level1 level2 level3 level4
        const {
          data: { data }
        } = await getActionList()
        list.value = data
        // 添加标记
        for (const obj of list.value) {
          if (obj.pMenuId) {
            cList.push(obj.pMenuId + '@menu1')
          }
          if (obj.cMenuId) {
            cList.push(obj.cMenuId + '@menu2')
          }
          if (obj.tabId) {
            cList.push(obj.tabId + '@tab')
          }
          if (obj.id) {
            cList.push(obj.id + '@auth')
          }
        }

        // 去重 ———— 只是为了取数量
        for (const cobj of cList) {
          if (checkList.value.indexOf(cobj) === -1) {
            checkList.value.push(cobj)
          }
        }
        checkAllCount.value = checkList.value.length
        checkList.value = []
        roleActions()
        getSpanArr(list.value)
        listLoading.value = false
      }

      // 获得目前所允许的权限操作
      async function roleActions() {
        // 使用roleId为0做测试
        const {
          data: { data }
        } = await getRoleActions({ roleId })
        checkList.value = data

        // 已全选
        if (checkAllCount.value === checkList.value.length) {
          isIndeterminate.value = false
          checkAll.value = true
        }
      }

      function getSpanArr(data) {
        const pos = [0, 0, 0, 0]
        const levelArr = ['level1', 'level2', 'level3', 'level4']
        const spanVal = [spanArr1.value, spanArr2.value, spanArr3.value, spanArr4.value]
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < levelArr.length; j++) {
            // 判断哪一级没有数据
            if (!data[i][levelArr[j]]) {
              data[i][levelArr[j]] = '——'
            }
            if (i > 0) {
              // 判断当前元素与上一个元素是否相同
              // spanArr 用于统计每级标签中重复标签的数量
              if (data[i][levelArr[j]]) {
                if (data[i][levelArr[j]] === data[i - 1][levelArr[j]]) {
                  spanVal[j][pos[j]] += 1
                  spanVal[j].push(0)
                } else {
                  spanVal[j].push(1)
                  pos[j] = i
                }
              } else {
                data[i][levelArr[j]] = '——'
                spanVal[j].push(1)
                pos[j] = i
              }
            }
          }
        }
      }
      getAction()
      const columns = [
        {
          title: '一级',
          dataIndex: 'level1',
          customCell: (record, rowIndex) => {
            return getRowsCols(spanArr1.value, rowIndex)
          }
        },
        {
          title: '二级',
          dataIndex: 'level2',
          customCell: (record, rowIndex) => {
            return getRowsCols(spanArr2.value, rowIndex)
          }
        },
        {
          title: '三级',
          dataIndex: 'level3',
          customCell: (record, rowIndex) => {
            return getRowsCols(spanArr3.value, rowIndex)
          }
        },
        {
          title: '四级',
          dataIndex: 'level4',
          customCell: (record, rowIndex) => {
            return getRowsCols(spanArr4.value, rowIndex)
          }
        }
      ]

      return { isIndeterminate, list, listLoading, checkAllCount, checkList, checkAll, columns }
    }

    function getRowsCols(spanArrValue, rowIndex) {
      const _row = spanArrValue[rowIndex]
      const _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col
      }
    }

    function toChangeChecked() {
      const changeChecked = (e, record) => {
        // 记录的是操作之后的状态，不是当前的状态
        const checked = checkList.value.indexOf(e) === -1
        if (checked) {
          // 选中
          if (e.indexOf('menu1') !== -1) {
            // 1级
            // 跳过
            addRelatedAuth(record.pMenuId, 1)
          } else if (e.indexOf('menu2') !== -1) {
            // 2级
            // 2级要添加1级选中
            addAuth(record.pMenuId, 'menu1')
            addRelatedAuth(record.cMenuId, 2)
          } else if (e.indexOf('tab') !== -1) {
            // 3级
            // 3级要添加1、2级选中
            addAuth(record.pMenuId, 'menu1')
            addAuth(record.cMenuId, 'menu2')
            addRelatedAuth(record.tabId, 3)
          } else if (e.indexOf('auth') !== -1) {
            // 4级
            // 4级要添加1、2、3级选中
            addAuth(record.pMenuId, 'menu1')
            addAuth(record.cMenuId, 'menu2')
            addAuth(record.tabId, 'tab')
          }
        } else {
          // 取消选中
          if (e.indexOf('menu1') !== -1) {
            // 1级
            // 1级要取消2、3、4级选中
            removeRelatedAuth(record.pMenuId, 1)
          } else if (e.indexOf('menu2') !== -1) {
            // 2级
            // 2级要取消3、4级选中
            removeRelatedAuth(record.cMenuId, 2)
          } else if (e.indexOf('tab') !== -1) {
            // 3级
            // 3级要取消4级选中
            removeRelatedAuth(record.tabId, 3)
          } else if (e.indexOf('auth') !== -1) {
            // 4级
            // 跳过
          }
        }
        if (checkList.value.length === 0) {
          isIndeterminate.value = false
          checkAll.value = false
        } else {
          isIndeterminate.value = true
          checkAll.value = false
          if (checkAllCount === checkList.value.length) {
            isIndeterminate.value = false
            checkAll.value = true
          }
        }
      }

      return { changeChecked }
    }

    function addRelatedAuth(key, level) {
      if (level === 1) {
        // 1级要添加2、3、4级
        for (const obj of list.value) {
          if (obj.pMenuId === key) {
            addAuth(obj.cMenuId, 'menu2')
            addAuth(obj.tabId, 'tab')
            addAuth(obj.id, 'auth')
          }
        }
      } else if (level === 2) {
        // 2级要添加3、4级
        for (const obj of list.value) {
          if (obj.cMenuId === key) {
            addAuth(obj.tabId, 'tab')
            addAuth(obj.id, 'auth')
          }
        }
      } else if (level === 3) {
        // 3级要添加4级
        for (const obj of list.value) {
          if (obj.tabId === key) {
            addAuth(obj.id, 'auth')
          }
        }
      }
    }

    function addAuth(key, subfix) {
      if (!!key && checkList.value.indexOf(key + '@' + subfix) === -1) {
        checkList.value.push(key + '@' + subfix)
      }
    }

    function removeRelatedAuth(key, level) {
      if (level === 1) {
        for (const obj of list.value) {
          if (obj.pMenuId === key) {
            removeAuth(obj.cMenuId, 'menu2')
            removeAuth(obj.tabId, 'tab')
            removeAuth(obj.id, 'auth')
          }
        }
      } else if (level === 2) {
        for (const obj of list.value) {
          if (obj.cMenuId === key) {
            removeAuth(obj.tabId, 'tab')
            removeAuth(obj.id, 'auth')
          }
        }
      } else if (level === 3) {
        for (const obj of list.value) {
          if (obj.tabId === key) {
            removeAuth(obj.id, 'auth')
          }
        }
      }
    }

    function removeAuth(key, subfix) {
      if (key) {
        const index = checkList.value.indexOf(key + '@' + subfix)
        if (index !== -1) {
          checkList.value.splice(index, 1)
        }
      }
    }

    // function closeTab() {
    //   // 退出当前tab, 打开指定tab
    //   let openPath = window.localStorage.getItem('authority-manager')
    //   let tagsViews = this.$store.state.tagsView.visitedViews
    //   let selectView = null
    //   for (let view of tagsViews) {
    //     if (view.path === this.$route.path) {
    //       this.$store.dispatch('tagsView/delView', view).then(() => {
    //         this.$router.push({ path: openPath })
    //       })
    //       break
    //     }
    //   }
    // }

    return {
      isIndeterminate,
      checkList,
      list,
      listLoading,
      checkAllCount,
      checkAll,
      columns,
      changeChecked,
      saveChoose,
      onCheckAllChange
    }
  }
}
</script>
