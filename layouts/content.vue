<template>
    <div class="content-box">
      <Nuxt />
      <div v-if="backTopBool" class="backTop" @click="scrollTop">
        <img class="top-icon" src="~/assets/images/icon/zhiding.png" />
      </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      backTopBool: false,
      timer: null
    }
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
    }),
    scrollTop () {
      this.backTopBool = false
      document.getElementsByClassName('content-box')[0].scrollTop = 0
    }
  }
}
</script>
<style>
  .content-box::-webkit-scrollbar{
    display: none;
  }
  .content-box{
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll;
  }
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: #f4f4f4;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
