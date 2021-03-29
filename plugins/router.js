import api from '@/static/api'
import pvRouter from '~/static/pvRouter'
export default function ({ app, $axios, store }) {
  app.router.beforeEach((to, from, next) => {
    const toName = to.name
    const fromName = from.name
    if (['index'].includes(toName)) { store.commit('setNavNo', 0) }
    if (toName === 'login') {
      window.sessionStorage.setItem('page', (from.fullPath === '/retrievePwd' || from.fullPath === '/register' || from.fullPath === '/lineLogin') ? '/' : from.fullPath)
    }
    const PVTO = {
      elType: 0,
      pageName: pvRouter[toName]
    }
    const PVFROM = {
      elType: 1,
      pageName: pvRouter[fromName]
    }
    if (toName === 'product-goodsid') {
      PVTO.goodsId = to.params.goodsid
    }
    if (fromName === 'product-goodsid') {
      PVFROM.goodsId = from.params.goodsid
    }
    if (toName === 'store-storeid') {
      PVTO.storeId = to.params.storeid
    }
    if (fromName === 'store-storeid') {
      PVFROM.storeId = from.params.storeid
    }
    if (toName === 'receiveCoupon-receive') {
      PVTO.pageName = pvRouter[toName] + '/' + to.query.couponId
    }
    if (fromName === 'receiveCoupon-receive') {
      PVFROM.pageName = pvRouter[toName] + '/' + from.query.couponId
    }
    if (toName === 'promotionpage-promotiongoods-id' || toName === 'promotionpage-promotiondiscount-id' || toName === 'promotionpage-promotionrank-id' || toName === 'promotionpage-promotionpicture-id') {
      PVTO.pageName = pvRouter[toName] + '/' + to.params.id
    }
    if (fromName === 'promotionpage-promotiongoods-id' || fromName === 'promotionpage-promotiondiscount-id' || fromName === 'promotionpage-promotionrank-id' || fromName === 'promotionpage-promotionpicture-id') {
      PVFROM.pageName = pvRouter[fromName] + '/' + from.params.id
    }
    if (toName === 'personal-goodslist') {
      if (to.query.active === '1') {
        PVTO.pageName = 'PurchasedGoods'
      } else {
        PVTO.pageName = 'RecommendGoods'
      }
    }
    if (fromName === 'personal-goodslist') {
      if (from.query.active === '1') {
        PVFROM.pageName = 'PurchasedGoods'
      } else {
        PVFROM.pageName = 'RecommendGoods'
      }
    }
    if (fromName) { $axios.post(api.bigdata.pv, PVFROM) }
    $axios.post(api.bigdata.pv, PVTO)
    next()
  })
}
