/**
 * 自定义上传函数
 * 代码来源: https://github.com/vueComponent/ant-design-vue/blob/next/components/vc-upload/src/request.js
 */
// option {
//  onProgress: (event: { percent: number }): void,
//  onError: (event: Error, body?: Object): void,
//  onSuccess: (body: Object): void,
//  data: Object,
//  filename: String,
//  file: File,
//  withCredentials: Boolean,
//  action: String,
//  headers: Object,
// }
import axios from 'axios'
import { ACCESS_TOKEN } from '@/constant/storage'
import { APP_CODE } from '@/constant'
import { checkFile } from '@/api/content/article'
import { Message } from 'ant-design-vue'

function getError(option, xhr) {
  const msg = `cannot upload ${xhr.status}`
  const err = new Error(msg)
  return err
}

export default async function upload(option) {
  function handleProgress(e) {
    if (option.onProgress) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100
        // 添加进度条，可通过fileList中的originFileObj获取到
        option.file.processVal = e.percent
      }
      option.onProgress(e)
    }
  }
  const { CancelToken } = axios
  const source = CancelToken.source()
  const host = process.env.VUE_APP_BASE_API || ''
  const httpsHost = host.replace(/http:/, 'https:')
  const formData = new window.FormData()

  formData.append('file', option.file)

  try {
    const { state } = await checkFile(formData)
    if (state !== 1) {
      throw Error()
    }
  } catch (error) {
    Message.error(`${option.file.name}照片审核失败`)
    option.onError(new Error('照片审核失败'))
    return
  }

  formData.append('folder', 'mifeng')

  const apiServer = httpsHost + '/ecservice/ec/upload/file2name'
  axios
    .post(apiServer, formData, {
      cancelToken: source.token,
      onUploadProgress: handleProgress,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Token': window.localStorage.getItem(ACCESS_TOKEN),
        appcode: APP_CODE
      }
    })
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        return option.onError(getError(option, res), res)
      }
      option.onSuccess({ url: res.data.data.url, fileName: res.data.data.filename }, res)
    })
    .catch(option.onError)

  return {
    abort() {
      source && source.cancel && source.cancel()
    }
  }
}
