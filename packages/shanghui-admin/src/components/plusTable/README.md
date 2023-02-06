# plus-table 高级表格

- [plus-table 高级表格](#plus-table-高级表格)
  - [简介](#简介)
  - [功能介绍](#功能介绍)
  - [示例](#示例)
    - [查询表格](#查询表格)
    - [筛选项和表格不统一](#筛选项和表格不统一)
    - [自定义筛选项](#自定义筛选项)
    - [添加自定义工具栏](#添加自定义工具栏)
  - [API](#api)
  - [Slot 插槽](#slot-插槽)
      - [filterItem](#filteritem)
      - [searchToolBar](#searchtoolbar)
      - [toolBar](#toolbar)
  - [类型说明](#类型说明)
    - [FilterItemType](#filteritemtype)
    - [SearchConfig](#searchconfig)

## 简介

此组件是秘锋表格通用组件，使用 antd 表格和表单进行封装，所有表格都可用此组件为基础拓展。

## 功能介绍

功能总体分为 filter 和 table 两大块功能

**筛选**

筛选功能是用 antd 的 form 表单功能进行封装的，提供 `request` 钩子函数

**表格**

表格是通过 antd 的 table 表格进行封装，继承 antd table 的所有功能，在其基础上添加了 筛选、工具栏、标题等功能

## 示例

### 查询表格

```vue
<template>
  <PlusTable :columns="columns" :data-source="dataSource" :request="handlerSearch"> </PlusTable>
</template>

<script setup>
import PlusTable from '@/components/plusTable/PlusTable.vue'

const handlerSearch = value => {
  console.log(value)
  // getDataSource
}

const columns = [
  {
    title: '供需Id',
    dataIndex: 'id',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '啦啦啦'
    }
  },
  {
    title: '供需状态',
    dataIndex: 'status',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '全部', value: 'all' },
        { label: '正常', value: 'normal' }
      ]
    }
  },
  {
    title: '冻结状态',
    dataIndex: 'freezeStatus',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '全部', value: 'all' },
        { label: '正常', value: 'normal' }
      ]
    }
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    filter: true,
    valueType: 'dateTimeRange',
    formItemProps: { valueFormat: 'YYYY-MM-DD' }
  },
  { title: '供需ID', dataIndex: 'demandId', filter: true, valueType: 'text' }
]

const dataSource = [
  {
    id:1,
    title: '供需--标题1',
    status: 1,
    freezeStatus: 1,
    publishTime: '2020 - 221',
    demandId: 122
  }
]
</script>
```

### 筛选项和表格不统一

```vue
<template>
  <PlusTable :columns="columns"  :data-source="dataSource"> </PlusTable>
</template>

<script setup>
import PlusTable from '@/components/plusTable/PlusTable.vue'
const columns = [
  {
    title: '供需标题/id/test',
    dataIndex: 'title',
    filter:true,
    hideInTable:true,
    valueType: 'text',
    formItemProps: {
      placeholder: '啦啦啦'
    }
  },
  {
    title: '供需标题',
    dataIndex: 'title',
  },
  {
    title: '供需状态',
    dataIndex: 'status',
  },
  {
    title: '冻结状态',
    dataIndex: 'freezeStatus',
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
  },
  { title: '供需ID', dataIndex: 'demandId'}
]
const dataSource = [
  {
    title: '供需--标题1',
    status: 1,
    freezeStatus: 1,
    publishTime: '2020 - 221',
    demandId: 122,
    id:1
  }
]
</script>
```



### 自定义筛选项

```vue
<template>
  <PlusTable :columns="columns"  :data-source="dataSource" :request="handlerSearch"> 
     <template #filterItem="{ column }">
        <template v-if="column.dataIndex === 'id'">
            {{column}}
      </template>
    </template>
  </PlusTable>
</template>

<script setup>
import PlusTable from '@/components/plusTable/PlusTable.vue'

const columns = [
  {
    title: '供需Id',
    dataIndex: 'id',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '啦啦啦'
    }
  },
  {
    title: '供需状态',
    dataIndex: 'status',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '全部', value: 'all' },
        { label: '正常', value: 'normal' }
      ]
    }
  },
  {
    title: '冻结状态',
    dataIndex: 'freezeStatus',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '全部', value: 'all' },
        { label: '正常', value: 'normal' }
      ]
    }
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    filter: true,
    valueType: 'dateTimeRange',
    formItemProps: { valueFormat: 'YYYY-MM-DD' }
  },
  { title: '供需ID', dataIndex: 'demandId', filter: true, valueType: 'text' }
]

const dataSource = [
  {
    id:1,
    title: '供需--标题1',
    status: 1,
    freezeStatus: 1,
    publishTime: '2020 - 221',
    demandId: 122
  }
]
</script>
```

### 添加自定义工具栏

```vue
<template>
  <PlusTable :columns="columns"  :data-source="dataSource" :request="handlerSearch"> </PlusTable>
</template>

<script setup>
import PlusTable from '@/components/plusTable/PlusTable.vue'

const handlerSearch = value => {
  console.log(value)
  // getDataSource
}

const columns = [
  {
    title: '供需Id',
    dataIndex: 'id',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '啦啦啦'
    }
  },
  {
    title: '供需状态',
    dataIndex: 'status',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '全部', value: 'all' },
        { label: '正常', value: 'normal' }
      ]
    }
  },
  {
    title: '冻结状态',
    dataIndex: 'freezeStatus',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '全部', value: 'all' },
        { label: '正常', value: 'normal' }
      ]
    }
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    filter: true,
    valueType: 'dateTimeRange',
    formItemProps: { valueFormat: 'YYYY-MM-DD' }
  },
  { title: '供需ID', dataIndex: 'demandId', filter: true, valueType: 'text' }
]

const dataSource = [
  {
    id:1,
    title: '供需--标题1',
    status: 1,
    freezeStatus: 1,
    publishTime: '2020 - 221',
    demandId: 122
  }
]
</script>
```





## API

| 属性        | 描述                                                         | 类型     | 默认值   |
| ----------- | ------------------------------------------------------------ | -------- | -------- |
| request     | 获取 `dataSource` 的方法，查询表单时会触发此函数，返回查询筛选项的字段 | Function | -        |
| columns     | Table 的列定义，继承 antd tabel ，同时又是表单筛选项定义，参考 `FilterItemType` | Array    | -        |
| headerTitle | 表格标题                                                     | String   | 表格标题 |
| dataSource  | Table 的数据                                                 | Array    | -        |

## Slot 插槽

#### filterItem

可以通过此插槽来自定义表单项

参数:

- column : 当前筛选项的数据

#### searchToolBar

可以通过此插槽来自定义筛选表单工具栏

参数:

- form : 当前筛选表单的实例，可通过实例操作表单

#### toolBar

可以通过此插槽来自定义工具栏

## 类型说明

### FilterItemType

| 属性          | 描述                                                 | 类型                                | 默认值 | 是否必传 |
| ------------- | ---------------------------------------------------- | ----------------------------------- | ------ | -------- |
| title         | 筛选项标题                                           | string                              | -      | 是       |
| dataIndex     | 筛选项字段                                           | string                              | -      | 是       |
| filter        | 字段是否要筛选                                       | boolean                             | -      | 否       |
| initialValue  | 筛选项默认值                                         | any                                 | -      | 否       |
| span          | 筛选项所占比例                                       | number                              | 6      | 否       |
| valueType     | 筛选的类型                                           | 'text' \|'select'\| 'dateTimeRange' | -      | 否       |
| search        | 搜索表单的配置                                       | false\|SearchConfig                 | -      | 否       |
| formItemProps | 筛选项的具体配置，会直接透传到对应筛选项的表单组件上 | object                              | -      | 否       |

### SearchConfig

| 属性             | 描述             | 类型    | 默认值 |
| ---------------- | ---------------- | ------- | ------ |
| hiddenNum        | 表单隐藏数量 | number  | 3      |
| defaultCollapsed | 默认是否收起     | boolean | true   |

