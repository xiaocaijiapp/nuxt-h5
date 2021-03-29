<template>
  <div class="rankList" :style="backgroundColor">
    <van-sticky>
      <div class="nav">
        <div class="arrow-left" @click="onClickLeft">
          <img src="~/assets/images/goodsdetail/arrow-left.png" />
        </div>
        <div class="center">
          <span>{{titleName}}</span>
        </div>
        <div class="right-icon" @click="Share">
          <img src="~/assets/images/goodsdetail/fenxiang2.png" />
        </div>
      </div>
    </van-sticky>
    <div class="head">
      <van-image width="100%" height="100%" :src="imgUrl + imgUrlDet" />
    </div>
    <div v-if="dataListData.length > 0" class="tab_list">
      <van-tabs v-model="tabActive" @change="changeTabs">
        <van-tab v-for="(item, index) in typeNameList" :key="index" :title="item"></van-tab>
      </van-tabs>
    </div>
    <div class="goodslist">
      <div v-for="(chiitem,index) in topProducts" :key="tabActive + index" class="goodsitem">
        <img width="100%" height="100%" v-lazy="imgUrl + chiitem.goodsSearchImage" />
        <div class="right">
          <div class="title">{{chiitem.goodsTitle}}</div>
          <div class="shop_price">
            <span class="markPrice">
              <i class="price-num">{{chiitem.price}}</i>
              <span class="unit">円</span>
            </span>
            <span v-if="chiitem.flashSaleActivityStates == 1||chiitem.discountActivityStates === 1" class="linePrice">
              <i class="linePriceNum">{{chiitem.marketPrice}}</i>
              <span class="unit">円</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import api from '~/static/api'
export default {
  name: 'RankList',
  layout: 'content',
  watchQuery: ['tabActive'],
  async asyncData ({ $axios, params, store, query }) {
    const tabActive = query.tabActive * 1
    const cateId = params.id
    const dataList = await $axios.get(api.activity.activePage + cateId)
    const titleName = store.state.common.locale === 'ja-JP' ? dataList.data.title.split('|')[1] : dataList.data.title.split('|')[0]
    const imgUrlDet = dataList.data.backgroundImg
    const bgc = dataList.data.backgroundColor
    const typeNameList = []
    const goodsidList = []
    const dataListData = dataList.data.typeList
    if (dataListData.length === 0) {
      const dataListData = dataList.data.noTypeGoods
      dataListData.forEach((item) => {
        goodsidList.push(item.id)
      })
    } else {
      const dataListData = dataList.data.typeList
      dataListData.forEach((item) => {
        const typeName = store.state.common.locale === 'ja-JP' ? item.typeName.split('|')[1] : item.typeName.split('|')[0]
        typeNameList.push(typeName)
      })
      dataListData[tabActive || 0].goodsList.forEach((item) => {
        goodsidList.push(item.id)
      })
    }
    const topData = await $axios.post(api.goods.getGoodsInfo, goodsidList)
    const topProducts = topData.data
    topProducts.forEach((chiitem) => {
      if (chiitem.flashSaleActivityStates === 1) {
        chiitem.price = Math.round(
          chiitem.marketPrice -
          (chiitem.marketPrice * chiitem.flashSaleActivitys[0].discount) / 100
        )
      } else if (chiitem.discountActivityStates === 1) {
        chiitem.price = Math.round(
          chiitem.marketPrice -
          (chiitem.marketPrice * chiitem.discountActivitys[0].rate) / 100
        )
      } else {
        chiitem.price = chiitem.marketPrice
      }
    })
    return {
      titleName,
      imgUrlDet,
      typeNameList,
      topProducts,
      dataList,
      tabActive: tabActive || 0,
      cateId,
      backgroundColor: {
        background: bgc || '#F4F4F4'
      },
      dataListData
    }
  },
  data () {
    return {
      active: 0,
      imgUrl: 'https://image.stardaymart.com/'
    }
  },
  computed: {
    ...mapGetters(
      { getLoginData: 'userInfo' },
      ['baseImageUrl', 'locale', 'login'])
  },
  methods: {
    ...mapMutations(['SET_LANG']),
    onClickLeft () {
      const prefixPageName = window.sessionStorage.getItem('prefixPage')
      const prePageName = window.sessionStorage.getItem('prePage')
      if (prefixPageName === 'outNav') {
        this.$router.push(prePageName)
      } else {
        this.$router.push('/')
      }
      window.sessionStorage.removeItem('prefixPage')
      window.sessionStorage.removeItem('prePage')
    },
    changeTabs (name, title) {
      this.$router.push({
        path: `/promotionpage/promotionrank/${this.cateId}`,
        query: {
          tabActive: this.tabActive
        }
      })
    },
    Share () {
      // this.$emit('changeShareData', true)
      const vm = this
      let _url = location.origin + location.pathname
      const _str = []
      if (vm.getLoginData.id) {
        if (vm.$route.query) {
          for (const i in vm.$route.query) {
            if (i !== 'shareId' && i !== 'shareSource' && i !== 'shareTime') {
              _str.push(i + '=' + vm.$route.query[i])
            }
          }
        }
        if (_str.length) {
          _url = _url + '?' + _str.join('&') + '&shareId=' + vm.getLoginData.id + '&shareSource=2&shareTime=' + Math.floor(new Date().getTime() / 1000)
        } else {
          _url = _url + '?shareId=' + vm.getLoginData.id + '&shareSource=2&shareTime=' + Math.floor(new Date().getTime() / 1000)
        }
      }
      vm.$copyText(_url).then(function (e) {
        vm.$toast.success(vm.$t('home.copysuccess'))
      }, function (e) {
        vm.$toast.fail(vm.$t('home.copyerror'))
      })
    },
    goDetail (item) {
      this.$router.push(`/product/${item.id}`)
      window.sessionStorage.setItem('prefixPage', 'promotionrank')
      window.sessionStorage.setItem('prePage', `/promotionpage/promotionrank/${this.cateId}`)
    }
  }
}
</script>

