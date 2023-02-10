<template>
  <Panel>
    <AForm ref="formRef" :model="formObj" :rules="rules" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
      <AFormItem label="文章标题：" name="title" v-if="formObj.contentModuleId === 6" has-feedback>
        <AInput
          :showCount="true"
          :maxlength="60"
          allowClear
          v-model:value="formObj.columnContent"
          placeholder="限输入5-60个字的标题"
          disabled
        />
      </AFormItem>
      <AFormItem label="文章内容" name="content">
        <WangEditor ref="editorElem" v-model:content="formObj.contentHtml" />
      </AFormItem>
      <ARow>
        <ACol :push="2" :span="6">
          <AButton type="primary" v-dbClick @click="toSave">确定</AButton>
          <AButton @click="closeTab" style="margin-left: 20px">取消</AButton>
        </ACol>
      </ARow>
    </AForm>
  </Panel>
</template>

<script src="./artcolum.js"></script>

<style lang="scss" scoped>
:deep(.editor) {
  width: 100%;
}
// fix:菜单换行下拉框弹出遮挡
:deep(.w-e-menu) {
  z-index: auto !important;
  .w-e-droplist {
    z-index: 3 !important;
  }
}
</style>
