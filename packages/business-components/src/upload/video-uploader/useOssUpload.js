import { getSts, queryVideo } from '@business/common/src/vod/vod'
import { decrypt } from '@/utils/cryptoUtils'
import { message as antMessage } from 'ant-design-vue'
import { getCurrentInstance } from 'vue'
import axios from 'axios'
import { ACCESS_TOKEN } from '@business/common/src/storage/constant'
import { APP_CODE } from '@business/common/src/config/index'
import loadScript from '@/utils/load-script'

// 流程：页面上传了视频 前端拿取到信息后上传去阿里云， 一系列操作后成功上传了，接下来就是去轮询后端接口去拿取视频的数据

// 上传阿里云配置参数
let sts = {
  accessKeyId: '', //
  accessKeySecret: '',
  region: '', // 上传到视频点播的地域
  secretToken: '',
  cateId: '', // 分类id
  templateGroupId: '', // 指定转码模板组
  userId: '', // 账号ID
  callbackUrl: '' // 回调信息
}
// 劫持ant upload Option
let AntOption
let videoUploader
// 劫持相关参数
let emit
let propsVal

export const useUploadRequest = props => {
  if (props.customRequest) {
    return props.customRequest
  }
  emit = getCurrentInstance()?.emit
  propsVal = {
    id: props.id,
    sourceType: props.sourceType
  }
  function uploadRequest(option) {
    AntOption = option
    onGetSts()
  }
  return uploadRequest
}

function getError(option, message) {
  const msg = `cannot upload ${message}`
  const err = new Error(msg)
  return err
}
// 获取配置信息
const onGetSts = () => {
  getSts().then(response => {
    const { data } = response
    // 解密
    sts = {
      accessKeyId: decrypt(data.accessKeyId),
      accessKeySecret: decrypt(data.accessKeySecret),
      secretToken: decrypt(data.securityToken),
      region: decrypt(data.region), // 上传到视频点播的地域
      callbackUrl: decrypt(data.callbackUrl), // 回调接口设置
      cateId: decrypt(data.cateId), // 分类id
      templateGroupId: decrypt(data.templateGroupId), // 指定转码模板组
      userId: decrypt(data.userId) //  账号ID
    }
    createUplader()
  })
}
const createUplader = async () => {
  // 初始化上传对象
  await initAliyunUpload()
  // 参数文档：https://help.aliyun.com/document_detail/55407.htm?spm=a2c4g.11186623.2.5.ef4eb227Xtdm2R#doc-api-vod-CreateUploadVideo
  var paramsData = {
    Vod: {
      Title: AntOption.file.name, // 视频名字
      CateId: sts.cateId, // 分类id
      TemplateGroupId: sts.templateGroupId, // 指定转码模板组
      UserData: {
        MessageCallback: {
          // 回调接口设置
          CallbackURL: sts.callbackUrl
        },
        Extend: {
          id: propsVal.id, // 视频关联对象id 新增情况下id=0 修改情况下id=对象id,示例值(0)
          source: 2, // 视频发布来源 视频来源 1-系统 2-商会后台 3-小程序 4-app
          sourceType: propsVal.sourceType // 来源类型：（1：文章/动态 ，2：供需，3：操作指引）
        }
      }
    }
  }
  // 添加文件和配置
  videoUploader.addFile(AntOption.file, '', '', '', JSON.stringify(paramsData))
  // 开始上传
  await videoUploader.startUpload()
}
// 初始化上传
const initAliyunUpload = async () => {
  if (!window.AliyunUpload) {
    /**   引入阿里云上传js  */
    await loadScript('https://cdn.9kd.com/kdnet_js/aliyun-oss-sdk-6.13.0.min.js')
    await loadScript('https://cdn.9kd.com/kdnet_js/aliyun-upload-sdk-1.5.2.min.js')
  }
  videoUploader = new AliyunUpload.Vod({
    userId: sts.userId, //  账号ID
    region: sts.region, // 上传到视频点播的地域
    partSize: 1048576, // 分片大小默认1 MB，不能小于100 KB（100*1024）
    parallel: 5, // 并行上传分片个数，默认5
    retryCount: 3, // 网络原因失败时，重新上传次数，默认为3
    retryDuration: 2, // 网络原因失败时，重新上传间隔时间，默认为2秒
    enableUploadProgress: true, // 是否上报上传日志到点播，默认为true
    // 开始上传
    onUploadstarted: uploadInfo => {
      // 上传凭证  STS方式
      videoUploader.setSTSToken(uploadInfo, sts.accessKeyId, sts.accessKeySecret, sts.secretToken)
    },
    // 文件上传成功
    onUploadSucceed: uploadInfo => {
      emit?.('Succeed', uploadInfo.videoId)
      getVideoInfo(uploadInfo.videoId)
    },
    // 文件上传失败
    onUploadFailed: (uploadInfo, code, message) => {
      emit?.('error', uploadInfo, code, message)
      AntOption.onError(getError(AntOption, message), code)
      antMessage.error('上传失败请重试')
      // console.log('上传失败', uploadInfo, code, message)
    },
    // 文件上传进度，单位：字节
    onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
      if (AntOption.onProgress) {
        if (loadedPercent > 0) {
          // 添加进度条，可通过fileList中的originFileObj获取到
          AntOption.file.processVal = loadedPercent * 100
        }
        AntOption.onProgress(loadedPercent)
      }
    },
    // 上传凭证或STS token超时
    onUploadTokenExpired: () => {
      // console.log('上传凭证或STS token超时', uploadInfo)
      // 重新获取STS token，恢复上传  STS方式
      videoUploader.resumeUploadWithSTSToken(sts.accessKeyId, sts.accessKeySecret, sts.secretToken)
    },
    // 全部文件上传结束
    onUploadEnd: () => {
      // console.log('全部文件上传结束', uploadInfo)
    }
  })
}

