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
        <div class="store">
          <div v-if="storeList.rows.length > 0" class="store-container"></div>
          <van-empty v-else :image="require(`assets/images/empty/wushoucang.png`)" :description="$t('newUserInfo.error_msg1')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '~/static/api'
const _uniqWith = require('lodash/uniqWith')
export default {
  name: 'SearchResult',
  layout: 'content',
  middleware: ['i18n', 'auth'],
  async asyncData ({ $axios, query, params }) {
    const pageNo = params.storepageno
    const searchKw = params.storewd
    let storeList = []
    await $axios.post(api.search.storeResault, {
      pageNo: pageNo || 1,
      pageSize: pageNo * 20 || 20,
      storeName: searchKw
    }).then((res) => {
      if (res.code === 200) { storeList = res.data }
    })
    return {
      searchKw,
      pageNo,
      storeList
    }
  },
  data () {
    return {
      value: '',
      active: 1,
      price: true,
      storelistH: 0
    }
  },
  created () {
    this.value = this.searchKw
  },
  methods: {
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
        this.$router.push(`/search/store/${this.value}/1`)
        const list = JSON.parse(localStorage.getItem('historySearch'))
        list.unshift(this.value)
        const newHistorySearch = _uniqWith(list)
        localStorage.setItem('historySearch', JSON.stringify(newHistorySearch))
      } else {
        this.$toast(this.$t('newUserInfo.searchTips'))
      }
    },
    toBeforePage () {
      this.$router.push('/search')
    }
  },
  head () {
    return {
      link: [
        {
          hid: 'canonical',
          ref: 'canonical',
          href: 'https://www.starday.jp/search/store/' + this.$route.params.storewd + '/' + 1
        },
        {
          hid: 'alternate',
          ref: 'alternate',
          media: 'only screen and (max-width: 640px)',
          href: 'https://m.starday.jp/search/store/' + this.$route.params.storewd + '/' + 1
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
      .store{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
