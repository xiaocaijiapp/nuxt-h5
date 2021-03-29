<template>
  <div class="index-container">
    <downapp v-show="DownAppShow" @changeDownApp="handleDownApp"></downapp>
    <div v-if="backTopBool" class="backTop" @click="scrollTop">
      <img class="top-icon" src="~assets/images/icon/zhiding.png" />
    </div>
    <van-sticky>
      <div class="header" :style="{backgroundColor: backgroundColor}">
        <van-icon size="30px" :name="activeIcon? require(`assets/images/index/logo.png`) : require(`assets/images/index/logo.png`)"/>
        <van-search shape="round" class="search" :placeholder="$t('home.search')" input-align="center" disabled @click="goSearch">
          <template #left-icon>
            <img class="search-icon" src="~/assets/images/index/sousuo.png"/>
          </template>
        </van-search>
        <van-icon size="30px" :name="activeIcon ? require(`assets/images/icon/fenxiang.png`) : require(`assets/images/icon/fenxiang.png`)" @click="shareHandle"/>
      </div>
    </van-sticky>
    <div class="nav-container">
      <div class="nav">
        <div v-for="(item, index) in navData" :key="index" class="nav-item" :class="navIndex == index ? 'active' : ''" @click="changeNav(index)">{{ item.typeName }}</div>
        <div class="line" :style="navLinepos"></div>
      </div>
      <div class="cate" @click="toCate">
        <a class="category-icon" :href="getUrl + 'category'" @click.prevent="()=> false"><img src="~/assets/images/index/caidan.png" /></a>
      </div>
    </div>
    <div class="children-container">
      <nuxt-child />
    </div>
    <div class="hotword">
      <p class="hote-header">{{$t('search.hotsearch')}}</p>
      <div class="hot-content">
        <div class="hot-scroll">
          <a v-for="(item, index) in hotwordData" :key="index" :href="getUrl + 'search/product/'+item+'/1'" @click.prevent="()=> false">
            <span class="hot-item" @click.stop="$router.push(`/search/product/${item}/1`)">{{item}}</span>
          </a>
        </div>
      </div>
    </div>
    <CouponPoupon v-if="CouponPopupList.length>0" :list="CouponPopupList" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import CouponPoupon from '~/components/index/CouponPoupon'
