<template>
  <a-tabs v-model:activeKey="tableFilter.contentModuleId" @change="handleTabsChange" class="bg-white pl-8">
    <a-tab-pane :key="CHAMBER_TAB.article" tab="商会文章" />
    <a-tab-pane :key="CHAMBER_TAB.about" tab="关于商会" force-render />
    <a-tab-pane :key="CHAMBER_TAB.honor" tab="商会荣誉" />
  </a-tabs>

  <PlusTable
    v-show="tableFilter.contentModuleId === CHAMBER_TAB.article"
    row-key="edge_device_id"
    :loading="loading"
    :scroll="{ x: 'max-content' }"
    :columns="column"
    :data-source="tableData"
    :pagination="orgPageOption"
    @change="handleTableChange"
    bordered
    :request="handleSearch"
  >
    <template #toolBar>
      <AButton v-action="'商会资讯-查询'" type="primary" @click="AddOrEdit"> <plus-outlined />创建文章 </AButton>
      <AButton class="ml-4" @click="toStick">置顶管理</AButton></template
    >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'readCount'">
        {{ record.readCount ? record.readCount : '--' }}
      </template>
      <template v-if="column.key === 'createdTs'">
        <div>{{ record.operator }}</div>
        <div>{{ record.createdTs }}</div>
      </template>
      <template v-if="column.key === 'publishTs'">
        <div v-if="record.status === ARTICLE_STATUS.normalSetTime">定时发布</div>
        {{ record.publishTs }}
      </template>
      <template v-if="column.key === 'status'">
        <div
          v-if="
            record.status === ARTICLE_STATUS.normal &&
            (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
              record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
          "
        >
          <a-badge status="success" />
          已发布
        </div>
        <div
          v-if="
            record.status === ARTICLE_STATUS.freezeByChamber &&
            (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
              record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
          "
        >
          <a-badge status="error" />
          已冻结(商会)
        </div>
        <div
          v-if="
            record.status === ARTICLE_STATUS.freezeByPlatform &&
            (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
              record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
          "
        >
          <a-badge status="error" />
          已冻结(平台)
        </div>
        <div
          v-if="
            record.status === ARTICLE_STATUS.normalSetTime &&
            (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
              record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
          "
        >
          <a-badge status="processing" />
          定时发布
        </div>
        <div
          v-if="
            record.auditStatus === ARTICLE_AUDITSTATYUS.noPassByChamber ||
            record.auditStatus === ARTICLE_AUDITSTATYUS.noPassedByPlatform
          "
        >
          <a-badge status="error" />
          审核不通过
        </div>
      </template>
      <template v-if="column.key === 'isChamberTop'">
        {{ record.isChamberTop === 1 ? '是' : '否' }}
      </template>
      <template v-if="column.key === 'handle'">
        <AButton type="link" :disabled="record.isChamberTop === 1" @click="showStickModal(record)">置顶</AButton>
        <AButton
          type="link"
          v-action="'商会资讯-编辑'"
          :disabled="record.articleType === DISABLE_Edit_ARTICLE"
          @click="AddOrEdit(record)"
        >
          编辑
        </AButton>
        <AButton
          type="link"
          v-action="'商会资讯-冻结'"
          v-if="record.status === ARTICLE_STATUS.normal || record.status === ARTICLE_STATUS.normalSetTime"
          @click="updateState(record)"
          danger
        >
          冻结
        </AButton>
        <AButton
          type="link"
          v-action="'商会资讯-解冻'"
          v-if="record.status == ARTICLE_STATUS.freezeByChamber"
          @click="updateState(record)"
        >
          解冻
        </AButton>
        <AButton type="link" v-action="'商会资讯-详情'" @click="openDetail(record)">详情</AButton>
        <AButton type="link" @click="delArticle(record)" danger>删除</AButton>
      </template>
    </template>
  </PlusTable>
  <PlusTable
    row-key="edge_device_id"
    :loading="loading"
    :scroll="{ x: 'max-content' }"
    :columns="AboutListCols"
    :data-source="tableData"
    :pagination="orgPageOption"
    @change="handleTableChange"
    bordered
    v-show="tableFilter.contentModuleId === CHAMBER_TAB.about"
  >
    <template #toolBar>
      <AButton type="primary" @click="addColumn"><plus-outlined />新增栏目</AButton>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'id'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'contentHtml'">
        <div class="content-box" v-html="record.contentHtml" />
      </template>
      <template v-if="column.key === 'sort'">
        <AButton type="link" @click="setLevel(record)">{{ record.sort }}</AButton>
      </template>
      <template v-if="column.key === 'createdTs'">
        <div>{{ record.operator }}</div>
        <div>{{ record.createdTs }}</div>
      </template>
      <template v-if="column.key === 'updatedTs'">
        <div>{{ record.updater }}</div>
        <div>{{ record.updatedTs }}</div>
      </template>
      <template v-if="column.key === 'status'">
        <div
          v-if="
            record.status === ARTICLE_STATUS.normal &&
            (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
              record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
          "
        >
          <a-badge status="success" />
          已发布
        </div>
        <div
          v-if="
            record.status === ARTICLE_STATUS.freezeByChamber &&
            (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
              record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
          "
        >
          <a-badge status="error" />
          已冻结(商会)
        </div>
        <div
          v-if="
            record.status === ARTICLE_STATUS.freezeByPlatform &&
            (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
              record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
          "
        >
          <a-badge status="error" />
          已冻结(平台)
        </div>
        <div
          v-if="
            record.status === ARTICLE_STATUS.normalSetTime &&
            (record.auditStatus === ARTICLE_AUDITSTATYUS.passedByChamber ||
              record.auditStatus === ARTICLE_AUDITSTATYUS.passedByPlatform)
          "
        >
          <a-badge status="processing" />
          定时发布
        </div>
        <div
          v-if="
            record.auditStatus === ARTICLE_AUDITSTATYUS.noPassByChamber ||
            record.auditStatus === ARTICLE_AUDITSTATYUS.noPassedByPlatform
          "
        >
          <a-badge status="error" />
          审核不通过
        </div>
      </template>
      <template v-if="column.key === 'handle'">
        <AButton type="link" @click="openDetail(record)">详情</AButton>
        <AButton type="link" @click="editColumn(record)"> 编辑</AButton>
      </template>
    </template>
  </PlusTable>
  <PlusTable
    row-key="edge_device_id"
    :loading="loading"
    :scroll="{ x: 'max-content' }"
    :columns="HonorListCols"
    :data-source="tableData"
    :pagination="orgPageOption"
    @change="handleTableChange"
    bordered
    v-show="tableFilter.contentModuleId === CHAMBER_TAB.honor"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'id'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'contentHtml'">
        <div class="content-box" style="max-width: 700px" v-html="record.contentHtml" />
      </template>
      <template v-if="column.key === 'createdTs'">
        <div>{{ record.operator }}</div>
        <div>{{ record.createdTs }}</div>
      </template>
      <template v-if="column.key === 'updatedTs'">
        <div>{{ record.updater }}</div>
        <div>{{ record.updatedTs }}</div>
      </template>
      <template v-if="column.key === 'handle'">
        <AButton type="link" @click="openDetail(record)">详情</AButton>
        <AButton type="link" @click="editColumn(record)"> 编辑</AButton>
      </template>
    </template>
  </PlusTable>
  <AddColumn
    v-model:addColumnVisible="addColumnVisible"
    @freshData="fetchData({ ...pageOption, ...search })"
    :editObj="editObj"
  />
  <SetLevel
    v-model:setLevelVisible="setLevelVisible"
    @freshData="fetchData({ ...pageOption, ...search })"
    :levelObj="levelObj"
  />
  <AModal v-model:visible="contentHtmlVisible" title="详情" :footer="null" width="100%" :centered="true">
    <div class="detail-body">
      <div class="detail-title">{{ ModelContent.title }}</div>
      <div class="detail-content" v-html="ModelContent.html" />
    </div>
  </AModal>
  <!-- 置顶弹窗 -->
  <a-modal v-model:visible="stickShow" title="置顶设置" width="500px" @ok="updateTop" @cancel="cancelTop">
    <a-form :model="formState" ref="stickForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="置顶时间" name="stickTime" :rules="[{ required: true, message: '请输入置顶时间' }]">
        <a-range-picker v-model:value="formState.stickTime" show-time />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script src="./articleupdata.js"></script>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
.content-box {
  max-height: 100px;
  max-width: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgb(192, 192, 192);
  }
}
.detail-body {
  height: 80vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgb(192, 192, 192);
  }
  border: 1px solid #d9dde2;
  .detail-title {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    margin: 40px 40px 20px 40px;
  }
  .detail-content {
    margin: 10px;
  }
}
</style>
