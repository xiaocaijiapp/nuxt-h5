import { setCookie, getClientCookie } from '../assets/js/cookie'
export default function ({ app }) {
  const lang = getClientCookie('lang')
  if (!lang) {
    setCookie('lang', 'ja-JP')
  } else {
    setCookie('lang', lang)
  }
}
