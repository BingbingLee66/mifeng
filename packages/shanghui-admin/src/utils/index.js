import { message } from 'ant-design-vue'
import html2canvas from 'html2canvas'
/**
 * 遍历Map对象，转成下拉框的options对象数组
 * @param mapArray
 * @returns {{label: *, value: *}[]}
 */
export function getMapDict(mapArray) {
  return [...mapArray].map(([value, label]) => ({ label, value }))
}

// 深度搜索树级
export function dep(arr, { key, value, children = 'children' }, cb) {
  if (!arr || !arr.length) return false
  return arr.some(v => {
    if (v[key] === value) {
      cb([v]) // eslint-disable-line
      return true
    }
    if (
      dep(v[children], { key, value, children }, function (child) {
        return cb([v, ...child]) // eslint-disable-line
      })
    ) {
      return true
    }
    return false
  })
}

// 深度搜索获取节点列表
export function findNodesByDep(arr, options) {
  let res = []
  dep(arr, options, arr => (res = arr))
  return res
}

/** 下载文件
 * @param {object} config {url:资源路径 title:资源名称(注意携带文件拓展名) 如: 活动报名模板.xlsx}
 */
export async function downloadFile({ url, title }) {
  let a = document.createElement('a')
  a.download = title
  a.href = url
  // 做跨域处理
  if (/^http/.test(url)) {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      a.href = URL.createObjectURL(blob)
    } catch (error) {
      message.error(`${title}下载失败`)
      message.error(error)
    }
  }
  a.click()
  a = null
}

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
  const _canvas = await html2canvas(imgContent, {
    // 转换为图片
    scrollY: -scrollTop,
    scrollX: 0,
    useCORS: true, // 开启跨域
    scale: 1 // 处理模糊问题
    // width: 750, // 画布的宽
    // height: 1334 // 画布的高
  })

  return _canvas.toDataURL('image/png', 1)
}
