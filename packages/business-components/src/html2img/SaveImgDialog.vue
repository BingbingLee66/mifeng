<template>
  <div style="position: relative">
    <div v-show="visible" class="mask" @click="$emit('update:visible', false)">
      <div class="save-dialog" @click.stop>
        <slot>
          <div class="save-default" />
        </slot>

        <a-button class="save-footer" @click="saveImage" :loading="isLoading">
          保存图片
        </a-button>
        <i
          class="save-close el-icon el-icon-close"
          @click="$emit('update:visible', false)"
        />
      </div>
    </div>
    <div class="print">
      <slot :id="sid">
        <div class="save-default" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { generatePictureByDomId } from "@business/logics/src/generatePictureByDomId";
import { downloadFile } from "@business/common/src/utils";
import { ref } from "vue";

/** 
  * 示例
  * <SaveImgDialog
              ref="codeDialog"
              v-model:visible="qrCodeDialog.show"
              :title="qrCodeDialog.title">
              <template v-slot="{ id }">      // required
                <SignInCode
                  :id="id"     // required
                  :title="qrCodeDialog.title"
                  :url="qrCodeDialog.url"
                />
              </template>
            </SaveImgDialog>
  *  */
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  /** 标题 */
  title: {
    type: String,
    default: "",
  },
});
const sid = "save" + Date.now();
const isLoading = ref(false);
const saveImage = async () => {
  isLoading.value = true;
  try {
    const imgUrl = await generatePictureByDomId(sid);
    downloadFile({ title: props.title, url: imgUrl });
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};
defineExpose({ saveImage });
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba($color: #000000, $alpha: 0.5);
  z-index: 999;
}

.save-dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .save-default {
    width: 526px;
    height: 496px;
    background-color: #fff;
    border-radius: 6px;
  }

  .save-footer {
    position: absolute;
    right: 16px;
    bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 98px;
    height: 34px;
    background: linear-gradient(360deg, #e53b4d 0%, #ea5755 100%);
    border-radius: 2px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }

  .save-close {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 16px;
    cursor: pointer;
  }
}

.print {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -999;
  opacity: 0;
}
</style>
