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
