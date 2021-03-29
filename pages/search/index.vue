<template>
  <div class="search-container">
    <div class="search-header-container">
      <van-icon class="arrow-l" color="#999999" size="22px" name="arrow-left" @click="toBeforePage" />
      <van-search
        v-model="value"
        class="search"
        shape="round"
        background="#fff"
        :placeholder="$t('classification.search')"
        @blur="search"
      >
        <template #left-icon>
          <img class="search-icon" src="~/assets/images/category/search.png" />
        </template>
      </van-search>
    </div>
    <div class="search-history">
      <div class="historyBtn">
        <span class="title">{{$t('search.seahistory')}}</span>
        <van-icon
          size="18px"
          color="#666"
          :name="require(`assets/images/icon/delete.png`)"
          @click="deleteHistory"
        />
      </div>
      <div v-if="!showBtn" class="history-content">
        <span v-for="(item, index) in historyList.slice(0, 6)" :key="index" class="item" @click="historySearch(item)">
          <a :href="getUrl + 'search/product/'+item+'/1'" @click.prevent="()=> false">{{item}}</a>
        </span>
        <van-icon v-if="historyList.length > 6" name="arrow-down"  style="margin-left:10px;" @click="showList"/>
      </div>

      <div v-if="showBtn" class="history-content" >
        <span v-for="(item, index) in historyList" :key="index" class="item" @click="historySearch(item)">
          <a :href="getUrl + 'search/product/'+item+'/1'" @click.prevent="()=> false">{{item}}</a>
        </span>
        <van-icon v-if="historyList.length > 6" name="arrow-up"  style="margin-left:10px;" @click="showList"/>
      </div>
    </div>
<!--     关键词-->
    <div v-if="hotData && hotData.length" class="search-history" >
      <div class="historyBtn">
        <span class="title">{{$t('search.hotsearch')}}</span>
      </div>
      <div class="history-content">
        <span v-for="(item, index) in hotData" :key="index" class="item" @click="historySearch(item)">
          <a :href="getUrl + 'search/product/'+item+'/1'" @click.prevent="()=> false">{{item}}</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
const _uniqWith = require('lodash/uniqWith')
export default {
  name: 'Search',
  layout: 'content',
  middleware: ['i18n', 'auth'],
  async asyncData ({ $axios, params, store }) {
    const { data } = await $axios.get('/starday-system/seo/keyword/now')
    return {
      hotData: data
    }
  },
  data () {
    return {
      value: '',
      historyList: [],
      active: 0,
      showBtn: false
    }
  },
  computed: {
    getUrl () {
      return process.env.proxyUrl
    }
  },
  mounted () {
    if (localStorage.getItem('historySearch')) {
      this.historyList = JSON.parse(localStorage.getItem('historySearch'))
    } else {
      const list = []
      localStorage.setItem('historySearch', JSON.stringify(list))
    }
  },
  methods: {
    ...mapMutations(['setSearchKeyWords']),
    showList () {
      this.showBtn = !this.showBtn
    },
    search () {
      // 执行搜索
      if (this.value) {
        this.setSearchKeyWords(this.value)
        const reg = new RegExp('/', 'g')
        this.value = this.value.replace(reg, '&')
        this.$router.push(`/search/product/${this.value}/1`)
        const list = JSON.parse(localStorage.getItem('historySearch'))
        list.unshift(this.value)
        const newHistorySearch = _uniqWith(list)
        localStorage.setItem('historySearch', JSON.stringify(newHistorySearch))
      } else {
        this.$toast(this.$t('newUserInfo.searchTips'))
      }
    },
    historySearch (val) {
      this.value = val
      this.setSearchKeyWords(val)
      this.search()
    },
    deleteHistory () {
      this.$dialog
        .confirm({
          message: this.$t('newUserInfo.delHistory'),
          confirmButtonColor: '#333'
        })
        .then(() => {
          // on confirm
          localStorage.removeItem('historySearch')
          this.historyList = []
        })
        .catch(() => {
          // on cancel
        })
    },
    toBeforePage () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
  .search-container{
    height: 100vh;
    display: flex;
    background-color: #ffffff;
    flex-flow: column nowrap;
  }
  .search-header-container{
    width: 750px;
    height: 88px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    background-color: #ffffff;
    padding-left: 30px;
    padding-right: 40px;
    .arrow-l{
      margin-right: 40px;
    }
    .search{
      flex: 1;
      height: 60px;
      padding: 0;
      .search-icon{
        width: 32px;
        height: 32px;
        margin-left: 20px;
      }
      /deep/.van-search__content{
        width: inherit;
        height: 100%;
        padding: 0;
        .van-cell{
          padding: 0;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: center;
          .van-cell__value .van-field__body{
            padding-left: 10px;
            font-size: 28px;
            font-weight: 400;
            text-align: left;
            color: #999999;
            line-height: 37px;
            .van-icon{
              font-size: 28px;
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
  .search-history{
    background-color: #ffffff;
    padding: 0 30px;
    // flex: 1;
    .historyBtn{
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: space-between;
      padding: 40px 0;
      .title{
        font-size: 26px;
        font-weight: 500;
        text-align: left;
        color: #333333;
        line-height: 37px;
      }
    }
    .history-content{
      display: flex;
      width: 100%;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
      .item{
        font-size: 26px;
        font-weight: 400;
        text-align: left;
        color: #333333;
        line-height: 37px;
        padding: 12px 32px;
        background-color: #f4f4f4;
        border-radius: 30px;
        margin: 5px 5px;
      }
    }
  }
</style>
