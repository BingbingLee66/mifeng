export const checkUserName = (rule, value) => {
  if (!value || !value.replace(/\s*/g, '')) {
    // return callback(new Error('账号不能为空'))
    return Promise.reject(new Error('账号不能为空'))
  } else if (
    !/(^[a-zA-Z]{1}[a-zA-Z0-9]{5,11}$)|(^1[0-9]{10}$|^([0-9]{3}[-])([1-9][0-9]{8})$|^([0-9]{4}[-])([1-9][0-9]{7})$)/.test(
      value
    )
  ) {
    // return callback(new Error('账号只能为字母和数字，且以字母开头，长度为6-12个字符！或为11位手机号码'))
    return Promise.reject(new Error('账号只能为字母和数字，且以字母开头，长度为6-12个字符！或为11位手机号码'))
  } else {
    return Promise.resolve() // 必须加上这个，不然一直塞在验证状态
  }
}
export const checkPassword = (rule, value) => {
  if (!value || !value.replace(/\s*/g, '')) {
    return Promise.reject(new Error('密码不能为空'))
  } else if (!/^[a-zA-Z0-9]{6,20}$/.test(value)) {
    return Promise.reject(new Error('密码不能为空，且只能为字母和数字，长度为6-20个字符！'))
  } else {
    return Promise.resolve() // 必须加上这个，不然一直塞在验证状态
  }
}
export const checkName = (rule, value) => {
  if (!value || !value.replace(/\s*/g, '')) {
    return Promise.reject(new Error('名字不能为空'))
  } else if (!/^\S{1,20}$/.test(value)) {
    return Promise.reject(new Error('名字长度为1-20个字符！'))
  } else {
    return Promise.resolve() // 必须加上这个，不然一直塞在验证状态
  }
}
export const checkCkey = (rule, value) => {
  if (!/(^$)|(^[a-zA-Z0-9]{6}$)/.test(value)) {
    return Promise.reject(new Error('ckey长度为6个字符！'))
  } else {
    return Promise.resolve() // 必须加上这个，不然一直塞在验证状态
  }
}