const getVideoInfo = id => {
  // 视videoId 轮询后端索取视频信息
  let queryTimer = null

  const queryFunc = () => {
    queryVideo(id)
      .then(res => {
        if (res.state === 1) {
          clearInterval(queryTimer)
          captureVideoCover(id)
        }
      })
      .catch(AntOption.onError)
  }
  queryTimer = setInterval(queryFunc, 500)
}

// 劫持第一帧上传服务器并回显  创建video --》通过canvas截取第一图片--》将canvas转成base64 --》将base64转成Blob--》上传服务器
const captureVideoCover = id => {
  const canvas = document.createElement('canvas')
  const video = document.createElement('video')
  video.autoplay = true
  video.muted = true
  video.src = URL.createObjectURL(AntOption.file)
  const handle = () => {
    canvas.width = video.videoWidth * 0.8
    canvas.height = video.videoHeight * 0.8
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    const videoCoverURL = canvas.toDataURL('image/png', 1.0)
    AntOption.onSuccess({
      url: 'preview',
      videoCoverURL,
      vid: id
    })
    emit?.('getVideoCoverLocal', videoCoverURL)

    // 转换blob 上传服务器
    const blobFile = base64ToBlob(videoCoverURL)
    uploadvideoCover(blobFile)
    video.removeEventListener('loadeddata', handle)
  }
  video.addEventListener('loadeddata', handle)
}
const base64ToBlob = (urlData, type) => {
  const arr = urlData.split(',')
  const mime = arr[0].match(/:(.*?);/)[1] || type
  // 去掉url的头，并转化为byte
  const bytes = window.atob(arr[1])
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], {
    type: mime
  })
}
// 上传服务器
const uploadvideoCover = file => {
  const host = process.env.VUE_APP_BASE_API || ''
  const httpsHost = host.replace(/http:/, 'https:')
  const formData = new window.FormData()
  formData.append('file', file)
  formData.append('folder', 'mifeng')
  const apiServer = httpsHost + '/ecservice/ec/upload/file2name'
  axios
    .post(apiServer, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Token': window.localStorage.getItem(ACCESS_TOKEN),
        appcode: APP_CODE
      }
    })
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        return
      }
      emit?.('getVideoCoverRemote', res.data.data.url)
    })
}
