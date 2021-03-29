<template>
  <div class="search-container">
    <div class="search-header-container">
      <van-icon class="arrow-l" color="#999999" size="22px" name="arrow-left" @click="toBeforePage" />
      <van-search v-model="value" class="search" shape="round" background="#fff" :placeholder="$t('classification.search')" @blur="search">
        <template #left-icon>
          <img class="search-icon" src="~/assets/images/category/search.png" />
        </template>
      </van-search>
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
              <div class="sec-item" :class="sorted ? '' : 'secActive'" @click="secSearch(0)">
                <span class="sec-title">{{$t('newThreeClass.a')}}</span>
              </div>
              <div class="sec-item" :class="sorted == 0 ? 'secActive' : ''" @click="secSearch(1)">
                <span class="sec-title">{{$t('newThreeClass.b')}}</span>
              </div>
              <div class="sec-item" :class="sorted == 2 ? 'secActive' : ''" @click="secSearch(2)">
                <span class="sec-title">{{$t('newThreeClass.c')}}</span>
              </div>
              <div class="sec-item" :class="sorted == 1 ? 'secActive' : ''" @click="secSearch(3)">
                <span class="sec-title">{{$t('newThreeClass.d')}}</span>
                <span class="price">
                  <van-icon size="3.714285vw" :color="(sortOrder == 'desc' && sorted == 1) ? 'rgb(255, 93, 25)' : '#999' " name="arrow-up" @click="priceSearch('desc')" />
                  <van-icon size="3.714285vw" :color="sortOrder == 'asc' ? 'rgb(255, 93, 25)' : '#999'" name="arrow-down" @click="priceSearch('asc')" />
                </span>
              </div>
            </div>
            <div class="production-list" :style="`height:${storelistH - prolistH}px`">
              <div class="pro-container">
                <GoodsList :list="goodsList"></GoodsList>
              </div>
            </div>
          </div>
          <van-empty v-else :image="require(`assets/images/empty/wushoucang.png`)" :description="$t('newUserInfo.error_msg1')" />
        </div>
        <div v-else class="store" :style="`height:${storelistH}px`">
          <div v-if="storeList.rows.length > 0" class="store-container"></div>
          <van-empty v-else :image="require(`assets/images/empty/wushoucang.png`)" :description="$t('newUserInfo.error_msg1')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsList from '~/components/search/list'
import api from '~/static/api'
const _uniqWith = require('lodash/uniqWith')
export default {
  name: 'SearchResult',
  layout: 'content',
  middleware: ['i18n', 'auth'],
  watchQuery: ['kw'],
  components: {
    GoodsList
  },
  async asyncData ({ $axios, query, store }) {
    const { searchKeyWords } = store.getters
    const { pageNo, pageSize, sorted, sortOrder, sN, pS } = query
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
      pageSize: pageSize || 20,
      keyword: searchKeyWords,
      sorted: sorted || '',
      sortOrder: sortOrder || 'desc'
    }
    const { data } = await $axios.post(api.store.goods, request)
    let storeList = []
    await $axios.post(api.search.storeResault, {
      pageNo: sN || 1,
      pageSize: pS || 20,
      storeName: searchKeyWords
    }).then((res) => {
      if (res.code === 200) { storeList = res.data }
    })
    return {
      sortOrder: sortOrder || 'desc',
      searchKeyWords,
      pageNo,
      pageSize,
      sorted,
      goodsList: [...topProducts, ...data.rows],
      storeList
    }
  },
  data () {
    return {
      value: '',
      active: 0,
      secIndex: 0,
      price: true,
      prolistH: 0,
      storelistH: 0
    }
  },
  created () {
    this.value = this.searchKeyWords
  },
  mounted () {
    this.storelistH = document.getElementsByClassName('production')[0] ? document.getElementsByClassName('production')[0].clientHeight : 0
    this.prolistH = document.getElementsByClassName('sec-box')[0] ? document.getElementsByClassName('sec-box')[0].clientHeight : 0
  },
  methods: {
    changeNav (i) {
      this.active = i
    },
    search () {
      // 执行搜索
      if (this.value) {
        this.$router.push('/searchResult?wd=' + this.value)
        // window.location.href = `/searchResult?wd=${this.value}`
        const list = JSON.parse(localStorage.getItem('historySearch'))
        list.unshift(this.value)
        const newHistorySearch = _uniqWith(list)
        localStorage.setItem('historySearch', JSON.stringify(newHistorySearch))
      } else {
        this.$toast(this.$t('newUserInfo.searchTips'))
      }
    },
    secSearch (i) {
      this.secIndex = i
      switch (i) {
        case 0:
          // 综合
          this.$router.push('/searchResult?kw=' + Math.floor(Math.random() * 100) + '&pageNo=1&pageSize=20&sortOrder=desc')
          // window.location.href = `/searchResult?kw=${Math.floor(Math.random() * 100)}&pageNo=1&pageSize=20&sortOrder=desc`
          break
        case 1:
          // 销量
          this.$router.push('/searchResult?kw=' + Math.floor(Math.random() * 100) + '&pageNo=1&pageSize=20&sorted=0&sortOrder=desc')
          // window.location.href = `/searchResult?kw=${Math.floor(Math.random() * 100)}&pageNo=1&pageSize=20&sorted=0&sortOrder=desc`
          break
        case 2:
          // 上新
          this.$router.push('/searchResult?kw=' + Math.floor(Math.random() * 100) + '&pageNo=1&pageSize=20&sorted=2&sortOrder=desc')
          // window.location.href = `/searchResult?kw=${Math.floor(Math.random() * 100)}&pageNo=1&pageSize=20&sorted=2&sortOrder=desc`
          break
        case 3:
          // 价格
          this.$router.push('/searchResult?kw=' + Math.floor(Math.random() * 100) + '&pageNo=1&pageSize=20&sorted=1&sortOrder=' + this.sortOrder)
          // window.location.href = `/searchResult?kw=${Math.floor(Math.random() * 100)}&pageNo=1&pageSize=20&sorted=1&sortOrder=${this.sortOrder}`
          break
        default:
          this.$router.push('/searchResult?kw=' + Math.floor(Math.random() * 100) + '&pageNo=1&pageSize=20&sorted=&sortOrder=desc')
          // window.location.href = `/searchResult?kw=${Math.floor(Math.random() * 100)}&pageNo=1&pageSize=20&sorted=&sortOrder=desc`
      }
    },
    priceSearch (str) {
      this.sortOrder = str
      if (str === 'asc') { this.price = false } else { this.price = true }
    },
    toBeforePage () {
      this.$router.push('/')
      // window.location.href = '/'
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
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  padding-left: 30px;
  padding-right: 40px;
  .arrow-l {
    margin-right: 40px;
  }
  .search {
    flex: 1;
    height: 60px;
    padding: 0;
    .search-icon {
      width: 32px;
      height: 32px;
      margin-left: 20px;
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
</style>
