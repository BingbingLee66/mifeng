<template>
  <div>
    <el-dialog :title="title" :visible.sync="attachmentVisible" width="60%" :before-close="close">
      <div>
        <div class="hd">图片：</div>
        <el-checkbox-group v-model="selectImg">
          <el-checkbox v-for="(item, index) in imgList" :key="index" class="item-box">
            <img class="file-img" :src="item.url">
            <div>{{ item.filename }}</div>
          </el-checkbox>
        </el-checkbox-group>

        <div class="hd" style="margin-top: 20px">文件：</div>

        <el-checkbox-group v-model="selectFile">
          <el-checkbox v-for="(item, index) in fileList" :key="index" class="item-box" :label="index">
            <div>{{ item.filename }}</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">下载</el-button>
        <el-button type="primary" @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    attachmentVisible: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      imgList: [],
      fileList: [],
      selectImg: [],
      selectFile: []
    }
  },
  methods: {
    close() {
      this.$emit('update:attachmentVisible', false)
    },
    formData(row) {
      // attachment signValue  filename type url
      const { attachment } = row
      if (!attachment.length > 0) return
      let imgList = []
      let fileList = []
      attachment.forEach(e => {
        if (e.signValue.length > 0) {
          imgList = imgList.concat(e.signValue.filter(f => f.type === 'image'))
          fileList = fileList.concat(e.signValue.filter(f => f.type === 'file'))
        }
      })
      this.fileList = fileList
      this.imgList = imgList
      this.title = '小可爱的附件'
    }
  }
}
</script>
<style lang="scss" scoped>
.file-img {
  width: 80px;
  height: 80px;
}
.item-box {
  margin: 10px 4px;
}
</style>
