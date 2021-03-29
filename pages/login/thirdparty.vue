<template>
  <div class="thirdparty"></div>
</template>

<script>
import { mapMutations } from 'vuex'
import api from '~/static/api'
import { setCookie } from '~/assets/js/cookie'
export default {
  name: 'Thirdparty',
  layout: 'content',
  mounted () {
    const _this = this
    const fullPath = window.sessionStorage.getItem('page')
    if (_this.$route.query && _this.$route.query.code && _this.$route.query.state) {
      const _url = location.origin + '/login/thirdparty'
      _this.$axios.post(api.login.linelogin, {
        code: _this.$route.query.code,
        redirectUri: _url,
        oauthType: location.href.includes('googleapis') ? '2' : '1',
        source: '2'
      }).then((res) => {
        if (res.code === 200) {
          const data = res.data
          _this.setAccessToken(data.token)
          _this.setLoginState(true)
          _this.setUserInfo(data)
          setCookie('token', data.token)
          _this.$router.push(fullPath)
        }
      })
    } else {
      _this.$router.push('/')
    }
  },
  methods: {
    ...mapMutations(['setAccessToken', 'setLoginState', 'setUserInfo'])
  }
}
</script>

<style scoped lang="less">
  .thirdparty {
    height: 800px;
  }
</style>
