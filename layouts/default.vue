<template>
    <div class="home-container">
      <Nuxt keep-alive/>
      <Footer :active="tabBarActive"></Footer>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Footer from '../components/footer/Footer'
export default {
  components: {
    Footer
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['tabBarActive'])
  },
  mounted () {
    const vm = this
    if (vm.$route.query && vm.$route.query.shareId && vm.$route.query.shareSource && vm.$route.query.shareTime) {
      vm.handleShareObj({
        shareId: vm.$route.query.shareId,
        shareSource: vm.$route.query.shareSource,
        shareTime: vm.$route.query.shareTime
      })
    }
    if (vm.$route.query && vm.$route.query.tgid) {
      vm.handleTgid(vm.$route.query.tgid)
    }
  },
  methods: {
    ...mapActions({
      handleTgid: 'handleTgid',
      handleShareObj: 'handleShareObj'
    })
  }
}
</script>
<style>
.home-container{
  position: relative;
}
.backTop{
  position: absolute;
  width: 112px;
  height: 112px;
  z-index: 100;
  right: 8px;
  bottom: 246px;
}
.top-icon{
  width: 100%;
  height: 100%;
}
html {
  font-family: PingFangSC, PingFangSC-Medium;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
