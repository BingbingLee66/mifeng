/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
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
  if (!(/^[0-9]\d*$/.test(value))) {
    callback(new Error('请输入正整数'))
  } else if (value < 0 || value > 999) {
    callback(new Error('权重范围0-999'))
  } else {
    callback()
  }
}

// 权重表单验证
export const validateInt = (rule, value, callback) => {
  if (!(/^[0-9]\d*$/.test(value))) {
    callback(new Error('请输入正整数'))
  } else if (value <= 0) {
    callback(new Error('请输入正整数'))
  } else {
    callback()
  }
}
