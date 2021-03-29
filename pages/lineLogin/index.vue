<template>
  <div>
    <van-nav-bar
      class="nav"
      left-arrow
      border
      placeholder
      fixed
      @click-left="onClickLeft"
    />
    <div class="contaner">
      <div class="icons">
        <van-icon :name="require('assets/images/icon/line.png')" />
        <van-icon :name="require('assets/images/icon/jiaohuan.png')" />
        <van-icon :name="require('assets/images/icon/starday.png')" />
      </div>
      <div class="textBox">
        <div>{{$t('linelogin.title')}}</div>
        <div>{{$t('linelogin.desc1')}}</div>
        <div>{{$t('linelogin.desc')}}</div>
      </div>
      <div class="buttonBox">
        <van-button
          color="linear-gradient(to right, #FFA14B, #FF5D19)"
          block
          round
          @click="lineLogin"
        >{{$t('linelogin.save')}}</van-button>
        <van-button
          color="#BBBBBB"
          block
          round
          @click="goback"
        >{{$t('linelogin.cancel')}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'content',
  components: {},
  data () {
    return {}
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    lineLogin () {
      const that = this
      const _url = location.origin + '/login/thirdparty'
      const state = that.RndNum(5)
      location.href = 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=' + '1654155216&redirect_uri=' + _url + '&state=' + state + 'abcde&scope=profile%20openid%20email&nonce=09876xyz'
    },
    RndNum (n) {
      let rnd = ''
      for (let i = 0; i < n; i++) { rnd += Math.floor(Math.random() * 10) }
      return rnd
    },
    goback () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.van-nav-bar__content {
    height: 88px;
    line-height: 88px;
  }
  /deep/.van-nav-bar__title {
    font-size: 32px;
    color: #333333;
  }
  /deep/.van-icon-arrow-left {
    color: #999;
    font-size: 36px;
  }
  .van-button--round {
    height: 80px;
    font-size: 28px;
  }
.contaner {
  width: 100%;
  height: calc(100vh - 88px);
  padding-top: 100px;
  background: #fff;
  .icons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 124px;
    }
    i:nth-child(2) {
      font-size: 60px;
      margin-right: 60px;
    }
    i:nth-child(1) {
      margin-right: 60px;
    }
  }
  .textBox {
    padding: 80px;
    text-align: left;
    div:first-child {
      font-size: 36px;
      color: #333333;
      font-weight: bold;
      line-height: 50px;
    }
    div:nth-child(2) {
      font-size: 28px;
      color: #666666;
      line-height: 36px;
      padding-top: 40px;
    }
    div:last-child {
      font-size: 28px;
      color: #666666;
      line-height: 36px;
      padding-top: 20px;
    }
  }
  .buttonBox {
    padding-top: 100px;
    width: 54%;
    margin-left: 23%;
    button {
      margin-top: 40px;
    }
  }
}
</style>
