// globalCache.js
const LRU = require('lru-cache')
const cachePage = new LRU({
  // 最大缓存数量
  max: 100,
  // 缓存过期时间(ms)
  maxAge: 1000 * 60 * 5
})

module.exports = cachePage
