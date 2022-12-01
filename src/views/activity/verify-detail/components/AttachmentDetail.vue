<template>
  <div>
    <el-dialog :title="title" :visible.sync="attachmentVisible" width="60%" :before-close="close">
      <div>
        <div class="hd">图片：</div>
        <el-checkbox-group v-model="selectImg">
          <el-checkbox v-for="(item, index) in imgList" :key="index" class="item-box" :label="index">
            <el-image :preview-src-list="previewList" class="file-img" :src="item.url" @click="previewImg(item)" />
            <div>{{ item.filename }}</div>
          </el-checkbox>
        </el-checkbox-group>

        <div class="hd" style="margin-top: 20px">文件：</div>

        <el-checkbox-group v-model="selectFile">
          <el-checkbox v-for="(item, index) in fileList" :key="index" class="item-box" :label="index">
            <div @click="perview(item)">{{ item.filename }}</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="download">下载</el-button>
        <el-button type="primary" @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { perviewFile, downloadByBlob } from '../util'
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
      // url和name都有可能重复 所有存的是index
      selectImg: [],
      selectFile: [],
      title: '',
      previewList: []
    }
  },
  methods: {
    close() {
      this.$emit('update:attachmentVisible', false)
      this.selectImg = []
      this.selectFile = []
    },
    perview(row) {
      perviewFile(row)
    },
    previewImg(row) {
      this.previewList = [row.url]
    },
    download() {
      const { selectImg, selectFile, imgList, fileList } = this
      const arr = []
      // 根据index找item
      selectImg.forEach(i => {
        arr.push(imgList[i])
      })
      selectFile.forEach(i => {
        arr.push(fileList[i])
      })
      arr.forEach(item => {
        if (item.type === 'file') {
          window.open(item.url)
        } else {
          downloadByBlob(item.url, item.filename)
        }
      })
      this.close()
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
      this.title = row.subUserName || row.userName || ''
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
