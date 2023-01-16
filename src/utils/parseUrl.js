
/**
 * url转化成object拼接样式
 * eg: id=1&name=张三&age=18  =>  { id: 1, name: '张三', age: 18 }
 * @param url 需要转化的参数
 */
export function parseUrl(url) {
  const string = url.split('&')
  const res = {}
  for (let i = 0; i < string.length; i++) {
    const str = string[i].split('=')
    if (str[0] !== '') {
      // eslint-disable-next-line prefer-destructuring
      res[str[0]] = str[1]
    }
  }
  return res
}
