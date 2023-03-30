<template>
  <div class="preview-wrap flex-y-center-center">
    <img class="preview-bg" :src="phone" />
    <div class="preview-content-wrap">
      <div class="preview-content">
        <slot />
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
import { useImgUrlAdmin } from '@business/common/src/utils/useImgUrl'
const phone = useImgUrlAdmin('test/5g/phone-bg.png')
</script>

<style lang="scss" scoped>
.preview-wrap {
  width: 364px;
  position: relative;
  padding: 16px 32px;
  z-index: 1;

  .preview-bg {
    position: absolute;
    width: 300px;
    height: 554px;
    top: 16px;
    left: 32px;
    z-index: -1;
  }

  .preview-content-wrap {
    width: 300px;
    height: 554px;
    padding: 40px 35px 30px 30px;

    .preview-content {
      width: calc(100% + 10px);
      height: 100%;
      padding-right: 10px;
      border-radius: 7px;
      overflow: auto;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
      }
    }
  }
}
:deep(.ant-modal-footer) {
  text-align: center;
}
:deep(.ant-btn.ant-btn-link) {
  padding: 0;
}
:deep(.ant-btn-link) {
  color: #f4c820 !important;
}
</style>
