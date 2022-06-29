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
