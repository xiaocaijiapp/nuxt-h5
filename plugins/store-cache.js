import createPersistedState from 'vuex-persistedstate'
export default ({ store }) => {
  createPersistedState({
    storage: window.localStorage,
    reducer (vuex) {
      return {
        common: {
          locales: vuex.common.locales,
          locale: vuex.common.locale,
          baseImageUrl: vuex.common.baseImageUrl,
          tabBarActive: vuex.common.tabBarActive,
          searchKeyWords: vuex.common.searchKeyWords,
          userInfo: vuex.common.userInfo,
          CODSTORE: vuex.common.CODSTORE,
          CODFEE: vuex.common.CODFEE,
          replyEmial: vuex.common.replyEmial,
          order: vuex.common.order,
          editAddress: vuex.common.editAddress,
          subOrderInfo: vuex.common.subOrderInfo,
          payMethods: vuex.common.payMethods,
          paymentForm: vuex.common.paymentForm,
          allinPayForm: vuex.common.allinPayForm,
          remark: vuex.common.remark,
          total: vuex.common.total,
          goodsId: vuex.common.goodsId,
          touristBuyInfo: vuex.common.touristBuyInfo,
          navNo: vuex.common.navNo,
          leaderId: vuex.common.leaderId,
          QYCode: vuex.common.QYCode
        },
        statistics: vuex.statistics
      }
    }
  })(store)
}
