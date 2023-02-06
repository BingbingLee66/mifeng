<template>
  <AddColumn v-model:addColumnVisible="addColumnVisible" @freshData="fetchTableData(true)" v-model:editObj="editObj" />
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8" @change="fetchTableData(true)">
    <a-tab-pane key="3" tab="商会文章" />
    <a-tab-pane key="4" tab="关于商会" force-render />
  </a-tabs>
  <PlusTable
    row-key="edge_device_id"
    :loading="loading"
    :scroll="{ x: 'max-content' }"
    :columns="ArticleListCols"
    :data-source="tableData"
    :pagination="pagination"
    @change="handleTableChange"
    bordered
  >
    <template #toolBar>
      <AButton type="primary" @click="addColumn" v-action="`${tabMap.get(activeName)}-新增栏目`"
        ><plus-outlined />新增栏目</AButton
      >
    </template>
    <template #headerCell="{ column }">
      <template v-if="column.key === 'committee'">
        是否给专委会使用
        <ATooltip>
          <template #title>开启后，专委会可以发文到栏目下</template>
          <question-circle-filled />
        </ATooltip>
      </template>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'id'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'level'">
        <AButton type="link" @click="setLevel(record)">{{ record.level }}</AButton>
      </template>
      <template v-if="column.key === 'createdTs'">
        <div>{{ record.operator }}</div>
        <div>{{ record.createdTs }}</div>
      </template>
      <template v-if="column.key === 'updateTs'">
        <div>{{ record.updater }}</div>
        <div>{{ record.updatedTs }}</div>
      </template>
      <template v-if="column.key === 'status'">
        <a-badge :status="STATUS_POINT_MAP.get(+record.status)" />
        <span v-if="record.status === Column_STATUS.freeze">已冻结</span>
        <span v-if="record.status === Column_STATUS.normal">正常</span>
        <span v-if="record.status === Column_STATUS.fixed">固定栏位</span>
      </template>
      <template v-if="column.key === 'committee'">
        <div>
          <ASwitch
            style="width: 55px"
            v-model:checked="record.isSpecialCommitteeBol"
            :disabled="record.columnName === '会员分享'"
            @change="handleSpecialCommitteeChange($event, record)"
          />
        </div>
      </template>
      <template v-if="column.key === 'handle'">
        <AButton
          type="link"
          v-action="`${tabMap.get(activeName)}-编辑`"
          v-if="record.columnName !== '会员分享'"
          :disabled="record.status === Column_STATUS.fixed"
          @click="editColumn(record)"
        >
          编辑
        </AButton>
        <AButton
          type="link"
          v-action="`${tabMap.get(activeName)}-冻结`"
          v-if="record.status === Column_STATUS.normal"
          @click="updateState(record)"
          danger
        >
          冻结
        </AButton>
        <AButton
          type="link"
          v-action="`${tabMap.get(activeName)}-解冻`"
          v-if="record.status === Column_STATUS.freeze"
          @click="updateState(record)"
        >
          解冻
        </AButton>
      </template>
    </template>
  </PlusTable>
  <SetLevel v-model:setLevelVisible="setLevelVisible" @freshData="fetchTableData()" :levelObj="levelObj" />
</template>

<script src="./columnsetup.js"></script>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
