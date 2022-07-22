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
