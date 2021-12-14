export default {
  bind(el, binding) {
    el.addEventListener('click', () => {
      console.log('sfefwefe' + binding.value) // url
      const a = document.createElement('a')
      //   let url = baseUrl + binding.value // 若是不完整的url则需要拼接baseURL
      const url = binding.value // 完整的url则直接使用
      // 这里是将url转成blob地址，
      fetch(url).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
        a.href = URL.createObjectURL(blob)
        console.log(a.href)
        a.download = '' // 下载文件的名字
        // a.download = url.split('/')[url.split('/').length -1] //  // 下载文件的名字
        document.body.appendChild(a)
        a.click()
      })
    })
  }
}
