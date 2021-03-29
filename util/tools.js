export const timeToSec = (time) => {
  const hour = time.split(':')[0]
  const min = time.split(':')[1]
  let sec
  if (time.split(':')[2]) {
    sec = time.split(':')[2]
  } else {
    sec = 0
  }

  const s = Number(hour * 3600) + Number(min * 60) + Number(sec)
  return s * 1000
}
export const getDateXHL = (num) => {
  const date = new Date()
  const dateNumber = date.getTime()
  const differ = num * 24 * 60 * 60 * 1000
  const needDateNumber = new Date(dateNumber + differ)
  const year = needDateNumber.getFullYear()
  const month = needDateNumber.getMonth() + 1
  const day = needDateNumber.getDate()
  const monthX = month < 10 ? '0' + month : month
  const dayX = day < 10 ? '0' + day : day
  const nowDate = year + '/' + monthX + '/' + dayX
  return nowDate
}
// 对称加密
export function encrypt (str, pwd) {
  if (pwd == null || pwd.length <= 0) {
    alert('Please enter a password with which to encrypt the message.')
    return null
  }
  let prand = ''
  for (let i = 0; i < pwd.length; i++) {
    prand += pwd.charCodeAt(i).toString()
  }
  const sPos = Math.floor(prand.length / 5)
  const mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos *
    4) + prand.charAt(sPos * 5))
  const incr = Math.ceil(pwd.length / 2)
  const modu = Math.pow(2, 31) - 1
  if (mult < 2) {
    alert(
      'Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.'
    )
    return null
  }
  let salt = Math.round(Math.random() * 1000000000) % 100000000
  prand += salt
  while (prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString()
  }
  prand = (mult * prand + incr) % modu
  let encChr = ''
  let encStr = ''
  for (let i = 0; i < str.length; i++) {
    encChr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255))
    if (encChr < 16) {
      encStr += '0' + encChr.toString(16)
    } else { encStr += encChr.toString(16) }
    prand = (mult * prand + incr) % modu
  }
  salt = salt.toString(16)
  while (salt.length < 8) { salt = '0' + salt }
  encStr += salt
  return encStr
}

// 对称解密
export function decrypt (str, pwd) {
  if (str == null || str.length < 8) {
    return
  }
  if (pwd == null || pwd.length <= 0) {
    return
  }
  let prand = ''
  for (let i = 0; i < pwd.length; i++) {
    prand += pwd.charCodeAt(i).toString()
  }
  const sPos = Math.floor(prand.length / 5)
  const mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos *
    4) + prand.charAt(sPos * 5))
  const incr = Math.round(pwd.length / 2)
  const modu = Math.pow(2, 31) - 1
  const salt = parseInt(str.substring(str.length - 8, str.length), 16)
  str = str.substring(0, str.length - 8)
  prand += salt
  while (prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString()
  }
  prand = (mult * prand + incr) % modu
  let encChr = ''
  let encStr = ''
  for (let i = 0; i < str.length; i += 2) {
    encChr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255))
    encStr += String.fromCharCode(encChr)
    prand = (mult * prand + incr) % modu
  }
  return encStr
}
export function timeDiff (d1, d2) {
  return (new Date(d1.replace(/-/g, '/')).getTime() - new Date(d2.replace(/-/g, '/')).getTime())
}
export function isDuringDate (d1, d2) {
  // 如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  const dateBegin = new Date(d1.replace(/-/g, '/')) // 将-转化为/，使用new Date
  const dateEnd = new Date(d2.replace(/-/g, '/')) // 将-转化为/，使用new Date
  // var dateBegin = new Date(d1); //将-转化为/，使用new Date
  // var dateEnd = new Date(d2); //将-转化为/，使用new Date
  const dateNow = new Date() // 获取当前时间

  const beginDiff = dateNow.getTime() - dateBegin.getTime() // 时间差的毫秒数
  const beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000)) // 计算出相差天数

  const endDiff = dateEnd.getTime() - dateNow.getTime() // 时间差的毫秒数
  const endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000)) // 计算出相差天数
  if (endDayDiff < 0) { // 已过期
    return 3
  }
  if (beginDayDiff < 0) { // 没到开始时间
    return 2
  }
  return 1
}

// 获取url参数
export function GetQueryString (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}
// 生成12位随机数
export function mockTransactionNo (length) {
  // 由以下元素组成
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let num = ''
  for (let i = 0; i < length; i++) {
    num += arr[parseInt(Math.random() * arr.length)]
  }
  return num
}

// 将毫秒转化成天时分秒
export function formatDuring (mss) {
  const days = parseInt(mss / (1000 * 60 * 60 * 24))
  const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  // const seconds = parseInt((mss % (1000 * 60)) / 1000)
  return days + '天' + hours + '小时' + minutes + '分钟'
}

export function throttle (fn, delay) {
  console.log('delay', delay)
  let timer
  let prevTime
  return function (...args) {
    const currTime = Date.now()
    const context = this
    if (!prevTime) { prevTime = currTime }
    clearTimeout(timer)

    if (currTime - prevTime > delay) {
      prevTime = currTime
      fn.apply(context, args)
      clearTimeout(timer)
      return
    }

    timer = setTimeout(function () {
      prevTime = Date.now()
      timer = null
      fn.apply(context, args)
    }, delay)
  }
}