import downapp from '~/components/index/downapp'
import api from '~/static/api'
import cachePage from '~/static/globalCache'
export default {
  name: 'Home',
  layout: 'default',
  middleware: ['i18n', 'auth'],
  watchQuery: true,
  components: {
    CouponPoupon,
    downapp
  },
  async asyncData ({ $axios, store, error }) {
    try {
      let response, navData
      if (cachePage.has('baseData')) {
        const baseData = JSON.parse(cachePage.get('baseData'))
        response = baseData.response
        navData = baseData.navData
      } else {
        // 首页基础数据
        await $axios.get(api.home.indexData, { useCache: true }).then((res) => {
          if (res.code === 200) {
            response = res.data
            navData = res.data.navData.map((item) => {
              item.typeName = store.state.common.locale === 'ja-JP' ? item.name.split('|')[1] : item.name.split('|')[0]
              return item
            })
            navData.sort((a, b) => a.sort - b.sort)
            navData.unshift({
              typeName: store.state.common.locale === 'ja-JP' ? 'ホームページ' : '首页'
            })
            cachePage.set('baseData', JSON.stringify({ response, navData }))
          }
        })
      }
      // seo
      const SeoData = await $axios.get('/starday-system/user/seo/info/1/0/1', { useCache: true })
      const hotwordData = await $axios.post('/starday-elasticsearch/search/random/tags', { keywords: '', sortOrder: (new Date().getTime() / 1000) - [1, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000][Math.floor(Math.random() * 10)] })
      return {
        indexData: response,
        navData,
        SeoData: SeoData.data,
        hotwordData: hotwordData.data
      }
    } catch (err) {
      err.url = api.home.indexData
      return error(err)
    }
  },
  data () {
    return {
      backTopBool: false,
      showShare: true,
      CouponPopupList: [],
      activeIcon: true,
      backgroundColor: '#ffffff',
      DownAppShow: false,
      navIndex: 0,
      navLinepos: {
        transform: 'translateX(48px) translateX(-50%)'
      }
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl', 'locale', 'login', 'userInfo', 'navNo', 'downApp']),
    getUrl () {
      return process.env.proxyUrl
    }
  },
  mounted () {
    if (this.login) {
      this.getCouponList()
    }
    this.DownAppShow = this.downApp
    this.setTabBarActive(0)
    this.handleNavLine(0)
    setTimeout(() => {
      // 首先，在mounted钩子window添加一个滚动滚动监听事件
      document.querySelectorAll('.index-container')[0].addEventListener('scroll', this.handleScroll)
      this.handleScroll()
    }, 500)
  },
  methods: {
    ...mapMutations(['SET_LANG', 'setTabBarActive', 'setNavNo']),
    toCate () {
      this.setTabBarActive(1)
      this.$router.push('/category')
    },
    handleDownApp (e) {
      this.DownAppShow = e
    },
    scrollTop (e) {
      this.backTopBool = false
      document.querySelectorAll('.index-container')[0].scrollTop = 0
    },
    shareHandle () {
      const vm = this
      let _url = location.origin + location.pathname
      const _str = []
      if (vm.login && vm.userInfo.id) {
        if (vm.$route.query) {
          for (const i in vm.$route.query) {
            if (i !== 'shareId' && i !== 'shareSource' && i !== 'shareTime') {
              _str.push(i + '=' + vm.$route.query[i])
            }
          }
        }
        if (_str.length) {
          _url = _url + '?' + _str.join('&') + '&shareId=' + vm.userInfo.id + '&shareSource=2&shareTime=' + Math.floor(new Date().getTime() / 1000)
        } else {
          _url = _url + '?shareId=' + vm.userInfo.id + '&shareSource=2&shareTime=' + Math.floor(new Date().getTime() / 1000)
        }
        vm.$copyText(_url).then(function (e) {
          vm.$toast.success(vm.$t('home.copysuccess'))
        }, function (e) {
          vm.$toast.fail(vm.$t('home.copyerror'))
        })
      } else {
        this.$router.push('/login')
      }
    },
    goSearch () {
      this.$router.push('/search')
    },
    getCouponList () {
      const vm = this
      vm.$axios({
        url: 'starday-activity/user/coupon/systemSend',
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            vm.CouponPopupList = res.data
          }
        }
      })
    },
    changeNav (index) {
      this.setNavNo(index)
      this.handleNavLine(index)
      switch (index) {
        case 0:
          this.$router.push('/')
          break
        default:
          this.$router.push(`/${index}/1`)
      }
    },
    handleNavLine (index) {
      this.navIndex = index
      const clickEle = document.getElementsByClassName('nav-item')[index]
      const navEle = document.getElementsByClassName('nav')[0]
      const navSelfW = navEle.offsetWidth
      // 获取自身宽度
      const selfW = clickEle.offsetWidth
      // 获取元素距离父元素左侧距离
      const left = clickEle.offsetLeft
      navEle.scrollLeft = left - (navSelfW / 2) ? left - (navSelfW / 2) + (selfW / 2) : 0
      this.navLinepos.transform = `translateX(${selfW / 2 + left}px) translateX(-50%)`
    },
    handleScroll (e) {
      const scrollTop = e ? e.target.scrollTop : document.querySelectorAll('.index-container')[0].scrollTop
      // 设置背景颜色的透明读
      if (scrollTop > 0 && scrollTop < 200) {
        this.activeIcon = false
        // this.backgroundColor = `rgba(255, 255, 255,${scrollTop / (scrollTop + 20)})`
        this.backgroundColor = 'rgba(255, 255, 255, 1)'
      } else if (scrollTop >= 200) {
        this.backgroundColor = 'rgba(255, 255, 255,1)'
      } else {
        this.activeIcon = true
        this.backgroundColor = '#ffffff'
      }
      if (scrollTop > 500) { this.backTopBool = true } else { this.backTopBool = false }
    },
    downHandle () {
      const u = navigator.userAgent
      const isAndroid = u.includes('Android') > -1 || u.includes('Linux') > -1 // android终端
      const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      let _url = ''
      if (isAndroid) {
        _url = 'android://com.saneki.stardays/open'
      }
      if (isIOS) {
        _url = 'stardaymarket://'
      }
      if (_url) {
        this.testApp(_url)
      }
    },
    testApp (url) {
      const t = 1000; let hasApp = true
      setTimeout(function () {
        if (hasApp) {
          window.location.href = url
        }
        document.body.removeChild(ifr)
      }, 2000)
      const t1 = Date.now()
      const ifr = document.createElement('iframe')
      ifr.setAttribute('src', url)
      ifr.setAttribute('style', 'display:none')
      document.body.appendChild(ifr)
      setTimeout(function () {
        const t2 = Date.now()
        if (!t1 || (t2 - t1 < t + 500)) {
          hasApp = false
        }
      }, 1500)
    }
  },
  head () {
    const vm = this
    return {
      title: vm.SeoData.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: vm.SeoData.des
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: vm.SeoData.keyWords
        }
      ],
      head () {
        return {
          link: [
            {
              hid: 'canonical',
              ref: 'canonical',
              href: 'https://www.starday.jp/'
            },
            {
              hid: 'alternate',
              ref: 'alternate',
              media: 'only screen and (max-width: 640px)',
              href: 'https://m.starday.jp/'
            }
          ]
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .index-container::-webkit-scrollbar{
    display: none;
  }
  .index-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 98px);
    overflow-x: hidden;
    overflow-y: scroll;
    .backTop{
      width: 112px;
      height: 112px;
      position: fixed;
      right: 8px;
      bottom: 246px;
      z-index: 100;
    }
    .header {
      width: 100%;
      height: 88px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      background-color: transparent;
      .search {
        flex: 1;
        height: 60px;
        padding: 0 20px;
        background-color: transparent;
        .van-search__content {
          height: inherit;
          background-color: #f2f2f2;
          padding-left: 20px;
          .van-cell {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: flex-start;
            font-size: 0;
            padding: 0;
            line-height: 0;
            /deep/.van-field__left-icon {
              margin-right: 0;
              .search-icon {
                width: 32px;
                height: 32px;
              }
            }

            /deep/ .van-field__value {
              font-size: 26px;
              color: #999999;
              font-weight: 400;
              line-height: 30px;
              .van-field__control {
                text-align: left;
                padding-left: 16px;
              }
              .van-field__control::-webkit-input-placeholder{
                font-size: 26px;
              }
            }
          }
        }
      }
    }
    .nav-container{
      width: 100%;
      height: 66px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      background-color: #ffffff;
      .nav::-webkit-scrollbar{
        display: none;
      }
      .nav{
        flex: 1;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling:touch;
        white-space: nowrap;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        position: relative;
        .nav-item {
          margin: 0 24px;
          font-size: 18px;
          color: #000;
          font-weight: 600;
        }
        .active {
          color: #ff5d19;
          font-size: 18px;
          font-weight: 600;
        }
        .line {
          position: absolute;
          width: 60px;
          height: 6px;
          background: #ff5d19;
          left: 0;
          bottom: 0;
          transition: all .3s;
        }
      }
      .cate{
        padding-left: 24px;
        width: 36px;
        height: 100%;
        box-sizing: content-box;
        display: flex;
        align-items: center;
        .category-icon {
          display: inline-block;
          width: 36px;
          height: 36px;
          img{
            width: 36px;
            height: 36px;
          }
        }
      }
    }
    .children-container {
      width: 100%;
      height: auto;
    }
    .hotword{
      width: 100%;
      .hote-header{
        font-size: 32px;
        font-weight: 400;
        text-align: left;
        color: #333333;
        line-height: 45px;
        padding: 36px 24px;
      }
      .hot-content::-webkit-scrollbar{
        display: none;
      }
      .hot-content{
        width: 100%;
        height: auto;
        overflow: scroll;
        padding: 0 24px;
        .hot-scroll{
          width: 300vw;
          display: flex;
          flex-flow: row wrap;
          justify-content: flex-start;
          a{
            margin-bottom: 15px;
            margin-right: 20px;
            .hot-item{
              font-size: 28px;
              font-weight: 400;
              color: #666666;
              line-height: 40px;
              padding: 15px 30px;
              border-radius: 35px;
              background-color: #ffffff;
              flex-shrink: 0;
            }
          }
        }
      }
      a{
        display: block;
        padding: 10px 0;
        font-size: 26px;
        color: #999999;
      }
    }
  }
</style>
