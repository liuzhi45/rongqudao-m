import moment from 'moment'
import { CHANNEL_TYPE, UTIL_TYPE } from './constant'
/* 金额格式化 */
export function fmoney (s, n) {
  n = n > 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d\\.-]/g, '')).toFixed(n) + ''
  let l = s.split('.')[0].split('').reverse()
  let r = s.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
  }
  return t.split('').reverse().join('') + '.' + r
}
// 时间格式化
export function formatTime (value, type) {
  type = (type === undefined ? 'YYYY-MM-DD' : type)
  return value ? moment(value).format(type) : ''
}
// 百分比保留一位数字
export function round (value) {
  var f = parseFloat(value)
  if (isNaN(f)) {
    return '0'
  }
  f = Math.round(value * 1000) / 10
  return f
}
// 数字格式化
export function roundNum (value, num) {
  var f = parseFloat(value)
  if (isNaN(f)) {
    return '0'
  }
  let i = num || 1
  f = Number(value).toFixed(i)
  return f
}
// 数字本地格式化
export function roundInt (value) {
  var f = parseFloat(value)
  if (isNaN(f)) {
    return '0'
  }
  f = (Math.floor(value * 100) / 100).toLocaleString()
  return f
}
// 返回业务类型名称
export function channelType (val) {
  return CHANNEL_TYPE[val]
}
// 返回工具类型名称
export function utilType (val) {
  return UTIL_TYPE[val]
}
export function showTimeType (time, type) {
  let str = '天'
  if (type === 'Y') {
    str = '年'
  } else if (type === 'M') {
    str = '个月'
  }
  return time + str
}
