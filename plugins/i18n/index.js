import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from '@/plugins/i18n/zh-CN'
import jp from '@/plugins/i18n/ja-JP'
import { getServerCookie, getClientCookie } from '@/assets/js/cookie'
Vue.use(VueI18n)
export default ({ app, store, req }) => {
  store.commit('SET_LANG', getServerCookie(req).lang || getClientCookie('lang') || 'ja-JP')
  app.i18n = new VueI18n({
    locale: getServerCookie(req).lang || getClientCookie('lang') || 'ja-JP',
    fallbackLocale: getServerCookie(req).lang || getClientCookie('lang') || 'ja-JP',
    silentFallbackWarn: true, // 抑制警告
    messages: {
      'zh-CN': zh,
      'ja-JP': jp
    }
  })
  app.i18n.link = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }
    return `/${app.i18n.locale}/${link}`
  }
}
