<template>
  <div class="discount" :style="backgroundColor">
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
      <div class="tag" @click="showModel">キャンペーン説明</div>
      <img width="100%" height="100%" v-lazy="imgUrl + imgUrlDet" />
    </div>
    <div v-if="dataListData.length > 0" class="tab_list">
      <van-tabs v-model="tabActive" @change="changeTabs">
        <van-tab v-for="(item) in typeNameList" :key="item.id" :title="item"></van-tab>
      </van-tabs>
    </div>
    <van-popup v-model="show" round>
      <div class="model_main">
        <div class="model_title">キャンペーン説明</div>
        <div class="model_item">
          <span>1</span>
          新規会員の初回注文に限り、会員は注文時に割引を利用できます。新規会員以外は元の価格で購入できます。
        </div>
        <div class="model_item">
          <span>2</span>
          最終解釈権はSTARDAYプラットフォームに属します。
        </div>
        <div class="buttonBox">
          <button @click="close">確認</button>
        </div>
      </div>
    </van-popup>
    <div class="goodslist">
      <div v-for="(chiitem,index) in topProducts" :key="index" class="goodsitem">
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
  name: 'Discount',
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
      show: false,
      title: '',
      imgUrl: 'https://image.stardaymart.com/',
      goodsidList: [],
      backTopBool: false
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
        path: `/promotionpage/promotiondiscount/${this.cateId}`,
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
    showModel () {
      this.show = true
    },
    close () {
      this.show = false
    },
    goDetail (item) {
      this.$router.push(`/product/${item.id}`)
      window.sessionStorage.setItem('prefixPage', 'promotiondiscount')
      window.sessionStorage.setItem('prePage', `/promotionpage/promotiondiscount/${this.cateId}`)
    }
  }
}
</script>

<style lang="less" scoped>
.discount {
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
    position: relative;
    height: 380px;
    .tag {
      min-width: 100px;
      height: 28px;
      position: absolute;
      right: 10px;
      top: 20px;
      z-index: 999;
      background-size: 100% 100%;
      font-size: 10px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      vertical-align: middle;
      line-height: 28px;
    }
  }
  /deep/ .van-popup--center.van-popup--round {
    padding: 3.714285714285714vw;
  }
  .model_main {
    width: 68.57142857142857vw;
    height: 54.85714285714286vw;
    .model_title {
      height: 11.42857142857143vw;
      text-align: center;
      font-size: 4vw;
      font-weight: 600;
      color: #cd2728;
      line-height: 11.42857142857143vw;
    }

    .model_item {
      font-size: 3.714285714285714vw;
      /*height: 13.71428571428571vw;*/
      font-weight: 400;
      color: #666;
      /*line-height: 4.571428571428571vw;*/
      padding: 0 3.428571428571429vw;
      margin-bottom: 2.285714285714286vw;
      span {
        display: inline-block;
        width: 4.571428571428571vw;
        height: 4.571428571428571vw;
        line-height: 4.571428571428571vw;
        background-color: #e94f50;
        border-radius: 2.285714285714286vw;
        color: #fff;
        text-align: center;
      }
    }
    .buttonBox {
      width: 100%;
      text-align: center;
      button {
        border: 0;
        background: #cd2728;
        color: #fff;
        width: 38.85714285714286vw;
        height: 10vw;
        border-radius: 1.142857142857143vw;
      }
    }
  }
  .tab_list {
    /deep/ .van-tabs--line .van-tabs__wrap {
      height: 88px;
    }
  }
  .goodslist {
    width: 100%;
    box-sizing: border-box;
    padding: 16px 0;
    .goodsitem {
      width: 95%;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 16px;
      margin: 0 auto;
      height: 240px;
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      img {
        width: 224px !important;
        height: 208px !important;
        object-fit: cover;
      }
      .right {
        width: 70%;
        box-sizing: border-box;
        padding: 16px 0px 26px 26px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
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
      button {
        position: absolute;
        bottom: 26px;
        background: linear-gradient(to right, #ffa14b, #ff1c12);
        border: 0;
        height: 54px;
        width: 160px;
        color: #fff;
        margin-left: 35%;
        border-radius: 24px;
        font-size: 20px;
        padding: 5px;
      }
    }
  }
}
</style>
