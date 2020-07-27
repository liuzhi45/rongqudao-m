// 返回不带html标签的名字
export function noHtmlName (val) {
  if (!val) {
    return ''
  }
  var imgReg = /<img(.*?)>/
  val = val.replace(imgReg, '[图片]')
  var reg = /<[^>]*>|<\/[^>]*>/gm
  val = val.replace(reg, '').replace(/\n/g, '')
  return val
}

/**
 *
 * @param {string} str
 * new UrlSearch().id 获取参数
 */
export function UrlSearch () {
  var name, value
  var str = location.href // 取得整个地址栏
  var num = str.indexOf('?')
  str = str.substr(num + 1) // 取得所有参数   stringvar.substr(start [, length ]

  var arr = str.split('&') // 各个参数放到数组里
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf('=')
    if (num > 0) {
      name = arr[i].substring(0, num)
      value = arr[i].substr(num + 1)
      this[name] = value
    }
  }
}
// 判断当前环境是电脑还是手机
export function isMobile () {
  var sUserAgent = navigator.userAgent.toLowerCase()
  alert(sUserAgent)
  var bIsIpad = sUserAgent.match(/ipad/i) === 'ipad'
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) === 'iphone os'
  var bIsMidp = sUserAgent.match(/midp/i) === 'midp'
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === 'rv:1.2.3.4'
  var bIsUc = sUserAgent.match(/ucweb/i) === 'ucweb'
  var bIsAndroid = sUserAgent.match(/android/i) === 'android'
  var bIsCE = sUserAgent.match(/windows ce/i) === 'windows ce'
  var bIsWM = sUserAgent.match(/windows mobile/i) === 'windows mobile'
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    return true
  } else {
    return false
  }
}
export function trim (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
