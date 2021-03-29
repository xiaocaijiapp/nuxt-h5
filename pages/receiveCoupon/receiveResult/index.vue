<template>
    <div>
        <div class="receivepage">
            <van-nav-bar title="Starday" left-arrow @click-left="onClickLeft"></van-nav-bar>
            <div class="receivecontainer" :style="'height:' + (clientHeight-43) + 'px'">
                <div v-if="statusType==='1'">
                    <img src="~/assets/images/receivecoupon/QRcode.png" alt="">
                    <div>受取成功！</div>
                    <div>アプリに移動してログインし、使用してください～</div>
                </div>
                <div v-else>
                    <img src="~/assets/images/receivecoupon/QRcode.png" alt="">
                    <div>受取失敗！</div>
                    <div>アプリに移動し、さらに多くのサプライズが待っています～</div>
                </div>
                <div class="login_button">
                    <van-button
                            color="linear-gradient(to right, #FFA14B, #FF5D19)"
                            block
                            round
                            @click="openApp()"
                    >APPを開く</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      statusType: '',
      clientHeight: ''
    }
  },
  mounted () {
    this.clientHeight = document.documentElement.clientHeight
    const _index = window.location.href.includes('?')
    if (_index > -1) {
      this.statusType = window.location.href.split('?')[1].split('=')[1]
    }
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    // 打开APP
    openApp () {
      const u = navigator.userAgent
      const isAndroid = u.includes('Android') || u.includes('Linux') // android终端
      const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) {
        window.location.href = 'android://com.saneki.stardays/open'
        setTimeout(function () {
          const hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
          if (typeof hidden === 'undefined' || hidden === false) {
            window.location.href = 'http://download.starday.jp/target.html'
          }
        }, 2000)
      }
      if (isIOS) {
        window.location.href = 'stardaymarket://'
        setTimeout(function () {
          const hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
          if (typeof hidden === 'undefined' || hidden === false) {
            window.location.href = 'http://download.starday.jp/target.html'
          }
        }, 2000)
      }
    }
  }
}
</script>

<style scoped lang="less">
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
  /deep/.van-button--round {
    height: 88px;
    line-height: 88px;
  }
    @import url('./index');
</style>
