<template>
  <div class="store-container">
    <div class="storeHeader" v-lazy:background-image="storeBgImage">
      <div class="searchBox" :style="navBackCol">
        <van-nav-bar :border="false">
          <template #left>
            <van-icon size="22px" name="arrow-left" :color="iconCol" @click="toBeforePage" />
          </template>
          <template #title>
            <van-search v-model="searchVal" :class="bool ? 'defaultSearch' : 'scrollSearch'" shape="round" :placeholder="$t('store.search')" @blur="storeSearch">
              <template #left-icon>
                <img class="search-icon" :src="defaultIcon" />
              </template>
            </van-search>
          </template>
          <template #right>
            <van-icon size="8.85714285vw" name="ellipsis" :color="iconCol" @click="showIconMenu" />
          </template>
        </van-nav-bar>
      </div>
      <!-- <img width="100%" :src="baseImageUrl+storeBaseInfo.mobileSign" /> -->
    </div>
    <div class="storeInfo">
      <div class="storeLogo"></div>
      <div class="storeLogo-pos">
        <img v-if="storeBaseInfo.logo" v-lazy="baseImageUrl + storeBaseInfo.logo" class="logo" />
        <img v-else class="logo" src="~/assets/images/empty/default2.png" />
      </div>
      <div class="store-content">
        <div class="name">{{storeBaseInfo.storeName}}</div>
        <div class="sales">
          <!--          销量-->
          <span class="sales-text">{{$t('goodsdetail.Sales')}}</span>
          <span class="sales-num">{{storeBaseInfo.salesCount}}点</span>
        </div>
        <div class="evaluate">
          <van-rate v-model="storeValue" size="4.571428571428571vw" color="#FAB647" allow-half void-icon="star" void-color="#eee" />
          <span class="evaluate-num">{{storeBaseInfo.evaluate}}</span>
          <span class="evaluate-count">({{storeBaseInfo.commentCount + '件'}})</span>
        </div>
      </div>
      <div class="store-focus-on">
        <span class="focus-text" :class="storeBaseInfo.follow === 1 ? 'focus' : 'no-focus'" @click="follow">{{ storeBaseInfo.follow === 0? $t('newAdd.focus') : $t('newAdd.noFocus')}}</span>
      </div>
    </div>
    <div class="production-list-container">
      <van-sticky offset-top="0" :container="container">
        <div class="list-nav">
          <van-tabs v-model="activeName" sticky title-active-color="#ff5d19" title-inactive-color="#666666" @click="changeCate">
            <van-tab v-for="(prop, index) in categoryList" :key="index" :name="prop.id" :title="prop.category"></van-tab>
          </van-tabs>
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
            <div class="sec-item" :class="sorted == 1 ? 'secActive' : ''" @click="secSearch(3, 'asc')">
              <span class="sec-title">{{$t('newThreeClass.d')}}</span>
              <span class="price">
                <van-icon size="3.714285714285714vw" :color="(sortOrder == 'asc' && sorted == 1) ? 'rgb(255, 93, 25)' : '#999' " name="arrow-up" @click="priceSearch('asc')" />
                <van-icon size="3.714285714285714vw" :color="sortOrder == 'desc' ? 'rgb(255, 93, 25)' : '#999'" name="arrow-down" @click="priceSearch('desc')" />
              </span>
            </div>
          </div>
        </div>
      </van-sticky>
    </div>
    <div v-if="list" ref="container" class="list">
      <GoodsList :list="list.rows"></GoodsList>
    </div>
    <transition name="van-fade">
      <div v-if="IconMenu" class="tankuang">
        <div @click="goHome">
          <van-icon name="wap-home-o" />
          {{$t('menu.home')}}
        </div>
        <div @click="goMsgCenter">
          <van-icon name="comment-o" />
          {{$t('newUserInfo.myMessage')}}
        </div>
        <div @click="goCollection">
          <van-icon name="like-o" />
          {{$t('goodsDetail.myCollection')}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '~/static/api'
import GoodsList from '~/components/search/list'
export default {
  name: 'Store',
  layout: 'content',
  scrollToTop: true,
  watchQuery: ['sortOrder', 'sorted', 'categoryId', 'keyword', 'pageNum'],
  components: {
    GoodsList
  },
  async asyncData ({ params, $axios, query }) {
    const storeId = params.storeid
    const { storeCateId, sortOrder, sorted, keyword } = query
    let storeBaseInfo
    let list
    const categoryList = [{
      category: '全部',
      categoryJp: '全て',
      id: '0123'
    }]
    const activeName = storeCateId || '0123'
    await $axios.get(api.store.storeInfo, { params: { storeId } }).then((res) => {
      if (res.code === 200) { storeBaseInfo = res.data }
    })
    await $axios.post(api.store.category, { storeId }).then((res) => {
      if (res.code === 200) {
        categoryList.push(...res.data)
      }
    })
    // 请求初始化店铺商品数据
    const storeProListData = {
      pageNo: 1,
      firstStoreCategoryId: '',
      storeCateId: storeCateId === '0123' ? '' : storeCateId,
      secCategoryId: '',
      pageSize: 20,
      categoryId: '',
      sortOrder: sortOrder || '',
      sorted: sorted || '',
      keyword: keyword || '',
      storeId
    }
    await $axios.post(api.store.goods, storeProListData).then((res) => {
      if (res.code === 200) {
        list = res.data
      }
    })
    return {
      storeId,
      storeBaseInfo,
      categoryList,
      list,
      activeName,
      sorted,
      sortOrder: sortOrder || 'asc'
    }
  },
  data () {
    return {
      timer: null,
      searchVal: '',
      activeCateId: '',
      price: true,
      IconMenu: false,
      container: null,
      h: 0,
      bool: true,
      navBackCol: {
        backgroundColor: 'rgba(255,255,255,0)'
      },
      iconCol: 'rgba(255,255,255,1)',
      defaultIcon: require('assets/images/store/sousuo.png')
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl', 'locale', 'login', 'goodsId']),
    storeValue () {
      return Number(this.storeBaseInfo.evaluate)
    },
    storeBgImage () {
      const { mobileSign } = this.storeBaseInfo
      // this.baseImageUrl + mobileSign
      return {
        error: require('~/assets/images/loading/default.png'),
        loading: require('~/assets/images/loading/default.png'),
        src: this.baseImageUrl + mobileSign
      }
    }
  },
  mounted () {
    this.container = this.$refs.container
    const imageH = document.getElementsByClassName('storeHeader')[0].clientHeight
    const searchH = document.getElementsByClassName('searchBox')[0].clientHeight
    this.h = imageH - searchH
    document.getElementsByClassName('content-box')[0].addEventListener('scroll', this.wScroll, false)
    document.getElementsByClassName('content-box')[0].scrollTo(0, 0)
  },
  destroyed () {
    document.getElementsByClassName('content-box')[0].removeEventListener('scroll', this.wScroll, false)
  },
  methods: {
    wScroll (ev) {
      const scrollH = ev.target.scrollTop
      if (scrollH > this.h) {
        this.navBackCol.backgroundColor = 'rgba(255,255,255,1)'
      } else {
        this.navBackCol.backgroundColor = `rgba(255,255,255, ${scrollH / 100})`
      }
      if (scrollH > 0) {
        this.defaultIcon = require('assets/images/category/search.png')
        this.iconCol = 'rgba(153,153,153,1)'
        this.bool = false
      } else {
        this.defaultIcon = require('assets/images/store/sousuo.png')
        this.iconCol = 'rgba(255,255,255,1)'
        this.bool = true
      }
    },
    follow () {
      const _this = this
      const data = {
        state: !_this.storeBaseInfo.follow,
        storeId: _this.storeId
      }
      _this.$axios.post(api.store.follow, data).then((res) => {
        if (res.code === 200) {
          _this.storeBaseInfo.follow = res.data
        }
      })
    },
    priceSearch (str) {
      this.sortOrder = str
      if (str === 'asc') { this.price = false } else { this.price = true }
    },
    toBeforePage () {
      this.$router.push(`/product/${this.goodsId}`)
    },
    storeSearch () {
      const _this = this
      location.href = `/store/${_this.storeId}?storeCateId=${_this.activeCateId}&sortOrder=${_this.sortOrder}&pageNum=1&keyword=${_this.searchVal}`
    },
    showIconMenu () {
      this.IconMenu = !this.IconMenu
    },
    goHome () {
      this.$router.push('/')
    },
    goMsgCenter () {
      if (this.login) {
        this.$router.push('/personal/emailList')
      } else {
        this.$router.push('/login')
      }
    },
    goCollection () {
      if (this.login) {
        this.$router.push('/personal/attentiongoods')
      } else {
        this.$router.push('/login')
      }
    },
    secSearch (i, sort) {
      this.secIndex = i
      const _this = this
      switch (i) {
        case 0:
          _this.sortOrder = ''
          location.href = `/store/${_this.storeId}?storeCateId=${_this.activeCateId}&sortOrder=${_this.sortOrder}&pageNum=1&keyword=${_this.searchVal}`
          break
        case 1:
          // 销量
          _this.sortOrder = ''
          location.href = `/store/${_this.storeId}?storeCateId=${_this.activeCateId}&sortOrder=${_this.sortOrder}&sorted=0&pageNum=1&keyword=${_this.searchVal}`
          break
        case 2:
          // 上新
          _this.sortOrder = ''
          location.href = `/store/${_this.storeId}?storeCateId=${_this.activeCateId}&sortOrder=${_this.sortOrder}&sorted=2&pageNum=1&keyword=${_this.searchVal}`
          break
        case 3:
          // 价格
          location.href = `/store/${_this.storeId}?storeCateId=${_this.activeCateId}&sortOrder=${_this.sortOrder}&sorted=1&pageNum=1&keyword=${_this.searchVal}`
          break
        default:
      }
    },
    changeCate (item) {
      const _this = this
      _this.activeCateId = item === '0123' ? '' : item
      location.href = `/store/${_this.storeId}?storeCateId=${item}&sortOrder=${_this.sortOrder}&pageNum=1&keyword=${_this.searchVal}`
    }
  }
}
</script>

<style lang="less" scoped>
.store-container {
  width: 100%;
  height: 100vh;
  .storeHeader {
    height: 320px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .searchBox {
      position: fixed;
      width: 100%;
      z-index: 999999;
      /deep/.van-nav-bar {
        background-color: rgba(255,255,255,0);
        .van-nav-bar__content {
          height: 88px;
          .van-nav-bar__title {
            max-width: 70%;
            flex: 1;
            .defaultSearch {
              background-color: rgba(255,255,255,0.28);
              padding: 0;
              height: 60px;
              border-radius: 100px;
              .van-search__content {
                width: 100%;
                height: 60px;
                padding: 0;
                background: transparent;
                .van-field {
                  padding: 0;
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: space-between;
                  align-items: center;
                  .van-field__left-icon {
                    .search-icon {
                      width: 28px;
                      height: 28px;
                      margin: 0px 20px;
                    }
                  }
                  .van-field__value {
                    .van-field__body {
                      .van-field__control {
                        font-size: 26px;
                        font-weight: 400;
                        color: #ffffff;
                        line-height: 37px;
                      }
                      .van-field__control::-webkit-input-placeholder {
                        /* WebKit browsers */
                        color: #ffffff;
                      }
                      .van-field__control:-moz-placeholder {
                        /* Mozilla Firefox 4 to 18 */
                        color: #ffffff;
                      }
                      .van-field__control::-moz-placeholder {
                        /* Mozilla Firefox 19+ */
                        color: #ffffff;
                      }
                      .van-field__control:-ms-input-placeholder {
                        /* Internet Explorer 10+ */
                        color: #ffffff;
                      }
                      .van-icon {
                        color: #ffffff;
                        margin-right: 10px;
                        font-size: 26px;
                        padding: 10px;
                      }
                    }
                  }
                }
              }
            }
            .scrollSearch {
              background-color: rgba(242,242,242,1);
              padding: 0;
              height: 60px;
              border-radius: 100px;
              .van-search__content {
                width: 100%;
                height: 60px;
                padding: 0;
                background-color: rgba(242,242,242,1);
                .van-field {
                  padding: 0;
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: space-between;
                  align-items: center;
                  .van-field__left-icon {
                    .search-icon {
                      width: 28px;
                      height: 28px;
                      margin: 0px 20px;
                    }
                  }
                  .van-field__value {
                    .van-field__body {
                      .van-field__control {
                        font-size: 26px;
                        font-weight: 400;
                        color: rgba(153,153,153,1);
                        line-height: 37px;
                      }
                      .van-field__control::-webkit-input-placeholder {
                        /* WebKit browsers */
                        color: rgba(153,153,153,1);
                      }
                      .van-field__control:-moz-placeholder {
                        /* Mozilla Firefox 4 to 18 */
                        color: rgba(153,153,153,1);
                      }
                      .van-field__control::-moz-placeholder {
                        /* Mozilla Firefox 19+ */
                        color: rgba(153,153,153,1);
                      }
                      .van-field__control:-ms-input-placeholder {
                        /* Internet Explorer 10+ */
                        color: rgba(153,153,153,1);
                      }
                      .van-icon {
                        color: rgba(153,153,153,1);
                        margin-right: 10px;
                        font-size: 26px;
                        padding: 10px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .storeInfo {
    width: 100%;
    height: 180px;
    background-color: #ffffff;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    .storeLogo,
    .storeLogo-pos {
      width: 152px;
      height: 152px;
    }
    .storeLogo-pos {
      position: absolute;
      top: -30px;
      left: 30px;
      .logo {
        width: 152px;
        height: 152px;
        border-radius: 10px;
      }
    }
    .store-content {
      flex: 1;
      height: 100%;
      padding-left: 28px;
      padding-top: 5px;
      .name {
        font-size: 32px;
        font-weight: 400;
        color: #333333;
        line-height: 45px;
      }
      .sales {
        .sales-text,
        .sales-num {
          font-size: 22px;
          font-weight: 400;
          color: #666666;
          line-height: 30px;
        }
      }
      .evaluate {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        margin-top: 5px;
        .evaluate-num {
          font-size: 22px;
          font-weight: 500;
          color: #e02020;
          line-height: 30px;
          margin-left: 10px;
        }
        .evaluate-count {
          font-size: 22px;
          font-weight: 400;
          text-align: left;
          color: #666666;
          line-height: 30px;
          margin-left: 10px;
        }
      }
    }
    .store-focus-on {
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
      padding-top: 24px;
      .focus-text {
        font-size: 24px;
        font-weight: 400;
        color: #ffffff;
        line-height: 33px;
        background: #fff;
        padding: 5px 20px;
        border-radius: 30px;
      }
      .no-focus {
        background: linear-gradient(to right, #ffa14b, #ff5d19);
      }
      .focus {
        background: transparent;
        border: 1px solid #666666;
        line-height: 33px;
        color: #666666;
      }
    }
  }
  .production-list-container {
    .list-nav {
      .van-tabs {
        height: 80px;
        /deep/.van-tabs__wrap {
          height: 80px;
          border-bottom: 1px solid #e5e5e5;
          .van-tabs__nav {
            padding: 0;
            .van-tab {
              .van-tab__text {
                font-size: 26px;
                line-height: 60px;
              }
            }
            /deep/.van-tabs__line {
              bottom: 0px;
              height: 4px;
              background-color: #ff5d19;
            }
          }
        }
      }
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
    }
  }
  .list {
    padding: 20px 20px 0px 20px;
  }
  /deep/ .van-sticky--fixed {
    margin-top: 88px;
  }
  .menuListBox {
    position: absolute;
    right: 0;
    top: 96px;
    width: 320px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
    .triangle-up {
      width: 0;
      height: 0;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent;
      border-bottom: 100px solid red;
    }
  }
  .tankuang {
    width: 320px;
    height: 256px;
    background: url('../../assets/images/store/beijingtankuang.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 0px;
    top: 86.4px;
    z-index: 9999;
    box-sizing: border-box;
    padding: 16px 48px;
    font-size: 16px;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    div {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      align-items: center;
    }
    i {
      font-size: 38px;
      margin-right: 15px;
    }
  }
}
</style>
