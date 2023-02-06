/**
 * 解析文件转成字节流字符串,并组装上传参数
 * @param file 文件
 * @returns Promise
 */
export default function resolveFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader()
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    // 读取完成
    reader.onloadend = evt => {
      if (evt.target.readyState === window.FileReader.DONE) {
        const params = {
          buffer: evt.target.result
        }
        resolve(params)
      }
    }
    const blob = new Blob([file])
    reader.readAsArrayBuffer(blob)
  })
}

export function getQueryObj(fileName, contentObj) {
  if (!fileName) {
    return
  }
  const queryObj = {
    public_read: true,
    permission: 3,
    ...contentObj,
    type: fileName.split('.').slice(-1)[0],
    file_name: encodeURIComponent(fileName)
  }

  const str = JSON.stringify(queryObj)

  return window.btoa(str)
}
