<template>
  <div class="search-container">
    <div class="search-header-container">
      <van-icon class="arrow-l" color="#999999" size="22px" name="arrow-left" @click="toBeforePage" />
      <a :href="getUrl + 'category'" class="a-link" @click="()=> false">
        <van-icon name="wap-nav" size="1.03125rem" color="#999999" />
      </a>
      <van-search v-model="value" class="search" shape="round" background="#fff" :placeholder="$t('classification.search')" @blur="search">
        <template #left-icon>
          <img class="search-icon" src="~/assets/images/category/search.png" />
        </template>
      </van-search>
    </div>
    <div class="branBox">
      <a :href="getUrl" @click.prevent="()=> false">
        <span @click="$router.push('/')">Starday</span>
      </a>
      >
      <span @click="$router.push('/sitemap/searches/1')">Searches</span>
      >
      <span>
        <h1 style="display:inline-block;">
          {{value}}通販
        </h1>
      </span>
    </div>
    <!--    搜索结果页面-->
    <div class="searchResult">
      <div class="nav">
        <div class="nav-item" :class="active == 0 ? 'active' : ''" @click="changeNav(0)">{{$t('newUserInfo.goods')}}</div>
        <div class="nav-item" :class="active == 1 ? 'active' : ''" @click="changeNav(1)">{{$t('newUserInfo.store')}}</div>
      </div>
      <div class="content">
        <div v-if="active == 0" class="production">
          <div v-if="goodsList.length > 0">
            <div class="sec-box">
              <div class="sec-item" :class="sorted === '' ? 'secActive' : ''" @click="secSearch('')">
                <span class="sec-title">{{$t('newThreeClass.a')}}</span>
              </div>
              <div class="sec-item" :class="sorted === '0' ? 'secActive' : ''" @click="secSearch(0)">
                <span class="sec-title">{{$t('newThreeClass.b')}}</span>
              </div>
              <div class="sec-item" :class="sorted === '2' ? 'secActive' : ''" @click="secSearch(2)">
                <span class="sec-title">{{$t('newThreeClass.c')}}</span>
              </div>
              <div class="sec-item" :class="sorted === '1' ? 'secActive' : ''" @click="secSearch(1)">
                <span class="sec-title">{{$t('newThreeClass.d')}}</span>
                <span class="price">
                  <van-icon size="0.8rem" :color="(sortOrder == 'desc' && sorted === '1') ? 'rgb(255, 93, 25)' : '#999' " name="arrow-up" @click="priceSearch('desc')" />
                  <van-icon size="0.8rem" :color="sortOrder == 'asc' ? 'rgb(255, 93, 25)' : '#999'" name="arrow-down" @click="priceSearch('asc')" />
                </span>
              </div>
            </div>
            <div class="production-list" :style="`height:${storelistH - prolistH}px`">
              <div class="pro-container">
                <GoodsList :list="productList"></GoodsList>
              </div>
            </div>
          </div>
          <van-empty v-else :image="require(`assets/images/empty/wushoucang.png`)" :description="$t('newUserInfo.error_msg1')" />
        </div>
        <div v-if="tagData.desc" class="descbox">
          <div v-html="tagData.desc" />
        </div>
        <div v-if="tagData && tagData.tags && tagData.tags.length" class="releasesearchbox">
          <h2>{{ searchKw }}に関連する検索キーワード</h2>
          <!--      <p>{{ getLanguageData.searchPage.releaseSearch }}</p>-->
          <a v-for="(item,index) in tagData.tags" :key="index" :href="getUrl + 'search/product/'+ item + '/1'">{{ item }}</a>
        </div>
