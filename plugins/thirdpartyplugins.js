import Vue from 'vue'
import { Locale } from 'vant'
import VueClipboard from 'vue-clipboard2'
import ja from 'vant/es/locale/lang/ja-JP'
import zh from 'vant/es/locale/lang/zh-CN'
import { getClientCookie } from '../assets/js/cookie'
const lang = getClientCookie('lang')
changeVantLocale(lang)
Vue.prototype.$Locale = changeVantLocale
Vue.use(VueClipboard)
function changeVantLocale (lang) {
  if (lang === 'zh-CN') {
    Locale.use('zh-CN', zh)
  } else {
    Locale.use('ja-JP', ja)
  }
}
