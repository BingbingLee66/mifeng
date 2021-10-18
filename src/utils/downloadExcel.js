export function downloadExcel(data, name) {
  if (data.type === 'application/json') {
    // 说明是普通对象数据，读取信息
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      const jsonData = JSON.parse(fileReader.result)
      // 后台信息
      if (jsonData && jsonData.code !== 200) return this.$message.error(jsonData.msg || '请稍后重试')
    }
    fileReader.readAsText(data)
  } else {
    let blob = new Blob([data], {
      type: 'application/vnd.ms-excel'
    })
    let downLoadEle = document.createElement('a')
    let href = URL.createObjectURL(blob)
    downLoadEle.href = href
    downLoadEle.download = name // 自定义文件名
    document.body.appendChild(downLoadEle)
    downLoadEle.click()
    document.body.removeChild(downLoadEle)
    window.URL.revokeObjectURL(href)
  }
}
