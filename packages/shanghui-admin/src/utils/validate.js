/**
 * 表单校验-电话
 * @param {*} rule
 * @param {*} value
 * @returns
 */
export const checkPhone = (rule, value) => {
  if (!/^$|^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$/.test(value)) {
    return Promise.reject(new Error('手机号码格式不正确'))
  } else {
    return Promise.resolve()
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 校验用户名,必须是5-32位
 * @param {string} str
 * @returns {Boolean}
 */
export function isvalidUsername(str) {
  const reg = /^[0-9A-Za-z]{5,32}$/
  return reg.test(str)
}

// 权重表单验证
export const validateWeight = (rule, value, callback) => {
  if (!/^[0-9]\d*$/.test(value)) {
    callback(new Error('请输入正整数'))
  } else if (value < 0 || value > 999) {
    callback(new Error('权重范围0-999'))
  } else {
    callback()
  }
}

// 权重表单验证
export const validateInt = (rule, value, callback) => {
  if (!/^[0-9]\d*$/.test(value)) {
    callback(new Error('请输入正整数'))
  } else if (value <= 0) {
    callback(new Error('请输入正整数'))
  } else {
    callback()
  }
}

// 检验切换频率
export const validateRate = (rule, value, callback) => {
  if (!/^[0-9]\d*$/.test(value)) {
    callback(new Error('请输入正整数'))
  } else if (value <= 0) {
    callback(new Error('请输入正整数'))
  } else if (+value > 300000) {
    callback(new Error('不能大于300000ms'))
  } else {
    callback()
  }
}
