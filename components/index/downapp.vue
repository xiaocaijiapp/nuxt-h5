<template>
    <div class="downapp-box">
        <div class="left">
            <img src="~/assets/images/index/applogo.png" alt="">
            <span>Starday</span>
        </div>
        <div class="right">
            <div class="btn" @click="downHandle">
                <a href="javascript: void(0)" >{{$t('index.nowdown')}}</a>
            </div>
            <img src="~/assets/images/index/guanbi.png" alt="" @click="close">
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {}
  },
  methods: {
    ...mapMutations(['setDownApp']),
    downHandle () {
      const vm = this
      const u = navigator.userAgent
      const isAndroid = u.includes('Android') > -1 || u.includes('Linux') > -1 // android终端
      const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) {
        let _str = 'android://com.saneki.stardays/open'
        if (vm.$route.params.goodsid && vm.$route.query.shareIntegralId) {
          _str = ('android://com.saneki.stardays/open?productid=' + vm.$route.params.goodsid + '&shareIntegralId=' + vm.$route.query.shareIntegralId)
        }
        window.location.href = _str
        setTimeout(function () {
          const hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
          if (typeof hidden === 'undefined' || hidden === false) {
            window.location.href = 'http://download.starday.jp/target.html'
          }
        }, 2000)
      }
      if (isIOS) {
        let _strios = 'stardaymarket://'
        if (vm.$route.params.goodsid && vm.$route.query.shareIntegralId) {
          _strios = 'stardaymarket://?productid=' + vm.$route.params.goodsid + '&shareIntegralId=' + vm.$route.query.shareIntegralId
        }
        window.location.href = _strios
        setTimeout(function () {
          const hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
          if (typeof hidden === 'undefined' || hidden === false) {
            window.location.href = 'http://download.starday.jp/target.html'
          }
        }, 2000)
      }
      this.close()
    },
    close () {
      this.setDownApp(false)
      this.$emit('changeDownApp', false)
    }
  }
}
</script>

<style lang="less" scoped>
.downapp-box{
    /*position: fixed;*/
    z-index: 1000;
    background: #fff5dc;
    width: 100%;
    height: 88px;
    /*top: 0px;*/
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    align-items: center;
    .left{
        display: flex;
        align-items: center;
        img{
            width: 60px;
            height: 60px;
        }
        span{
            color: #333333;
            font-size: 40px;
            font-weight: 400;
            margin-left: 20px;
        }
    }
    .right{
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .btn{
            height: 50px;
            font-size: 26px;
            line-height: 50px;
            text-align: center;
            color: #ffffff;
            background: #ff4d4e;
            border-radius: 8px;
            a{
                display: inline-block;
                padding: 0 20px;
                height: 50px;
                color: #ffffff;
                text-decoration: none;
            }
        }
        img{
            width: 30px;
            height: 30px;
            margin-left: 20px;
        }
    }
}
</style>
