// 下载方法
export function downloadByBlob(url, name) {
  const image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      download(url, name)
      // 用完释放URL对象
      URL.revokeObjectURL(url)
    })
  }
}
function download(href, name) {
  const eleLink = document.createElement('a')
  eleLink.download = name
  eleLink.href = href
  eleLink.click()
  eleLink.remove()
}
// 文件预览
export function perviewFile(row) {
  const arr = row.url.split('.')
  const type = arr[arr.length - 1]
  let url = ''
  if (filetype.indexOf(type) !== -1) {
    // 使用微软的office online
    url = 'http://view.xdocin.com/xdoc?_xdoc=' + row.url
  } else {
    url = row.url
  }
  // window.open()居中打开
  const width = 800
  const height = 600
  const top = (window.screen.availHeight - height) / 2
  const left = (window.screen.availWidth - width) / 2
  window.open(url, '', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left)
}

export const filetype = ['docx', 'doc', 'xls', 'xlsx', 'pdf', 'PPT', 'ppt', 'pptx']
