const apiUrl = process.env.VUE_APP_BASE_API

export function getApiUrl() {
  return apiUrl
}

// 限制输入框输入大于零的正整数
export function nmberInput(val) {
  let regexp = /^[1-9]\d*$/
  if (!regexp.test(val)) {
    return ''
  } else {
    return val
  }
}

// 不允许输入框输入空格
export function spaceInput(val) {
  if (val.trim() === '') {
    return ''
  } else {
    return val
  }
}

// 限制输入正整数
export function intInput(val) {
  let regexp = /^[1-9]\d*$/
  if (!regexp.test(val)) {
    return ''
  } else {
    return val
  }
}

export function errorCaptured(promise) {
  return promise.then((res) => [res, null])
    .catch((err) => [null, err])
}
// 权重校验
export const checkNumber = (rule, value, callback) => {
  if (!/^([0-9]{0,3})$/.test(value)) {
    return callback(new Error('必须是0-999的整数'))
  } else {
    callback() // 必须加上这个，不然一直塞在验证状态
  }
}
// 手机校验
export const phoneValidator = (rule, value, callback) => {
  if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
    return callback(new Error('号码格式不正确'))
  }
  callback()
}
// 密码校验
export const passwordValidator = (rule, value, callback) => {
  if (!/^\w*$/.test(value)) return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
  callback()
}

