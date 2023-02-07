/* eslint-disable no-constant-condition */
/**
 * 以 '万', '亿', '万亿', '亿亿', '万亿亿' 为单位格式化数字
 * @param val
 * @returns {string|*}
 */
export function formateNum(val) {
  let value = Number(Math.abs(val))
  let index = 0

  while (true) {
    value /= 10000
    if (value < 1 || isNaN(value)) {
      break
    }
    index++
  }

  if (index === 0) {
    return val
  }

  const prev = Math.pow(10000, index)

  const i = (val / prev).toFixed(2)

  const fixVal = ['万', '亿', '万亿', '亿亿', '万亿亿']
  const fix = fixVal[index - 1] || ''

  return `${i}${fix}`
}

/**
 * 每隔三位数用，隔开
 * 如果值超过千亿不建议使用该函数
 * @param val
 * @returns {string|*}
 */
export function formatValue(val) {
  if (typeof val === 'number' && Number.toLocaleString) {
    return val.toLocaleString()
  }
  const format = num => {
    if (num === 0) return val
    const arr = []
    for (let i = 1, len = num / 3; i <= len; i++) {
      arr.push(String(val).substr(-3 * i, 3))
    }
    arr.push(Math.floor(val / Math.pow(10, num)))
    return arr.reverse().join(',')
  }

  let result
  if (val > Math.pow(10, 9)) {
    result = 9
  } else if (val > Math.pow(10, 6)) {
    result = 6
  } else if (val > Math.pow(10, 3)) {
    result = 3
  } else {
    result = 0
  }
  return format(result)
}

export function compare(type, prop) {
  return function (obj1, obj2) {
    let val1 = obj1[prop]
    let val2 = obj2[prop]
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1)
      val2 = Number(val2)
    }
    if (type === 'desc') {
      if (val1 > val2) {
        return -1
      } else if (val1 < val2) {
        return 1
      } else {
        return 0
      }
    } else {
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    }
  }
}

/**
 * 判断值是否可以转为数字
 * @param targetValue 目标值
 * @returns {boolean|*}
 * */
export function isNumberValue(targetValue) {
  return !isNaN(parseFloat(targetValue)) && isFinite(targetValue)
}
