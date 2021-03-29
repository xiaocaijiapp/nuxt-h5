<template>
  <div class="product" :style="backgroundColor">
    <van-sticky>
      <div class="nav">
        <div class="arrow-left" @click="onClickLeft">
          <img src="~/assets/images/goodsdetail/arrow-left.png" />
        </div>
        <div class="center">
          <span>{{title}}</span>
        </div>
        <div class="right-icon" @click="Share">
          <img src="~/assets/images/goodsdetail/fenxiang2.png" />
        </div>
      </div>
    </van-sticky>
    <div class="head">
      <van-image style="width:100%;height:100%" :src="imgUrl+imgUrlDet" />
    </div>
    <div v-if="typeNameList.length>0" class="tab_list">
      <van-tabs v-model="tabActive" @change="changeTabs">
        <van-tab v-for="(item) in typeNameList" :key="item.id" :title="item"></van-tab>
      </van-tabs>
    </div>
    <div class="goodslist">
      <div v-for="(chiitem,i) in topProducts" :key="i" class="goodsitem">
        <div class="imgBox">
          <img class="proMainImage" width="100%" height="100%" v-lazy="imgUrl+chiitem.goodsSearchImage" @click="goDetail(chiitem)" />
        </div>
        <p class="van-ellipsis protitle">{{chiitem.goodsTitle}}</p>
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
        <div class="buttonBox">
          <button @click="goDetail(chiitem)">今すぐ購入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import api from '~/static/api'
export default {
  name: 'Product',
  layout: 'content',
  watchQuery: ['tabActive'],
  async asyncData ({ $axios, params, query, store }) {
    const tabActive = query.tabActive * 1
    const cateId = params.id
    const dataList = await $axios.get(api.activity.activePage + cateId)
    const title = store.state.common.locale === 'ja-JP' ? dataList.data.title.split('|')[1] : dataList.data.title.split('|')[0]
    const imgUrlDet = dataList.data.backgroundImg
    const bgc = dataList.data.backgroundColor
    const typeNameList = []
    const goodsidList = []
    const dataListData = dataList.data.typeList
    if (dataListData === undefined) {
      goodsidList.push()
    } else if (dataListData.length > 0) {
      dataListData.forEach((item) => {
        const typeName = store.state.common.locale === 'ja-JP' ? item.typeName.split('|')[1] : item.typeName.split('|')[0]
        typeNameList.push(typeName)
      })
      dataListData[tabActive || 0].goodsList.forEach((item) => {
        goodsidList.push(item.id)
      })
    } else {
      dataList.data.noTypeGoods.forEach((item) => {
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
      title,
      imgUrlDet,
      typeNameList,
      tabActive: tabActive || 0,
      topProducts,
      cateId,
      backgroundColor: {
        background: bgc || '#F4F4F4'
      }
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
    changeTabs (name, title) {
      this.$router.push({
        path: `/promotionpage/promotiongoods/${this.cateId}`,
        query: {
          tabActive: this.tabActive
        }
      })
    },
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
      window.sessionStorage.setItem('prefixPage', 'promotiongoods')
      window.sessionStorage.setItem('prePage', `/promotionpage/promotiongoods/${this.cateId}`)
    }
  }
}
</script>

<style lang="less" scoped>
.product {
  // height: 100%;
  // background-color: #fff;
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
  .tab_list {
    /deep/ .van-tabs--line .van-tabs__wrap {
      height: 88px;
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
    width: 100%;
    box-sizing: border-box;
    padding: 0 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 24px;
    .goodsitem {
      width: 49%;
      height: 100%;
      background: #fff;
      border-radius: 8px;
      position: relative;
      padding: 0 0 16px 0;
      margin-bottom: 24px;
      .proMainImage {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        width: 100%;
        height: 320px;
        object-fit: cover;
      }
      .protitle {
        width: 100%;
        height: 80px;
        font-size: 28px;
        font-weight: 400;
        text-align: left;
        padding: 0 16px 0 20px;
        color: #333333;
        line-height: 80px;
      }
      .shop_price {
        padding-left: 20px;
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
      .buttonBox {
        width: 100%;
        text-align: center;
        button {
          background: #dd3536;
          border: 0;
          height: 58px;
          width: 90%;
          color: #fff;
          border-radius: 6px;
          font-size: 20px;
          margin-top: 48px;
        }
      }
    }
  }
}
</style>
