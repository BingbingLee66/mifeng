// 限制输入框输入大于零的正整数
export function nmberInput(val) {
  const regexp = /^[1-9]\d*$/
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
  const regexp = /^[1-9]\d*$/
  if (!regexp.test(val)) {
    return ''
  } else {
    return val
  }
}

export function errorCaptured(promise) {
  return promise.then(res => [res, null]).catch(err => [null, err])
}
// 权重校验
export const checkNumber = (rule, value) => {
  if (!/^([0-9]{0,3})$/.test(value)) {
    return Promise.reject(new Error('必须是0-999的整数'))
  } else {
    return Promise.resolve() // 必须加上这个，不然一直塞在验证状态
  }
}
// 手机校验
export const phoneValidator = (rule, value) => {
  if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
    return Promise.reject(new Error('号码格式不正确'))
  }
  return Promise.resolve()
}
// 密码校验
export const passwordValidator = (rule, value) => {
  if (!/^\w*$/.test(value)) return Promise.reject(new Error('密码只能由字母、数字和下划线"_"组成！'))
  return Promise.resolve()
}

/**
 * 调整数组中目标元素的上下位置
 * @param {*} arr 目标数组
 * @param {*} id 目标元素关键字
 * @param {String} event up-上移 down-下移
 * @returns
 */
export const changeOrder = (arr = [], id, event) => {
  const idx = arr.findIndex(i => i.id === id)
  const targetIdx = event === 'up' ? idx - 1 : idx + 1
  // eslint-disable-next-line prefer-destructuring
  arr[idx] = arr.splice(targetIdx, 1, arr[idx])[0]
  return arr
}

/**
 * 删除数组中目标元素
 * @param {*} arr 目标数组
 * @param {*} id 目标元素关键字
 * @returns
 */
export const removeItem = (arr, id) => {
  const idx1 = arr.findIndex(i => i.id === id)
  arr.splice(idx1, 1)
  return arr
}

export const throttle = (fn, delay = 3000) => {
  let oldNow = Date.now()
  return function (...args) {
    const currNow = Date.now()
    if (currNow - oldNow < delay) return
    oldNow = currNow
    fn.call(this, ...args)
  }
}
