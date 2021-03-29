import Vue from 'vue'
import Vuex from 'vuex'
import statistics from './module/statistics'
import common from '~/store/module/common'

import getters from '~/store/getters'
Vue.use(Vuex)
const store = () => {
  return new Vuex.Store({
    getters,
    modules: {
      common, statistics
    }
  })
}
export default store
