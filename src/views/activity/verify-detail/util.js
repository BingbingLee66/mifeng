import html2canvas from 'html2canvas'
import { formatDateTime } from '@/utils/date'

export async function generatePictureByDomId(domId) {
  const canvas = document.createElement('canvas')
  const imgContent = document.getElementById(domId)
  const width = imgContent.offsetWidth // 获取dom 宽度
  const height = imgContent.offsetHeight // 获取dom 高度
  canvas.width = width * 2
  canvas.height = height * 2
  canvas.style.width = width * 2 + 'px'
  canvas.style.height = width * 2 + 'px'
  const scale = 1 // 定义任意放大倍数 支持小数
  const context = canvas.getContext('2d')
  context.scale(scale, scale)
  const rect = imgContent.getBoundingClientRect() // 获取元素相对于视口的
  context.translate(-rect.left, -rect.top)
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
  const _canvas = await html2canvas(imgContent, { // 转换为图片
    scrollY: -scrollTop,
    scrollX: 0,
    useCORS: true // 开启跨域
  })

  return _canvas.toDataURL('image/png')
}

export function formatDate(str) {
  if (!str) return ''
  return formatDateTime(new Date(+str), 'yyyy-MM-dd hh:mm')
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

export const filetype = ['docx', 'doc', 'xls', 'xlsx', 'pdf', 'ppt', 'pptx']
