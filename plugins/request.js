import { getServerCookie, removeCookie, getClientCookie } from '@/assets/js/cookie'
import { cacheAdapterEnhancer } from 'axios-extensions'
import LRUCache from 'lru-cache' // 为了自定义缓存配置，如果不需要，可以不使用
export default function ({ req, store, redirect, error, app: { $axios } }) {
  $axios.baseUrl = process.env.baseUrl
  $axios.timeout = 10000
  $axios.setHeader('platform', 2)
  // 请求中使用了useCache: true的话，会被缓存起来以便下次直接返回从而减少服务器压力
  const defaultAdapter = $axios.defaults.adapter
  const cacheCfg = new LRUCache({
    maxAge: 1000 * 60 * 5, // 有效期5min
    max: 1000 // 最大缓存数量
  })
  $axios.defaults.adapter = cacheAdapterEnhancer(defaultAdapter, { enabledByDefault: false, cacheFlag: 'useCache', defaultCache: cacheCfg })
  // 请求拦截器
  $axios.onRequest((config) => {
    const accessToken = getServerCookie(req).token || getClientCookie('token')
    config.headers.Authorization = accessToken
    const lang = getClientCookie('lang') || store.getters.locale
    config.headers.lang = lang === 'zh-CN' ? 'zh_CN' : 'ja_JP'
    if (store.getters.getShareObj) {
      config.headers[config.method].shareId = store.getters.getShareObj.shareId
      config.headers[config.method].shareTime = store.getters.getShareObj.shareTime
      config.headers[config.method].shareSource = store.getters.getShareObj.shareSource
    }
    if (store.getters.getTgid) {
      config.headers[config.method].tgid = store.getters.getTgid
    }
    return config
  })
  $axios.onResponse((response) => {
    const { status } = response
    if (status === 200) {
      return Promise.resolve(response.data)
    }
  })
  $axios.onError((err) => {
    const status = err.response.status
    if (status === 403 || status === 401) {
      removeCookie('token')
      store.commit('setAccessToken', '')
      store.commit('setLoginState', false)
      store.commit('setUserInfo', { })
      if (req && req.url) {
        redirect('/login?ref=' + req.url)
      } else {
        redirect('/login')
      }
      return Promise.reject(err.response.data)
    } else {
      return Promise.reject(err.response.data)
    }
  })
}
