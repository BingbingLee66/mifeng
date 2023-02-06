# TableFilter 表格页面头部过滤组件
# TableFilterItem 过滤项

用于带有筛选项的表格页面

## TableFilter输入参数
| 参数    | 类型                 | 描述                       |
| ------- | -------------------- | -------------------------- |
| title | String             | 标题         |
| clearable | Boolean | 是否展示拓展项（重置、查询、收起、隐藏） |
| showAll | Boolean | 是否展示全部插槽内容不做隐藏 |
| count | Number（选填） | 展示的数量 |
| labelWidth | String（选填） | 过滤项label宽度 |

## TableFilterItem输入参数
| 参数    | 类型                 | 描述                       |
| ------- | -------------------- | -------------------------- |
| label | String             | 过滤项label         |
| labelWidth | String（选填） | 过滤项label宽度 |

## 例子

### 基本用法

```vue
<template>
  <div class="information-wrap">
    <Panel>
      <TableFilter label-width="80" @reset="resetFilters" @fetch="fetchTableData" clearable>
        <TableFilterItem label="标题名称">
          <AInput v-model:value="tableFilter.title" placeholder="标题" style="width: 300px" />
        </TableFilterItem>
      </TableFilter>
    </Panel>

    <Panel>
      <ATable
          :loading="loading"
          :dataSource="tableData"
          :columns="cols"
          :scroll="{ x: 'max-content' }"
          :pagination="pagination"
          @change="handleTableChange"
      />
    </Panel>
  </div>
</template>
<script>
import { toRefs, reactive, defineComponent } from 'vue'
import { useResetFilter } from '@/use/useResetFilter'

export default defineComponent({
  setup() {
    const tableFilter = reactive({
      title: '',
    })

   const fetchTableData = () => {
      // 获取页面数据
   }
    
  return {
    ...useResetFilter({ ...toRefs(tableFilter) }),
  }
}
})
</script>
```

