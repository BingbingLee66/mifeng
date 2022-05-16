<template>
  <PublishForm :detail="detail" @submit="onSubmit">
    <el-form-item v-loading="loading">
      <div slot="label">
        <span>供需图片</span>
        <span class="span">选填，最多9张</span>
      </div>
      <div class="image-list">
        <div
          v-for="(file,i) in imgs"
          :key="file"
          draggable
          class="image-item"
          :style="{backgroundImage: `url(${file})`}"
          @dragstart="onDragStart(i)"
        >
          <i class="el-icon-circle-close" @click="handleRemove(file)" />
          <div class="image-preview" @click="openPreviewModal(file)">预览</div>
          <div class="drag-left" @drop="onDrop('left', i)" />
          <div class="drag-right" @drop="onDrop('right', i)" />
        </div>
        <el-upload
          v-show="imgs.length < 9"
          action="#"
          class="image-upload"
          list-type="picture-card"
          :http-request="upload"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <div class="upload-description">
            <i class="el-icon-plus" />
            <span>上传图片</span>
            <span>（{{ imgs.length }} / 9）</span>
          </div>
        </el-upload>
      </div>
    </el-form-item>
    <kdDialog ref="kdDialog" :show-footer="false" dialog-title="" dialog-width="60%">
      <div slot="content">
        <img :src="currentImg" style="max-width:90%">
      </div>
    </kdDialog>
  </PublishForm>
</template>

<script>
import { checkFile, uploadFile } from '@/api/content/article'
import { publishSupplyDemand } from '@/api/home/supplyDemandManger'

export default {
  components: {
    PublishForm: () => import(/* webpackChunkName: "PublishForm" */'./components/PublishForm'),
  },
  data() {
    return {
      imgs: [],
      loading: false,
      currentImg: '',
      detail: null
    }
  },
  created() {
    this.getEditData()
  },
  methods: {
    getEditData() {
      const { isEdit, id } = this.$route.query
      if (!isEdit) return
      const detailMap = JSON.parse(localStorage.getItem('supply_demand_detail') || '{}')
      this.detail = detailMap[id]
      this.imgs = this.detail.yshContentEditVO.imgs || []
    },
    // 图片拖拽排序
    onDragStart(i) {
      this.dragIndex = i
    },
    onDrop(type, i) {
      if (this.dragIndex === i) return
      const dragItem = this.imgs.splice(this.dragIndex, 1)[0]
      if (this.dragIndex < i) i--
      this.imgs.splice(type === 'left' ? i : i + 1, 0, dragItem)
    },
    // 上传前校验
    beforeUpload(file, index) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        this.$message.error('上传图片只能是 JPG 或 PNG 或 GIF 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    // 上传逻辑
    async upload(content) {
      this.loading = true

      let formData = new FormData()
      formData.append('file', content.file)

      try {
        const { state, msg } = await checkFile(formData)
        if (state !== 1) {
          this.$message.error(msg)
          this.loading = false
          return
        }
        const { data } = await uploadFile(formData, 'demand')
        this.imgs.push(data)
      } catch (error) {
        //
      }
      this.loading = false
    },
    // 移除图片
    handleRemove(file) {
      const i = this.imgs.findIndex(v => v === file)
      this.imgs.splice(i, 1)
    },
    // 图片预览
    openPreviewModal(val) {
      this.$refs.kdDialog.show()
      this.currentImg = val
    },

    async onSubmit(params) {
      params.imgs = this.imgs
      params.contentType = 1
      try {
        const { state } = await publishSupplyDemand({
          ...params,
          contentType: 1,
          imgs: this.imgs
        })
        if (state === 1) {
          this.$message({ message: '发布成功', type: 'success' })
          this.$router.push({ path: '/management' })
          return
        }
      } catch (error) { //
      }
      this.$message({ message: '发布失败，请重试', type: 'error' })
    }
  }
}
</script>

<style scoped lang="scss">
  .span {
    color: #bbb;
  }

  .image-list {
    width: 500px;
    display: flex;
    flex-wrap: wrap;
    line-height: 1.15;

    .image-item {
      width: 150px;
      height: 150px;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      margin: 0 8px 8px 0;
      position: relative;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 220px;
      cursor: pointer;

      .el-icon-circle-close {
        display: none;
        position: absolute;
        right: 5px;
        top: 5px;
        font-size: 20px;
        color: #fd5d5d;
        z-index: 10;
      }

      .image-preview {
        display: none;
        position: absolute;
        padding: 5px 0;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
        background-color: rgba($color: #000000, $alpha: 0.5);
        color: #fff;
        z-index: 10;
      }

      &:hover {
        .el-icon-circle-close,.image-preview {
          display: block;
        }
      }

      .drag-left,.drag-right {
        position: absolute;
        top: -4px;
        width: 79px;
        height: 158px;
      }

      .drag-left {
        left: -4px;
      }

      .drag-right {
        left: 50%;
      }
    }

    .image-upload {
      width: 150px;
      height: 150px;
    }

    .upload-description {
      line-height: 16px;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }

  }
</style>