<!--        <div v-else class="store" :style="`height:${storelistH}px`">-->
<!--          <div v-if="storeList.rows.length > 0" class="store-container"></div>-->
<!--          <van-empty v-else :image="require(`assets/images/empty/wushoucang.png`)" :description="$t('newUserInfo.error_msg1')" />-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import GoodsList from '~/components/search/list'
import api from '~/static/api'
const _uniqWith = require('lodash/uniqWith')
const _ = require('lodash')
export default {
  name: 'SearchResult',
  layout: 'content',
  middleware: ['i18n', 'auth'],
  watchQuery: ['sorted', 'sortOrder'],
  components: {
    GoodsList
  },
  async asyncData ({ $axios, query, params }) {
    const { sorted, sortOrder } = query
    const pageNo = params.productpageno
    const reg = new RegExp('&', 'g')
    const searchKw = params.product.replace(reg, '/')
    // 置顶商品
    let topProducts = []
    if (query.spuIds && query.spuIds.split(',').length) {
      const topData = await $axios.post(api.goods.getGoodsInfo, query.spuIds.split(','))
      if (topData.data && topData.data.length) {
        topProducts = topData.data
      }
    }
    const request = {
      pageNo: pageNo || 1,
      pageSize: pageNo * 20 || 20,
      keyword: searchKw,
      sorted: sorted || '',
      sortOrder: sortOrder || 'desc',
      listType: 0
    }
    const { data } = await $axios.post(api.store.goods, request)
    let storeList = []
    await $axios.post(api.search.storeResault, {
      pageNo: pageNo || 1,
      pageSize: pageNo * 20 || 20,
      storeName: searchKw
    }).then((res) => {
      if (res.code === 200) { storeList = res.data } else { storeList = [] }
    })
    // 是否存在关联词tag
    const tagData = await $axios.post('/starday-elasticsearch/search/tags', { keywords: searchKw, sortOrder: (new Date().getTime() / 1000) - [1, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000][Math.floor(Math.random() * 10)] })
    if (tagData.data && tagData.data.desc) {
      tagData.data.desc = tagData.data.desc.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<p/g, '<p style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"').replace(/<span/g, '<span style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"').replace(/<strong/g, '<strong style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"').replace(/<h2/g, '<h2 style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"').replace(/<b/g, '<b style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"')
    }
    const seoData = {
      title: (searchKw || '') + 'の通販「人気' + (searchKw || '') + '」商品おすすめ｜Starday',
      keyWords: (searchKw || '') + ',' + (searchKw || '') + '通販,starday,starday市場,starday mart,通販,インターネットショッピング,オンラインショッピング"',
      des: (searchKw || '') + '通販のページ、人気の' + (searchKw || '') + 'がお得な価格で登場！全品最安値99円から！セール商品・送料無料商品も多数！stardayは総合オンラインショッピングサイトです。'
    }
    return {
      sortOrder: sortOrder || 'desc',
      searchKw,
      pageNo,
      sorted: sorted || '',
      goodsList: [...topProducts, ...data.rows],
      storeList,
      seoData,
      tagData: tagData.data
    }
  },
  data () {
    return {
      value: '',
      active: 0,
      price: true,
      prolistH: 0,
      storelistH: 0
    }
  },
  computed: {
    productList () {
      return this.goodsList
    },
    getUrl () {
      return process.env.proxyUrl
    }
  },
  created () {
    this.value = this.searchKw
  },
  mounted () {
    this.storelistH = document.getElementsByClassName('production')[0] ? document.getElementsByClassName('production')[0].clientHeight : 0
    this.prolistH = document.getElementsByClassName('sec-box')[0] ? document.getElementsByClassName('sec-box')[0].clientHeight : 0
    if (this.goodsList.length > 0) {
      this.lazyload()
      document.getElementsByClassName('production-list')[0].addEventListener('scroll', _.throttle(this.lazyload, 1000))
    }
  },
  methods: {
    lazyload () {
      const viewHeight = document.body.clientHeight // 获取可视区高度
      const imgs = document.getElementsByClassName('production-list')[0].querySelectorAll('img[data-src]')
      imgs.forEach((item, index) => {
        if (item.dataset.src === '') { return }
        // 用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
        const rect = item.getBoundingClientRect()
        if (rect.bottom >= 0 && rect.top < viewHeight) {
          item.src = item.dataset.src
          item.removeAttribute('data-src')
        }
      })
    },
    changeNav (i) {
      this.active = i
      switch (i) {
        case 0:
          this.$router.push(`/search/product/${this.searchKw}/1`)
          break
        case 1:
          this.$router.push(`/search/store/${this.searchKw}/1`)
          break
        default:
          this.$router.push(`/search/product/${this.searchKw}/1`)
      }
    },
    search () {
      // 执行搜索
      if (this.value) {
        this.$router.push(`/search/product/${this.value}/1`)
        const list = JSON.parse(localStorage.getItem('historySearch'))
        list.unshift(this.value)
        const newHistorySearch = _uniqWith(list)
        localStorage.setItem('historySearch', JSON.stringify(newHistorySearch))
      } else {
        this.$toast(this.$t('newUserInfo.searchTips'))
      }
    },
    secSearch (i) {
      this.sorted = i
      switch (i) {
        case 0:
          // 销量
          this.$router.push('/search/product/' + this.searchKw + '/1?sorted=0&sortOrder=desc')
          // window.location.href = `/search/product/${this.searchKw}/1?sorted=0&sortOrder=desc`
          // this.$router.push({ path: `/search/product/${this.searchKw}/1`, query: { sorted: 0, sortOrder: 'desc' } })
          break
        case 2:
          // 上新
          this.$router.push('/search/product/' + this.searchKw + '/1?sorted=2&sortOrder=desc')
          // window.location.href = `/search/product/${this.searchKw}/1?sorted=2&sortOrder=desc`
          // this.$router.push({ path: `/search/product/${this.searchKw}/1`, query: { sorted: 2, sortOrder: 'desc' } })
          break
        case 1:
          // 价格
          this.$router.push('/search/product/' + this.searchKw + '/1?sorted=1&sortOrder=' + this.sortOrder)
          // window.location.href = `/search/product/${this.searchKw}/1?sorted=1&sortOrder=${this.sortOrder}`
          // this.$router.push({ path: `/search/product/${this.searchKw}/1`, query: { sorted: 1, sortOrder: this.sortOrder } })
          break
        default:
          this.$router.push('/search/product/' + this.searchKw + '/1?sorted=&sortOrder=desc')
          // window.location.href = `/search/product/${this.searchKw}/1?sorted=&sortOrder=desc`
          // this.$router.push({ path: `/search/product/${this.searchKw}/1`, query: { sorted: '', sortOrder: 'desc' } })
      }
    },
    priceSearch (str) {
      this.sortOrder = str
      if (str === 'asc') { this.price = false } else { this.price = true }
    },
    toBeforePage () {
      this.$router.push('/search')
    }
  },
  head () {
    const vm = this
    return {
      title: vm.seoData.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: vm.seoData.des
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: vm.seoData.keyWords
        }
      ],
      link: [
        {
          hid: 'canonical',
          ref: 'canonical',
          href: 'https://www.starday.jp/search/product/' + this.$route.params.product + '/'
        },
        {
          hid: 'alternate',
          ref: 'alternate',
          media: 'only screen and (max-width: 640px)',
          href: 'https://m.starday.jp/search/product/' + this.$route.params.product + '/'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
}
.search-header-container {
  width: 750px;
  height: 88px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding-left: 30px;
  padding-right: 40px;
  .a-link{
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    align-items: center;
  }
  .search {
    flex: 1;
    height: 60px;
    padding: 0;
    margin-left:10px;
    .search-icon {
      width: 32px;
      height: 32px;
      margin-left: 20px;
      vertical-align: middle;
    }
    .a-link{
      margin-left: -40px;
      margin-right: 10px;
      vertical-align: middle;
    }
    /deep/.van-search__content {
      width: inherit;
      height: 100%;
      padding: 0;
      .van-cell {
        padding: 0;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        .van-cell__value .van-field__body {
          padding-left: 10px;
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #999999;
          line-height: 37px;
          .van-icon {
            font-size: 28px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
.searchResult {
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  background-color: #ffffff;
  .nav {
    width: 100%;
    height: 80px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid rgba(229, 229, 229, 0.6);
    & .active {
      border-bottom: 6px solid rgba(255, 93, 25, 1) !important;
      color: rgba(255, 93, 25, 1) !important;
      font-weight: 500 !important;
    }
    .nav-item {
      border-bottom: 6px solid rgba(0, 0, 0, 0);
      height: inherit;
      font-size: 34px;
      font-weight: 400;
      text-align: left;
      color: #333333;
      line-height: 74px;
    }
  }
  .content::-webkit-scrollbar {
    display: none;
  }
  .content {
    flex: 1;
    background-color: #f4f4f4;
    overflow-x: hidden;
    overflow-y: scroll;
    .production {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      .sec-box {
        width: 100%;
        height: 80px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        background-color: #ffffff;
        .secActive {
          color: #ff5d19 !important;
        }
        .sec-item {
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #666666;
          line-height: 40px;
          padding: 20px 30px;
        }
        .sec-item:last-child {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .price {
            height: 60px;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
          }
        }
      }
      .production-list::-webkit-scrollbar {
        display: none;
      }
      .production-list {
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 20px 20px 0px 20px;
        .pro-container {
          width: 100%;
        }
      }
    }
  }
}
.descbox{
  h2{
    font-size: 12px;
    color: #666666;
    font-weight: 400 !important;
    word-break: break-all;
    white-space: pre-wrap;
  }
}
.releasesearchbox {
  h2 {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    font-weight: normal;
    margin-bottom: 15px;
  }

  a {
    display: inline-block;
    color: #666666;
    font-size: 10px;
    /*width: 280px;*/
    margin-right: 20px;
  }
}
.branBox{
  padding: 20px 0 20px 20px;
  span{
    font-size: 10px;
  }
}
</style>
