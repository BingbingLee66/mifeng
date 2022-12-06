<template>
  <div style="position: relative">
    <div v-show="show" class="mask" @click="$emit('change', false)">
      <div class="save-dialog" @click.stop>
        <slot>
          <div class="save-default" />
        </slot>
        <div v-if="showSaveBtn" class="save-footer" :loading="isLoading" @click="saveImage">保存图片</div>
        <i class="save-close el-icon el-icon-close" @click="$emit('change', false)" />
      </div>
    </div>
    <div class="print">
      <slot :id="sid">
        <div class="save-default" />
      </slot>
    </div>
  </div>
</template>

<script>
import { generatePictureByDomId } from '../util'
import { downloadFile } from '@/utils/index'

export default {
  components: {},
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showSaveBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sid: `save${this._uid}`,
      isLoading: false
    }
  },
  methods: {
    async saveImage() {
      this.isLoading = true
      try {
        await this.$nextTick()
        const imgUrl = await generatePictureByDomId(this.sid)
        console.log(imgUrl)
        downloadFile({ title: this.title, url: imgUrl })
      } catch (error) {
        console.log(error)
      }
      this.isLoading = false
    }
  }
}
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
