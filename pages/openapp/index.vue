<template>
  <div class="openapp">
    <div class="nav">
      <div class="arrow-left" @click="onClickLeft">
        <img src="~/assets/images/goodsdetail/arrow-left.png" />
      </div>
    </div>
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
import { mapGetters } from 'vuex'
export default {
  name: 'Index',
  layout: 'content',
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    }),
    getUrl () {
      return process.env.proxyUrl
    }
  },
  async asyncData ({ $axios, params, store, query }) {
    let imageListcopy = ''
    let descTextcopy = ''
    let goodsImage = ''
    await $axios({
      url: '/starday-goods/user/goods/share/' + query.shareIntegralId,
      method: 'get'
    }).then((res) => {
      // console.log('res----333333=====', res)
      if (res.code === 200) {
        imageListcopy = res.data.goodsShareDTO.imageList || ''
        descTextcopy = res.data.goodsShareDTO.descText || ''
      }
    })
    if (imageListcopy === '') {
      await $axios({
        url: '/starday-goods/user/goods/details/' + query.productid,
        method: 'get'
      }).then((res) => {
        // console.log('res----333333=====', res)
        if (res.code === 200) {
          goodsImage = res.data.goodsImage || ''
          descTextcopy = res.data.goodsTitle || ''
        }
      })
    }
    return {
      productid: query.productid,
      shareIntegralId: query.shareIntegralId,
      imageListcopy,
      descTextcopy,
      goodsImage
    }
  },
  head () {
    const vm = this
    return {
      title: vm.descTextcopy,
      meta: [
        {
          property: 'og:url',
          content: vm.getUrl + 'product/' + vm.productid + '?shareIntegralId=' + vm.shareIntegralId
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:title',
          content: 'Starday - ネット通販公式サイト｜Starday市場'
        },
        {
          property: 'og:description',
          content: vm.descTextcopy
        },
        {
          property: 'og:image',
          content: vm.baseImageUrl + (vm.imageListcopy[0] || vm.goodsImage)
        },
        {
          property: 'fb:app_id',
          content: '2743034795911788'
        },
        {
          name: 'title',
          content: 'Starday - ネット通販公式サイト｜Starday市場'
        },
        {
          name: 'twitter:site',
          content: 'website'
        },
        {
          name: 'twitter:url',
          content: vm.getUrl + 'product/' + vm.productid + '?shareIntegralId=' + vm.shareIntegralId
        },
        {
          name: 'twitter:description',
          content: vm.descTextcopy
        },
        {
          name: 'twitter:image',
          content: vm.baseImageUrl + (vm.imageListcopy[0] || vm.goodsImage)
        },
        {
          name: 'twitter:card',
          content: 'summary'
        }
      ]
    }
  },
  methods: {
    onClickLeft () {
      const vm = this
      window.location.href = location.origin + '/product/' + vm.$route.query.productid + '?shareIntegralId=' + vm.$route.query.shareIntegralId
    },
    openApp () {
      const vm = this
      const u = navigator.userAgent
      const isAndroid = u.includes('Android') > -1 || u.includes('Linux') > -1 // android终端
      const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) {
        const _str = ('android://com.saneki.stardays/open?productid=' + vm.$route.query.productid + '&shareIntegralId=' + vm.$route.query.shareIntegralId)
        window.location.href = _str
        setTimeout(function () {
          const hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
          if (typeof hidden === 'undefined' || hidden === false) {
            window.location.href = 'http://download.starday.jp/target.html'
          }
        }, 2000)
      }
      if (isIOS) {
        window.location.href = 'stardaymarket://?productid=' + vm.$route.query.productid + '&shareIntegralId=' + vm.$route.query.shareIntegralId
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
  .openapp {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-flow: column;
    align-items: center;
    background: url(../../assets/images/activity/couponcenter.png);
    background-size: 100% 100%;
    position: relative;
    .nav {
      .arrow-left {
        position: absolute;
        top: 32px;
        left: 40px;
        width: 48px;
        height: 48px;
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
