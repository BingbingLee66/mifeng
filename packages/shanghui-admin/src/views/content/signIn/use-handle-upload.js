import { getCurrentInstance, ref, watch } from 'vue'

const UploadStatus = {
  UPLOADING: 'uploading', // 上传中
  DONE: 'done', // 完成上传
  ERROR: 'error', // 上传出现错误
  REMOVED: 'removed' // 文件已移除
}

let seed = 0

function getUUID() {
  return `uploadFile_${Date.now()}_${seed++}`
}
export const useHandleUpload = props => {
  const emit = getCurrentInstance()?.emit
  /**
   * 生成已完成项列表
   * @param files 已上传的文件
   */
  const genDoneFiles = files => {
    return files.map(file => {
      if (file && file.uid) {
        return file
      } else {
        return {
          ...file,
          uid: getUUID(),
          status: UploadStatus.DONE
        }
      }
    })
  }

  const fileList = ref([])
  watch(
    () => props.value || [],
    newVal => {
      fileList.value = genDoneFiles(newVal)
    },
    { immediate: true, deep: true }
  )
  watch(
    () => props.url,
    newVal => {
      if (newVal) {
        const ImgList = [{ url: newVal, uid: getUUID(), status: UploadStatus.DONE }]
        fileList.value = ImgList
      }
    },
    { immediate: true, deep: true }
  )
  /**
   * 上传中、完成、失败、删除都会调用这个函数
   * file 当前操作的文件对象
   * fileList 当前的文件列表
   * event 上传中的服务端响应内容，包含了上传进度等信息
   * @param info: {file, fileList, event}
   */
  const handleChange = info => {
    const resFileList = [...info.fileList]

    /**
     * 删除没有通过beforeUpload校验的文件
     */
    if (!info.file.status) {
      resFileList.splice(resFileList.indexOf(info.file), 1)
      return
    }
    fileList.value = resFileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url
        file.id = file.response.id
      }
      return file
    })

    const findUndoneIndex = fileList.value.findIndex(file => file.status !== UploadStatus.DONE)
    const uploadFiles = fileList.value.filter(file => file.status === UploadStatus.DONE)
    if (findUndoneIndex === -1) {
      if (uploadFiles.length === 0) {
        emit?.('update:url', '')
      } else {
        emit?.('update:url', uploadFiles[uploadFiles.length - 1].url)
      }
      emit?.('update:value', uploadFiles)
      emit?.('uploaded', uploadFiles)
    }
  }
  return {
    handleChange,
    fileList
  }
}
