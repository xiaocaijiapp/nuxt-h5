import { setCookie, getClientCookie, removeCookie } from '@/assets/js/cookie'
import api from 'static/api'
const state = () => ({
  locales: ['zh-CN', 'ja-JP'],
  locale: getClientCookie('lang') || 'zh-CN',
  baseImageUrl: 'https://image.stardaymart.com',
  tabBarActive: 0,
  accessToken: '',
  searchKeyWords: '',
  login: false,
  userInfo: {},
  CODSTORE: null,
  CODFEE: null,
  replyEmial: {},
  order: {},
  editAddress: {},
  subOrderInfo: {},
  payMethods: [],
  paymentForm: {},
  allinPayForm: {},
  remark: '',
  total: '',
  goodsId: '',
  touristBuyInfo: {},
  navNo: 0,
  downApp: true,
  leaderId: '', // 团长ID
  QYCode: ''
})
const mutations = {
  SET_LANG (state, value) {
    setCookie('lang', value)
    if (state.locales.includes(value)) { state.locale = value }
  },
  SET_ORDERINFO (state, value) {
    state.order = value
  },
  setDownApp (state, value) {
    state.downApp = value
  },
  setNavNo (state, value) {
    state.navNo = value
  },
  setRemark (state, value) {
    state.remark = value
  },
  setTotal (state, value) {
    state.total = value
  },
  setPaymentForm (state, value) {
    state.paymentForm = value
  },
  setAllinPayForm (state, value) {
    state.allinPayForm = value
  },
  setPayMethods (state, value) {
    state.payMethods = value
  },
  setEditAddress (state, value) {
    state.editAddress = value
  },
  setTabBarActive (state, value) {
    state.tabBarActive = value
  },
  setSubOrderInfo (state, value) {
    state.subOrderInfo = value
  },
  setSearchKeyWords (state, value) {
    state.searchKeyWords = value
  },
  setAccessToken (state, value) {
    state.accessToken = value
  },
  setUserInfo (state, infos) {
    state.userInfo = infos
  },
  setLoginState (state, value) {
    state.login = value
  },
  setCodStore (state, value) {
    state.CODSTORE = value
  },
  setCodFee (state, value) {
    state.CODFEE = value
  },
  setReplyEmial (state, value) {
    state.replyEmial = value
  },
  setGoodsId (state, value) {
    state.goodsId = value
  },
  setTouristBuyInfo (state, value) {
    state.touristBuyInfo = value
  },
  setLeaderId (state, value) {
    state.leaderId = value
  },
  setQYCode (state, value) {
    state.QYCode = value
  }
}
const actions = {
  nuxtServerInit ({ commit }, { app }) {
    const token = app.$cookies.get('token')
    // 更新 vuex 状态树
    commit('setAccessToken', token)
    commit('setLoginState', !!token)
  },
  setLang: ({ commit }, value) => {
    setCookie('lang', value)
    commit('SET_LANG', value)
  },
  passwordLogin ({ commit }, loginData) {
    return new Promise((resolve, reject) => {
      this.$axios.post(api.login.login, loginData).then((res) => {
        if (res.code === 200) {
          const { token, email, firstLogin, headImage, id, integral, stardayEmail, status, username } = res.data
          commit('setAccessToken', token)
          commit('setLoginState', true)
          commit('setUserInfo', { email, firstLogin, headImage, id, integral, stardayEmail, status, username })
          setCookie('token', token)
          resolve(res.data)
        } else {
          this.$toast(res.message)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  phoneLogin ({ commit }, emailData) {
    return new Promise((resolve, reject) => {
      this.$axios.post(`${api.login.emileLogin}${emailData.mobile}/${emailData.code}/${emailData.country}/login.do`).then((response) => {
        if (response.code === 200) {
          const { token, email, firstLogin, headImage, id, integral, stardayEmail, status, username } = response.data
          commit('setAccessToken', token)
          commit('setLoginState', true)
          commit('setUserInfo', { email, firstLogin, headImage, id, integral, stardayEmail, status, username })
          setCookie('token', token)
          resolve(response.data)
        } else {
          this.$toast(response.message)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  emailLogin ({ commit }, emailData) {
    return new Promise((resolve, reject) => {
      this.$axios.post(`${api.login.emileLogin}${emailData.username}/${emailData.code}/login.do`).then((response) => {
        if (response.code === 200) {
          const { token, email, firstLogin, headImage, id, integral, stardayEmail, status, username } = response.data
          commit('setAccessToken', token)
          commit('setLoginState', true)
          commit('setUserInfo', { email, firstLogin, headImage, id, integral, stardayEmail, status, username })
          setCookie('token', token)
          resolve(response.data)
        } else {
          this.$toast(response.message)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  newUserRegister ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      this.$axios.post(api.register.register, userInfo).then((response) => {
        if (response.code === 200) {
          const { token, email, firstLogin, headImage, id, integral, stardayEmail, status, username } = response.data
          commit('setAccessToken', token)
          commit('setLoginState', true)
          commit('setUserInfo', { email, firstLogin, headImage, id, integral, stardayEmail, status, username })
          setCookie('token', token)
          resolve(response.data)
        } else {
          this.$toast(response.message)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  actionsReplyEmail ({ commit }, data) {
    commit('setReplyEmial', data)
  },
  loginOut ({ commit }) {
    return new Promise((resolve) => {
      commit('setAccessToken', '')
      commit('setLoginState', false)
      commit('setUserInfo', {})
      removeCookie('token')
      resolve()
    })
  }
}
export default {
  state,
  mutations,
  actions
}
