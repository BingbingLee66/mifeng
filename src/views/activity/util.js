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
export const filetype = ['docx', 'doc', 'xls', 'xlsx', 'pdf', 'ppt']
