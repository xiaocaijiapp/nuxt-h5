// pageCache.js
const cachePage = require('../static/globalCache')
export default function (req, res, next) {
  const url = req._parsedOriginalUrl
  const pathname = url ? url.pathname : ''
  // 清理缓存
  if (pathname === '/cleancache') {
    cachePage.reset()
    res.statusCode = 200
  }
  // 本地开发环境不做页面缓存(也可开启开发环境进行调试)
  if (process.env.NODE_ENV === 'dev') {
  // 只有首页才进行缓存
    if (['/'].includes(pathname)) {
      const existsHtml = cachePage.get('indexPage')
      if (existsHtml) {
      //  如果没有Content-Type:text/html 的 header，gtmetrix网站无法做测评
        res.setHeader('Content-Type', ' text/html; charset=utf-8')
        return res.end(existsHtml.html, 'utf-8')
      } else {
        res.original_end = res.end
        res.end = function (data) {
          if (res.statusCode === 200 && data) {
            // 设置缓存
            cachePage.set('indexPage', {
              html: data
            })
          }
          res.original_end(data, 'utf-8')
        }
      }
    }
  }
  next()
}