<style lang="less" scoped>
.rankList {
  // height: 100%;
  // background-color: rgb(255, 60, 0);
  .nav {
    width: 100%;
    height: 88px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    box-sizing: border-box;
    box-shadow: 0 1px 5px #cccccc;
    .arrow-left {
      width: 52px;
      height: 33px;
      padding-left: 33px;
      img {
        width: 19px;
        height: 33px;
      }
    }
    .center {
      text-align: center;
      font-size: 36px;
    }
    .right-icon {
      img {
        width: 62px;
        height: 62px;
      }
    }
  }
  .head {
    height: 380px;
  }
  /deep/ .van-popup--center.van-popup--round {
    padding: 26px;
  }
  .tab_list {
    padding: 0 24px;
    /deep/ .van-tabs--line .van-tabs__wrap {
      height: 70px;
      border-radius: 8px;
    }
    /deep/ .van-tab {
      flex: 0 0 22%;
      span {
        font-size: 26px;
        line-height: 70px;
      }
    }
    /deep/ .van-tab--active {
      color: rgb(255, 93, 25) !important;
    }
  }
  .goodslist {
    padding: 0 24px 32px 24px;
    width: 100%;
    box-sizing: border-box;
    .goodsitem {
      width: 100%;
      border-radius: 6px;
      box-sizing: border-box;
      padding: 16px 6px;
      height: 240px;
      background: #fff;
      border-radius: 6px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 20px;
      position: relative;
      img {
        width: 224px !important;
        height: 208px !important;
        object-fit: cover;
      }
      .right {
        width: 70%;
        box-sizing: border-box;
        padding: 10px 0px 10px 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }
      button {
        background: linear-gradient(to right, #ffa14b, #ff1c12);
        border: 0;
        height: 54px;
        width: 160px;
        color: #fff;
        margin-left: 35%;
        border-radius: 32px;
        font-size: 20px;
        padding: 5px;
      }
      .title {
        font-size: 22px;
        margin-top: 8px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-top: 0px;
      }
      .shop_price {
        .price-num {
          font-size: 40px;
          font-weight: 700;
          text-align: left;
          color: #ff5d19;
          line-height: 47px;
        }
        .unit {
          font-size: 22px;
          font-weight: 600;
          text-align: left;
          color: #ff5d19;
          line-height: 30px;
        }
        .linePrice {
          text-decoration: line-through;
          margin-left: 8px;
          .linePriceNum {
            font-size: 22px;
            font-family: DINAlternate, DINAlternate-Bold;
            font-weight: 700;
            text-decoration: line-through;
            text-align: left;
            color: #999999;
            line-height: 26px;
          }
          .unit {
            font-size: 18px;
            font-family: PingFangSC, PingFangSC-Semibold;
            font-weight: 600;
            text-decoration: line-through;
            text-align: left;
            color: #999999;
            line-height: 25px;
          }
        }
      }
    }
  }
}
</style>
