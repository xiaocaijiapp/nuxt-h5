import whiteList from '@/static/white-list'
import { getServerCookie } from '~/assets/js/cookie'
export default function ({ route, redirect, store, req }) {
  const accessToken = getServerCookie(req).token || store.getters.accessToken
  const whiteAuth = whiteList.includes(route.name)
  if (!accessToken && !whiteAuth) {
    redirect('/login')
  }
}
