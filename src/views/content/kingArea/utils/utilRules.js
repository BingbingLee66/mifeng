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
