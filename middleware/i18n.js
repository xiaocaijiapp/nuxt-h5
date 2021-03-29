import { getClientCookie } from '~/assets/js/cookie'

export default function ({
  isHMR,
  app,
  store,
  route,
  params,
  error,
  redirect,
  req
}) {
  const cookieLang = getClientCookie('lang')
  const defaultLocale = cookieLang || app.i18n.fallbackLocale
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) {
    return
  }
  // Get locale from params
  const locale = params.lang || defaultLocale
  if (!store.state.common.locales.includes(locale)) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }
  // Set locale
  store.commit('SET_LANG', locale)
  app.i18n.locale = store.state.common.locale
  // If route is /<defaultLocale>/... -> redirect to /...
  if (locale === defaultLocale && route.fullPath.indexOf('/' + defaultLocale) === 0) {
    const toReplace =
      '^/' +
      defaultLocale +
      (route.fullPath.indexOf('/' + defaultLocale + '/') === 0 ? '/' : '')
    const re = new RegExp(toReplace)
    return redirect(route.fullPath.replace(re, '/'))
  }
}
