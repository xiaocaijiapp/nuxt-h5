<template>
  <div class="couponcenter">
    <div class="nav">
      <div class="arrow-left" @click="onClickLeft">
        <img src="~/assets/images/goodsdetail/arrow-left.png" />
      </div>
    </div>
    <div v-if="showTip" class="tip">{{$t('returnList.applyReturnGood')}}</div>
    <div class="buttonBox">
      <div class="butn" @click="openApp()">
        <button class="buttonOne"> {{$t('index.openStarday')}}</button>
      </div>
      <div class="butn">
        <button class="buttonTwo">
          <a class="down_a" href="http://download.starday.jp/target.html" target="_blank">{{$t('index.nowdown')}}</a>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Couponcenter',
  layout: 'content',
  data () {
    return {
      showTip: ''
    }
  },
  mounted () {
    this.showTip = this.$route.query.showTip || 0
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    // 打开APP
    openApp () {
      const u = navigator.userAgent
      const isAndroid = u.includes('Android') > -1 || u.includes('Linux') > -1 // android终端
      const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) {
        window.location.href = 'android://com.saneki.stardays/open?name=zhangsan&age=26'
        // window.location.href = 'android://com.saneki.stardays/open?productid=1&shareIntegralId=1'
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

<style lang="less" scoped>
.couponcenter {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  background: url(../../assets/images/activity/couponcenter.png) no-repeat;
  background-size: 100% 100%;
  filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size:100% 100%;
  position: relative;
  .nav {
    .arrow-left {
      position: absolute;
      top: 32px;
      left: 40px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.2);
      img {
        width: 16px;
        margin: 0;
      }
    }
  }
  .tip {
    width: 100%;
    color: #fff;
    font-size: 32px;
    text-align: center;
    position: absolute;
    bottom: 23%;
    left: 2%;
  }
  .buttonBox {
    position: absolute;
    left: 50%;
    bottom: 6%;
    transform: translate(-50%, -6%);
    button {
      width: 416px;
      height: 64px;
      font-size: 24px;
      text-align: center;
      line-height: 64px;
      border: 1px solid #fff;
      border-radius: 50px;
    }
    .buttonOne {
      color: #fff;
      background-color: transparent;
      margin-bottom: 30px;
    }
    .buttonTwo {
      background: #fff;
      .down_a {
        color: #FF5D19;
      }
    }
  }
}
</style>
