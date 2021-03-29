const cookies = require('js-cookie')
export const setCookie = (cookieName, data) => {
  cookies.set(cookieName, data)
}
export const getServerCookie = (req) => {
  const serviceCookie = {}
  req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
    const parts = val.split('=')
    serviceCookie[parts[0].trim()] = (parts[1] || '').trim()
  })
  return serviceCookie
}
export const getClientCookie = (cookieName) => {
  return cookies.get(cookieName) ? cookies.get(cookieName) : ''
}
export const removeCookie = (cookieName) => {
  cookies.remove(cookieName)
  return ''
}
