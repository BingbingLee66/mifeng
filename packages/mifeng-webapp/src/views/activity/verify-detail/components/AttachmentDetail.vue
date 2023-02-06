<template>
  <a-modal v-model:visible="visible" :title="title" width="60%" :footer="null" @cancel="close">
    <div>
      <div class="hd">图片：</div>
      <a-checkbox-group v-model:value="selectImg">
        <a-checkbox v-for="(item, index) in imgList" :key="index" class="item-box" :value="index">
          <a-image class="file-img" :src="item.url" />
          <div>{{ item.filename }}</div>
        </a-checkbox>
      </a-checkbox-group>

      <div class="hd" style="margin-top: 20px">文件：</div>
      <a-checkbox-group v-model="selectFile">
        <a-checkbox v-for="(item, index) in fileList" :key="index" class="item-box" :value="index">
          <div @click="perview(item)">{{ item.filename }}</div>
        </a-checkbox>
      </a-checkbox-group>
      <div>
        <a-button @click="download" class="mr-10">下载</a-button>
        <a-button type="primary" @click="close">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { reactive, toRefs, ref, watch } from 'vue'
import { perviewFile, filetype, downloadByBlob } from '../../util'
export default {
  props: {
    attachmentVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const infoModel = reactive({
      imgList: [],
      selectImg: [],
      selectFile: [],
      title: '',
      fileList: []
    })
    const visible = ref(props.attachmentVisible)
    watch(
      () => props.attachmentVisible,
      newValue => {
        visible.value = newValue
      }
    )
    const close = () => {
      emit('update')
      visible.value = false
      infoModel.selectImg = []
      infoModel.selectFile = []
    }
    const perview = row => {
      perviewFile(row)
    }
    const download = () => {
      const { selectImg, selectFile, imgList, fileList } = infoModel
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
      close()
    }
    const formData = row => {
      // attachment signValue  filename type url
      const { attachment } = row
      if (!attachment.length > 0) return
      const imgList = []
      const fileList = []
      attachment.forEach(e => {
        if (e.signValue.length > 0) {
          e.signValue.forEach(f => {
            const typeArr = f.url.split('.')
            console.log(typeArr[typeArr.length - 1], filetype)
            if (filetype.indexOf(typeArr[typeArr.length - 1]) !== -1) {
              fileList.push(f)
            } else {
              imgList.push(f)
            }
          })
        }
      })
      infoModel.fileList = fileList
      infoModel.imgList = imgList
      infoModel.title = row.subUserName || row.userName || ''
    }
    return { ...toRefs(infoModel), formData, perview, close, download, visible }
  }
}
</script>
<style lang="scss" scoped>
.item-box {
  margin: 10px 4px;
}
:deep(.ant-image-img) {
  width: 80px;
  height: 80px;
}
</style>
