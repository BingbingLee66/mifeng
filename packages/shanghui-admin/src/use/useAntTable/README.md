# useAntTable

整合了ant-design-vue 中 table 组件的使用逻辑。让开发人员只关注表格数据的请求方式，简化其他的逻辑编写

## 输入参数

| 参数    | 类型                 | 描述                       |
| ------- | -------------------- | -------------------------- |
| fetchFn | IFetchFn             | 请求表格数据的函数         |
| loading | Ref<boolean>（选填） | 根据表格是否加载而改变状态 |

## 输出内容

| 参数              | 类型                               | 描述                                                         |
| ----------------- | ---------------------------------- | ------------------------------------------------------------ |
| pagination        | Ant 中的 pagination。              | 用于传入 a-table 组件中的 **pagination**                     |
| handleTableChange | function                           | 用于传入 a-table 组件中的 **change** 事件                    |
| fetchTableData    | (isReset?:boolean) => Promise<any> | 封装 传入 useAntTable 的 fetchFn。统一使用这个函数触发请求列表数据，而不要使用 fetchFn。isReset 参数表示是否重置表格的页数 |
| loading           | Ref<boolean>                       | 表格加载状态                                                 |

## 例子

### 基本用法

```vue
<template>
	<a-table
      row-key="edge_device_id"
      size="middle"
      bordered
      :columns="columns"
      :data-source="devices"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
</template>
<script>
  import { useAntTable } from '....'
	export default defineComponent({
    setup() {

				const devices = ref([])

      	let { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
        fetchFn: async pageOption => {
          // 处理 conditionQuery
          let conditionQuery = {
            limit: pageOption.pageSize,
            page: pageOption.current,
            query: { .... }
          }

          // 请求数据
          let {
            data: {
              data: { list, total },
            },
          } = await getVideoDeviceList(conditionQuery)

          devices.value = list

          // 输出总数
          return {
            total,
          }
        },
      })
      
      // 在页面加载后请求数据
      onMounted(() => {
        fetchTableData(true)
      })
          
      return {
        pagination, handleTableChange, fetchTableData, loading, devices
      }
    }
  })
</script>
```

### 获取数据加载状态

有两种方法获取数据的加载状态

```javascript

setup () {
  // 方法一 通过传入 loading ref, useAntTable 内部会自动改变 loading 状态
  const loading = ref(false)
  let {} = useAntTable({
    fetchFn: () => {},
    loading: loading
  })
  
  // 方法二 读取返回的 loading ref。
  let { loading } = useAntTable({
    fetchFn: () => {},
  })
}
```

